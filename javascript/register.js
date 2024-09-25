import { localStorageKey, regexPatterns } from "../constants.js";

const formSignUp = document.querySelector(".form");
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const repeatPassword = document.querySelector(".repeat-password");
const error = document.querySelector(".error");
const eyePassword = document.querySelector(".password-eye");
const eyeRepeatPassword = document.querySelector(".repeat-password-eye");
const users = JSON.parse(localStorage.getItem(localStorageKey.user_info)) || [];
const length_requirement = document.getElementById("length-requirement");
const uppercase_requirement = document.getElementById("uppercase-requirement");
const lowercase_requirement = document.getElementById("lowercase-requirement");
const digit_requirement = document.getElementById("digit-requirement");
const special_character_requirement = document.getElementById(
  "special-character-requirement"
);

function generateUserId() {
  return btoa(userName.value) + Date.now();
}

function setPasswordRequirementsColors() {
  length_requirement.classList.toggle(
    "active",
    regexPatterns.length.test(password.value)
  );
  uppercase_requirement.classList.toggle(
    "active",
    regexPatterns.uppercase.test(password.value)
  );
  lowercase_requirement.classList.toggle(
    "active",
    regexPatterns.lowercase.test(password.value)
  );
  digit_requirement.classList.toggle(
    "active",
    regexPatterns.digit.test(password.value)
  );
  special_character_requirement.classList.toggle(
    "active",
    regexPatterns.specialCharacter.test(password.value)
  );
}
password.addEventListener("input", function () {
  setPasswordRequirementsColors(password.value);
});

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
    error.innerText = "Passwords does not match.";
  } else if (!regexPatterns.passwordRequirements.test(password.value)) {
    error.innerText = "Passwords does not meet requirements";
  } else {
    const userId = generateUserId();
    users.push({
      userId: userId,
      userName: userName.value,
      password: password.value,
    });
    localStorage.setItem(localStorageKey.user_info, JSON.stringify(users));
    localStorage.removeItem(localStorageKey.logged_in_user);
    window.location.href = "../html/login.html";
  }
}
formSignUp.addEventListener("submit", handleRegister);

function handleDOMContentLoaded() {
  const storage = {
    local: JSON.parse(localStorage.getItem(localStorageKey.logged_in_user)),
    session: JSON.parse(sessionStorage.getItem(localStorageKey.logged_in_user)),
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
