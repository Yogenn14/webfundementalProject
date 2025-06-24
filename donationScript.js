document.getElementById('donationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const paymentMethod = document.querySelector('[name=paymntMtd]').value;
  const amount = document.querySelector('#customAmnt').value || document.querySelector('.donationOpts .selected')?.dataset.amount;
  console.log("amount", amount);
  const email = document.querySelector('[name=email]').value;
  const type = document.querySelector('[name=donationType]').value;

  if (paymentMethod === 'creditCard') {
    const res = await fetch('http://localhost:3000/donations/creditCard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: null, 
        amount,
        email,
        type,
        paymentMethod
      }),
    });

    const data = await res.json();
    window.location.href = data.url; 
  }
});
