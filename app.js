/*************************
 * DOM ELEMENTS
 *************************/
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const dashboardBox = document.getElementById("dashboardBox");

const switchReg = document.getElementById("switchToRegister");
const switchLog = document.getElementById("switchToLogin");
const toggleBtn = document.getElementById("toggle");
const logoutBtn = document.getElementById("logoutBtn");

const API = "http://localhost:3000";

/*************************
 * UI TOGGLE
 *************************/
switchReg.onclick = e => {
    e.preventDefault();
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
};

switchLog.onclick = e => {
    e.preventDefault();
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
};

toggleBtn.onclick = () => {
    document.documentElement.classList.toggle("dark");
};

/*************************
 * POPUP SYSTEM
 *************************/
const popup = document.getElementById("popup");
const errPopup = document.getElementById("errPopup");

const showPopup = msg => {
    const el = document.createElement("div");
    el.className = "popup-item";
    el.textContent = msg;
    popup.appendChild(el);
    el.offsetHeight;
    el.classList.add("show");
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 400);
    }, 2500);
};

const showErr = msg => {
    const el = document.createElement("div");
    el.className = "popup-err";
    el.textContent = msg;
    errPopup.appendChild(el);
    el.offsetHeight;
    el.classList.add("show");
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 400);
    }, 2500);
};

/*************************
 * LOGIN
 *************************/
const formLog = document.getElementById("formLog");
const emailLog = document.getElementById("emailLog");
const passwordLog = document.getElementById("passwordLog");

const resetLoginForm = () => formLog.reset();

formLog.addEventListener("submit", async e => {
    e.preventDefault();

    const email = emailLog.value.trim();
    const password = passwordLog.value.trim();

    if (!email || !password) {
        showErr("Form belum lengkap");
        return;
    }

    try {
        const res = await fetch("https://portofolio-production-db1e.up.railway.app/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!data.ok) {
            showErr(data.msg);
            return;
        }

        localStorage.setItem("auth_token", data.token);

        loginBox.classList.add("hidden");
        dashboardBox.classList.remove("hidden");

        showPopup("Login berhasil");
        resetLoginForm();

    } catch {
        showErr("Server tidak tersedia");
    }
});

/*************************
 * REGISTER
 *************************/
const formReg = document.getElementById("formReg");
const namaReg = document.getElementById("namaReg");
const emailReg = document.getElementById("emailReg");
const passwordReg = document.getElementById("passwordReg");
const passwordRegKonf = document.getElementById("passwordRegKonf");

const resetRegisterForm = () => formReg.reset();

formReg.addEventListener("submit", async e => {
    e.preventDefault();

    const nama = namaReg.value.trim();
    const email = emailReg.value.trim();
    const password = passwordReg.value.trim();
    const konf = passwordRegKonf.value.trim();

    if (!nama || !email || !password || !konf) {
        showErr("Form belum lengkap");
        return;
    }

    if (password !== konf) {
        showErr("Konfirmasi password salah");
        return;
    }

    try {
        const res = await fetch(`https://portofolio-production-db1e.up.railway.app/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, email, password })
        });

        const data = await res.json();

        if (!data.ok) {
            showErr(data.msg);
            return;
        }

        showPopup("Registrasi berhasil");
        resetRegisterForm();
        switchLog.click();

    } catch {
        showErr("Server tidak tersedia");
    }
});

/*************************
 * AUTH CHECK ON LOAD
 *************************/
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
        const res = await fetch(`https://portofolio-production-db1e.up.railway.app/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (!data.ok) {
            localStorage.removeItem("auth_token");
            return;
        }

        loginBox.classList.add("hidden");
        registerBox.classList.add("hidden");
        dashboardBox.classList.remove("hidden");

    } catch {
        localStorage.removeItem("auth_token");
    }
});

/*************************
 * LOGOUT
 *************************/
const logout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
        await fetch(`https://portofolio-production-db1e.up.railway.app/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
    } catch {}

    localStorage.removeItem("auth_token");

    dashboardBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

    showPopup("Logout berhasil");
};

logoutBtn?.addEventListener("click", logout);
