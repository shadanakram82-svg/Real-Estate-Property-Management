document.addEventListener('DOMContentLoaded', () => {
  if (typeof propertiesData === 'undefined') return;

  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');

  let property;
  if (propertyId) {
    property = propertiesData.find(p => p.id == propertyId);
  }

  // If no valid property found, fallback to the first one for demo purposes
  if (!property) {
    property = propertiesData[0];
  }
  
  // Save to recently viewed
  let recentlyViewed = JSON.parse(localStorage.getItem('estate-recently-viewed')) || [];
  // Remove if already exists so we can push it to the front
  recentlyViewed = recentlyViewed.filter(id => id != property.id);
  recentlyViewed.unshift(property.id.toString()); // add to top
  // Keep only last 8
  if (recentlyViewed.length > 8) recentlyViewed = recentlyViewed.slice(0, 8);
  localStorage.setItem('estate-recently-viewed', JSON.stringify(recentlyViewed));

  // Populate DOM elements
  const gallery = document.getElementById('property-gallery');
  const title = document.getElementById('prop-title');
  const price = document.getElementById('prop-price');
  const type = document.getElementById('prop-type');
  const location = document.getElementById('prop-location');
  const beds = document.getElementById('prop-beds');
  const baths = document.getElementById('prop-baths');
  const area = document.getElementById('prop-area');

  if (gallery) {
    // Optimize the Unsplash URL for much faster loading (w=1920 instead of 2560, q=80 instead of 100)
    // The auto=format parameter already ensures it serves as WebP on modern browsers.
    let optimizedImage = property.image;
    if (optimizedImage.includes('unsplash.com')) {
      optimizedImage = optimizedImage.replace('w=2560', 'w=1920').replace('q=100', 'q=80');
    }
    gallery.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url('${optimizedImage}')`;
  }
  if (title) title.textContent = property.title;
  if (price) price.textContent = `$${property.price.toLocaleString()}`;
  if (type) type.textContent = property.type;
  if (location) location.textContent = property.location;
  if (beds) beds.textContent = property.bedrooms;
  if (baths) baths.textContent = property.bathrooms;
  if (area) area.textContent = property.area;

  const staticMapLoc = document.getElementById('static-map-location');
  if (staticMapLoc) staticMapLoc.textContent = property.location;

  // New Property Features
  const featYear = document.getElementById('feat-year');
  const featFurnish = document.getElementById('feat-furnish');
  const featPark = document.getElementById('feat-park');
  const featStatus = document.getElementById('feat-status');
  const featSchool = document.getElementById('feat-school');
  const featHosp = document.getElementById('feat-hosp');

  if (featYear) featYear.textContent = property.yearBuilt || 'N/A';
  if (featFurnish) featFurnish.textContent = property.furnished || 'N/A';
  if (featPark) featPark.textContent = property.parking || 'N/A';
  if (featStatus) featStatus.textContent = property.status || 'N/A';
  if (featSchool) featSchool.textContent = property.schools || 'N/A';
  if (featHosp) featHosp.textContent = property.hospital || 'N/A';

  // Custom Toast Notification System
  function showToast(message, iconClass = 'fa-solid fa-circle-check', iconColor = 'var(--primary-color)', borderColor = 'var(--primary-color)') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = borderColor;
    
    toast.innerHTML = `
      <i class="${iconClass}" style="color: ${iconColor};"></i>
      <span class="toast-content">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('hiding');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  // Handle contact form mock submission
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Our agent will contact you shortly.', 'fa-solid fa-paper-plane', '#10b981', '#10b981');
      form.reset();
    });
  }

  // Update Agent Info
  const agentName = document.getElementById('agent-name');
  if (agentName) {
    agentName.textContent = property.agent || 'Agent Name';
    const agentCard = agentName.closest('.agent-card');
    if (agentCard) {
      const agentImg = agentCard.querySelector('img');
      if (agentImg && property.agentImage) {
        agentImg.src = property.agentImage;
      }
    }
  }

  // Wire up Action Buttons
  const btnFav = document.getElementById('btn-add-fav');
  const btnComp = document.getElementById('btn-add-comp');
  const btnVisit = document.getElementById('btn-book-visit');

  if (btnFav) {
    // Check initial state
    let favList = JSON.parse(localStorage.getItem('estate-favorites') || '[]');
    const favIcon = btnFav.querySelector('i');
    const favText = btnFav.querySelector('span');

    if (favList.includes(property.id)) {
      favText.textContent = 'Remove from Favorites';
      favIcon.className = 'fa-solid fa-heart-crack';
    }

    btnFav.addEventListener('click', () => {
      favList = JSON.parse(localStorage.getItem('estate-favorites') || '[]');
      
      if (favList.includes(property.id)) {
        // Remove from favorites
        favList = favList.filter(id => id !== property.id);
        localStorage.setItem('estate-favorites', JSON.stringify(favList));
        
        // Update UI
        favText.textContent = 'Add to Favorites';
        favIcon.className = 'fa-solid fa-heart';
        
        showToast(`${property.title} removed from favorites.`, 'fa-solid fa-heart-crack', '#94a3b8', '#94a3b8');
      } else {
        // Add to favorites
        favList.push(property.id);
        localStorage.setItem('estate-favorites', JSON.stringify(favList));
        
        // Update UI
        favText.textContent = 'Remove from Favorites';
        favIcon.className = 'fa-solid fa-heart-crack';
        
        showToast(`${property.title} has been added to your favorites!`, 'fa-solid fa-heart', '#ef4444', '#ef4444');
      }
      
      // Also update all global favorites counters in navbar (desktop/mobile)
      document.querySelectorAll('.fav-count-badge').forEach(badge => {
        badge.textContent = favList.length;
        badge.style.display = favList.length > 0 ? 'flex' : 'none';
        
        // Trigger a nice bump animation on update
        badge.classList.remove('bump');
        void badge.offsetWidth; // force DOM reflow to restart animation
        badge.classList.add('bump');
      });
    });
  }

  if (btnComp) {
    btnComp.addEventListener('click', () => {
      let compareList = JSON.parse(localStorage.getItem('estate-compare') || '[]');
      if (!compareList.includes(property.id)) {
        if (compareList.length >= 3) {
          showToast('You can only compare up to 3 properties.', 'fa-solid fa-triangle-exclamation', '#f59e0b', '#f59e0b');
          return;
        }
        compareList.push(property.id);
        localStorage.setItem('estate-compare', JSON.stringify(compareList));
      }
      window.location.href = 'compare.html';
    });
  }

  if (btnVisit) {
    btnVisit.addEventListener('click', () => {
      const contactSection = document.getElementById('contact-form-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const msgBox = form.querySelector('textarea');
        if (msgBox) {
          msgBox.value = `Hi ${property.agent || 'Agent'}, I'd like to book a visit for ${property.title}.`;
          msgBox.focus();
        }
      }
    });
  }
});
