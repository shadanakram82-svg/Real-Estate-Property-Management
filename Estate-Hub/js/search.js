document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('all-properties-grid');
  const countSpan = document.getElementById('results-count');
  
  if (!grid || typeof propertiesData === 'undefined') return;

  // Filter elements
  const btnApply = document.getElementById('btn-apply-filters');
  const sortSelect = document.getElementById('sort-by');

  // Read URL parameters for pre-filtering
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  const locParam = urlParams.get('location');
  const priceParam = urlParams.get('price');
  
  let shouldFilter = false;

  if (typeParam) {
    const filterType = document.getElementById('filter-type');
    if (filterType) filterType.value = typeParam;
    shouldFilter = true;
  }
  if (locParam) {
    const filterLoc = document.getElementById('filter-location');
    if (filterLoc) filterLoc.value = locParam;
    shouldFilter = true;
  }
  if (priceParam) {
    const filterPrice = document.getElementById('filter-price');
    if (filterPrice) filterPrice.value = priceParam;
    shouldFilter = true;
  }

  if (shouldFilter) {
    applyFilters();
  } else {
    // Initial render
    renderProperties(propertiesData);
  }

  if (btnApply) {
    btnApply.addEventListener('click', applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters); // Re-apply filters which includes sorting
  }

  // View Toggles
  const btnGrid = document.getElementById('btn-grid-view');
  const btnList = document.getElementById('btn-list-view');

  if (btnGrid && btnList) {
    btnGrid.addEventListener('click', () => {
      grid.classList.remove('list-view');
      btnGrid.style.color = 'var(--primary-color)';
      btnList.style.color = 'var(--text-color)';
    });
    
    btnList.addEventListener('click', () => {
      grid.classList.add('list-view');
      btnList.style.color = 'var(--primary-color)';
      btnGrid.style.color = 'var(--text-color)';
    });
  }

  function renderProperties(data) {
    countSpan.textContent = data.length;
    
    if (data.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No properties found matching your criteria.</p>';
      return;
    }

    let html = '';
    data.forEach((prop, index) => {
      html += `
        <div class="property-card fade-in-up">
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
                <button class="btn-icon btn-fav" data-id="${prop.id}" title="Add to Favorites"><i class="fa-regular fa-heart"></i></button>
                <button class="btn-icon btn-compare" data-id="${prop.id}" title="Compare"><i class="fa-solid fa-code-compare"></i></button>
              </div>
              <a href="details.html?id=${prop.id}" class="btn-details">View Details</a>
            </div>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  function applyFilters() {
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();
    const location = document.getElementById('filter-location').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const maxPrice = document.getElementById('filter-price').value;
    const minBeds = document.getElementById('filter-beds').value;
    const sortBy = sortSelect.value;

    let filtered = propertiesData.filter(prop => {
      // Keyword match (title)
      if (keyword && !prop.title.toLowerCase().includes(keyword)) return false;
      // Location match
      if (location && !prop.location.toLowerCase().includes(location)) return false;
      // Type match
      if (type && prop.type !== type) return false;
      // Price match
      if (maxPrice && prop.price > parseInt(maxPrice)) return false;
      // Beds match
      if (minBeds && prop.bedrooms < parseInt(minBeds)) return false;
      
      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProperties(filtered);
  }
});
