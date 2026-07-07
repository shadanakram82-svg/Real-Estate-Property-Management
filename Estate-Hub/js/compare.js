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
                <h3 style="color:var(--text-color); font-size:1.2rem;">${p.title}</h3>
                <p style="margin-bottom:0.5rem;"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
                <a href="details.html?id=${p.id}" class="btn-outline" style="color:var(--primary-color); border-color:var(--primary-color); padding:0.4rem 1rem; font-size:0.9rem;">View Details</a>
                <br>
                <button class="remove-compare" data-id="${p.id}"><i class="fa-solid fa-trash-can"></i> Remove</button>
              </td>
            `).join('')}
            ${Array(3 - compareProps.length).fill('<td>-</td>').join('')}
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
