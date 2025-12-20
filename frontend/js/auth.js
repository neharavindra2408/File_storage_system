const API_BASE = "http://localhost:5000";

function login(e) {
  e.preventDefault(); 
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
  document.getElementById("message").innerText = "Email and password required";
  return;
}

  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("message").innerText = data.msg || "Login failed";
    }
  });
}


function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (password.length < 6) {
  document.getElementById("message").innerText =
    "Password must be at least 6 characters";
  return;
}

  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(async res => {
    const data = await res.json();
    return { status: res.status, data };
  })
  .then(result => {
    if (result.status === 201 || result.status === 200) {
      document.getElementById("message").innerText =
        "Registration successful. Redirecting to login...";
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1000);
    } else if (result.status === 409) {
      document.getElementById("message").innerText =
        "User already exists. Please login.";
    } else {
      document.getElementById("message").innerText =
        result.data.msg || "Registration failed";
    }
  });
}

