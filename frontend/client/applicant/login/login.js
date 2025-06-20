document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://updated-backend-production-ff82.up.railway.app";

  const wrapper = document.querySelector('.wrapper');
  const loginContainer = document.querySelector('.form-box.login');
  const roleTabs = document.querySelectorAll('.role-tab');
  const loginForms = document.querySelectorAll('.login-form');

  const showNotification = (message, type = "info") => {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.style.display = "none";
        notification.style.opacity = "1";
      }, 500);
    }, 3000);
  };

  function initForms() {
    loginForms.forEach(form => form.classList.remove('active'));
    document.querySelector('.login-form[data-role="applicant"]').classList.add('active');
    roleTabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector('.role-tab[data-role="applicant"]').classList.add('active');

    document.querySelector('.form-box.register').style.display = 'none';
    document.querySelector('.form-box.forgot').style.display = 'none';
    document.getElementById('verificationForm')?.style.display = 'none';
    document.getElementById('newPasswordForm')?.style.display = 'none';

    wrapper.classList.remove('active', 'active-forgot', 'active-verification', 'active-new-password');
  }

  initForms();

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.dataset.role;
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loginForms.forEach(form => form.classList.remove('active'));
      document.querySelector(`.login-form[data-role="${role}"]`).classList.add('active');
    });
  });

  document.querySelector('.btnLogin-popup')?.addEventListener('click', e => {
    e.preventDefault();
    initForms();
    wrapper.scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.parentElement.querySelector("input");
      const icon = toggle.querySelector("ion-icon");
      input.type = (input.type === "password") ? "text" : "password";
      icon.setAttribute("name", input.type === "text" ? "eye" : "eye-off");
    });
  });

  document.getElementById("terms-link")?.addEventListener("click", event => {
    event.preventDefault();
    document.getElementById("terms-con").style.display = "block";
  });
  document.getElementById("accept-btn")?.addEventListener("click", () => {
    document.getElementById("terms-con").style.display = "none";
    document.getElementById("terms-checkbox").checked = true;
  });

  document.querySelector(".register-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    document.querySelector('.form-box.register').style.display = 'block';
    wrapper.classList.add('active');
  });

  document.querySelector(".login-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    loginContainer.style.display = 'block';
    initForms();
  });

  document.querySelector(".forgot-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    document.querySelector('.form-box.forgot').style.display = 'block';
    wrapper.classList.add('active-forgot');
  });

  document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!email || !password || !confirm) return showNotification("Please fill in all fields", "error");
    if (!email.includes("@")) return showNotification("Enter a valid email", "error");
    if (password !== confirm) return showNotification("Passwords do not match", "error");
    if (password.length < 8) return showNotification("Password too short", "error");
    if (!document.getElementById("terms-checkbox").checked) return showNotification("Accept terms and conditions", "error");

    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Registering...";

    try {
      const resp = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.details || data.error || "Registration failed");
      showNotification("Registered! Please continue", "success");
      localStorage.setItem("userId", data.data.userId);
      window.location.href = "/frontend/client/applicant/info/information.html";
    } catch (err) {
      showNotification(`Registration failed: ${err.message}`, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });

  document.getElementById("applicantLoginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("applicantEmail").value.trim().toLowerCase();
    const pass = document.getElementById("applicantPassword").value;
    if (!email || !pass) return showNotification("Enter both email and password", "error");
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const resp = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: pass })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Login failed");
      showNotification("Login successful!", "success");
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("userEmail", data.data.email);
      window.location.href = "/frontend/client/applicant/timeline/timeline.html";
    } catch (err) {
      showNotification(`Login failed: ${err.message}`, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  document.getElementById("adminLoginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    // Similar logic adapted for adminLogin endpoint...
  });

  document.getElementById("assessorLoginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    // Similar logic adapted for assessorLogin endpoint...
  });
});
