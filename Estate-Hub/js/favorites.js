document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('favorites-grid');
  const countSpan = document.getElementById('fav-count');
  const btnClear = document.getElementById('btn-clear-favs');
  
  if (!grid || typeof propertiesData === 'undefined') return;

  function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem('estate-favorites')) || [];
    countSpan.textContent = favorites.length;
    
    if (favorites.length === 0) {
      grid.innerHTML = `
        <div class="empty-state fade-in-up" style="grid-column: 1/-1;">
          <i class="fa-regular fa-heart"></i>
          <h3>No Favorites Yet</h3>
          <p>You haven't saved any properties to your favorites.</p>
          <a href="properties.html" class="btn-primary" style="display:inline-block; margin-top:1rem;">Explore Properties</a>
        </div>
      `;
      return;
    }

    const favProperties = propertiesData.filter(p => favorites.includes(p.id.toString()));
    
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
            <div class="property-price">$${prop.price.toLocaleString()}</div>
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
  }

  // Initial render
  renderFavorites();

  // Listen for clicks on the newly rendered remove buttons and re-render
  document.body.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      setTimeout(renderFavorites, 100); // re-render after app.js handles the generic removal
    }
  });

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if(confirm('Are you sure you want to clear all favorites?')) {
        localStorage.removeItem('estate-favorites');
        renderFavorites();
      }
    });
  }
});
