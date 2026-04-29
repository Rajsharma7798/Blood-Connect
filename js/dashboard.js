import {
  getCurrentUser, logoutUser, getAllRequests,
  getUserByUid, updateUserProfile,
  saveLocationSettings, getLocationSettings
} from './local-db.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();

  // Redirect if not logged in
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // ========== Greeting ==========
  const greeting = document.getElementById('userGreeting');
  if (greeting) greeting.textContent = `Hello, ${user.name}`;

  // ========== Logout ==========
  document.getElementById('logoutBtn').addEventListener('click', () => {
    logoutUser();
    window.location.href = 'index.html';
  });

  // ========== Sidebar Navigation ==========
  const navLinks = document.querySelectorAll('.side-nav a[data-panel]');
  const panels = document.querySelectorAll('.panel');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.panel;

      // Update active link
      document.querySelectorAll('.side-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');

      // Show target panel
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // ========== New Request Button ==========
  const newReqBtn = document.getElementById('newRequestBtn');
  if (newReqBtn) newReqBtn.addEventListener('click', () => window.location.href = 'request-blood.html');

  // ========== PANEL 1: Feed & Requests ==========
  const loadFeed = () => {
    const feed = document.getElementById('requestsFeed');
    const requests = getAllRequests();

    if (requests.length === 0) {
      feed.innerHTML = `
        <div class="empty-state">
          <div class="icon">📭</div>
          <h3>No Requests Yet</h3>
          <p>There are no blood requests at the moment. Check back later or create a new request.</p>
        </div>`;
      return;
    }

    // Show newest first
    const sorted = [...requests].reverse();
    let html = '';

    sorted.forEach(req => {
      const date = new Date(req.createdAt);
      const timeAgo = getTimeAgo(date);
      const urgencyClass = req.urgency === 'immediate' ? 'urgency-immediate'
                         : req.urgency === 'today' ? 'urgency-today'
                         : 'urgency-scheduled';
      const urgencyLabel = req.urgency === 'immediate' ? '🔴 Immediate'
                         : req.urgency === 'today' ? '🟡 Today'
                         : '🔵 Scheduled';

      html += `
        <div class="request-card">
          <div class="request-info">
            <h3>${req.patientName}</h3>
            <div class="request-meta">
              <span>🏥 ${req.hospitalName || 'N/A'}</span>
              <span>📞 ${req.contactNumber || 'N/A'}</span>
              <span>📦 ${req.requiredUnits} unit(s)</span>
              <span>🕐 ${timeAgo}</span>
            </div>
            <div style="margin-top:0.5rem;">
              <span class="urgency-badge ${urgencyClass}">${urgencyLabel}</span>
            </div>
          </div>
          <div class="blood-badge">${req.bloodType}</div>
        </div>`;
    });

    feed.innerHTML = html;
  };

  loadFeed();

  // ========== PANEL 2: My Profile ==========
  const loadProfile = () => {
    const fullUser = getUserByUid(user.uid);
    if (!fullUser) return;

    // Avatar initials
    const avatar = document.getElementById('profileAvatar');
    const initials = (fullUser.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    avatar.textContent = initials;

    // Display info
    document.getElementById('profileDisplayName').textContent = fullUser.name;
    document.getElementById('profileRole').textContent =
      fullUser.role === 'donor' ? '🩸 Blood Donor' : '🏥 Recipient / Hospital';

    // Fill form
    document.getElementById('profName').value = fullUser.name || '';
    document.getElementById('profEmail').value = fullUser.email || '';
    document.getElementById('profPhone').value = fullUser.phone || '';
    document.getElementById('profAge').value = fullUser.age || '';
    document.getElementById('profGender').value = fullUser.gender || '';
    document.getElementById('profBloodType').value = fullUser.bloodType || 'A+';
    document.getElementById('profAddress').value = fullUser.address || '';
    document.getElementById('profMedical').value = fullUser.medicalNotes || '';
  };

  loadProfile();

  // Save profile
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updates = {
      name: document.getElementById('profName').value,
      phone: document.getElementById('profPhone').value,
      age: document.getElementById('profAge').value,
      gender: document.getElementById('profGender').value,
      bloodType: document.getElementById('profBloodType').value,
      address: document.getElementById('profAddress').value,
      medicalNotes: document.getElementById('profMedical').value
    };

    updateUserProfile(user.uid, updates);

    // Update greeting
    greeting.textContent = `Hello, ${updates.name}`;

    // Show success
    const msg = document.getElementById('profileSaveMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2500);

    // Reload profile display
    loadProfile();
  });

  // ========== PANEL 3: Location Settings ==========
  const radiusSlider = document.getElementById('radiusSlider');
  const radiusValue = document.getElementById('radiusValue');
  const cityOptions = document.querySelectorAll('.city-option');

  let selectedCity = '';

  // Load saved settings
  const locSettings = getLocationSettings(user.uid);
  selectedCity = locSettings.city;
  radiusSlider.value = locSettings.radius;
  radiusValue.textContent = locSettings.radius;
  updateSliderBackground(radiusSlider);

  // Highlight saved city
  cityOptions.forEach(opt => {
    if (opt.dataset.city === selectedCity) opt.classList.add('selected');
  });

  // City selection
  cityOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      cityOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedCity = opt.dataset.city;
    });
  });

  // Radius slider
  radiusSlider.addEventListener('input', () => {
    radiusValue.textContent = radiusSlider.value;
    updateSliderBackground(radiusSlider);
  });

  // Save location
  document.getElementById('saveLocationBtn').addEventListener('click', () => {
    saveLocationSettings(user.uid, selectedCity, parseInt(radiusSlider.value));

    const msg = document.getElementById('locationSaveMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2500);
  });

  // ========== Availability Toggle ==========
  const availToggle = document.getElementById('availabilityToggle');
  const availText = document.getElementById('availabilityText');

  if (availToggle) {
    availToggle.addEventListener('change', () => {
      availText.textContent = availToggle.checked ? 'Available to Donate' : 'Not Available';
    });
  }
});

// ========== Helpers ==========
function updateSliderBackground(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #E63946 ${pct}%, #ddd ${pct}%)`;
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
