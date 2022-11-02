/*  Object references of the login and signup page*/
const triggerLogin = document.getElementById("trigger-login");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");

const triggerSignup = document.getElementById("trigger-signup");
const signupModal = document.getElementById("signup");
const signupClose = document.getElementById("signup-close");

const userName = document.getElementById("username-signup");
const password = document.getElementById("password-signup");
const confirmPassword = document.getElementById("ensure-password");
const signupSubmit = document.getElementById("signup-submit");

const usernameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

let valid = false;

/**
 * It will display the particular modal based on the ID.
 * @param {string} UIAttributeID id of the modal
 * @return {void}
 */
function toggleModal(UIAttributeID) {
  if (UIAttributeID == "loginModal") loginModal.classList.toggle("show-modal");
  else signupModal.classList.toggle("show-modal");
}

/**
 * It will display the particular modal, when the user clicks the login or signup button
 * @param {refernce} event
 * @return {void}
 */
function windowOnClick(event) {
  if (event.target === loginModal || event.target === signupModal) {
    toggleModal();
  }
}

/**
 *
 * Based on the user choice , a request is raised and the data is stored in json.
 * if the user choice is login, it check the user credentials and return the sucess response.
 * @param {string} userChoice
 * @return {void}
 */
async function handleSubmit(userChoice) {
  if (userChoice == "signup")
    await sendHttpRequestToPostUserDetails(userName.value, password.value);
  else {
    let response = await sendHttpRequestToPostUserDetailsAndValidate(
      usernameLogin.value,
      passwordLogin.value
    );
    return response;
  }
}

/* when the user clicks the login button,the listener will display and hide the login division */
triggerLogin.addEventListener("click", () => {
  toggleModal("loginModal");
});

/* when the user clicks the close button,the listener hide the login division */
loginClose.addEventListener("click", () => {
  toggleModal("loginModal");
});

/* when the user clicks the signup button,the listener will display and hide the signup division */
triggerSignup.addEventListener("click", () => {
  toggleModal("signupModal");
});

/* when the user clicks the close button,the listener hide the signup division */
signupClose.addEventListener("click", () => {
  toggleModal("signupModal");
});

window.addEventListener("click", windowOnClick);

/**
 * It will valid the user details and send alert if it doesn't satisfy the condition.
 * @param {void}
 * @return {void}
 */
function validUserDetails() {
  if (
    userName.value == "" ||
    password.value == "" ||
    confirmPassword.value == ""
  )
    alert("All fields are required");
  else {
    if (CheckPassword()) checkForValidPassword();
    if (valid) {
      handleSubmit("signup");
      window.location.replace("index.html");
    }
  }
}

/**
 * It will validate the password and alert the user if it fails.
 * @param {void}
 * @return {boolean} valid
 */
function CheckPassword() {
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  if (password.value.match(passw) && password.value != "") {
    valid = true;
    return true;
  } else {
    alert(
      "Please Enter atleast one Number, one UpperCase, one Lowercase and minimum 8 Characters in password field"
    );
    password.style.border = "2px solid red";
    password.value = "";
    valid = false;
    return false;
  }
}

/**
 * It checks the password with confirm password ,if it doesn't matches it alert and highlight the input field.
 * @param {void}
 * @return {void}
 */
function checkForValidPassword() {
  if (password.value == "") {
    alert("Please Enter the password again.");
    confirmPassword.style.border = "2px solid red";
    valid = false;
  } else if (password.value != confirmPassword.value) {
    alert("Password doesn't Match");
    confirmPassword.style.border = "2px solid red";
    confirmPassword.value = "";
    valid = false;
  } else {
    valid = true;
    confirmPassword.style.border = "1px solid grey";
  }
}

/**
 * Checks all the input field are filled and validate the credentials and
 * redirect to game page.
 * @param {void}
 * @return {void}
 */
async function isUserValid() {
  if (usernameLogin.value == "" || passwordLogin.value == "")
    alert("All fields are required");
  else {
    let response = await handleSubmit("login");
    if (response.data == "success") window.location.replace("tictactoe.html");
  }
}
