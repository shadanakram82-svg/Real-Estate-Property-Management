document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('compare-container');
  if (!container || typeof propertiesData === 'undefined') return;

  function renderCompare() {
    const compareIds = JSON.parse(localStorage.getItem('estate-compare')) || [];
    
    if (compareIds.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-code-compare"></i>
          <h3>Nothing to Compare</h3>
          <p>Add up to 3 properties to compare them side-by-side.</p>
          <a href="properties.html" class="btn-primary" style="display:inline-block; margin-top:1rem;">Explore Properties</a>
        </div>
      `;
      return;
    }

    const compareProps = propertiesData.filter(p => compareIds.includes(p.id.toString()));
    
    // Logic for highlighting best options (lowest price, highest area, highest beds/baths)
    const minPrice = Math.min(...compareProps.map(p => p.price));
    const maxArea = Math.max(...compareProps.map(p => p.area));
    const maxBeds = Math.max(...compareProps.map(p => p.bedrooms));
    const maxBaths = Math.max(...compareProps.map(p => p.bathrooms));

    let html = `
      <div class="compare-table-wrapper">
        <table class="compare-table">
          <tr>
            <th>Property</th>
            ${compareProps.map(p => `
              <td>
                <img src="${p.image}" class="compare-img" alt="${p.title}">
                <h3 style="color:#ffffff; font-size:1.2rem; font-weight: 700; margin-bottom: 0.2rem;">${p.title}</h3>
                <p style="color:#94a3b8; font-size: 0.95rem;"><i class="fa-solid fa-location-dot" style="color: var(--primary-color);"></i> ${p.location}</p>
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.2rem;">
                  <a href="details.html?id=${p.id}" class="btn-outline" style="color:var(--primary-color); border-color:var(--primary-color); padding:0.4rem 1rem; font-size:0.8rem; border-radius: 8px;">View Details</a>
                  <button class="cta-btn-danger remove-compare" data-id="${p.id}" style="padding:0.4rem 1rem; font-size:0.8rem; border-radius: 8px;"><i class="fa-solid fa-trash-can"></i> Remove</button>
                </div>
              </td>
            `).join('')}
            ${Array(3 - compareProps.length).fill().map(() => `
              <td>
                <div style="background: #1e293b; border: 2px dashed #475569; border-radius: 12px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; min-height: 250px; transition: transform 0.3s ease;">
                  <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 1rem;"></i>
                  <h4 style="color: #f8fafc; margin-bottom: 1.2rem;">Compare More</h4>
                  <a href="properties.html" class="btn-primary" style="padding: 0.4rem 1.2rem; border-radius: 8px; font-size: 0.85rem; text-decoration: none;"><i class="fa-solid fa-plus"></i> Add Property</a>
                </div>
              </td>
            `).join('')}
          </tr>
          <tr>
            <th>Price</th>
            ${compareProps.map(p => `<td class="${p.price === minPrice ? 'highlight-best' : ''}">$${p.price.toLocaleString()}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Property Type</th>
            ${compareProps.map(p => `<td>${p.type}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Area (sqft)</th>
            ${compareProps.map(p => `<td class="${p.area === maxArea ? 'highlight-best' : ''}">${p.area}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Bedrooms</th>
            ${compareProps.map(p => `<td class="${p.bedrooms === maxBeds ? 'highlight-best' : ''}">${p.bedrooms}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Bathrooms</th>
            ${compareProps.map(p => `<td class="${p.bathrooms === maxBaths ? 'highlight-best' : ''}">${p.bathrooms}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Year Built</th>
            ${compareProps.map(p => `<td>${p.yearBuilt || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Furnished</th>
            ${compareProps.map(p => `<td>${p.furnished || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Amenities</th>
            ${compareProps.map(p => `<td style="font-size:0.9rem; line-height:1.4;">${p.amenities || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Nearby Schools</th>
            ${compareProps.map(p => `<td>${p.schools || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Nearby Hospital</th>
            ${compareProps.map(p => `<td>${p.hospital || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Property Rating</th>
            ${compareProps.map(p => `<td><i class="fa-solid fa-star" style="color:#FFB800;"></i> <span style="font-weight:600;">${p.rating || '-'}</span></td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Agent Name</th>
            ${compareProps.map(p => `<td>${p.agent || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Availability</th>
            ${compareProps.map(p => `<td>${p.availability || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Parking</th>
            ${compareProps.map(p => `<td>${p.parking || '-'}</td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
          <tr>
            <th>Status</th>
            ${compareProps.map(p => `<td><span style="padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: ${p.status === 'Sold' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; color: ${p.status === 'Sold' ? '#ef4444' : '#10b981'};">${p.status || '-'}</span></td>`).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
          </tr>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  renderCompare();

  // Handle remove clicks
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-compare');
    if (btn) {
      const id = btn.getAttribute('data-id');
      let compareIds = JSON.parse(localStorage.getItem('estate-compare')) || [];
      compareIds = compareIds.filter(cid => cid !== id);
      localStorage.setItem('estate-compare', JSON.stringify(compareIds));
      renderCompare();
    }
    
  });
});
