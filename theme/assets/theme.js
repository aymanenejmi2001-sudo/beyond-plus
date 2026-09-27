/* LE TEMPLE — theme behaviour. No dependencies; every feature degrades to plain
   links and forms if this file fails to load. */
(() => {
  const root = document.documentElement;

  /* ---- Body scroll lock (reference-counted) ------------------------------ */
  let locks = 0;
  const lock = () => {
    if (++locks === 1) {
      const sb = window.innerWidth - root.clientWidth;
      document.body.dataset.locked = 'true';
      if (sb > 0) document.body.style.paddingRight = `${sb}px`;
    }
  };
  const unlock = () => {
    if (locks > 0 && --locks === 0) {
      delete document.body.dataset.locked;
      document.body.style.paddingRight = '';
    }
  };

  /* ---- Drawers (mobile nav, search, cart) -------------------------------- */
  const openDrawers = new Set();
  const drawer = {
    open(id) {
      const el = document.getElementById(id);
      if (!el || openDrawers.has(id)) return;
      openDrawers.add(id);
      el.dataset.open = 'true';
      el.inert = false;
      document.querySelector(`[data-drawer-overlay="${id}"]`)?.setAttribute('data-open', 'true');
      lock();
      setTimeout(() => (el.querySelector('input[type="search"]') || el).focus({ preventScroll: true }), 150);
    },
    close(id) {
      const el = document.getElementById(id);
      if (!el || !openDrawers.has(id)) return;
      openDrawers.delete(id);
      el.dataset.open = 'false';
      el.inert = true;
      document.querySelector(`[data-drawer-overlay="${id}"]`)?.setAttribute('data-open', 'false');
      unlock();
      if (id === 'MobileNav') {
        setTimeout(() => {
          el.querySelectorAll('[data-level="sub"]').forEach((l) => (l.dataset.state = 'ahead'));
          el.querySelector('[data-level="root"]')?.removeAttribute('data-state');
        }, 400);
      }
    },
  };
  window.themeDrawer = drawer;

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-drawer]');
    if (opener) {
      e.preventDefault();
      drawer.open(opener.dataset.openDrawer);
      return;
    }
    const closer = e.target.closest('[data-close-drawer]');
    if (closer) {
      drawer.close(closer.closest('[data-drawer]').id);
      return;
    }
    const overlay = e.target.closest('[data-drawer-overlay]');
    if (overlay) drawer.close(overlay.dataset.drawerOverlay);

    const level = e.target.closest('[data-open-level]');
    if (level) {
      const nav = level.closest('.mobile-nav');
      nav.querySelector('[data-level="root"]').dataset.state = 'behind';
      document.getElementById(level.dataset.openLevel).dataset.state = 'front';
    }
    const back = e.target.closest('[data-close-level]');
    if (back) {
      const nav = back.closest('.mobile-nav');
      back.closest('[data-level="sub"]').dataset.state = 'ahead';
      nav.querySelector('[data-level="root"]').removeAttribute('data-state');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') [...openDrawers].forEach((id) => drawer.close(id));
  });

  /* ---- Sticky header: retract on scroll down, return on scroll up -------- */
  customElements.define('sticky-header', class extends HTMLElement {
    connectedCallback() {
      let last = window.scrollY;
      let ticking = false;
      const update = () => {
        const y = window.scrollY;
        const d = y - last;
        const menuOpen = this.querySelector('[data-open="true"]');
        if (y < 160 || menuOpen) this.dataset.hidden = 'false';
        else if (d > 4) this.dataset.hidden = 'true';
        else if (d < -4) this.dataset.hidden = 'false';
        last = y;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });

      /* Mega menu + dropdown on hover (desktop) */
      const scrim = document.querySelector('[data-menu-scrim]');
      const closeAll = () => {
        this.querySelectorAll('[data-menu-item][data-open="true"]').forEach((i) => {
          i.dataset.open = 'false';
          i.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
        });
        scrim?.setAttribute('data-open', 'false');
      };
      this.querySelectorAll('[data-menu-item]').forEach((item) => {
        item.addEventListener('mouseenter', () => {
          closeAll();
          if (!item.querySelector('[data-menu-panel]')) return;
          item.dataset.open = 'true';
          item.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'true');
          if (item.querySelector('.header__mega')) scrim?.setAttribute('data-open', 'true');
        });
        item.addEventListener('focusin', () => item.dispatchEvent(new Event('mouseenter')));
      });
      this.addEventListener('mouseleave', closeAll);
      scrim?.addEventListener('mouseenter', closeAll);

      /* Locale popover */
      const locale = this.querySelector('[data-locale]');
      if (locale) {
        const btn = locale.querySelector('button');
        const set = (v) => { locale.dataset.open = v; btn.setAttribute('aria-expanded', v); };
        btn.addEventListener('click', () => set(locale.dataset.open === 'true' ? 'false' : 'true'));
        locale.addEventListener('mouseenter', () => set('true'));
        locale.addEventListener('mouseleave', () => set('false'));
      }

      /* Dark mode */
      const scheme = this.querySelector('[data-scheme-toggle]');
      if (scheme) {
        const sync = () => scheme.setAttribute('aria-pressed', root.dataset.scheme === 'dark');
        sync();
        scheme.addEventListener('click', () => {
          root.dataset.scheme = root.dataset.scheme === 'dark' ? 'light' : 'dark';
          try { localStorage.setItem('letemple-scheme', root.dataset.scheme); } catch (e) {}
          sync();
        });
      }
    }
  });

  /* ---- Predictive search ------------------------------------------------- */
  const searchInput = document.querySelector('[data-predictive-input]');
  const searchResults = document.querySelector('[data-predictive-results]');
  if (searchInput && searchResults && window.theme) {
    let timer;
    let controller;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      const q = searchInput.value.trim();
      const panel = searchInput.closest('[data-drawer]');
      if (!q) { searchResults.innerHTML = ''; panel.dataset.hasResults = 'false'; return; }
      timer = setTimeout(async () => {
        controller?.abort();
        controller = new AbortController();
        try {
          const url = `${window.theme.routes.predictiveSearch}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=8&section_id=predictive-search`;
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) return;
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const section = doc.querySelector('#shopify-section-predictive-search');
          searchResults.innerHTML = section ? section.innerHTML : '';
          panel.dataset.hasResults = 'true';
        } catch (e) { /* aborted or offline: the form still submits to /search */ }
      }, 250);
    });
  }

  /* ---- Reveal ("Le Seuil") ----------------------------------------------- */
  const reveal = () => {
    const revealAll = () => document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-inview', 'true'));
    if (!window.theme?.reveal || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll();
      return;
    }
    const vh = window.innerHeight;
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) el.setAttribute('data-inview', 'true');
    });
    root.setAttribute('data-reveal-ready', '');

    // Observed node → the [data-reveal] elements it releases. A closed frame is
    // clipped to zero area, which the observer never counts as intersecting,
    // so frames are watched through their unclipped parent.
    const pending = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pending.get(entry.target)?.forEach((el) => el.setAttribute('data-inview', 'true'));
        pending.delete(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.02 });

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not([data-inview])').forEach((el) => {
        const target = el.dataset.reveal === 'frame' && el.parentElement ? el.parentElement : el;
        let group = pending.get(target);
        if (!group) { group = new Set(); pending.set(target, group); io.observe(target); }
        group.add(el);
      });
    };
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    setTimeout(revealAll, 4000);
    document.addEventListener('shopify:section:load', scan);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal);
  else reveal();

  /* ---- Hero video: respect reduced motion -------------------------------- */
  document.querySelectorAll('video[data-hero-video]').forEach((v) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause();
    else v.play().catch(() => {});
  });

  /* ---- Product page: variant picker ------------------------------------- */
  customElements.define('variant-picker', class extends HTMLElement {
    connectedCallback() {
      this.variants = JSON.parse(this.querySelector('[data-variants]').textContent);
      this.section = this.closest('[data-product-section]');
      this.addEventListener('change', () => this.update());
    }
    update() {
      const selected = [...this.querySelectorAll('fieldset')].map(
        (fs) => fs.querySelector('input:checked')?.value,
      );
      const variant = this.variants.find((v) => v.options.every((o, i) => o === selected[i]));
      this.querySelectorAll('fieldset').forEach((fs, i) => {
        const val = fs.querySelector('input:checked')?.value;
        const label = fs.querySelector('[data-selected-value]');
        if (label) label.textContent = val ? ` — ${val}` : '';
        fs.querySelectorAll('input').forEach((input) => {
          const candidate = selected.slice();
          candidate[i] = input.value;
          const match = this.variants.find((v) => v.options.every((o, j) => o === candidate[j]));
          input.dataset.unavailable = !match || !match.available;
        });
      });
      const s = this.section;
      const idInput = s.querySelector('form[data-type="add-to-cart-form"] input[name="id"]');
      const button = s.querySelector('[data-add-button]');
      const label = button?.querySelector('.button__label');
      if (!variant) {
        if (button) button.disabled = true;
        if (label) { label.textContent = window.theme.strings.unavailable; label.dataset.label = label.textContent; }
        return;
      }
      if (idInput) idInput.value = variant.id;
      if (button) button.disabled = !variant.available;
      if (label) {
        label.textContent = variant.available ? window.theme.strings.addToCart : window.theme.strings.soldOut;
        label.dataset.label = label.textContent;
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      history.replaceState(null, '', url);
      // Refresh price, stock line and SKU from the server-rendered section.
      fetch(`${url.pathname}?variant=${variant.id}&section_id=${s.dataset.sectionId}`)
        .then((r) => r.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          ['[data-product-price]', '[data-product-stock]', '[data-product-sku]'].forEach((sel) => {
            const next = doc.querySelector(sel);
            const current = s.querySelector(sel);
            if (next && current) current.innerHTML = next.innerHTML;
          });
          if (variant.featured_media) {
            const media = s.querySelector(`[data-media-id="${variant.featured_media.id}"]`);
            if (media && matchMedia('(max-width: 989px)').matches) media.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }
        })
        .catch(() => {});
    }
  });

  /* ---- Product gallery: mobile dots + lightbox -------------------------- */
  customElements.define('product-gallery', class extends HTMLElement {
    connectedCallback() {
      const rail = this.querySelector('[data-gallery-rail]');
      const dots = [...this.querySelectorAll('[data-gallery-dot]')];
      const box = this.querySelector('[data-lightbox]');
      const boxImg = box?.querySelector('img');
      rail?.addEventListener('scroll', () => {
        const i = Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth));
        dots.forEach((d, j) => (d.dataset.active = i === j));
      }, { passive: true });
      this.querySelectorAll('[data-zoom]').forEach((item) => {
        item.addEventListener('click', () => {
          if (!box || matchMedia('(max-width: 989px)').matches) return;
          boxImg.src = item.dataset.zoom;
          boxImg.alt = item.querySelector('img')?.alt || '';
          box.dataset.open = 'true';
          lock();
        });
      });
      const close = () => { if (box?.dataset.open === 'true') { box.dataset.open = 'false'; unlock(); } };
      box?.addEventListener('click', close);
      document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
    }
  });

  /* ---- Collection: filters, sort, density, load more -------------------- */
  customElements.define('collection-grid', class extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      try {
        if (localStorage.getItem('letemple-grid-dense') === 'true') this.setDense(true);
      } catch (e) {}
      this.addEventListener('click', (e) => {
        const d = e.target.closest('[data-density]');
        if (d) { this.setDense(d.dataset.density === 'dense'); return; }
        const link = e.target.closest('a[data-facet-link]');
        if (link) { e.preventDefault(); this.load(link.href); return; }
        const more = e.target.closest('[data-load-more]');
        if (more) { e.preventDefault(); this.loadMore(more); }
      });
      this.addEventListener('change', (e) => {
        if (e.target.matches('[data-sort]')) {
          const url = new URL(window.location.href);
          url.searchParams.set('sort_by', e.target.value);
          url.searchParams.delete('page');
          this.load(url.toString());
        }
      });
      window.addEventListener('popstate', () => this.load(window.location.href, false));
    }
    setDense(dense) {
      this.querySelector('[data-grid]')?.setAttribute('data-dense', dense);
      this.querySelectorAll('[data-density]').forEach((b) => b.setAttribute('aria-pressed', (b.dataset.density === 'dense') === dense));
      try { localStorage.setItem('letemple-grid-dense', dense); } catch (e) {}
    }
    async fetchSection(href) {
      const url = new URL(href, window.location.origin);
      url.searchParams.set('section_id', this.sectionId);
      const res = await fetch(url);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      return doc.querySelector('collection-grid');
    }
    async load(href, push = true) {
      this.setAttribute('aria-busy', 'true');
      try {
        const next = await this.fetchSection(href);
        if (next) {
          this.innerHTML = next.innerHTML;
          if (push) history.pushState(null, '', href);
          try { if (localStorage.getItem('letemple-grid-dense') === 'true') this.setDense(true); } catch (e) {}
        }
      } catch (e) {
        window.location.href = href;
      }
      this.removeAttribute('aria-busy');
    }
    async loadMore(button) {
      button.setAttribute('aria-busy', 'true');
      try {
        const next = await this.fetchSection(button.href);
        const items = next?.querySelectorAll('[data-grid] > li');
        const grid = this.querySelector('[data-grid]');
        items?.forEach((li) => grid.appendChild(li));
        const nextMore = next?.querySelector('[data-load-more]');
        if (nextMore) button.href = nextMore.href;
        else button.closest('[data-more-wrap]')?.remove();
      } catch (e) {
        window.location.href = button.href;
      }
      button.removeAttribute('aria-busy');
    }
  });
})();
