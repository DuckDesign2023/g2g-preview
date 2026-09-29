/* G2G — шапка: Transparent → Solid после прокрутки, мобильное меню (≤1024).
   Молча ничего не делает, если шапки нет на странице. */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const bar = header.querySelector('.site-header__bar');
  const burger = header.querySelector('.site-header__burger');
  const drawer = header.querySelector('.site-header__drawer');

  // ── Solid после прокрутки ───────────────────────────────────
  const SOLID_AT = 24;
  // Страницы без тёмного героя (17 Article): шапка Solid с самого верха — класс site-header--always-solid в разметке
  const always = header.classList.contains('site-header--always-solid');
  let solid = null;
  const syncSolid = () => {
    const next = always || window.scrollY > SOLID_AT || header.classList.contains('site-header--menu-open');
    if (next === solid) return;
    solid = next;
    header.classList.toggle('site-header--solid', next);
    if (bar) bar.classList.toggle('site-header__bar--solid', next);
  };
  syncSolid();
  window.addEventListener('scroll', syncSolid, { passive: true });

  // ── Мобильное меню ──────────────────────────────────────────
  if (!burger || !drawer) return;

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.classList.toggle('site-header__burger--open', open);
    header.classList.toggle('site-header--menu-open', open);
    document.body.classList.toggle('page--locked', open);
    drawer.hidden = !open;
    syncSolid();
    if (open) {
      const first = drawer.querySelector('a');
      if (first) first.focus();
    }
  };

  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      burger.focus();
    }
  });

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Меню закрывается, если окно расширили до десктопа
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });
});
