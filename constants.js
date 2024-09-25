export const localStorageKey = {
  logged_in_user: "LOGGED_IN_USER",
  user_info: "USER_INFO",
  tasks: "TASKS",
};

export const taskStatus = {
  completed: "completed",
  uncompleted: "uncompleted",
};

export const regexPatterns = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  length: /.{8,}/,
  digit: /\d/,
  specialCharacter: /[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./]/,
  passwordRequirements:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|~=`{}\[\]:";'<>?,./]{8,}$/,
};
