/* LE TEMPLE — AJAX cart. Uses Shopify's Cart API and Section Rendering API to
   re-render the cart drawer and header count. When the cart type is "page", or
   if anything fails, forms fall back to their native submit. */
(() => {
  const theme = window.theme;
  if (!theme) return;
  const useDrawer = () => theme.cartType === 'drawer' && document.getElementById('CartDrawer');

  const sections = ['cart-drawer'];

  const render = (payload) => {
    const html = payload?.sections?.['cart-drawer'];
    if (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const next = doc.querySelector('#CartDrawer');
      const current = document.getElementById('CartDrawer');
      if (next && current) {
        current.querySelector('.cart-drawer__header').replaceWith(next.querySelector('.cart-drawer__header'));
        current.querySelector('.cart-drawer__body').replaceWith(next.querySelector('.cart-drawer__body'));
        const foot = current.querySelector('.cart-drawer__footer');
        const nextFoot = next.querySelector('.cart-drawer__footer');
        if (foot) foot.remove();
        if (nextFoot) current.appendChild(nextFoot);
      }
    }
    fetch(`${theme.routes.cart}.js`).then((r) => r.json()).then((cart) => {
      document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = cart.item_count));
    }).catch(() => {});
  };

  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!form.matches('form[data-type="add-to-cart-form"]') || !useDrawer()) return;
    e.preventDefault();
    const button = e.submitter || form.querySelector('[name="add"]');
    button?.setAttribute('aria-busy', 'true');
    const body = new FormData(form);
    body.append('sections', sections.join(','));
    body.append('sections_url', window.location.pathname);
    try {
      const res = await fetch(theme.routes.cartAdd, { method: 'POST', headers: { Accept: 'application/json' }, body });
      const data = await res.json();
      if (!res.ok || data.status) throw new Error(data.description || theme.strings.cartError);
      render(data);
      window.themeDrawer?.open('CartDrawer');
    } catch (err) {
      const msg = form.querySelector('[data-form-error]');
      if (msg) { msg.textContent = err.message || theme.strings.cartError; msg.hidden = false; }
      else form.submit();
    } finally {
      button?.removeAttribute('aria-busy');
    }
  });

  document.addEventListener('click', async (e) => {
    const openCart = e.target.closest('[data-open-cart]');
    if (openCart && useDrawer()) {
      e.preventDefault();
      window.themeDrawer?.open('CartDrawer');
      return;
    }
    const change = e.target.closest('[data-cart-change]');
    if (!change) return;
    e.preventDefault();
    const line = change.closest('[data-line]');
    line?.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(theme.routes.cartChange, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: change.dataset.cartChange, quantity: Number(change.dataset.quantity), sections, sections_url: window.location.pathname }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (document.getElementById('CartDrawer')) render(data);
      if (document.querySelector('[data-cart-page]')) window.location.reload();
    } catch (err) {
      window.location.href = theme.routes.cart;
    }
  });
})();
