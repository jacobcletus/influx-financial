import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavLink, ServiceNavGroup } from '@/data/navigation';
import { ServiceIcon } from './ServiceIcon';

interface HeaderProps {
  nav: NavLink[];
  cta: NavLink;
  servicesMenu: ServiceNavGroup[];
  currentPath: string;
  phone: string;
  phoneHref: string;
}

/** Normalise a path for active-state comparison. */
function normalise(path: string): string {
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
}

function isActive(href: string, currentPath: string): boolean {
  const current = normalise(currentPath);
  if (href === '/') return current === '/';
  if (href === '/services') return current.startsWith('/services');
  return current === href || current.startsWith(`${href}/`);
}

export default function Header({
  nav,
  cta,
  servicesMenu,
  currentPath,
  phone,
  phoneHref,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const navListRef = useRef<HTMLUListElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* --- compact header on scroll --- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* --- sliding active indicator --- */
  const moveIndicatorTo = useCallback((el: HTMLElement | null) => {
    if (!el || !navListRef.current) {
      setIndicator(null);
      return;
    }
    const listRect = navListRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({ left: rect.left - listRect.left, width: rect.width });
  }, []);

  const resetIndicator = useCallback(() => {
    const active = navListRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    moveIndicatorTo(active ?? null);
  }, [moveIndicatorTo]);

  useEffect(() => {
    resetIndicator();
    window.addEventListener('resize', resetIndicator);
    return () => window.removeEventListener('resize', resetIndicator);
  }, [resetIndicator]);

  /* --- mega menu open/close with hover intent --- */
  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);
  const scheduleCloseMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  /* --- escape / outside click for mega menu --- */
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        megaButtonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!megaRef.current?.contains(t) && !megaButtonRef.current?.contains(t)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [megaOpen]);

  /* --- mobile menu: scroll lock, escape, focus trap --- */
  useEffect(() => {
    if (!mobileOpen) return;
    document.documentElement.style.overflow = 'hidden';
    const panel = mobilePanelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
    // Delay initial focus until the panel's visibility transition has
    // started, so focus() isn't attempted on a hidden element.
    const focusTimer = setTimeout(() => focusables()[0]?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      // Keep Tab cycling inside the open menu (button + panel)
      if (e.shiftKey && (active === first || active === mobileButtonRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        mobileButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  /* --- mobile panel top edge tracks the header's bottom --- */
  const headerRef = useRef<HTMLElement>(null);
  const [panelTop, setPanelTop] = useState(57);
  useEffect(() => {
    if (!mobileOpen) return;
    const update = () => setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 57);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [mobileOpen]);

  const linkBase =
    'relative z-10 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.92rem] font-medium transition-colors duration-200 xl:px-3.5 xl:text-[0.95rem]';

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        scrolled || mobileOpen ? 'shadow-nav' : ''
      }`}
    >
      <div
        className={`border-b border-line-100 bg-white/90 backdrop-blur-md transition-[padding] duration-300 ${
          scrolled ? 'py-2' : 'py-3.5'
        }`}
      >
        <nav className="container-site flex items-center justify-between gap-4" aria-label="Main">
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center" aria-label="Influx Financial, home">
            <img
              src="/images/influx-logo-dark.png"
              alt="Influx Financial"
              width={1859}
              height={242}
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-5' : 'h-6'}`}
            />
          </a>

          {/* Desktop nav */}
          <ul
            ref={navListRef}
            className="relative hidden items-center lg:flex"
            onMouseLeave={resetIndicator}
          >
            {/* Sliding pill indicator */}
            <li
              aria-hidden="true"
              className={`absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-mist-200 transition-all duration-300 motion-reduce:transition-none ${
                indicator ? 'opacity-100' : 'opacity-0'
              }`}
              style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
            />
            {nav.map((item) => {
              const active = isActive(item.href, currentPath);
              if (item.label === 'Services') {
                return (
                  <li key={item.href}>
                    <button
                      ref={megaButtonRef}
                      type="button"
                      data-active={active}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      className={`${linkBase} flex items-center gap-1 ${
                        active ? 'text-pine-800' : 'text-ink-700 hover:text-pine-800'
                      }`}
                      onMouseEnter={(e) => {
                        openMega();
                        moveIndicatorTo(e.currentTarget);
                      }}
                      onMouseLeave={scheduleCloseMega}
                      onClick={(e) => {
                        // Mouse click (detail > 0): hover already opened the
                        // menu, so keep it open. Keyboard activation
                        // (detail === 0): toggle.
                        if (e.detail > 0) openMega();
                        else setMegaOpen((v) => !v);
                      }}
                    >
                      {item.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9.5 6 6 6-6" />
                      </svg>
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                    className={`${linkBase} block ${
                      active ? 'text-pine-800' : 'text-ink-700 hover:text-pine-800'
                    }`}
                    onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right: phone + CTA (desktop), menu button (mobile) */}
          <div className="flex items-center gap-2">
            <a
              href={phoneHref}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.95rem] font-semibold text-pine-800 transition-colors hover:bg-mist-100 xl:flex"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4.5 8 4l1.5 4-2 1.5a12 12 0 0 0 7 7L16 14.5l4 1.5-.5 3c-.2 1-1 1.6-2 1.4C10.5 19.2 4.8 13.5 3.6 6.5c-.2-1 .4-1.8 1.4-2Z" />
              </svg>
              {phone}
            </a>
            <a
              href={cta.href}
              className="hidden whitespace-nowrap rounded-full bg-pine-700 px-5 py-2.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-pine-800 lg:inline-block"
            >
              {cta.label}
            </a>
            <button
              ref={mobileButtonRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-mist-100 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-all duration-300 motion-reduce:transition-none ${
                    mobileOpen ? 'top-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-all duration-300 motion-reduce:transition-none ${
                    mobileOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 rounded bg-current transition-all duration-300 motion-reduce:transition-none ${
                    mobileOpen ? 'top-[7px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* ---- Desktop mega menu ---- */}
        <div
          ref={megaRef}
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          className={`absolute inset-x-0 top-full hidden justify-center px-6 lg:flex ${
            megaOpen ? '' : 'pointer-events-none'
          }`}
        >
          <div
            className={`mt-2 w-full max-w-5xl origin-top rounded-2xl border border-line-100 bg-white p-8 shadow-card-hover transition-all duration-200 motion-reduce:transition-none ${
              megaOpen
                ? 'translate-y-0 scale-100 opacity-100'
                : '-translate-y-1 scale-[0.99] opacity-0'
            }`}
            role="region"
            aria-label="Services menu"
          >
            <div className="grid grid-cols-4 gap-8">
              {servicesMenu.map((group) => (
                <div key={group.heading} className={group.items.length > 3 ? 'col-span-2' : ''}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
                    {group.heading}
                  </p>
                  <ul className={group.items.length > 3 ? 'grid grid-cols-2 gap-1' : 'space-y-1'}>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-mist-100"
                          tabIndex={megaOpen ? 0 : -1}
                        >
                          <span className="mt-0.5 text-pine-700">
                            <ServiceIcon name={item.icon} size={20} />
                          </span>
                          <span>
                            <span className="block text-[0.95rem] font-semibold text-ink-900 group-hover:text-pine-800">
                              {item.label}
                            </span>
                            <span className="block text-[0.8rem] leading-snug text-ink-500">
                              {item.description}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl bg-pine-950 p-5 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-mist-100">
                Not sure which service fits? Start with a free 30-minute consultation.
              </p>
              <a
                href={cta.href}
                tabIndex={megaOpen ? 0 : -1}
                className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-pine-900 transition-colors hover:bg-mist-100"
              >
                Book now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile menu ---- */}
      <div
        id="mobile-menu"
        ref={mobilePanelRef}
        style={{ top: panelTop }}
        className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white transition-all duration-300 motion-reduce:transition-none lg:hidden ${
          mobileOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex min-h-full flex-col px-5 pb-6 pt-4" aria-label="Mobile">
          <ul className="flex-1 divide-y divide-line-100">
            {nav.map((item, i) => {
              const active = isActive(item.href, currentPath);
              const stagger = mobileOpen ? { transitionDelay: `${80 + i * 45}ms` } : undefined;
              const entrance = `transition-all duration-300 motion-reduce:transition-none ${
                mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`;
              if (item.label === 'Services') {
                return (
                  <li key={item.href} className={entrance} style={stagger}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-lg font-semibold text-ink-900"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      tabIndex={mobileOpen ? 0 : -1}
                    >
                      Services
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${
                          mobileServicesOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <path d="m6 9.5 6 6 6-6" />
                      </svg>
                    </button>
                    {mobileServicesOpen && (
                      <ul className="mb-3 space-y-0.5 rounded-xl bg-mist-50 p-2">
                        <li>
                          <a
                            href="/services"
                            className="block rounded-lg px-3 py-2.5 font-semibold text-pine-800"
                            tabIndex={mobileOpen ? 0 : -1}
                          >
                            All services
                          </a>
                        </li>
                        {servicesMenu.flatMap((g) =>
                          g.items.map((s) => (
                            <li key={s.href}>
                              <a
                                href={s.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-ink-700"
                                tabIndex={mobileOpen ? 0 : -1}
                              >
                                <span className="text-pine-700">
                                  <ServiceIcon name={s.icon} size={18} />
                                </span>
                                {s.label}
                              </a>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.href} className={entrance} style={stagger}>
                  <a
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block py-4 text-lg font-semibold ${
                      active ? 'text-pine-700' : 'text-ink-900'
                    }`}
                    tabIndex={mobileOpen ? 0 : -1}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Persistent CTA, solid backdrop so the nav list never shows through */}
          <div
            className={`sticky bottom-0 -mx-5 mt-6 space-y-2.5 bg-gradient-to-t from-white via-white to-transparent px-5 pb-4 pt-8 transition-all duration-300 motion-reduce:transition-none ${
              mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            style={mobileOpen ? { transitionDelay: '360ms' } : undefined}
          >
            <a
              href={cta.href}
              className="block rounded-full bg-pine-700 px-6 py-3.5 text-center text-base font-semibold text-white shadow-card"
              tabIndex={mobileOpen ? 0 : -1}
            >
              {cta.label}
            </a>
            <a
              href={phoneHref}
              className="block rounded-full border border-line-200 bg-white px-6 py-3.5 text-center text-base font-semibold text-pine-800"
              tabIndex={mobileOpen ? 0 : -1}
            >
              Call {phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
