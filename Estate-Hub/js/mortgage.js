document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mortgage-form');
  const btnReset = document.getElementById('btn-reset');
  
  if (!form) return;

  const priceInput = document.getElementById('price');
  const dpInput = document.getElementById('down-payment');
  const rateInput = document.getElementById('interest-rate');
  const termInput = document.getElementById('loan-term');
  
  const elMonthly = document.getElementById('monthly-payment');
  const elPrincipal = document.getElementById('principal-amount');
  const elInterest = document.getElementById('total-interest');
  const elTotal = document.getElementById('total-payment');

  const summarySection = document.getElementById('loan-summary-section');
  const bdPrincipal = document.getElementById('bd-principal');
  const bdInterest = document.getElementById('bd-interest');
  const bdDownpayment = document.getElementById('bd-downpayment');
  
  const bdTotalCost = document.getElementById('bd-total-cost');
  const bdMonthlyEmi = document.getElementById('bd-monthly-emi');
  const bdInterestRate = document.getElementById('bd-interest-rate');
  const bdLoanDuration = document.getElementById('bd-loan-duration');
  
  let mortgageChart = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const price = parseFloat(priceInput.value);
    const downPayment = parseFloat(dpInput.value);
    const annualRate = parseFloat(rateInput.value);
    const years = parseInt(termInput.value);
    
    if (downPayment >= price) {
      alert("Down payment cannot be greater than or equal to the property price.");
      return;
    }

    const principal = price - downPayment;
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;
    
    // EMI Formula
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = principal / numberOfPayments;
    }
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    elMonthly.textContent = `$${monthlyPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    elPrincipal.textContent = `$${principal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    elInterest.textContent = `$${totalInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    elTotal.textContent = `$${totalPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

    // Update Breakdown
    bdPrincipal.textContent = elPrincipal.textContent;
    bdInterest.textContent = elInterest.textContent;
    bdDownpayment.textContent = `$${downPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    
    if(bdTotalCost) bdTotalCost.textContent = elTotal.textContent;
    if(bdMonthlyEmi) bdMonthlyEmi.textContent = elMonthly.textContent;
    if(bdInterestRate) bdInterestRate.textContent = `${annualRate}%`;
    if(bdLoanDuration) bdLoanDuration.textContent = `${years} Yrs`;

    // Render Chart
    const ctx = document.getElementById('mortgageChart').getContext('2d');
    
    if (mortgageChart) {
      mortgageChart.destroy();
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--primary-color').trim() || '#2563EB';

    mortgageChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Principal Amount', 'Total Interest', 'Down Payment'],
        datasets: [{
          data: [principal, totalInterest, downPayment],
          backgroundColor: [
            primaryColor,
            '#ef4444',
            '#10b981'
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                }
                return label;
              }
            }
          }
        }
      }
    });
    
    // Smooth scroll to summary
    setTimeout(() => {
      summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    elMonthly.textContent = '$0.00';
    elPrincipal.textContent = '$0.00';
    elInterest.textContent = '$0.00';
    elTotal.textContent = '$0.00';
    
    if(bdTotalCost) bdTotalCost.textContent = '$0';
    if(bdMonthlyEmi) bdMonthlyEmi.textContent = '$0';
    if(bdInterestRate) bdInterestRate.textContent = '0%';
    if(bdLoanDuration) bdLoanDuration.textContent = '0 Yrs';
    
    if (mortgageChart) {
      mortgageChart.destroy();
      mortgageChart = null;
    }
  });

  /* Scroll Reveal Animation for Calculator Cards */
  const calcSection = document.getElementById('calculator-section');
  const revealLeft = document.querySelector('.reveal-left');
  const revealRight = document.querySelector('.reveal-right');
  
  if (calcSection && revealLeft && revealRight) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25 // Trigger when 25% is visible
    };

    const calcObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealLeft.classList.add('is-revealed');
          revealRight.classList.add('is-revealed');
        } else {
          revealLeft.classList.remove('is-revealed');
          revealRight.classList.remove('is-revealed');
        }
      });
    }, observerOptions);

    calcObserver.observe(calcSection);
  }
});
