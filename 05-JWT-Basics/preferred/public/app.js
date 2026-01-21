const output = document.getElementById("output");
const tokenStatus = document.getElementById("tokenStatus");

const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");

const btnLogon = document.getElementById("btnLogon");
const btnHello = document.getElementById("btnHello");
const btnLogout = document.getElementById("btnLogout");

const TOKEN_KEY = "jwt_token_preferred";

function setOutput(obj) {
  if (typeof obj === "string") {
    output.textContent = obj;
    return;
  }
  output.textContent = JSON.stringify(obj, null, 2);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  updateTokenStatus();
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  updateTokenStatus();
}

function updateTokenStatus() {
  const token = getToken();
  if (token) {
    tokenStatus.textContent = `Token saved in localStorage (${token.length} chars).`;
  } else {
    tokenStatus.textContent = "No token saved yet.";
  }
}

async function logon() {
  const name = nameInput.value.trim();
  const password = passwordInput.value;

  if (!name || !password) {
    setOutput({ error: "Please enter name and password." });
    return;
  }

  try {
    const res = await fetch("/api/v1/logon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setOutput({ status: res.status, ...data });
      return;
    }

    if (!data.token) {
      setOutput({ error: "No token returned from server.", data });
      return;
    }

    setToken(data.token);
    setOutput({
      message: "Logon success. Token stored.",
      tokenPreview: data.token.slice(0, 20) + "...",
    });
  } catch (err) {
    setOutput({ error: "Request failed", details: String(err) });
  }
}

async function hello() {
  const token = getToken();
  if (!token) {
    setOutput({ error: "No token. Please logon first." });
    return;
  }

  try {
    const res = await fetch("/api/v1/hello", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    setOutput({ status: res.status, ...data });
  } catch (err) {
    setOutput({ error: "Request failed", details: String(err) });
  }
}

btnLogon.addEventListener("click", logon);
btnHello.addEventListener("click", hello);
btnLogout.addEventListener("click", () => {
  clearToken();
  setOutput("Logged out. Token cleared.");
});

updateTokenStatus();
