const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleText = document.querySelector('.theme-toggle-text');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const projectTabs = document.querySelectorAll('.project-tab');
const projectPanels = document.querySelectorAll('.project-card');
const certificateTrack = document.querySelector('.certificate-track');
const certificateCards = document.querySelectorAll('.certificate-card');
const certificateDots = document.querySelectorAll('.certificate-dot');
const certificatePrev = document.querySelector('.certificate-prev');
const certificateNext = document.querySelector('.certificate-next');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const ambientOne = document.querySelector('.ambient-one');
const ambientTwo = document.querySelector('.ambient-two');
const contactForm = document.querySelector('#contact-form');
const root = document.documentElement;
const storedTheme = localStorage.getItem('portfolio-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
  if (themeToggleText) {
    themeToggleText.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
}

applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    header.classList.toggle('is-open');
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('is-open');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item, index) => {
  const delay = Math.min(index % 6, 5) * 70;
  item.style.setProperty('--reveal-delay', `${delay}ms`);
});

revealItems.forEach((item) => observer.observe(item));

if (scrollProgressBar) {
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  };

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
}

if (ambientOne || ambientTwo) {
  const updateAmbientParallax = () => {
    const scrollY = window.scrollY;

    if (ambientOne) {
      root.style.setProperty('--ambient-one-y', `${scrollY * 0.035}px`);
      root.style.setProperty('--ambient-one-x', `${scrollY * -0.008}px`);
    }

    if (ambientTwo) {
      root.style.setProperty('--ambient-two-y', `${scrollY * -0.025}px`);
      root.style.setProperty('--ambient-two-x', `${scrollY * 0.01}px`);
    }
  };

  updateAmbientParallax();
  window.addEventListener('scroll', updateAmbientParallax, { passive: true });
}

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.projectTarget;

    projectTabs.forEach((button) => button.classList.remove('is-active'));
    projectPanels.forEach((panel) => panel.classList.remove('is-visible'));

    tab.classList.add('is-active');

    const activePanel = document.querySelector(`[data-project-panel="${target}"]`);
    if (activePanel) {
      activePanel.classList.add('is-visible');
    }
  });
});

if (certificateTrack && certificateCards.length) {
  let activeCertificate = 0;
  let autoSlideId;

  const updateCertificateSlider = (index) => {
    activeCertificate = (index + certificateCards.length) % certificateCards.length;
    certificateTrack.style.transform = `translateX(-${activeCertificate * 100}%)`;

    certificateCards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === activeCertificate);
    });

    certificateDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeCertificate);
    });
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideId);
    autoSlideId = setInterval(() => {
      updateCertificateSlider(activeCertificate + 1);
    }, 3500);
  };

  certificatePrev?.addEventListener('click', () => {
    updateCertificateSlider(activeCertificate - 1);
    startAutoSlide();
  });

  certificateNext?.addEventListener('click', () => {
    updateCertificateSlider(activeCertificate + 1);
    startAutoSlide();
  });

  certificateDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateCertificateSlider(index);
      startAutoSlide();
    });
  });

  certificateTrack.addEventListener('mouseenter', () => {
    clearInterval(autoSlideId);
  });

  certificateTrack.addEventListener('mouseleave', () => {
    startAutoSlide();
  });

  updateCertificateSlider(0);
  startAutoSlide();
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const subject = (formData.get('subject') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n');

    const mailtoUrl = `mailto:princebansal2312@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  });
}
