/**
 * Sending a post request to store the user details in json file
 * by taking username and password as input.
 * @param {string} nameOfTheUser
 * @param {string} userPassword
 * @return {promise} response
 */
function sendHttpRequestToPostUserDetails(nameOfTheUser, userPassword) {
  let response = new Promise(async (resolve, reject) => {
    let userDetail = await fetch(`http://127.0.0.1:8000/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameOfTheUser: nameOfTheUser,
        userPassword: userPassword,
      }),
    });
    if (userDetail.ok) {
      resolve();
    } else {
      let error = await userDetail.json();
      alert(error.Error);
      reject("Something went wrong..");
    }
  });
  return response;
}

/**
 * Sending a post request to store the current username in json file and validate the user is a
 * valid user or not, by taking username and password as input.
 * @param {string} nameOfTheUser
 * @param {string} userPassword
 * @return {promise} response
 */
function sendHttpRequestToPostUserDetailsAndValidate(
  nameOfTheUser,
  userPassword
) {
  let response = new Promise(async (resolve, reject) => {
    let userData = await fetch(`http://127.0.0.1:8000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameOfTheUser: nameOfTheUser,
        userPassword: userPassword,
      }),
    });
    if (userData.ok) {
      resolve(userData.json());
    } else {
      let error = await userData.json();
      alert(error.Error);
      reject("Something went wrong..");
    }
  });
  return response;
}

/**
 * Sending a get request to fetch the username from json file.
 * @param {string} nameOfTheUser
 * @param {string} userPassword
 * @return {promise} response
 */
function sendHttpRequestGetCurrentUserName() {
  let response = new Promise(async (resolve, reject) => {
    let CurrentUserName = await fetch("http://127.0.0.1:8000/getusername", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (CurrentUserName.ok) {
      resolve(CurrentUserName.json());
    } else {
      let error = await CurrentUserName.json();
      alert(error.Error);
      reject("Something went wrong..");
    }
  });
  return response;
}
