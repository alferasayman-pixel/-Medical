(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = [...document.querySelectorAll('.primary-nav a')];
  const backToTop = document.querySelector('.back-to-top');
  const form = document.querySelector('#appointment-form');
  const status = document.querySelector('#form-status');
  const year = document.querySelector('#year');
  const dateField = form?.querySelector('input[type="date"]');

  if (year) year.textContent = new Date().getFullYear();
  if (dateField) dateField.min = new Date().toISOString().split('T')[0];

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const sections = [...document.querySelectorAll('main section[id], header[id]')];
  const setActiveNav = () => {
    const marker = window.scrollY + 150;
    let current = 'home';
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };

  window.addEventListener('scroll', () => {
    setActiveNav();
    backToTop?.classList.toggle('show', window.scrollY > 550);
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'يرجى استكمال الحقول المطلوبة والموافقة على استخدام البيانات.';
      status.style.color = '#9b3d28';
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const name = data.get('name');
    const specialty = data.get('specialty');
    status.textContent = `شكرًا ${name}. تم تسجيل طلب موعد في ${specialty} تجريبيًا، وسيتم التواصل بعد ربط النموذج بالنظام الفعلي.`;
    status.style.color = '#087074';
    form.reset();
  });

  setActiveNav();
})();