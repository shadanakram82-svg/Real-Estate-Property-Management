document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('favorites-grid');
  const recentScroll = document.getElementById('recent-scroll');
  const searchesGrid = document.getElementById('searches-grid');
  const btnClear = document.getElementById('btn-clear-favs');
  const btnClearRecent = document.getElementById('btn-clear-recent');
  const btnClearSearches = document.getElementById('btn-clear-searches');
  
  if (!grid || typeof propertiesData === 'undefined') return;

  // --- Track Recently Viewed ---
  function trackRecentlyViewed() {
    const viewed = JSON.parse(localStorage.getItem('estate-recently-viewed')) || [];
    return viewed;
  }

  // --- Render Dashboard Stats ---
  function updateDashboardStats() {
    const favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
    const viewed = JSON.parse(localStorage.getItem('estate-recently-viewed')) || [];
    const compare = JSON.parse(localStorage.getItem('estate-compare')) || [];
    const searches = JSON.parse(localStorage.getItem('estate-saved-searches')) || [1,2,3];

    const statFavs = document.getElementById('stat-favs');
    const statViewed = document.getElementById('stat-viewed');
    const statSearches = document.getElementById('stat-searches');
    const statCompare = document.getElementById('stat-compare');

    if (statFavs) animateNumber(statFavs, favorites.length);
    if (statViewed) animateNumber(statViewed, viewed.length);
    if (statSearches) animateNumber(statSearches, searches.length);
    if (statCompare) animateNumber(statCompare, compare.length);
  }

  // Animate number counting up safely
  function animateNumber(el, target) {
    const numTarget = parseInt(target, 10);
    if (isNaN(numTarget) || numTarget === 0) {
      el.textContent = numTarget || 0;
      return;
    }
    
    let current = 0;
    const duration = 600;
    const step = Math.ceil(numTarget / (duration / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= numTarget) {
        current = numTarget;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  }

  // --- Render Favorite Properties ---
  function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
    
    if (favorites.length === 0) {
      grid.innerHTML = `
        <div class="empty-state fade-in-up" style="grid-column: 1/-1;">
          <i class="fa-regular fa-heart"></i>
          <h3>No Favorites Yet</h3>
          <p>You haven't saved any properties to your favorites.</p>
          <a href="properties.html" class="btn-primary" style="display:inline-block; margin-top:1rem;">Explore Properties</a>
        </div>
      `;
      updateDashboardStats();
      return;
    }

    const favProperties = propertiesData.filter(p => favorites.includes(p.id) || favorites.includes(p.id.toString()));
    
    let html = '';
    favProperties.forEach((prop, index) => {
      html += `
        <div class="property-card fade-in-up delay-${index * 100}">
          <div class="property-img-wrapper">
            ${prop.badge ? `<span class="property-badge">${prop.badge}</span>` : ''}
            <span class="property-type">${prop.type}</span>
            <img src="${prop.image}" alt="${prop.title}">
          </div>
          <div class="property-content">
            <div class="property-price">₹${prop.price.toLocaleString()}</div>
            <h3 class="property-title">${prop.title}</h3>
            <div class="property-location">
              <i class="fa-solid fa-location-dot"></i> ${prop.location}
            </div>
            <div class="property-amenities">
              <div class="amenity-item"><i class="fa-solid fa-bed"></i> ${prop.bedrooms} Beds</div>
              <div class="amenity-item"><i class="fa-solid fa-bath"></i> ${prop.bathrooms} Baths</div>
              <div class="amenity-item"><i class="fa-solid fa-vector-square"></i> ${prop.area} sqft</div>
            </div>
            <div class="property-footer">
              <div style="display:flex; gap:0.5rem;">
                <button class="btn-icon btn-fav" data-id="${prop.id}" title="Remove from Favorites"><i class="fa-solid fa-heart"></i></button>
              </div>
              <a href="details.html?id=${prop.id}" class="btn-details">View Details</a>
            </div>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;
    updateDashboardStats();
  }

  // --- Render Recently Viewed ---
  function renderRecentlyViewed() {
    const viewed = JSON.parse(localStorage.getItem('estate-recently-viewed')) || [];
    
    if (viewed.length === 0) {
      recentScroll.innerHTML = `
        <div class="empty-state" style="width: 100%; flex-shrink: 0;">
          <i class="fa-regular fa-clock"></i>
          <h3>No Recent Activity</h3>
          <p>Properties you view will appear here automatically.</p>
        </div>
      `;
      return;
    }

    const viewedProperties = propertiesData.filter(p => viewed.includes(p.id.toString()));
    
    let html = '';
    viewedProperties.forEach(prop => {
      html += `
        <a href="details.html?id=${prop.id}" class="recent-card">
          <img src="${prop.image}" alt="${prop.title}">
          <div class="recent-card-body">
            <h4>${prop.title}</h4>
            <div class="rc-location"><i class="fa-solid fa-location-dot"></i> ${prop.location}</div>
            <div class="rc-price">₹${prop.price.toLocaleString()}</div>
          </div>
        </a>
      `;
    });
    recentScroll.innerHTML = html;
  }

  // --- Render Saved Searches ---
  function renderSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('estate-saved-searches')) || [
      { 
        name: 'Luxury Villas in Mumbai',
        tags: ['Villa', 'Mumbai', '₹30L+', '4+ Beds'],
        date: '2 days ago',
        results: 12
      },
      {
        name: 'Affordable Apartments',
        tags: ['Apartment', 'Delhi', 'Under ₹25L'],
        date: '5 days ago',
        results: 28
      },
      {
        name: 'Farm Houses near Lonavala',
        tags: ['Farm House', 'Lonavala', '5000+ sqft'],
        date: '1 week ago',
        results: 6
      }
    ];

    if (savedSearches.length === 0) {
      searchesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <i class="fa-regular fa-bookmark"></i>
          <h3>No Saved Searches</h3>
          <p>You haven't saved any search filters yet.</p>
        </div>
      `;
      return;
    }

    let html = '';
    savedSearches.forEach((search, i) => {
      html += `
        <div class="search-card">
          <div class="search-card-title"><i class="fa-solid fa-magnifying-glass"></i> ${search.name}</div>
          <div class="search-tags">
            ${search.tags.map(tag => `<span class="search-tag">${tag}</span>`).join('')}
          </div>
          <div class="search-card-meta">
            <span><i class="fa-regular fa-clock"></i> ${search.date} · ${search.results} results</span>
            <a href="properties.html" class="btn-search-again">Search Again</a>
          </div>
        </div>
      `;
    });
    searchesGrid.innerHTML = html;
  }

  // --- Initial Render ---
  renderFavorites();
  renderRecentlyViewed();
  renderSavedSearches();

  // --- Listen for fav button clicks and re-render ---
  document.body.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      setTimeout(renderFavorites, 100);
    }
  });

  // Custom Confirm Modal System
  function showConfirmModal(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-modal">
        <div class="confirm-icon"><i class="fa-solid fa-trash-can"></i></div>
        <h3 style="margin-bottom: 0.5rem; color: var(--text-color);">Confirm Action</h3>
        <p style="margin-bottom: 1.5rem; color: var(--text-light); font-size: 0.95rem;">${message}</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="modal-btn modal-btn-cancel">Cancel</button>
          <button class="modal-btn modal-btn-confirm">Clear</button>
        </div>
      </div>
    `;
    
    // Inject styles for the modal
    const style = document.createElement('style');
    style.textContent = `
      .confirm-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.7);
        display: flex; justify-content: center; align-items: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease forwards;
      }
      .confirm-modal {
        background: var(--card-bg, #fff);
        padding: 2.5rem 2rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid var(--border-color);
        transform: scale(0.9);
        animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      .confirm-icon {
        width: 64px; height: 64px;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-radius: 50%;
        display: flex; justify-content: center; align-items: center;
        font-size: 1.6rem;
        margin: 0 auto 1.5rem;
      }
      .modal-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .modal-btn-cancel {
        background: transparent;
        color: var(--text-color);
        border: 2px solid var(--border-color);
      }
      .modal-btn-cancel:hover {
        background: var(--border-color);
        transform: translateY(-2px);
      }
      .modal-btn-confirm {
        background: #ef4444;
        color: white;
        border: 2px solid #ef4444;
      }
      .modal-btn-confirm:hover {
        background: #dc2626;
        border-color: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
      }
      @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
      @keyframes popIn { from{transform:scale(0.9);opacity:0;} to{transform:scale(1);opacity:1;} }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    overlay.querySelector('.modal-btn-cancel').addEventListener('click', () => {
      overlay.remove();
      style.remove();
    });
    
    overlay.querySelector('.modal-btn-confirm').addEventListener('click', () => {
      overlay.remove();
      style.remove();
      onConfirm();
    });
  }

  // --- Clear All Favorites ---
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      showConfirmModal('Are you sure you want to clear all favorites? This action cannot be undone.', () => {
        localStorage.removeItem('estate-favorites');
        renderFavorites();
        
        document.querySelectorAll('.fav-count-badge').forEach(badge => {
          badge.textContent = '0';
          badge.style.display = 'none';
        });
      });
    });
  }

  // --- Clear Recently Viewed ---
  if (btnClearRecent) {
    btnClearRecent.addEventListener('click', () => {
      showConfirmModal('Are you sure you want to clear your recent activity?', () => {
        localStorage.setItem('estate-recently-viewed', JSON.stringify([]));
        renderRecentlyViewed();
        updateDashboardStats();
      });
    });
  }

  // --- Clear Saved Searches ---
  if (btnClearSearches) {
    btnClearSearches.addEventListener('click', () => {
      showConfirmModal('Are you sure you want to delete all saved searches?', () => {
        localStorage.setItem('estate-saved-searches', JSON.stringify([]));
        renderSavedSearches();
        updateDashboardStats();
      });
    });
  }
});
