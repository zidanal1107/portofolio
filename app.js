document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const loginBox = document.querySelector('.container-login');
    const regBox = document.querySelector('.container-regis');

    if (!themeToggle || !loginBox || !regBox) return;

    // ================= POPUP =================
    let popupTimeout;
    const showPopup = (selector, message) => {
        const popup = document.querySelector(selector);
        if (!popup) return;

        clearTimeout(popupTimeout);
        popup.textContent = message;
        popup.classList.add('popup-show');

        popupTimeout = setTimeout(() => {
            popup.classList.remove('popup-show');
        }, 2800);
    };

    // ================= THEME =================
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;
    themeToggle.textContent = savedTheme === 'light-mode' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light-mode' ? '🌙' : '☀️';
    });

    // ================= SWITCH FORM =================
    const switchForm = (hide, show) => {
        hide.classList.add('fade-out');
        setTimeout(() => {
            hide.classList.add('hidden');
            hide.classList.remove('fade-out');

            show.classList.remove('hidden');
            show.classList.add('fade-in');
        }, 250);
    };

    document.getElementById('showRegister')?.addEventListener('click', e => {
        e.preventDefault();
        switchForm(loginBox, regBox);
    });

    document.getElementById('showLogin')?.addEventListener('click', e => {
        e.preventDefault();
        switchForm(regBox, loginBox);
    });

    // ================= VALIDATION =================
    const validateField = (id, errId) => {
        const input = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!input || !err) return false;

        if (!input.value.trim()) {
            err.style.display = 'block';
            input.classList.add('input-error');
            return false;
        }

        err.style.display = 'none';
        input.classList.remove('input-error');
        return true;
    };

    const liveClear = (id, errId) => {
        const input = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!input || !err) return;

        input.addEventListener('input', () => {
            err.style.display = 'none';
            input.classList.remove('input-error');
        });
    };

    [
        ['email','errEmailLog'],
        ['password','errPassLog'],
        ['name','errNama'],
        ['dob','errDate'],
        ['emailNew','errEmailReg'],
        ['passwordNew','errPassReg'],
        ['confirmPasswordNew','errPassRegKonf']
    ].forEach(([a,b]) => liveClear(a,b));

    // ================= LOGIN =================
    document.querySelector('.formLogin')?.addEventListener('submit', e => {
        e.preventDefault();

        const okEmail = validateField('email','errEmailLog');
        const okPass = validateField('password','errPassLog');
        if (!okEmail || !okPass) {
            showPopup('.errPopupLog','Lengkapi data login.');
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const valid = users.find(u => u.email === email && u.password === password);

        if (!valid) {
            showPopup('.errPopupLog','Email atau Password salah.');
            return;
        }

        localStorage.setItem('loggedUser', email);
        showPopup('.popupLog','Login berhasil!');
    });

    // ================= REGISTER =================
    document.querySelector('.formRegis')?.addEventListener('submit', e => {
        e.preventDefault();

        const okName = validateField('name','errNama');
        const okDate = validateField('dob','errDate');
        const okEmail = validateField('emailNew','errEmailReg');
        const okPass = validateField('passwordNew','errPassReg');

        const pass = document.getElementById('passwordNew').value.trim();
        const conf = document.getElementById('confirmPasswordNew').value.trim();
        const errConf = document.getElementById('errPassRegKonf');

        let match = true;

        if (!conf) {
            errConf.style.display = 'block';
            errConf.querySelector('p').textContent = "Belum diisi";
            match = false;
        } else if (pass !== conf) {
            errConf.style.display = 'block';
            errConf.querySelector('p').textContent = "Password tidak cocok";
            match = false;
        }

        if (!(okName && okDate && okEmail && okPass && match)) {
            showPopup('.errPopupReg','Registrasi gagal.');
            return;
        }

        const email = document.getElementById('emailNew').value.trim();
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(u => u.email === email)) {
            showPopup('.errPopupReg','Email sudah terdaftar.');
            return;
        }

        users.push({
            name: document.getElementById('name').value.trim(),
            dob: document.getElementById('dob').value.trim(),
            email,
            password: pass
        });

        localStorage.setItem('users', JSON.stringify(users));

        showPopup('.popupReg','Registrasi sukses!');

        setTimeout(() => switchForm(regBox, loginBox), 1400);
    });
});
