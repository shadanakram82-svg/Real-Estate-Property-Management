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
  let recentlyViewed = JSON.parse(localStorage.getItem('recently-viewed')) || [];
  // Remove if already exists so we can push it to the front
  recentlyViewed = recentlyViewed.filter(id => id != property.id);
  recentlyViewed.unshift(property.id); // add to top
  // Keep only last 4
  if (recentlyViewed.length > 4) recentlyViewed = recentlyViewed.slice(0, 4);
  localStorage.setItem('recently-viewed', JSON.stringify(recentlyViewed));

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
    gallery.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url('${property.image}')`;
  }
  if (title) title.textContent = property.title;
  if (price) price.textContent = `$${property.price.toLocaleString()}`;
  if (type) type.textContent = property.type;
  if (location) location.textContent = property.location;
  if (beds) beds.textContent = property.bedrooms;
  if (baths) baths.textContent = property.bathrooms;
  if (area) area.textContent = property.area;

  // Handle contact form mock submission
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message sent successfully! The agent will contact you soon.');
      form.reset();
    });
  }
});
