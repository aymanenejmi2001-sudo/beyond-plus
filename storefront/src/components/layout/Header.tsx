/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MAIN_MENU, SALE_HREF } from "@/data/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { CartIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import megaStyles from "./MegaMenu.module.css";
import styles from "./Header.module.css";

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { cart, open: openCart } = useCart();
  const { hidden } = useScrollDirection();

  // Never keep a panel open while the header is retracting.
  useEffect(() => {
    if (hidden) setOpenMenu(null);
  }, [hidden]);

  useEffect(() => {
    document.documentElement.dataset.scheme = dark ? "dark" : "light";
  }, [dark]);

  const closeMenus = useCallback(() => setOpenMenu(null), []);

  return (
    <>
      <div
        className={styles.wrapper}
        data-hidden={hidden && !openMenu}
        onMouseLeave={closeMenus}
      >
        <header className={styles.header}>
          <div className={styles.left}>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <MenuIcon />
            </button>

            <nav className={styles.nav} aria-label="Navigation principale">
              <ul className={styles.navList}>
                {MAIN_MENU.map((item) => (
                  <li
                    key={item.title}
                    className={styles.navItem}
                    style={item.type === "dropdown" ? { position: "relative" } : undefined}
                    onMouseEnter={() => setOpenMenu(item.type === "link" ? null : item.title)}
                  >
                    <Link href={item.href} className={styles.navLink}>
                      <span
                        className={styles.navLabel}
                        data-sale={item.href === SALE_HREF || undefined}
                      >
                        {item.title}
                      </span>
                    </Link>
                    {item.type !== "link" && (
                      <MegaMenu
                        item={item}
                        open={openMenu === item.title}
                        onNavigate={closeMenus}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href="/" className={styles.brand} aria-label="BEYOND PLUS, accueil">
            <span className="beyond-brand"><span className="beyond-symbol"><img src="/images/beyond/symbol-256.png" alt="" width="256" height="256" /></span>BEYOND PLUS</span>
          </Link>

          <div className={styles.right}>
            <button
              type="button"
              className={styles.scheme}
              data-on={dark}
              onClick={() => setDark((v) => !v)}
              aria-pressed={dark}
            >
              Mode sombre
              <span className={styles.switch} aria-hidden="true" />
            </button>

            <div className={styles.localeWrap} onMouseLeave={() => setLocaleOpen(false)}>
              <button
                type="button"
                className={styles.action}
                onClick={() => setLocaleOpen((v) => !v)}
                onMouseEnter={() => setLocaleOpen(true)}
                aria-expanded={localeOpen}
              >
                DH / FR
              </button>
              <div className={styles.localePanel} data-open={localeOpen} role="dialog" aria-label="Livraison et devise">
                <div className={styles.localeRow}>
                  <span className={styles.localeCountry}>Maroc</span>
                  <span className={styles.localeCurrency}>MAD (DH)</span>
                </div>
                <p className={styles.localeNote}>
                  Livraison partout au Maroc. Commande confirmée par téléphone.
                </p>
              </div>
            </div>

            <button type="button" className={styles.action} onClick={() => setSearchOpen(true)} aria-label="Rechercher">
              Recherche
            </button>
            <button type="button" className={styles.actionMobile} onClick={() => setSearchOpen(true)} aria-label="Rechercher">
              <SearchIcon />
            </button>

            <Link href="/wishlist" className={styles.action}>Wishlist</Link>
            <Link href="/wishlist" className={styles.actionMobile} aria-label="Wishlist"><HeartIcon /></Link>
            <Link href="/account" className={styles.action}>Suivi</Link>

            <Link href="/contact" className={styles.cta}>
              <span className={styles.ctaClip}>
                <span className={styles.ctaLabel} data-label="Contact">
                  Contact
                </span>
              </span>
            </Link>

            <button
              type="button"
              className={styles.cart}
              onClick={openCart}
              aria-label={`Panier, ${cart.totalQuantity} article(s)`}
            >
              <span className={styles.cartLabel}>Panier</span>
              <CartIcon className={styles.cartIcon} />
              <span className={styles.cartCount}>{cart.totalQuantity}</span>
            </button>
          </div>
        </header>
      </div>

      <div
        className={megaStyles.scrim}
        data-open={Boolean(openMenu) && openMenu !== null}
        onMouseEnter={closeMenus}
        aria-hidden="true"
      />

      <MobileNav open={mobileOpen} menu={MAIN_MENU} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
