const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const switchReg = document.getElementById('switchToRegister');
const switchLog = document.getElementById('switchToLogin');
const toggleBtn = document.getElementById('toggle');

// Toggle Login - Register
switchReg.onclick = (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
};

switchLog.onclick = (e) => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
};

// Dark Mode Logic
toggleBtn.onclick = () => {
    document.documentElement.classList.toggle('dark');
};

// Popup
const popup = document.getElementById("popup");
const errPopup = document.getElementById("errPopup");

// Function popup
const showPopup = (massage) => {
    const el = document.createElement("div");
    el.className = "popup-item"
    el.textContent = massage

    popup.appendChild(el);

    el.offsetHeight
    el.classList.add("show")

    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 400);
    }, 2500)
}

// Function error popup
const showErr = (massage) => {
    const el = document.createElement("div");
    el.className = "popup-err"
    el.textContent = massage

    errPopup.appendChild(el);

    el.offsetHeight
    el.classList.add("show")

    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 400);
    }, 2500)
}

const formLog = document.getElementById("formLog");
const formReg = document.getElementById("formReg");

let data = []

// Variable login
const emailLog = document.getElementById("emailLog");
const passwordLog = document.getElementById("passwordLog");

// Variable register
const namaReg = document.getElementById("namaReg");
const emailReg = document.getElementById("emailReg");
const passwordReg = document.getElementById("passwordReg");
const passwordRegKonf = document.getElementById("passwordRegKonf");

// Variable massage error
const errNamaReg = document.getElementById("errNamaReg");
const errEmailReg = document.getElementById("errEmailReg");
const errPassReg = document.getElementById("errPassReg");

const errEmailLog = document.getElementById("errEmailLog");
const errPassLog = document.getElementById("errPassLog");

// RESET ERROR LOGIN
const resetErrMassageL = () => {
    emailLog.classList.remove("error");
    errEmailLog.classList.add("hidden");
    passwordLog.classList.remove("error");
    errPassLog.classList.add("hidden");
}

const admin = { email: "admin@gmail.com", password: "admin123" }
// From login
formLog.addEventListener("submit", (e) => {
    e.preventDefault();

    // Panggil value nya
    const emailIn = emailLog.value.trim();
    const passwordIn = passwordLog.value.trim();

    resetErrMassageL();

    if (emailIn === "") {
        errEmailLog.classList.remove("hidden")
        emailLog.classList.add("error")
    }

    if (passwordIn === "") {
        errPassLog.classList.remove("hidden")
        passwordLog.classList.add("error")
        return;
    }

    // if (emailIn !== admin.email) {
    //     showErr("Email salah")
    //     return
    // }
    // if (passwordIn !== admin.password) {
    //     showErr("Password salah")
    //     return
    // }
    showPopup("Berhasil Login")
});

// RESET MASSAGE ERROR REGISTRASI
const resetErrMassageR = () => {
    namaReg.classList.remove("error");
    errNamaReg.classList.add("hidden");

    emailReg.classList.remove("error");
    errEmailReg.classList.add("hidden");

    passwordReg.classList.remove("error");
    errPassReg.classList.add("hidden");
}

// From registrasi
formReg.addEventListener("submit", (e) => {
    e.preventDefault();

    // Panggil value nya
    const namaIn = namaReg.value.trim();
    const emailIn = emailReg.value.trim();
    const passwordIn = passwordReg.value.trim();

    resetErrMassageR();

    if (namaIn === "") {
        namaReg.classList.add("error");
        errNamaReg.classList.remove("hidden");
    }
    
    if (emailIn === "") {
        emailReg.classList.add("error");
        errEmailReg.classList.remove("hidden");
        return;
    }

    showErr("Gagal login")
})