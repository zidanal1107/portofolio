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