  // Check authentication and update navbar
  fetch('/api/user')
    .then(res => res.json())
    .then(data => {
      const userDropdown = document.getElementById("userDropdown");
      const signupNav = document.getElementById("signupNav");
      const loginNav = document.getElementById("loginNav");
      const navbarUserName = document.getElementById("navbarUserName");
      if (data.authenticated) {
        // If logged in, show user dropdown and hide signup/login links
        userDropdown.style.display = "block";
        signupNav.style.display = "none";
        loginNav.style.display = "none";
        navbarUserName.textContent = data.name;
      } else {
        // If not logged in, show signup/login links and hide user dropdown
        userDropdown.style.display = "none";
        signupNav.style.display = "";
        loginNav.style.display = "";
        navbarUserName.textContent = "";
      }
    });

// Handle logout button click
  // Logout handler
  document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        // Send logout request to server and redirect to login page
        fetch('/api/logout', { method: 'POST' })
          .then(() => window.location.href = '/login.html');
      });
    }
  });
