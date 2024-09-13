const formSignUp = document.querySelector(".form");
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const repeatPassword = document.querySelector(".repeat-password");
const error = document.querySelector(".error");
const users = JSON.parse(localStorage.getItem("USER_INFO")) || [];

function generateUserId() {
  return btoa(userName.value) + Date.now();
}

formSignUp.addEventListener("submit", function (event) {
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
});

document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = JSON.parse(localStorage.getItem("LOGGED_IN_USER"));
  if (loggedInUser && loggedInUser.isRememberMe) {
    window.location.href = "../html/main.html";
  } else {
    localStorage.removeItem("LOGGED_IN_USER");
  }
});

const eyePassword = document.querySelector(".password-eye");
eyePassword.addEventListener("click", function () {
  password.type = password.type === "password" ? "text" : "password";
});

const eyeRepeatPassword = document.querySelector(".repeat-password-eye");
eyeRepeatPassword.addEventListener("click", function () {
  repeatPassword.type =
    repeatPassword.type === "password" ? "text" : "password";
});
