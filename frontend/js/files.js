const API_BASE = "http://localhost:5000";
const token = localStorage.getItem("token");

/////////////////////////
// Expired token Function
/////////////////////////
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true; // treat invalid token as expired
  }
}

if (!token || isTokenExpired(token)) {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

//////////////////
// Logout function
//////////////////
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

//////////////////////////////////
// Function to upload a file
/////////////////////////////////
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
  alert("File uploaded successfully");
   button.disabled = false;
}

//////////////////////////////////////
// Function to load all files for user
/////////////////////////////////////
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
      li.className = "file-item";

      li.innerHTML = `
        <span class="file-name">${f.filename}</span>
        <div class="file-actions">
          <button onclick="downloadFile(${f.id})" class="download">Download</button>
          <button onclick="deleteFile(${f.id})" class="delete">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  });
}

//////////////////////////////////
// Function to download a file
/////////////////////////////////
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
    alert("File downloaded successfully");
    a.click();
    a.remove();
  });
}

//////////////////////////////////
// Function to delete a file
/////////////////////////////////
function deleteFile(id) {
  fetch(`${API_BASE}/files/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(() => loadFiles());
  alert("File deleted");
}

loadFiles();
