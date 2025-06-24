document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("authLink");
  const navList = authLink.parentElement;

  const userId = localStorage.getItem("userId");

  if (userId) {
    authLink.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;

    const dashboardLi = document.createElement("li");
    dashboardLi.innerHTML = `<a href="dashboard.html">Dashboard</a>`;
    navList.insertBefore(dashboardLi, authLink);

    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    });
  }
});
