window.addEventListener("DOMContentLoaded", async () => { 
loadDonationProgress();


});

async function loadDonationProgress() {
  try {
    const res = await fetch('http://localhost:3000/donations/stat/progress');
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch donation progress");

    const total = data.total;
    const goal = data.goal;
    const percentage = data.percentage;


    document.getElementById("raisedAmount").innerHTML = `<strong>Raised so far:</strong> RM${total.toLocaleString()}`;
    document.getElementById("remainingAmount").innerHTML = `<strong>Remaining:</strong> RM${(goal - total).toLocaleString()}`;

    const progressFill = document.getElementById("progressFill");
    progressFill.style.width = `${percentage}%`;
    progressFill.innerText = `${percentage.toFixed(1)}%`;

  } catch (err) {
    console.error("Failed to load donation progress:", err);
  }
}
