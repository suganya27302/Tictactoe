/**
 * Importing the neccessary packages.
 */
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

/* Read the json file and convert into object to append the data */
let data = fs.readFileSync("./DATA/userdata.json", "utf8");
data = JSON.parse(data);

let presentUser = fs.readFileSync("./DATA/currentuser.json", "utf8");
presentUser = JSON.parse(presentUser);

/**
 * body-parser, which is used to fetch input data from body.
 * extended is set to false, it returns objects.
 * Note: If extended is set to true it returns object of objects
 * and qslibrary is used to parse object
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Render the Webpage using the middleware.
 */
app.use("/", express.static("./"));

/**
 * Respond to the request to capture the user details and
 * store the user details in the json file.
 * If the username is already in the object, it returns with an error message.
 * If the data is not captured properly, it displays error message to page.
 * */
app.post("/signup", function (request, response) {
  try {
    if (!request.body) throw new Error("Request body is null ");
    else {
      if (!(request.body.nameOfTheUser && request.body.userPassword))
        throw new Error("Request body argument values are null");
      else {
        console.log(data);
        if (!(request.body.nameOfTheUser in data)) {
          data[request.body.nameOfTheUser] = request.body.userPassword;
          let userData = JSON.stringify(data);
          fs.writeFile("./DATA/userdata.json", userData, () => {});
          response.status(200).json({ data: "success" });
          response.end();
        } else {
          response.status(404).json({ Error: "Username already exists" });
          response.end();
        }
      }
    }
  } catch (error) {
    let date = new Date();
    let errorMessage =
      "\n" +
      date.toDateString() +
      " " +
      date.toLocaleTimeString() +
      " " +
      error.message +
      " in http://127.0.0.1" +
      request.url;
    // create a logger file and append the error message
    fs.appendFile("logger.txt", errorMessage, function (err) {
      console.log(errorMessage);
    });

    response.status(404).json({
      Error:
        "Not a valid Endpoint,Please check with it." + "\n" + error.message,
    });
  }
});

/**
 * Respond to the request to capture the user details and
 * Check whether the user exists or not.
 * If the username or password are wrong, it returns with an error message.
 * If the data is not captured properly, it displays error message to page.
 * */
app.post("/login", function (request, response) {
  try {
    if (!request.body) throw new Error("Request body is null ");
    else {
      if (!(request.body.nameOfTheUser && request.body.userPassword))
        throw new Error("Request body argument values are null");
      else {
        if (
          request.body.nameOfTheUser in data &&
          data[request.body.nameOfTheUser] === request.body.userPassword
        ) {
          presentUser["CurrentUser"] = request.body.nameOfTheUser;
          let userData = JSON.stringify(presentUser);
          fs.writeFile("./DATA/currentuser.json", userData, () => {});
          response.status(200).json({ data: "success" });
          response.end();
        } else {
          response
            .status(404)
            .json({ Error: "Invalid user. Please enter valid credential." });
          response.end();
        }
      }
    }
  } catch (error) {
    let date = new Date();
    let errorMessage =
      "\n" +
      date.toDateString() +
      " " +
      date.toLocaleTimeString() +
      " " +
      error.message +
      " in http://127.0.0.1" +
      request.url;
    // create a logger file and append the error message
    fs.appendFile("logger.txt", errorMessage, function (err) {
      console.log(errorMessage);
    });

    response.status(404).json({
      Error:
        "Not a valid Endpoint,Please check with it." + "\n" + error.message,
    });
  }
});

/* Respond to the request and send the current user to client*/
app.get("/getusername", function (request, response) {
  try {
    response.status(200).json(presentUser);
    response.end();
  } catch (error) {
    response.status(404).json({
      Error: "Not a valid Endpoint,Please check with it.",
    });
  }
});

app.listen(8000, () => {
  console.log("Server listening at http://127.0.0.1:8000/");
});
