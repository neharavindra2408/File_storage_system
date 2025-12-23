const API_BASE = "http://localhost:5000";

////////////////////
// Login Function
///////////////////
function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  messageEl.style.color = "red";
  messageEl.innerText = "";

  // Frontend validation
  if (!email || !password) {
    messageEl.innerText = "Email and password are required";
    return;
  }

  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Invalid email or password");
      }

      return data;
    })
    .then(data => {
      localStorage.setItem("token", data.access_token);
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      messageEl.innerText = err.message;
    });
}


////////////////////
// Register Function
///////////////////
function register(e) {
  e.preventDefault();

  console.log("Register function called"); // 👈 DEBUG LINE

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  messageEl.style.color = "red";
  messageEl.innerText = "";

  if (!email || !password) {
    messageEl.innerText = "Email and password are required";
    return;
  }

  if (password.length < 6) {
    messageEl.innerText = "Password must be at least 6 characters";
    return;
  }

  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");
      return data;
    })
    .then(() => {
      messageEl.style.color = "green";
      messageEl.innerText = "Registration successful. Redirecting...";
      setTimeout(() => window.location.href = "login.html", 1000);
    })
    .catch(err => {
      messageEl.innerText = err.message;
    });
}


/////////////////////////
// Expired token Function
/////////////////////////
function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}
