/* ══════════════════════════════════════════════
   BluePeak Mountain Resort — script.js
   Features:
   - Navbar scroll + active link
   - Mobile hamburger menu
   - Dark / Light mode toggle (localStorage)
   - Testimonial slider (prev/next/dots/autoplay)
   - Portfolio / room "Book Now" modal popup
   - Booking form validation (dates, email, required)
   - Scroll reveal animations
   - Back to top button
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. NAVBAR SCROLL + ACTIVE LINKS
     ══════════════════════════════ */
  const navbar  = document.getElementById('navbar');
  const navAnchors = document.querySelectorAll('.nav-link');
  const allSections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link tracking
    let active = '';
    allSections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) active = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
    });

    // Back-to-top visibility
    backTopBtn.classList.toggle('visible', window.scrollY > 500);

    // Scroll reveal
    doReveal();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Smooth-scroll all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });


  /* ══════════════════════════════
     2. MOBILE HAMBURGER MENU
     ══════════════════════════════ */
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMobileMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  navBackdrop.addEventListener('click', closeMobileMenu);


  /* ══════════════════════════════
     3. DARK / LIGHT THEME TOGGLE
     ══════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle.querySelector('.theme-icon');

  // Restore saved theme (default: dark)
  const savedTheme = localStorage.getItem('bluepeak-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('bluepeak-theme', next);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }


  /* ══════════════════════════════
     4. TESTIMONIAL SLIDER
     ══════════════════════════════ */
  const tSlides   = document.querySelectorAll('.t-slide');
  const tDots     = document.querySelectorAll('.t-dot');
  const tPrev     = document.getElementById('tPrev');
  const tNext     = document.getElementById('tNext');
  let   tCurrent  = 0;
  let   tInterval = null;

  function goToSlide(idx) {
    tSlides[tCurrent].classList.remove('active');
    tDots[tCurrent].classList.remove('active');
    tCurrent = (idx + tSlides.length) % tSlides.length;
    tSlides[tCurrent].classList.add('active');
    tDots[tCurrent].classList.add('active');
  }

  function startAutoplay() {
    tInterval = setInterval(() => goToSlide(tCurrent + 1), 7000);
  }

  function resetAutoplay() {
    clearInterval(tInterval);
    startAutoplay();
  }

  tPrev.addEventListener('click', () => { goToSlide(tCurrent - 1); resetAutoplay(); });
  tNext.addEventListener('click', () => { goToSlide(tCurrent + 1); resetAutoplay(); });
  tDots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.idx)); resetAutoplay(); });
  });

  startAutoplay();


  /* ══════════════════════════════
     5. ROOM "BOOK NOW" MODAL
     ══════════════════════════════ */
  const modalOverlay = document.getElementById('modalOverlay');
  const modal        = document.getElementById('modal');
  const modalClose   = document.getElementById('modalClose');
  const modalCancel  = document.getElementById('modalCancel');
  const modalBook    = document.getElementById('modalBook');
  const modalTitle   = document.getElementById('modalTitle');
  const modalPrice   = document.getElementById('modalPrice');

  // Open modal when any "Book Now" room button is clicked
  document.querySelectorAll('.btn-room').forEach(btn => {
    btn.addEventListener('click', () => {
      const roomName  = btn.getAttribute('data-room');
      const roomPrice = btn.getAttribute('data-price');
      modalTitle.textContent = roomName;
      modalPrice.textContent = roomPrice + '/night';
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Pre-select the matching room in the booking form dropdown
      const roomSelect = document.getElementById('bRoom');
      const roomMap = {
        'Standard Room': 'standard',
        'Deluxe Room':   'deluxe',
        'Mountain Suite':'suite'
      };
      if (roomMap[roomName]) roomSelect.value = roomMap[roomName];
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // "Proceed to Booking" — scroll to form
  modalBook.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  });


  /* ══════════════════════════════
     6. BOOKING FORM VALIDATION
     ══════════════════════════════ */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  const bName     = document.getElementById('bName');
  const bEmail    = document.getElementById('bEmail');
  const bCheckin  = document.getElementById('bCheckin');
  const bCheckout = document.getElementById('bCheckout');
  const bRoom     = document.getElementById('bRoom');

  const errName    = document.getElementById('errName');
  const errEmail   = document.getElementById('errEmail');
  const errCheckin = document.getElementById('errCheckin');
  const errCheckout= document.getElementById('errCheckout');
  const errRoom    = document.getElementById('errRoom');

  // Set minimum check-in date to today
  const today = new Date().toISOString().split('T')[0];
  bCheckin.min  = today;
  bCheckout.min = today;

  // Dynamically update checkout min when checkin changes
  bCheckin.addEventListener('change', () => {
    bCheckout.min = bCheckin.value || today;
    if (bCheckout.value && bCheckout.value <= bCheckin.value) {
      bCheckout.value = '';
    }
  });

  function setErr(input, errEl, msg) {
    input.classList.add('err');
    errEl.textContent = msg;
  }

  function clearErr(input, errEl) {
    input.classList.remove('err');
    errEl.textContent = '';
  }

  function validateBooking() {
    let valid = true;

    // Name
    if (!bName.value.trim()) {
      setErr(bName, errName, 'Please enter your full name.');
      valid = false;
    } else {
      clearErr(bName, errName);
    }

    // Email — must contain @
    const emailVal = bEmail.value.trim();
    if (!emailVal) {
      setErr(bEmail, errEmail, 'Please enter your email address.');
      valid = false;
    } else if (!emailVal.includes('@') || emailVal.indexOf('@') === emailVal.length - 1) {
      setErr(bEmail, errEmail, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearErr(bEmail, errEmail);
    }

    // Check-in date
    if (!bCheckin.value) {
      setErr(bCheckin, errCheckin, 'Please select a check-in date.');
      valid = false;
    } else {
      clearErr(bCheckin, errCheckin);
    }

    // Check-out date — must be after check-in
    if (!bCheckout.value) {
      setErr(bCheckout, errCheckout, 'Please select a check-out date.');
      valid = false;
    } else if (bCheckin.value && bCheckout.value <= bCheckin.value) {
      setErr(bCheckout, errCheckout, 'Check-out must be after check-in.');
      valid = false;
    } else {
      clearErr(bCheckout, errCheckout);
    }

    // Room type
    if (!bRoom.value) {
      setErr(bRoom, errRoom, 'Please select a room type.');
      valid = false;
    } else {
      clearErr(bRoom, errRoom);
    }

    return valid;
  }

  // Real-time feedback on blur
  [bName, bEmail, bCheckin, bCheckout, bRoom].forEach(field => {
    field.addEventListener('blur', validateBooking);
    field.addEventListener('change', () => {
      if (field.classList.contains('err')) validateBooking();
    });
  });

  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateBooking()) {
      formSuccess.classList.add('show');
      bookingForm.querySelectorAll('input, select').forEach(f => f.value = '');
      // Scroll success into view
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => formSuccess.classList.remove('show'), 7000);
    }
  });


  /* ══════════════════════════════
     7. SCROLL REVEAL
     ══════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  function doReveal() {
    revealEls.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        // Stagger siblings
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('visible'), Math.min(idx * 90, 350));
      }
    });
  }

  // Initial check for elements already in viewport
  setTimeout(doReveal, 120);


  /* ══════════════════════════════
     8. BACK TO TOP
     ══════════════════════════════ */
  const backTopBtn = document.getElementById('backTop');

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════
     INITIALISE
     ══════════════════════════════ */
  handleScroll(); // set initial navbar + reveal state

}); // end DOMContentLoaded