const API_BASE = "http://localhost:5000";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) return alert("Select a file");

  const formData = new FormData();
  formData.append("file", file);

  fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  })
  .then(() => loadFiles());
}

function loadFiles() {
  fetch(`${API_BASE}/files/list`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(files => {
    const list = document.getElementById("fileList");
    list.innerHTML = "";

    files.forEach(f => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${f.filename}
        <button onclick="downloadFile(${f.id})">Download</button>
        <button onclick="deleteFile(${f.id})">Delete</button>
      `;
      list.appendChild(li);
    });
  });
}

function downloadFile(id) {
  window.open(`${API_BASE}/files/download/${id}?token=${token}`);
}

function deleteFile(id) {
  fetch(`${API_BASE}/files/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(() => loadFiles());
}

loadFiles();
