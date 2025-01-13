const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');
const regBtn=document.getElementById('reg-btn');
const regModal = document.getElementById('reg-modal');
const regcloseModal = document.getElementById('reg-close-modal');

loginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

regBtn.addEventListener('click',()=>{
    loginModal.classList.add('hidden');
    regModal.classList.remove('hidden');
});

regcloseModal.addEventListener('click', () => {
    regModal.classList.add('hidden');
});

regModal.addEventListener('click', (e) => {
    if (e.target === regModal) {
        regModal.classList.add('hidden');
    }
});