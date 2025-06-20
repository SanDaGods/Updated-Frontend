document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://updated-backend-production-ff82.up.railway.app";

  const wrapper = document.querySelector('.wrapper');
  const loginContainer = document.querySelector('.form-box.login');
  const roleTabs = document.querySelectorAll('.role-tab');
  const loginForms = document.querySelectorAll('.login-form');

  function initForms() {
    loginForms.forEach(f => f.classList.remove('active'));
    document.querySelector('.login-form[data-role="applicant"]').classList.add('active');
    roleTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.role-tab[data-role="applicant"]').classList.add('active');
    document.querySelector('.register').style.display = 'none';
    document.querySelector('.forgot').style.display = 'none';
    const vForm = document.getElementById('verificationForm');
    const npForm = document.getElementById('newPasswordForm');
    if (vForm) vForm.style.display = 'none';
    if (npForm) npForm.style.display = 'none';
    wrapper.classList.remove('active', 'active-forgot', 'active-verification', 'active-new-password');
  }

  initForms();

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.dataset.role;
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loginForms.forEach(f => f.classList.remove('active'));
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
      input.type = input.type === "password" ? "text" : "password";
      icon.setAttribute("name", input.type === "text" ? "eye" : "eye-off");
    });
  });

  document.getElementById("terms-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("terms-con").style.display = "block";
  });

  document.getElementById("accept-btn")?.addEventListener("click", () => {
    document.getElementById("terms-con").style.display = "none";
    document.getElementById("terms-checkbox").checked = true;
  });

  document.querySelector(".register-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    document.querySelector('.register').style.display = 'block';
    wrapper.classList.add('active');
  });

  document.querySelector(".login-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    loginContainer.style.display = 'block';
    initForms();
    wrapper.classList.remove('active');
  });

  document.querySelector(".forgot-link")?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll('.form-box').forEach(f => f.style.display = 'none');
    document.querySelector('.forgot').style.display = 'block';
    wrapper.classList.add('active-forgot');
  });

  function showNotification(msg, type = "info") {
    const note = document.getElementById("notification");
    note.textContent = msg;
    note.className = `notification ${type}`;
    note.style.display = "block";
    setTimeout(() => {
      note.style.opacity = "0";
      setTimeout(() => {
        note.style.display = "none";
        note.style.opacity = "1";
      }, 500);
    }, 3000);
  }

  // Applicant login
  document.getElementById("applicantLoginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("applicantEmail").value.trim().toLowerCase();
    const password = document.getElementById("applicantPassword").value;
    if (!email || !password) return showNotification("Please enter both email and password", "error");

    const btn = e.target.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.data.userId);
        localStorage.setItem("userEmail", data.data.email);
        showNotification("Login successful!", "success");
        window.location.href = "/frontend/client/applicant/timeline/timeline.html";
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err) {
      showNotification(`Login failed: ${err.message}`, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });

  // Similarly, fix adminLoginForm, assessorLoginForm if needed...
});
