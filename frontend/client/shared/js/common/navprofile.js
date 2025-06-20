class NavProfile {
  constructor() {
    this.apiBase = "https://updated-backend-production-ff82.up.railway.app";
    this.userId = localStorage.getItem("userId");
    this.init();
  }

  async init() {
    try {
      await this.loadUserData();
      this.setupDropdowns(); // Handles dropdown toggling
    } catch (error) {
      console.error("Navigation profile initialization error:", error);
    }
  }

  async loadUserData() {
    try {
      const authResponse = await fetch(`${this.apiBase}/applicant/auth-status`, {
        credentials: "include",
      });

      const authData = await authResponse.json();
      console.log("Auth Data:", authData); // Optional debug

      if (!authData.authenticated) {
        window.location.href = "../login/login.html";
        return;
      }

      if (authData.user) {
        await this.loadProfilePicture();
        this.updateProfileName(authData.user.personalInfo || authData.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  async loadProfilePicture() {
    try {
      const response = await fetch(`${this.apiBase}/api/profile-pic/${this.userId}`);
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const navProfilePic = document.getElementById("nav-profile-pic");
        if (navProfilePic) {
          navProfilePic.src = imageUrl;
        }
      }
    } catch (error) {
      console.error("Error loading profile picture:", error);
    }
  }

  updateProfileName(userData) {
    const navProfileName = document.getElementById("nav-profile-name");
    if (navProfileName && userData) {
      const firstName = userData.firstname || "";
      const lastName = userData.lastname || "";
      const displayName = `${firstName} ${lastName}`.trim();
      navProfileName.textContent = displayName || "Applicant";
    }
  }

  setupDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      const content = dropdown.querySelector(".dropdown-content");

      if (toggle && content) {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          content.classList.toggle("show");
        });
      }
    });

    // Hide dropdowns when clicking outside
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
          dropdown.classList.remove("show");
        });
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NavProfile();
});
