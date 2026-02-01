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
 * POPUP
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
 * STORAGE LAYER
 *************************/
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = users =>
    localStorage.setItem("users", JSON.stringify(users));

const getSessions = () =>
    JSON.parse(localStorage.getItem("sessions")) || [];
const saveSessions = sessions =>
    localStorage.setItem("sessions", JSON.stringify(sessions));

/*************************
 * SECURITY (SIMULATION)
 *************************/
const hashPassword = password => btoa(password);

/*************************
 * SESSION LOGIC
 *************************/
const createSession = userId => {
    const sessions = getSessions();
    const token = crypto.randomUUID();

    sessions.push({
        token,
        userId,
        expiredAt: Date.now() + 1000 * 60 * 60 // 1 jam
    });

    saveSessions(sessions);
    localStorage.setItem("auth_token", token);
    return token;
};

const clearExpiredSessions = () => {
    const now = Date.now();
    const valid = getSessions().filter(s => s.expiredAt > now);
    saveSessions(valid);
};

const authenticate = () => {
    clearExpiredSessions();

    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const session = getSessions().find(s => s.token === token);
    if (!session) return null;

    return getUsers().find(u => u.id === session.userId) || null;
};

const logout = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const sessions = getSessions().filter(s => s.token !== token);
    saveSessions(sessions);
    localStorage.removeItem("auth_token");

    dashboardBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
    showPopup("Logout berhasil");
};

/*************************
 * LOGIN
 *************************/
const formLog = document.getElementById("formLog");
const emailLog = document.getElementById("emailLog");
const passwordLog = document.getElementById("passwordLog");

const resetLoginForm = () => {
    formLog.reset();
    resetErrMassageL();
};

const cekLogin = (email, password) => {
    const user = getUsers().find(u => u.email === email);
    if (!user) return { ok: false, msg: "Email belum terdaftar" };

    if (user.password !== hashPassword(password))
        return { ok: false, msg: "Password salah" };

    createSession(user.id);
    return { ok: true };
};

formLog.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailLog.value.trim();
    const password = passwordLog.value.trim();

    if (!email || !password) {
        showErr("Form belum lengkap");
        return;
    }

    const res = cekLogin(email, password);
    if (!res.ok) {
        showErr(res.msg);
        return;
    }

    showPopup("Login berhasil");
    loginBox.classList.add("hidden");
    dashboardBox.classList.remove("hidden");
    resetLoginForm();
});

/*************************
 * REGISTER
 *************************/
const formReg = document.getElementById("formReg");
const namaReg = document.getElementById("namaReg");
const emailReg = document.getElementById("emailReg");
const passwordReg = document.getElementById("passwordReg");
const passwordRegKonf = document.getElementById("passwordRegKonf");

const resetRegisterForm = () => {
    formReg.reset();
    resetErrMassageR();
};

formReg.addEventListener("submit", e => {
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

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showErr("Email sudah terdaftar");
        return;
    }

    users.push({
        id: crypto.randomUUID(),
        nama,
        email,
        password: hashPassword(password)
    });

    saveUsers(users);
    showPopup("Registrasi berhasil");
    switchLog.click();
    resetRegisterForm();
});

/*************************
 * AUTO AUTH ON LOAD
 *************************/
document.addEventListener("DOMContentLoaded", () => {
    const user = authenticate();
    if (user) {
        loginBox.classList.add("hidden");
        registerBox.classList.add("hidden");
        dashboardBox.classList.remove("hidden");
    }
});

/*************************
 * LOGOUT
 *************************/
logoutBtn?.addEventListener("click", logout);
