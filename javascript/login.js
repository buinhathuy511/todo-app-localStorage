const formSignIn = document.querySelector(".form");
const userLocal = JSON.parse(localStorage.getItem("USER_INFO")) || [];
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const rememberMe = document.querySelector(".remember-me");
const eyePassword = document.querySelector(".password-eye");

function handleLogin(event) {
  event.preventDefault();
  for (let i = 0; i < userLocal.length; i++) {
    if (
      userName.value === userLocal[i].userName &&
      password.value === userLocal[i].password
    ) {
      const userId = userLocal[i].userId;
      const userData = {
        userId: userId,
        userName: userName.value,
        loggedIn: true,
      };
      if (rememberMe.checked) {
        localStorage.setItem("LOGGED_IN_USER", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("LOGGED_IN_USER", JSON.stringify(userData));
      }
      window.location.href = "../html/main.html";
      return;
    }
  }
  alert("Invalid username or password.");
}
formSignIn.addEventListener("submit", handleLogin);

function handleDOMContentLoaded() {
  const storage = {
    local: JSON.parse(localStorage.getItem("LOGGED_IN_USER")),
    session: JSON.parse(sessionStorage.getItem("LOGGED_IN_USER")),
  };

  if (
    (storage.local && storage.local.loggedIn) ||
    (storage.session && storage.session.loggedIn)
  ) {
    window.location.href = "../html/main.html";
  }
}
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleEyePassword() {
  password.type = password.type === "password" ? "text" : "password";
}
eyePassword.addEventListener("click", handleEyePassword);
