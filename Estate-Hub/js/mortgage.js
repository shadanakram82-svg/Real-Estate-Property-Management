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
    
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
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
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    elMonthly.textContent = '$0.00';
    elPrincipal.textContent = '$0.00';
    elInterest.textContent = '$0.00';
    elTotal.textContent = '$0.00';
  });
});
