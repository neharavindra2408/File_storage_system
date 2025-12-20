const API_BASE = "http://localhost:5000";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function uploadFile(event) {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const button = event.target;
  button.disabled = true;
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
   button.disabled = false;
}

function loadFiles() {
  fetch(`${API_BASE}/files/list`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }
    return res.json();
  })
  .then(files => {
    if (!files) return;

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
  fetch(`${API_BASE}/files/download/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "file";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
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
