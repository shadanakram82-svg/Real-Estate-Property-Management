// Theme toggling functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme in LocalStorage
  const savedTheme = localStorage.getItem('estate-theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  } else {
    // Default to light
    document.documentElement.removeAttribute('data-theme');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.documentElement.hasAttribute('data-theme')) {
        // Switch to light
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('estate-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        // Switch to dark
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('estate-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    });
  }
});
