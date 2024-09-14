const formSignUp = document.querySelector(".form");
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const repeatPassword = document.querySelector(".repeat-password");
const error = document.querySelector(".error");
const eyePassword = document.querySelector(".password-eye");
const eyeRepeatPassword = document.querySelector(".repeat-password-eye");
const users = JSON.parse(localStorage.getItem("USER_INFO")) || [];

function generateUserId() {
  return btoa(userName.value) + Date.now();
}

function handleRegister(event) {
  event.preventDefault();
  const isUserExist = users.some(function (user) {
    return user.userName === userName.value;
  });
  if (!userName.value || !password.value || !repeatPassword.value) {
    error.innerText = "Please fill in all the required information";
  } else if (isUserExist) {
    error.innerText = "User already exists.";
  } else if (password.value != repeatPassword.value) {
    error.innerText = "Passwords do not match.";
  } else {
    const userId = generateUserId();

    users.push({
      userId: userId,
      userName: userName.value,
      password: password.value,
    });
    localStorage.setItem("USER_INFO", JSON.stringify(users));
    localStorage.removeItem("LOGGED_IN_USER");
    window.location.href = "../html/login.html";
  }
}
formSignUp.addEventListener("submit", handleRegister);

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

function handleEyeRepeatPassword() {
  repeatPassword.type =
    repeatPassword.type === "password" ? "text" : "password";
}
eyePassword.addEventListener("click", handleEyePassword);
eyeRepeatPassword.addEventListener("click", handleEyeRepeatPassword);
