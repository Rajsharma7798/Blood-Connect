import { getAllUsers, getAllRequests } from './local-db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Access Control
  if (sessionStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // Logout
  document.getElementById('logoutAdminBtn').addEventListener('click', () => {
    sessionStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  // Table Bodies
  const usersTbody = document.querySelector('#usersTable tbody');
  const requestsTbody = document.querySelector('#requestsTable tbody');

  // Load Users
  const loadUsers = () => {
    const users = getAllUsers();
    if (users.length === 0) {
      usersTbody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
      return;
    }
    let rows = '';
    users.forEach(data => {
      let dateStr = 'N/A';
      if (data.createdAt) {
        const d = new Date(data.createdAt);
        dateStr = isNaN(d) ? data.createdAt : d.toLocaleString();
      }

      rows += `
        <tr>
          <td>${data.name || 'N/A'}</td>
          <td>${data.email || 'N/A'}</td>
          <td style="text-transform: capitalize;">${data.role || 'N/A'}</td>
          <td>${data.bloodType || '-'}</td>
          <td>${dateStr}</td>
        </tr>
      `;
    });
    usersTbody.innerHTML = rows;
  };

  // Load Blood Requests
  const loadRequests = () => {
    const requests = getAllRequests();
    if (requests.length === 0) {
      requestsTbody.innerHTML = '<tr><td colspan="6">No requests found.</td></tr>';
      return;
    }
    let rows = '';
    requests.forEach(data => {
      let dateStr = 'N/A';
      if (data.createdAt) {
        const d = new Date(data.createdAt);
        dateStr = isNaN(d) ? data.createdAt : d.toLocaleString();
      }

      rows += `
        <tr>
          <td>${data.patientName || 'N/A'}</td>
          <td>${data.bloodType || 'N/A'}</td>
          <td>${data.requiredUnits || 'N/A'}</td>
          <td>${data.hospitalName || 'N/A'}</td>
          <td style="text-transform: capitalize;">${data.status || 'N/A'}</td>
          <td>${dateStr}</td>
        </tr>
      `;
    });
    requestsTbody.innerHTML = rows;
  };

  // CSV Export utility
  const exportTableToCSV = (tableId, filename) => {
    const table = document.getElementById(tableId);
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
      let row = [], cols = table.rows[i].querySelectorAll("td, th");
      for (let j = 0; j < cols.length; j++) {
        let data = cols[j].innerText.replace(/"/g, '""');
        row.push('"' + data + '"');
      }
      csv.push(row.join(","));
    }

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Export Buttons
  document.getElementById('exportUsersBtn').addEventListener('click', () => {
    exportTableToCSV('usersTable', `Users_Export_${new Date().toISOString().slice(0,10)}.csv`);
  });

  document.getElementById('exportRequestsBtn').addEventListener('click', () => {
    exportTableToCSV('requestsTable', `BloodRequests_Export_${new Date().toISOString().slice(0,10)}.csv`);
  });

  // Initialize
  loadUsers();
  loadRequests();
});
