document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "https://updated-backend-production-ff82.up.railway.app";
    const FRONTEND_BASE_URL = "https://updated-frontend-ten.vercel.app";

    const wrapper = document.querySelector('.wrapper');
    const loginContainer = document.querySelector('.form-box.login');
    const roleTabs = document.querySelectorAll('.role-tab');
    const loginForms = document.querySelectorAll('.login-form');

    function initForms() {
        loginForms.forEach(form => form.classList.remove('active'));
        document.querySelector('.login-form[data-role="applicant"]').classList.add('active');
        roleTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('.role-tab[data-role="applicant"]').classList.add('active');
        document.querySelector('.register').style.display = 'none';
        document.querySelector('.forgot').style.display = 'none';
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

    document.querySelector('.btnLogin-popup')?.addEventListener('click', (e) => {
        e.preventDefault();
        initForms();
        wrapper.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll(".toggle-password").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const input = toggle.parentElement.querySelector("input");
            const icon = toggle.querySelector("ion-icon");
            input.type = input.type === "password" ? "text" : "password";
            icon.setAttribute("name", input.type === "text" ? "eye" : "eye-off");
        });
    });

    document.getElementById("terms-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("terms-con").style.display = "block";
    });

    document.getElementById("accept-btn")?.addEventListener("click", () => {
        document.getElementById("terms-con").style.display = "none";
        document.getElementById("terms-checkbox").checked = true;
    });

    document.querySelector(".register-link")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll('.form-box').forEach(form => form.style.display = 'none');
        document.querySelector('.register').style.display = 'block';
        wrapper.classList.add('active');
    });

    document.querySelector(".login-link")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll('.form-box').forEach(form => form.style.display = 'none');
        loginContainer.style.display = 'block';
        initForms();
        wrapper.classList.remove('active');
    });

    document.querySelector(".forgot-link")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll('.form-box').forEach(form => form.style.display = 'none');
        document.querySelector('.forgot').style.display = 'block';
        wrapper.classList.add('active-forgot');
    });

    const resetInputs = () => {
        document.querySelectorAll("input").forEach((input) => {
            input.type === "checkbox" ? input.checked = false : input.value = "";
        });
    };

    const showNotification = (message, type = "info") => {
        const notification = document.getElementById("notification");
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = "block";
        notification.style.opacity = "1";

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
                notification.className = "notification"; // reset
            }, 500);
        }, 3000);
    };

    document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password || !confirmPassword)
            return showNotification("Please fill in all fields", "error");
        if (!emailRegex.test(email))
            return showNotification("Please enter a valid email address", "error");
        if (password !== confirmPassword)
            return showNotification("Passwords do not match!", "error");
        if (password.length < 8)
            return showNotification("Password must be at least 8 characters", "error");
        if (!document.getElementById("terms-checkbox").checked)
            return showNotification("You must accept the terms and conditions", "error");

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Registering...";

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.details || data.error || "Registration failed");

            showNotification("Registration successful! Please fill out your personal information.", "success");
            localStorage.setItem("userId", data.data.userId);
            localStorage.setItem("applicantId", data.data.applicantId);
            window.location.href = `${FRONTEND_BASE_URL}/frontend/client/applicant/info/information.html`;
        } catch (error) {
            showNotification(`Registration failed: ${error.message}`, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    document.getElementById("applicantLoginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("applicantEmail").value.trim().toLowerCase();
        const password = document.getElementById("applicantPassword").value;

        if (!email || !password)
            return showNotification("Please enter both email and password", "error");

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                showNotification("Login successful!", "success");
                localStorage.setItem("userId", data.data.userId);
                localStorage.setItem("userEmail", data.data.email);
                window.location.href = `${FRONTEND_BASE_URL}/frontend/client/applicant/timeline/timeline.html`;
            } else {
                throw new Error(data.error || "Login failed");
            }
        } catch (error) {
            showNotification(`Login failed: ${error.message}`, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Optional: Add admin and assessor login handlers if forms exist
    document.getElementById("adminLoginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Add logic for admin login
        showNotification("Admin login not implemented yet", "info");
    });

    document.getElementById("assessorLoginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Add logic for assessor login
        showNotification("Assessor login not implemented yet", "info");
    });
});
