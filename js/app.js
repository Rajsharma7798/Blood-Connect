import { loginUser, registerUser, logoutUser, getCurrentUser } from './local-db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Modal Elements
  const authModal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const heroRegisterBtn = document.getElementById('heroRegisterBtn');
  const requestBloodBtn = document.getElementById('requestBloodBtn');
  const closeBtn = document.querySelector('#authModal .close-btn');
  const authForm = document.getElementById('authForm');
  
  // Modal Switch Variables
  let isLoginMode = true;
  const modalTitle = document.getElementById('modalTitle');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authSwitchLink = document.getElementById('authSwitchLink');
  const authSwitchText = document.getElementById('authSwitchText');
  const registerOnlyFields = document.querySelectorAll('.register-only');

  // Open Modal Functions
  const openModal = (mode = 'login') => {
    isLoginMode = mode === 'login';
    updateModalUI();
    authModal.classList.remove('hidden');
  };

  const closeModal = () => {
    authModal.classList.add('hidden');
    authForm.reset();
  };

  // Toggle Mode
  const updateModalUI = () => {
    if (isLoginMode) {
      modalTitle.textContent = 'Welcome Back';
      authSubmitBtn.textContent = 'Login';
      authSwitchText.textContent = "Don't have an account? ";
      authSwitchLink.textContent = 'Sign up here';
      registerOnlyFields.forEach(el => el.classList.add('hidden'));
    } else {
      modalTitle.textContent = 'Join Blood Connect';
      authSubmitBtn.textContent = 'Create Account';
      authSwitchText.textContent = 'Already have an account? ';
      authSwitchLink.textContent = 'Login here';
      registerOnlyFields.forEach(el => el.classList.remove('hidden'));
    }
  };

  // Event Listeners for Landing Page
  if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
  if (registerBtn) registerBtn.addEventListener('click', () => openModal('register'));
  if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => openModal('register'));
  if (requestBloodBtn) requestBloodBtn.addEventListener('click', () => window.location.href = 'request-blood.html');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (authSwitchLink) {
    authSwitchLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLoginMode = !isLoginMode;
      updateModalUI();
    });
  }

  // Handle Auth Form Submission
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;

      try {
        if (isLoginMode) {
          loginUser(email, pass);
          window.location.href = 'dashboard.html';
        } else {
          const name = document.getElementById('name').value;
          const role = document.getElementById('role').value;
          const bloodType = document.getElementById('bloodType').value;
          registerUser(email, pass, name, role, bloodType);
          window.location.href = 'dashboard.html';
        }
      } catch (error) {
        console.error("Auth error:", error);
        alert(error.message);
      }
    });
  }

  // === Dashboard Logic ===
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
      window.location.href = 'index.html';
    });
  }

  // Greet user on dashboard
  const userGreeting = document.getElementById('userGreeting');
  if (userGreeting) {
    const user = getCurrentUser();
    if (user) {
      userGreeting.textContent = `Hello, ${user.name}`;
    } else {
      userGreeting.textContent = 'Guest';
    }
  }

  // === Admin Modal Logic ===
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminModal = document.getElementById('adminModal');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminForm = document.getElementById('adminForm');

  if (adminLoginBtn && adminModal) {
    adminLoginBtn.addEventListener('click', () => {
      adminModal.classList.remove('hidden');
    });
  }

  if (adminCloseBtn && adminModal) {
    adminCloseBtn.addEventListener('click', () => {
      adminModal.classList.add('hidden');
      if (adminForm) adminForm.reset();
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUser').value;
      const pass = document.getElementById('adminPass').value;

      if (user === 'Admin' && pass === 'Pass@123') {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
      } else {
        alert('Invalid admin credentials.');
      }
    });
  }
});
