/*  Object references of the game space*/
let gameContainer = document.getElementById("game-container");
let board = document.getElementById("board");
let gameSpace = document.getElementById("game-space");
let numberOfPlayer = document.getElementById("number-of-players");
let modeOfGame = document.getElementById("modeof-game");
let messageDivision = document.createElement("div");
let playerNameDiv = document.getElementById("player-name");
let scoreOfPlayer1 = document.getElementById("player1score");
let scoreOfPlayer2 = document.getElementById("player2score");
let quitButton = document.getElementById("quit-button");
let logoutButton = document.getElementById("logout");
let replayButton = document.getElementById("replay");
let stopReplay = document.getElementById("stop-replay");
let newGame = document.getElementById("new-game");

let tileNumber;
let gameMode;
let indication;
let toggler;
let player1;
let player2;
let userSymbol;
let ai;
let result;
let userName;
let currentUserName;
let playerO = "O";
let playerX = "X";
let currentPlayer;
let playerBoard;
let player1Score = 0;
let player2Score = 0;
let playersList = ["x", "X", "o", "O"];
let scores = {};
let replayBoard = [];
let toggle = false;
let gameover = false;

/* If the number of players dropdown value changes , game space is updated with default data*/
numberOfPlayer.addEventListener("change", () => {
  gameType = numberOfPlayer.options[numberOfPlayer.selectedIndex].value;
  quitButton.style.visibility = "visible";
  newGame.style.visibility = "visible";
  replayBoard = [];
  updateTheGameAreaWithDefaultContent();
});

/*  If the mode of game dropdown value changes ,score is reset to zero*/
modeOfGame.addEventListener("change", () => {
  resetScore();
});

/* If the user clicks the quit button, it redirects to game's start page. */
quitButton.addEventListener("click", () => {
  window.location.replace("tictactoe.html");
});

/* If the user clicks the logout button, it redirects to home page. */
logoutButton.addEventListener("click", () => {
  window.location.replace("index.html");
});

/* If the user clicks the replay button, the board is reseted and replay the current game. */
replayButton.addEventListener("click", () => {
  indication = true;
  if (replayBoard.length != 0) {
    board.replaceChildren();
    setGameBoard();
  }
  replayTheTictactoe();
});

/* If the user clicks the stop replay button, it resets the board. */
stopReplay.addEventListener("click", () => {
  indication = false;
  resetTheGameArea();
});

/* If the user clicks the newgame  button,
 it resets the game area and reinitialize the array with empty strings */
newGame.addEventListener("click", resetReplayArrayAndGameArea);

newGame.style.visibility = "hidden";

/**
 * Decides to display or hide the dropdown,
 * score box, players move based on the gametype
 * @param {void}
 * @return {void}
 */
function hideandDisplayDataBasedOnGametype() {
  if (gameType == "Two Player") {
    modeOfGame.style.display = "none";
  } else {
    modeOfGame.style.display = "flex";
  }
  gameover = false;

  scoreOfPlayer1.style.display = "block";
  scoreOfPlayer2.style.display = "block";

  let playerList = document.querySelector(".player-move");
  if (playerList.childElementCount > 0) removePlayerMovesDataOnUI();
}

/**
 * Get the player symbol (either X or O) and
 * set some default value to the identifiers for further use.
 * @param {void}
 * @return {void}
 */
async function GetAndValidateCurrentPlayer() {
  currentPlayer = await displayMessageTogetPlayerSymbol();
  if (currentPlayer) {
    updateDefaultData(currentPlayer);
    userSymbol = currentPlayer;
    if (userSymbol == playerX) {
      ai = playerO;
      scores["O"] = 1;
      scores["X"] = -1;
    } else {
      ai = playerX;
      scores["X"] = 1;
      scores["O"] = -1;
    }
    scores["tie"] = 0;
  }
}

/**
 * Display a overlay to gamespace and ask user to choose X or O as their symbol to identify.
 * @param {void}
 * @return {string} symbolPromise
 */
function displayMessageTogetPlayerSymbol() {
  let symbolPromise = new Promise((resolve, reject) => {
    let userChoiceDivision = document.createElement("div");
    let userChoiceMessage = document.createElement("p");
    let buttonDivision = document.createElement("div");
    let Xplayer = document.createElement("button");
    let Oplayer = document.createElement("button");
    Xplayer.classList.add("userchoice-button");
    Oplayer.classList.add("userchoice-button");
    buttonDivision.classList.add("userchoice");
    userChoiceMessage.style.margin = "9px";
    userChoiceDivision.classList.add("winner-message");

    userChoiceMessage.innerHTML = "Choose X or O !";
    Xplayer.innerText = "X";
    Oplayer.innerText = "O";

    buttonDivision.appendChild(Xplayer);
    buttonDivision.appendChild(Oplayer);
    userChoiceDivision.appendChild(userChoiceMessage);
    userChoiceDivision.appendChild(buttonDivision);
    gameSpace.appendChild(userChoiceDivision);

    Xplayer.addEventListener("click", () => {
      currentPlayer = Xplayer.innerText;
      gameSpace.removeChild(userChoiceDivision);
      resolve(currentPlayer);
    });

    Oplayer.addEventListener("click", () => {
      currentPlayer = Oplayer.innerText;
      gameSpace.removeChild(userChoiceDivision);
      resolve(currentPlayer);
    });
  });
  return symbolPromise;
}

/**
 * update the UI with the username, board and default value.
 * @param {string} currentPlayer
 * @return {void}
 */
function updateDefaultData(currentPlayer) {
  if (playerNameDiv.childElementCount == 0) updatePlayerNameOnUI(currentPlayer);
  setGameBoard();
  displayPlayerNameOnUI();
}

/**
 * Initialize a empty 2D array and set the tictactoe game space to play.
 * @param {void}
 * @return {void}
 */
function setGameBoard() {
  playerBoard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  for (let row = 0; row <= 2; row++) {
    for (let column = 0; column <= 2; column++) {
      let tile = document.createElement("div");
      tile.classList.add("tile-box");
      tile.id = row.toString() + "-" + column.toString();

      tileNumber = document.createElement("span");
      tileNumber.innerText = row.toString() + "-" + column.toString();
      tileNumber.classList.add("tile-number");

      tile.appendChild(tileNumber);
      if (row != 2) tile.classList.add("horizontal-line");
      if (column != 2) tile.classList.add("vertical-line");
      tile.addEventListener("click", function () {
        gameMode = modeOfGame.options[modeOfGame.selectedIndex].text;
        if (
          gameType == "Two Player" ||
          gameMode == "Easy" ||
          gameMode == "Medium" ||
          gameMode == "Hard"
        ) {
          setValueToTheTile(this);
        } else alert("Please select the game mode!");
      });
      board.appendChild(tile);
    }
  }
}

/**
 *
 * create elements and update the player name and symbol on UI.
 * @param {string} firstPlayer
 * @return {void}
 */
async function updatePlayerNameOnUI(firstPlayer) {
  player1 = document.createElement("div");
  let firstplayerName = document.createElement("p");
  userName = await sendHttpRequestGetCurrentUserName();
  firstplayerName.innerHTML = userName.CurrentUser;
  currentUserName = userName.CurrentUser;
  firstplayerName.setAttribute("class", "nameOfThePlayer");
  player1.classList.add("player-box");
  player1.appendChild(firstplayerName);

  let player1ChoosenSymbol = document.createElement("p");
  player1ChoosenSymbol.innerHTML = firstPlayer;
  player1ChoosenSymbol.setAttribute("class", "symbol");
  player1.appendChild(player1ChoosenSymbol);
  playerNameDiv.appendChild(player1);

  player2 = document.createElement("div");
  let secondplayerName = document.createElement("p");
  if (gameType == "Two Player") secondplayerName.innerHTML = "Player 2";
  else secondplayerName.innerHTML = "Computer";
  secondplayerName.setAttribute("class", "nameOfThePlayer");
  player2.classList.add("player-box");
  player2.appendChild(secondplayerName);

  let player2ChoosenSymbol = document.createElement("p");
  if (firstPlayer == playerX) player2ChoosenSymbol.innerHTML = playerO;
  else player2ChoosenSymbol.innerHTML = playerX;
  player2ChoosenSymbol.setAttribute("class", "symbol");
  player2.appendChild(player2ChoosenSymbol);
  playerNameDiv.appendChild(player2);
}

/**
 *
 * update the symbol to the board and boardarray.
 * update the player move in game space.
 * store the moves order in an array for replaying the game.
 * @param {scope reference} obj scope of the particular event
 * @return {void}
 */
function setValueToTheTile(obj) {
  if (gameover) return;

  let index = obj.id.split("-");
  let row = parseInt(index[0]);
  let column = parseInt(index[1]);

  if (playerBoard[row][column] != " ") {
    return;
  }
  obj.innerHTML += currentPlayer;
  updatePlayerMoveOnUI(obj.id, currentPlayer);
  storePlayersMove(obj.id);

  playerBoard[row][column] = currentPlayer;

  if (gameType == "Two Player") {
    if (currentPlayer == playerX) {
      highlightPlayer1();
      obj.style.color = "pink";
      tileNumber.classList.add("tile-number");
      currentPlayer = playerO;
    } else {
      highlightPlayer2();
      obj.style.color = "skyblue";
      tileNumber.classList.add("tile-number");
      currentPlayer = playerX;
    }
    CheckTheWinner(false);
  } else {
    bestMove(obj);
  }
}

/**
 * Store the players move cell number in an array to replaying the game.
 * @param {string} cellNumber
 * @return {void}
 */
function storePlayersMove(cellNumber) {
  replayBoard.push(cellNumber);
}

/**
 * It will wait and make a delay for userinput's time. ex:3000ms
 * @param {number} ms
 * @return {promise}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Reinitialize the replayBoard with empty value and reset the game space.
 * @param {void}
 * @return {void}
 */
function resetReplayArrayAndGameArea() {
  replayBoard = [];
  resetTheGameSpaceAndBoards();
}

/**
 * Update the Game area with default content and reset the score when the user changes
 * the dropdown value.
 * @param {void}
 * @return {void}
 */
function updateTheGameAreaWithDefaultContent() {
  quitButton.style.visibility = "visible";
  playerNameDiv.replaceChildren();
  board.replaceChildren();
  messageDivision.replaceChildren();
  GetAndValidateCurrentPlayer();
  resetScore();
  hideandDisplayDataBasedOnGametype();
}

/**
 * when the user clicks the replay button, this function triggered.
 * Currently,if the game is played, the replay of the game is automatically displayed on board.
 * @param {void}
 * @return {void}
 */
async function replayTheTictactoe() {
  toggler = true;
  ai = userSymbol == playerX ? "O" : "X";
  console.log(replayBoard);
  if (messageDivision.childElementCount > 0) {
    messageDivision.replaceChildren();
    resetTheGameArea();
  }
  if (replayBoard.length == 0) {
    alert(
      "Currently,you haven't play the game" +
        "\n" +
        "So, no history of game is available."
    );
  }

  for (index = 0; index < replayBoard.length; index++) {
    if (indication == false) {
      break;
    }
    let tile = document.getElementById(replayBoard[index]);
    if (toggler) {
      tile.innerHTML += userSymbol;
      tile.style.color = "skyblue";
      toggler = false;
    } else {
      tile.innerHTML += ai;
      toggler = true;
    }
    await sleep(2000);
  }
  if (index != 0 && index == replayBoard.length) {
    alert("Game Replay ends");
  }
}

/**
 * It creates a list, that contains the players move.
 * @param {void}
 * @return {void}
 */
function CreateListToStorePlayerMove() {
  let playerMoveDivision = document.getElementById("player-movecontent");
  let playerList = document.createElement("ul");
  playerList.classList.add("player-move");
  playerMoveDivision.append(playerList);
  gameContainer.prepend(playerMoveDivision);
}

/**
 * Whenever the player clicks the tile.
 * The players move is displayed on Game space. Ex:Playername->playersymbol->cellnumber
 * @param {string} cellNumber
 * @param {string} playersymbol
 */
function updatePlayerMoveOnUI(cellNumber, playersymbol) {
  let playerList = document.querySelector(".player-move");
  let playerData = document.createElement("li");
  if (playersymbol == userSymbol) {
    playerData.innerText =
      currentUserName + "->" + playersymbol + "->" + cellNumber;
  } else {
    if (gameType == "Two Player") {
      playerData.innerText = "Player 2->" + playersymbol + "->" + cellNumber;
    } else
      playerData.innerText = "Computer->" + playersymbol + "->" + cellNumber;
    playerData.style.color = "blue";
  }
  playerList.appendChild(playerData);
}

/**
 * Removes the players moves in that list.
 * @param {void}
 * @return {void}
 */
function removePlayerMovesDataOnUI() {
  let playerList = document.querySelector(".player-move");
  playerList.replaceChildren();
}

/**
 * The game area is reseted and currentPlayer(initial player) is updated.
 * @param {void}
 * @return {void}
 */
function resetTheGameArea() {
  playerNameDiv.replaceChildren();
  board.replaceChildren();
  gameover = false;
  currentPlayer = userSymbol;
  hideandDisplayDataBasedOnGametype();
  updateDefaultData(currentPlayer);
}

/**
 *
 * The function will check with playerboard array and identify the winner symbol.
 * Highlight the tiles (either vertically ,hortizontally,diagonaly,anti-diagonally) as per
 * the condition
 * Displays the winner message in UI
 * @param {boolean} highlightContent
 * @return {string}
 */
function CheckTheWinner(highlightContent) {
  // Check horizontally
  for (let row = 0; row < 3; row++) {
    if (
      playerBoard[row][0] === playerBoard[row][1] &&
      playerBoard[row][1] === playerBoard[row][2] &&
      playerBoard[row][0] !== " "
    ) {
      if (gameType == "Two Player" || highlightContent) {
        highlightTheTile("horizontal", row);
        displayWinnerMessage("wins", playerBoard[row][0]);
      }
      return playerBoard[row][0];
    }
  }
  //check vertically
  for (let column = 0; column < 3; column++) {
    if (
      playerBoard[0][column] === playerBoard[1][column] &&
      playerBoard[1][column] === playerBoard[2][column] &&
      playerBoard[0][column] !== " "
    ) {
      if (gameType == "Two Player" || highlightContent) {
        highlightTheTile("vertical", column);
        displayWinnerMessage("wins", playerBoard[0][column]);
      }
      return playerBoard[0][column];
    }
  }

  //check diagonally
  if (
    playerBoard[0][0] === playerBoard[1][1] &&
    playerBoard[1][1] === playerBoard[2][2] &&
    playerBoard[1][1] !== " "
  ) {
    if (gameType == "Two Player" || highlightContent) {
      highlightTheTile("diagonal", "null");
      displayWinnerMessage("wins", playerBoard[0][0]);
    }
    return playerBoard[0][0];
  }

  //check anti-diagonally
  if (
    playerBoard[0][2] === playerBoard[1][1] &&
    playerBoard[1][1] === playerBoard[2][0] &&
    playerBoard[0][2] !== " "
  ) {
    if (gameType == "Two Player" || highlightContent) {
      highlightTheTile("antidiagonal", "null");
      displayWinnerMessage("wins", playerBoard[0][2]);
    }
    return playerBoard[0][2];
  }
  if (isBoardFilled()) {
    if (gameType == "Two Player" || highlightContent) {
      displayWinnerMessage("tie", "null");
    }
    return "tie";
  }
}

/**
 * Check whether the board is filled or not.
 * @param {void}
 * @return {boolean}
 */
function isBoardFilled() {
  let countSymbol = 0;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (playerBoard[row][column] != " ") countSymbol++;
    }
  }
  if (countSymbol == 9) return true;
  return false;
}

/**
 *
 * Change the background-color of tile and color of the user symbol.
 * @param {string} checkType alignment of the board
 * @param {number} dimension
 */
function highlightTheTile(checkType, dimension) {
  let tileContainer;
  for (let iterator = 0; iterator < 3; iterator++) {
    if (checkType == "horizontal") {
      tileContainer = document.getElementById(
        dimension.toString() + "-" + iterator.toString()
      );
    } else if (checkType == "vertical") {
      tileContainer = document.getElementById(
        iterator.toString() + "-" + dimension.toString()
      );
    } else if (checkType == "diagonal") {
      tileContainer = document.getElementById(
        iterator.toString() + "-" + iterator.toString()
      );
    } else if (checkType == "antidiagonal") {
      tileContainer = document.getElementById("0-2");
      tileContainer.classList.add("winner");
      tileContainer = document.getElementById("1-1");
      tileContainer.classList.add("winner");
      tileContainer = document.getElementById("2-0");
    }
    tileContainer.classList.add("winner");
  }
  gameover = true;
}

/**
 *
 * Display the winner or status message in UI as a overlay.
 * @param {string} statusOfGame
 * @param {string} winner
 */
function displayWinnerMessage(statusOfGame, winner) {
  let message = document.createElement("p");
  let buttonDivision = document.createElement("div");
  let playAgain = document.createElement("button");
  let cancel = document.createElement("button");
  messageDivision.classList.add("winner-message");
  message.style.margin = "10px";
  playAgain.classList.add("action-button");
  playAgain.classList.add("game-afterend");

  cancel.classList.add("action-button");
  cancel.classList.add("game-afterend");
  if (statusOfGame == "wins")
    message.innerHTML = "Player " + winner + " won the game! ";
  else message.innerHTML = "The Game ties! ";
  playAgain.innerHTML = "Play again";
  cancel.innerHTML = "Cancel";

  messageDivision.appendChild(message);
  messageDivision.appendChild(buttonDivision);
  buttonDivision.appendChild(playAgain);
  buttonDivision.appendChild(cancel);
  gameSpace.appendChild(messageDivision);

  playAgain.addEventListener("click", () => {
    resetTheGameSpaceAndBoards();
  });

  cancel.addEventListener("click", () => {
    messageDivision.replaceChildren();
  });
  if (userSymbol == winner) player1Score++;
  else if (winner != "null") player2Score++;
  updateScoreOnGameArea();
}

/**
 * Reset the game space and reinitialize the replay board.
 * @param {void}
 * @return {void}
 */
function resetTheGameSpaceAndBoards() {
  playerNameDiv.replaceChildren();
  board.replaceChildren();
  gameover = false;
  replayBoard = [];
  currentPlayer = userSymbol;
  hideandDisplayDataBasedOnGametype();
  updateDefaultData(currentPlayer);
  messageDivision.replaceChildren();
}

/**
 * Display the players name on UI under player details with symbol section.
 * @param {void}
 * @return {void}
 */
async function displayPlayerNameOnUI() {
  let firstplayerName = document.getElementById("player1name");
  userName = await sendHttpRequestGetCurrentUserName();
  firstplayerName.innerHTML = userName.CurrentUser;
  let secondplayerName = document.getElementById("player2name");
  if (gameType == "Two Player") secondplayerName.innerHTML = "Player 2";
  else secondplayerName.innerHTML = "Computer";
}

/**
 * Update the players score on game area
 * @param {void}
 * @return {void}
 */
function updateScoreOnGameArea() {
  scoreOfPlayer1.value = player1Score;
  scoreOfPlayer2.value = player2Score;
}

/**
 * Reset the players score in the input field.
 * @param {void}
 * @return {void}
 */
function resetScore() {
  scoreOfPlayer1.value = 0;
  scoreOfPlayer2.value = 0;
  player1Score = 0;
  player2Score = 0;
}

/**
 * Highlight the player 1, when the player1 clicks the tile.
 * @param {void}
 * @return {void}
 */
function highlightPlayer1() {
  player1.classList.add("highlight-user");
  player2.classList.remove("highlight-user");
}

/**
 * Highlight the player 2, when the player2 clicks the tile.
 * @param {void}
 * @return {void}
 */
function highlightPlayer2() {
  player2.classList.add("highlight-user");
  player1.classList.remove("highlight-user");
}

/**
 *
 * It checks, if the board value is empty and calls a recursive function to place computer symbol.
 * @param {scope reference} currentScope
 * @return {void}
 */
function bestMove(currentScope) {
  let bestScore = -Infinity;
  let move;
  let score;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (playerBoard[row][column] == " ") {
        playerBoard[row][column] = ai;
        if (gameMode == "Hard")
          score = minimaxForHardMode(playerBoard, 0, false);
        else if (gameMode == "Medium")
          score = minimaxForMediumMode(playerBoard, 2, false);
        else if (gameMode == "Easy")
          score = minimaxForEasyMode(playerBoard, 0, false);
        playerBoard[row][column] = " ";
        if (score > bestScore) {
          bestScore = score;
          move = { row, column };
        }
      }
    }
  }

  if (currentPlayer == userSymbol) {
    currentScope.style.color = "skyblue";
  } else {
    currentScope.style.color = "pink";
  }

  if (move != undefined) {
    playerBoard[move.row][move.column] = ai;
    let tile = document.getElementById(
      move.row.toString() + "-" + move.column.toString()
    );
    updatePlayerMoveOnUI(
      move.row.toString() + "-" + move.column.toString(),
      ai
    );
    storePlayersMove(move.row.toString() + "-" + move.column.toString());
    tile.innerHTML += ai;
    setTimeout(highlightPlayer2, 500);
    highlightPlayer1();
  }
  CheckTheWinner(true);
  currentPlayer = userSymbol;
}

/**
 *
 * It searches depth by depth and find the perfect place and return bestscore.
 * @param {array} playerBoard
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @return {number}
 */
function minimaxForHardMode(playerBoard, depth, isMaximizing) {
  result = CheckTheWinner(false);

  if (result != undefined) {
    let score = scores[result];
    return score;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = ai;
          let score = minimaxForHardMode(playerBoard, depth + 1, false);
          playerBoard[row][column] = " ";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = userSymbol;
          let score = minimaxForHardMode(playerBoard, depth + 1, true);
          playerBoard[row][column] = " ";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

/**
 *
 * It searches depth by depth and find the perfect place and return bestscore.
 * @param {array} playerBoard
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @return {number}
 */
function minimaxForMediumMode(playerBoard, depth, isMaximizing) {
  result = CheckTheWinner(false);

  if (result != undefined) {
    let score = scores[result];
    return score;
  }
  if (depth == 3) return 0;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = ai;
          let score = minimaxForMediumMode(playerBoard, depth + 1, false);
          playerBoard[row][column] = " ";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = userSymbol;
          let score = minimaxForMediumMode(playerBoard, depth + 1, true);
          playerBoard[row][column] = " ";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

/**
 *
 * It searches depth by depth and find the perfect place and return bestscore.
 * @param {array} playerBoard
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @return {number}
 */
function minimaxForEasyMode(playerBoard, depth, isMaximizing) {
  result = CheckTheWinner(false);

  if (result != undefined) {
    let score = scores[result];
    if (score == 1) return -Infinity;
    else return score;
    // return score;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = ai;
          let score = minimaxForEasyMode(playerBoard, depth + 1, false);
          playerBoard[row][column] = " ";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (playerBoard[row][column] == " ") {
          playerBoard[row][column] = userSymbol;
          let score = minimaxForEasyMode(playerBoard, depth + 1, false);
          playerBoard[row][column] = " ";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}
