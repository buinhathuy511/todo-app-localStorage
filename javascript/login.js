const formSignIn = document.querySelector(".form");
const userLocal = JSON.parse(localStorage.getItem("USER_INFO")) || [];
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const rememberMe = document.querySelector(".remember-me");

formSignIn.addEventListener("submit", function (event) {
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
});

document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = JSON.parse(localStorage.getItem("LOGGED_IN_USER"));
  if (loggedInUser && loggedInUser.loggedIn) {
    window.location.href = "../html/main.html";
  }
});

const eyePassword = document.querySelector(".password-eye");
eyePassword.addEventListener("click", function () {
  password.type = password.type === "password" ? "text" : "password";
});
