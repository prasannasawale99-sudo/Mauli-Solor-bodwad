/**
 * माऊली सोलर (Mauli Solar) - Main JavaScript
 * Handles Navigation, Stats Counters, Solar Savings Calculator,
 * Gallery Filtering, Lightbox Modal, and WhatsApp Inquiry Dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. Active Navigation Spy on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });

  // 3. Animated Number Counters
  const counterElements = document.querySelectorAll('.stat-number[data-target]');
  let counterStarted = false;

  const runCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
          runCounters();
          counterStarted = true;
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 4. Interactive Solar Savings Calculator
  const billSlider = document.getElementById('billSlider');
  const billDisplay = document.getElementById('billDisplay');
  const recommendedKw = document.getElementById('recommendedKw');
  const subsidyAmount = document.getElementById('subsidyAmount');
  const netInvestment = document.getElementById('netInvestment');
  const yearlySavings = document.getElementById('yearlySavings');
  const lifetimeSavings = document.getElementById('lifetimeSavings');

  function calculateSolarSavings(bill) {
    let kw = 1;
    let subsidy = 30000;
    let approxCost = 65000;

    if (bill <= 1500) {
      kw = 1;
      subsidy = 30000;
      approxCost = 65000;
    } else if (bill <= 2800) {
      kw = 2;
      subsidy = 60000;
      approxCost = 125000;
    } else if (bill <= 4200) {
      kw = 3;
      subsidy = 78000;
      approxCost = 180000;
    } else if (bill <= 6500) {
      kw = 4;
      subsidy = 78000;
      approxCost = 235000;
    } else if (bill <= 9000) {
      kw = 5;
      subsidy = 78000;
      approxCost = 290000;
    } else {
      kw = Math.min(10, Math.ceil(bill / 1600));
      subsidy = 78000;
      approxCost = kw * 56000;
    }

    const netCost = approxCost - subsidy;
    const monthlySaving = Math.round(bill * 0.92);
    const annualSaving = monthlySaving * 12;
    const lifeSaving = annualSaving * 25;

    return {
      kw,
      subsidy,
      approxCost,
      netCost,
      annualSaving,
      lifeSaving
    };
  }

  function updateCalculatorUI() {
    if (!billSlider) return;
    const currentBill = parseInt(billSlider.value, 10);
    
    // Format into Marathi / Indian Currency
    if (billDisplay) {
      billDisplay.textContent = `₹ ${currentBill.toLocaleString('en-IN')}`;
    }

    const res = calculateSolarSavings(currentBill);

    if (recommendedKw) recommendedKw.textContent = `${res.kw} kW`;
    if (subsidyAmount) subsidyAmount.textContent = `₹ ${res.subsidy.toLocaleString('en-IN')}/-`;
    if (netInvestment) netInvestment.textContent = `₹ ${res.netCost.toLocaleString('en-IN')} (अंदाजे)`;
    if (yearlySavings) yearlySavings.textContent = `₹ ${res.annualSaving.toLocaleString('en-IN')}`;
    if (lifetimeSavings) lifetimeSavings.textContent = `₹ ${res.lifeSaving.toLocaleString('en-IN')}`;
  }

  if (billSlider) {
    billSlider.addEventListener('input', updateCalculatorUI);
    updateCalculatorUI();
  }

  // 5. Gallery Filter
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent || '';
        const loc = item.querySelector('.gallery-item-loc')?.textContent || '';
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = `${title} - ${loc}`;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 7. Form submission -> Direct WhatsApp Dispatch
  const sendWhatsAppInquiry = (data) => {
    const phone = '918855840411'; // Rajendra Dhokne
    const message = `*माऊली सोलर - नवीन चौकशी*%0A%0A` +
      `*नाव:* ${encodeURIComponent(data.name || 'माहिती नाही')}%0A` +
      `*मोबाईल:* ${encodeURIComponent(data.phone || 'माहिती नाही')}%0A` +
      `*पत्ता/गाव:* ${encodeURIComponent(data.city || 'बोदवड परिसर')}%0A` +
      `*सिस्टीम:* ${encodeURIComponent(data.system || 'सोलर रूफटॉप')}%0A` +
      `*मासिक वीज बिल:* ${encodeURIComponent(data.bill ? '₹' + data.bill : 'उपलब्ध नाही')}%0A` +
      (data.notes ? `*टीप:* ${encodeURIComponent(data.notes)}%0A` : '') +
      `%0A_कृपया मला मोफत कोटेशन व सरकारी सबसिडीची माहिती द्यावी._`;

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Quick Hero Form
  const quickHeroForm = document.getElementById('quickHeroForm');
  if (quickHeroForm) {
    quickHeroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('heroName')?.value;
      const phone = document.getElementById('heroPhone')?.value;
      const system = document.getElementById('heroSystem')?.value;
      const bill = document.getElementById('heroBill')?.value;

      sendWhatsAppInquiry({ name, phone, system, bill });
    });
  }

  // Main Contact Form
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value;
      const phone = document.getElementById('contactPhone')?.value;
      const city = document.getElementById('contactCity')?.value;
      const system = document.getElementById('contactSystem')?.value;
      const bill = document.getElementById('contactBill')?.value;
      const notes = document.getElementById('contactNotes')?.value;

      sendWhatsAppInquiry({ name, phone, city, system, bill, notes });
      alert('धन्यवाद! तुमची चौकशी थेट श्री. राजेंद्र ढोकणे (माऊली सोलर) यांच्याकडे WhatsApp द्वारे पाठवली जात आहे.');
    });
  }
});
