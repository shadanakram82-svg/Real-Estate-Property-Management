document.addEventListener('DOMContentLoaded', () => {
  // --- Loader Animation ---
  const loader = document.querySelector('.loader-wrapper');
  const hideLoader = () => {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.style.display = 'none', 500);
      }, 500); // 500ms delay for visual effect
    }
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // --- Sticky Navbar (Fixed permanently on top) ---
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  if (navbarWrapper) {
    // Move out of .hero so it escapes z-index stacking context
    document.body.prepend(navbarWrapper);
  }

  // --- Parallax Blur Effect for Hero ---
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (hero) {
      const scrollY = window.scrollY;
      const blurValue = Math.min(scrollY / 40, 20); // Dynamic blur up to 20px
      hero.style.setProperty('--blur-val', `${blurValue}px`);
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggleBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = menuToggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // --- Reveal on Scroll (Basic setup for later use) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // --- Sticky Scroll Logic for Why Choose Us ---
  const whySteps = document.querySelectorAll('.why-step');
  const whyImages = document.querySelectorAll('.why-scroll-img');

  if (whySteps.length > 0 && whyImages.length > 0) {
    const whyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all steps and images
          whySteps.forEach(step => step.classList.remove('is-active'));
          whyImages.forEach(img => img.classList.remove('active'));

          // Add active class to current step
          entry.target.classList.add('is-active');

          // Add active class to corresponding image
          const index = entry.target.getAttribute('data-index');
          const targetImg = document.querySelector(`.why-scroll-img[data-index="${index}"]`);
          if (targetImg) {
            targetImg.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.5, // Trigger when block is 50% visible (center of screen)
      rootMargin: "0px"
    });

    whySteps.forEach(step => {
      whyObserver.observe(step);
    });
  }

  // --- Render Featured Properties ---
  const featuredGrid = document.getElementById('featured-properties-grid');
  
  if (featuredGrid && typeof propertiesData !== 'undefined') {
    // Render only first 3 for featured section
    const featuredProperties = propertiesData.slice(0, 3);
    const isRoot = !window.location.pathname.includes('/pages/');
    
    let html = '';
    featuredProperties.forEach((prop, index) => {
      const imgPath = isRoot ? prop.image.replace('../', '') : prop.image;
      
      html += `
        <div class="property-card featured-reveal" data-reveal-index="${index}">
          <div class="property-img-wrapper">
            ${prop.badge ? `<span class="property-badge">${prop.badge}</span>` : ''}
            <span class="property-type">${prop.type}</span>
            <img src="${imgPath}" alt="${prop.title}">
          </div>
          <div class="property-content">
            <div class="property-price">$${prop.price.toLocaleString()}</div>
            <h3 class="property-title">${prop.title}</h3>
            <div class="property-location">
              <i class="fa-solid fa-location-dot"></i> ${prop.location}
            </div>
            <div class="property-amenities">
              <div class="amenity-item">
                <i class="fa-solid fa-bed"></i> ${prop.bedrooms} Beds
              </div>
              <div class="amenity-item">
                <i class="fa-solid fa-bath"></i> ${prop.bathrooms} Baths
              </div>
              <div class="amenity-item">
                <i class="fa-solid fa-vector-square"></i> ${prop.area} sqft
              </div>
            </div>
            <div class="property-footer">
              <div style="display:flex; gap:0.5rem;">
                <button class="btn-icon btn-fav" data-id="${prop.id}" title="Add to Favorites"><i class="fa-regular fa-heart"></i></button>
                <button class="btn-icon btn-compare" data-id="${prop.id}" title="Compare"><i class="fa-solid fa-code-compare"></i></button>
              </div>
              <a href="${isRoot ? 'pages/details.html' : 'details.html'}?id=${prop.id}" class="btn-details">View Details</a>
            </div>
          </div>
        </div>
      `;
    });
    
    featuredGrid.innerHTML = html;
    
    // Staggered scroll reveal
    const featuredSection = document.getElementById('featured-section');
    const featuredCards = featuredGrid.querySelectorAll('.featured-reveal');
    // Standard Intersection Observer (Fade in one by one when they come into view)
    const featuredObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = parseInt(card.dataset.revealIndex);
          setTimeout(() => {
            card.classList.add('is-visible');
          }, index * 200);
          featuredObserver.unobserve(card);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    
    featuredCards.forEach(card => {
      // Ensure no inline styles are overriding CSS transitions
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = '';
      featuredObserver.observe(card);
    });
  }

  // --- Global Event Delegation for Favorites and Compare ---
  document.body.addEventListener('click', (e) => {
    // Handle Add to Favorites
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      const propId = favBtn.getAttribute('data-id');
      if (propId) {
        let favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
        if (favorites.includes(propId)) {
          favorites = favorites.filter(id => id !== propId);
          favBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
          showToast('Removed from Favorites');
        } else {
          favorites.push(propId);
          favBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
          showToast('Added to Favorites');
        }
        localStorage.setItem('estate-favorites', JSON.stringify(favorites));
        updateFavBadgeCount();
      }
    }

    // Handle Add to Compare
    const compareBtn = e.target.closest('.btn-compare');
    if (compareBtn) {
      const propId = compareBtn.getAttribute('data-id');
      if (propId) {
        let compare = JSON.parse(localStorage.getItem('estate-compare')) || [];
        if (!compare.includes(propId)) {
          if (compare.length >= 3) {
            showToast('You can only compare up to 3 properties at a time.');
            return;
          }
          compare.push(propId);
          localStorage.setItem('estate-compare', JSON.stringify(compare));
        }
        
        // Redirect to compare page (handle path difference depending on current page)
        if (window.location.pathname.includes('/pages/')) {
          window.location.href = 'compare.html';
        } else {
          window.location.href = 'pages/compare.html';
        }
      }
    }
  });

  // --- Initialize Favorite Icon States ---
  function initFavIcons() {
    const favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
    const favBtns = document.querySelectorAll('.btn-fav');
    favBtns.forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (favorites.includes(id)) {
        btn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
      }
    });
    updateFavBadgeCount();
  }
  
  // --- FAQ Accordion Logic removed as it is now pure CSS hover driven ---
  
  // --- Update Fav Badge Count ---
  function updateFavBadgeCount() {
    const favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
    const badges = document.querySelectorAll('.fav-count-badge');
    badges.forEach(badge => {
      badge.textContent = favorites.length;
      badge.classList.remove('bump');
      void badge.offsetWidth; // Trigger reflow for animation
      badge.classList.add('bump');
      if (favorites.length === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  }
  
  setTimeout(initFavIcons, 500); 

  // --- Toast Notifications Logic ---
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // --- Scroll to Top Button ---
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  scrollTopBtn.setAttribute('title', 'Scroll to Top');
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Basic Lazy Loading ---
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => img.setAttribute('loading', 'lazy'));

  // --- Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'));
          const duration = 2000;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);
          let currentFrame = 0;

          const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentVal = Math.round(endValue * progress);
            target.textContent = currentVal.toLocaleString() + (endValue > 100 ? '+' : '');

            if (currentFrame === totalFrames) {
              clearInterval(counter);
              target.textContent = endValue.toLocaleString() + (endValue > 100 ? '+' : '');
            }
          }, frameRate);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  // --- Global Search Modal Logic ---
  const searchModal = document.createElement('div');
  searchModal.className = 'search-modal';
  searchModal.innerHTML = `
    <div class="search-modal-content">
      <button class="search-modal-close">&times;</button>
      <h2 style="color:var(--text-color);">Search Properties</h2>
      <form class="search-modal-form" id="global-search-form">
        <input type="text" id="global-search-input" placeholder="Keyword, location, or type..." required>
        <button type="submit" class="btn-primary">Search</button>
      </form>
    </div>
  `;
  document.body.appendChild(searchModal);

  const searchToggleBtn = document.getElementById('search-toggle');
  const searchCloseBtn = searchModal.querySelector('.search-modal-close');
  const globalSearchForm = document.getElementById('global-search-form');

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      setTimeout(() => document.getElementById('global-search-input').focus(), 100);
    });
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });
  }

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
    }
  });

  if (globalSearchForm) {
    globalSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('global-search-input').value;
      
      // Determine base path depending on current page
      const currentPath = window.location.pathname;
      let propertiesPageUrl = 'pages/properties.html';
      if (currentPath.includes('pages/')) {
        propertiesPageUrl = 'properties.html';
      }
      
      // We can pass the keyword via sessionStorage or URL params. Let's do a simple alert or redirect.
      // Since it's a front-end template, we'll alert and redirect.
      alert('Searching for: ' + query);
      window.location.href = propertiesPageUrl;
    });
  }
  // --- Hero Search Form Premium Validation ---
  const heroSearchForm = document.querySelector('.hero-search-wrapper .search-form');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      const loc = document.getElementById('location').value.trim();
      const type = document.getElementById('property-type').value;
      const checkIn = document.getElementById('check-in').value;
      const price = document.getElementById('price-range').value;
      
      if (!loc && !type && !checkIn && !price) {
        e.preventDefault();
        
        // Premium Toast Notification
        let existingToast = document.querySelector('.premium-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'premium-toast fade-in-up';
        toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Please fill at least one field to search.`;
        
        document.body.appendChild(toast);
        
        // Remove after 3.5 seconds
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translate(-50%, 20px)';
          setTimeout(() => toast.remove(), 400);
        }, 3500);
      }
    });
  }
  // --- Newsletter Subscription Notification ---
  const newsletterForm = document.querySelector('.cta-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Inline Success Toast Notification
      let existingToast = newsletterForm.parentNode.querySelector('.inline-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.className = 'inline-toast fade-in-up';
      toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Successfully subscribed to the newsletter!`;
      
      // Append it right after the form, within the wrapper
      newsletterForm.parentNode.insertBefore(toast, newsletterForm.nextSibling);
      
      // Clear the input
      newsletterForm.reset();
      
      // Remove after 3.5 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    });
  }

  // --- Custom Premium Select Logic (Global) ---
  const customSelects = document.querySelectorAll('.filter-item select, #sort-by, select.form-select');
  customSelects.forEach(select => {
    select.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    if (select.classList.contains('form-select')) {
      wrapper.classList.add('hero-select-wrapper');
    }
    
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement('div');
    // inherit classes like form-input for hero selects
    let inheritedClasses = select.className.replace('form-select', '').trim();
    trigger.className = `custom-select-trigger ${inheritedClasses}`;
    trigger.innerHTML = `<span>${select.options[select.selectedIndex]?.text || 'Select'}</span><i class="fa-solid fa-chevron-down" style="font-size:0.8em; color:var(--primary-color); transition: transform 0.3s ease;"></i>`;
    wrapper.appendChild(trigger);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-options';
    wrapper.appendChild(optionsContainer);

    Array.from(select.options).forEach((option, index) => {
      // Skip empty placeholder options if they have no text
      if (!option.text) return;
      
      const customOption = document.createElement('div');
      customOption.className = `custom-option ${index === select.selectedIndex ? 'selected' : ''}`;
      customOption.textContent = option.text;
      customOption.dataset.value = option.value;
      
      customOption.addEventListener('click', function(e) {
        e.stopPropagation();
        select.value = this.dataset.value;
        select.dispatchEvent(new Event('change'));
        
        trigger.querySelector('span').textContent = this.textContent;
        
        optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        wrapper.classList.remove('open');
      });
      
      optionsContainer.appendChild(customOption);
    });

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-wrapper').forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
  });

});
