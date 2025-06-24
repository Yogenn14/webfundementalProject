let nameUser, emailUser, userIdUser; 

window.addEventListener("DOMContentLoaded", async () => {



  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("You are not logged in");
    window.location.href = "./login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`);
    const user = await res.json();

    if (!res.ok) throw new Error(user.error || "Failed to fetch user");

    document.getElementById("welcome").innerText = `Hi, ${user.name}!`;
    document.getElementById("dashboardName").innerText = `Name: ${user.name}`;
    document.getElementById("dashboardEmail").innerText = `Email: ${user.email}`;

    nameUser = user.name;
    emailUser = user.email;
    userIdUser = user.id;

  } catch (err) {
    console.error(err.message);
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedName = document.getElementById("editName").value;
    const updatedEmail = document.getElementById("editEmail").value;
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName, email: updatedEmail })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      document.getElementById("dashboardName").innerText = `Name: ${data.name}`;
      document.getElementById("dashboardEmail").innerText = `Email: ${data.email}`;
      document.getElementById("welcome").innerText = `Hi, ${data.name}!`;

      nameUser = data.name;
      emailUser = data.email;

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  });

  document.getElementById('donationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const paymentMethod = document.querySelector('[name=paymntMtd]').value;
    const amount = document.querySelector('#customAmnt').value || document.querySelector('.donationOpts .selected')?.dataset.amount;
    const type = document.querySelector('[name=donationType]').value;

    console.log("amount", amount);
    console.log("donor name", nameUser);
    console.log("email", emailUser);

    if (paymentMethod === 'creditCard') {
      const res = await fetch('http://localhost:3000/donations/creditCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userIdUser,
          amount,
          email: emailUser,
          name: nameUser,
          type,
          paymentMethod
        }),
      });

      const data = await res.json();
      window.location.href = data.url;
    }
  });

  loadUserDonations(userIdUser);


});

async function loadUserDonations(userId) {
  try {
    const res = await fetch(`http://localhost:3000/donations/user/${userId}`);
    const donations = await res.json();

    if (!res.ok) throw new Error(donations.error || "Failed to fetch donations");

    const tbody = document.querySelector(".table-wrapper table tbody");
    tbody.innerHTML = "";

    if (donations.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="3" style="text-align:center;">No donations yet</td>`;
      tbody.appendChild(row);
      return;
    }

    donations.forEach(donation => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${donation.type || "-"}</td>
        <td>${new Date(donation.donated_at).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}</td>
        <td>$${donation.amount}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Failed to load donations:", err);
    alert("Could not load donation history.");
  }
}
