"use strict";

// With these two objects you can make a tic-tac-toe player
const player = (name) => {
	const getName = () =>  { return name; }
	return { getName };
}

const token = (token) => {
	const getToken = () => { return token; }
	const setToken = (newToken) => { token = newToken; }
	return { getToken, setToken };
}

// This object stores the state of a tic-tac-toe game.
// After setting the players, every time you call setSquare,
// every aspect of the game state is updated. The inactive player
// becomes the active player, the board is updated, a win or draw is 
// determined, and a status string is set.
const gameState = () => {
	let board = ['','','','','','','','',''];
	let currPlayer = null;
	let players = null;
	let numMoves = 0;
	let winner = false;
	let draw = false;
	let gameStatus = '';

	// Win or draw functions
	function hasThree(line) {
		line = line.join('');
		return (line === "XXX" || line === "OOO");
	}

	function vertWin() {
		let vertical = '';
		let vertWin = false;

		for (let i = 0; i < 3; i++) {
			vertical = board.filter((square, index) => 
				(index === 0 + i || index === 3 + i || index === 6 + i));
			vertWin = hasThree(vertical);
			if (vertWin) { break; }
		}

		return vertWin
	}

	function horizWin() {
		let horiz = '';
		let horizWin = false;

		for (let i = 0; i < 3; i++) {
			horiz = board.filter((square, index) => 
				(index >= (0 + (i * 3)) && index <= (2 + (i * 3))));
			horizWin = hasThree(horiz);
			if (horizWin) { break; }
		}
		return horizWin;
	}

	function diagWin() {
		let diag = '';
		let diagWin = false;

		for (let i = 0; i < 3; i++) {
			diag = board.filter((square, index) =>
				(index === 0 + i || index === 4 || index === 8 - i));
			diagWin = hasThree(diag)
			if (diagWin) { break };
		}
		return diagWin;
	}

	function checkForWin() {
		winner = (vertWin() || horizWin() || diagWin());
		if (winner) gameStatus = getCurrPlayer().getName() + " is the winner!";
	}

	const isWinner = () => {
		return winner;
	}

	function checkForDraw() {
		draw = (numMoves === 9);
		if (draw) gameStatus = "The game is a draw.";
	}

	const isDraw = () => {
		return draw;
	}

	// Players moves
	// A players move updates the entire state of the game
	const setSquare = (square, token) => {
		board[square] = token;
		numMoves++;
		checkForWin();
		if (!isWinner()) checkForDraw();
		if (!isWinner() && !isDraw()) switchPlayers();
	}

	const validMove = (square) => {
		return (board[square] === '');
    }

	const getStatus = () => {
		return gameStatus;
	}

	// Player info and status
	function setCurrPlayer(player) {
		currPlayer = player;
		gameStatus = currPlayer.getName() + ", your turn.";
	}

	const getCurrPlayer = () => {
		return currPlayer;
	}

	const setPlayers = (gamePlayers) => {
		players = gamePlayers;
		setCurrPlayer(players[0]);
	}

	const getPlayers = () => {
		return players;
	}

	function switchPlayers() {
		if (getCurrPlayer() === players[0]) {
			setCurrPlayer(players[1]);
		} else {
			setCurrPlayer(players[0]);
		}
	}


	// New games
	const reset = () => {
		for (let i = 0; i < 9; i++) { board[i] = ''; }
		numMoves = 0;
		winner = false;
		draw = false;
		setCurrPlayer(players[0]);
	}

	const swapPlayers = () => {
		reset();
		const player = players[0];
		players[0] = players[1];
		players[0].setToken('X');
		players[1] = player;
		players[1].setToken('O');
		setCurrPlayer(players[0]);
	}

	// Public methods
	return {setSquare, setPlayers, getCurrPlayer, getPlayers, validMove,
		isWinner, isDraw, reset, getStatus, swapPlayers };
}

// This interfaces with the HTML page which displays the board, a legend,
// a status, and buttons for resetting the game
const boardDisplayController = (function() {
	const getSquareIds = () => {
		return (['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9']);
	}

	const displayLegend = (players) => {
		const p1Element = document.getElementById('p1');
		const p2Element = document.getElementById('p2');

		p1Element.innerText = players[0].getToken() + ': ' + players[0].getName();
		p2Element.innerText = players[1].getToken() + ': ' + players[1].getName();
	}

	const displayStatus = (gameStatus) => {
		const statusElement = document.getElementById('status');

		statusElement.innerText = gameStatus;
	}

	const placeToken = (elem, token) => {
		elem.innerText = token;
	}

	const reset = () => {
		const squares = getSquareIds();

		for (let i = 0; i < 9; i++) {
			let elem = document.getElementById(squares[i]);
			elem.innerText = '';
		}
	}

	const toggleButtons = () => {
		const switchBtn = document.getElementById("switch");
		const replayBtn = document.getElementById("replay");

		if (switchBtn.disabled) {
			switchBtn.disabled = false;
			replayBtn.disabled = false;
		} else {
			switchBtn.disabled = true;
			replayBtn.disabled = true;
		}
	}

	return { displayLegend, displayStatus, placeToken, toggleButtons, reset,
		getSquareIds }
})();

// Event listeners
//
// Shows a user what square they are on
function toggleSquareBackground(e) {
	const elem = e.target;
	const classList = elem.classList;
	const highlight = 'highlight-square';

	if (classList.contains(highlight)) {
		elem.classList.remove(highlight);
	} else {
		elem.classList.add(highlight);
	}
}

// Shows a user which button they will click
function toggleBtnBackground(e) {
	const elem = e.target;
	const classList = elem.classList;
	const highlight = 'highlight-btn';

	if (classList.contains(highlight)) {
		elem.classList.remove(highlight);
	} else {
		elem.classList.add(highlight);
	}
}

// Each square gets a listen event for updating game state as well
// as showing which square they are on
function setSquareListeners(gameState) {
	const squares = boardDisplayController.getSquareIds();

	for (let i = 0; i < squares.length; i++) {
		let elem = document.getElementById(squares[i]);
		elem.addEventListener('click', function(e) { gameController(gameState, e) });
		elem.addEventListener('mouseover', toggleSquareBackground);
		elem.addEventListener('mouseout', toggleSquareBackground);
	}
}

// Button listener functions
//
// Will update game state and page if players decide to swap sides
function switchPlayers(gameState, e) {
	e.preventDefault();
	gameState.swapPlayers();
	boardDisplayController.reset();
	toggleBtnBackground(e);
	boardDisplayController.toggleButtons();
	boardDisplayController.displayLegend(gameState.getPlayers());
	boardDisplayController.displayStatus(gameState.getStatus());
}

// Will update game state and page if players decide to play again
function replayGame(gameState, e) {
	e.preventDefault();
	gameState.reset();
	boardDisplayController.reset();
	toggleBtnBackground(e);
	boardDisplayController.toggleButtons();
	boardDisplayController.displayStatus(gameState.getStatus());
}

function setButtonListeners(gameState) {
	const switchBtn = document.getElementById('switch');
	switchBtn.addEventListener('click', function(e) { switchPlayers(gameState, e) });
	switchBtn.addEventListener('mouseover', toggleBtnBackground);
	switchBtn.addEventListener('mouseout', toggleBtnBackground);

	const replayBtn = document.getElementById('replay');
	replayBtn.addEventListener('click', function(e) { replayGame(gameState, e) });
	replayBtn.addEventListener('mouseover', toggleBtnBackground);
	replayBtn.addEventListener('mouseout', toggleBtnBackground);
}

// Main event handler, when a user clicks a square, the gameState
// is updated via setSquare.  This event handler checks for a win
// or draw condition and sets the state of the page appropiately
function gameController(gameState, e) {
	if (!gameState.isWinner() && !gameState.isDraw()) {
		const square = getSquare(e.target.id);

		if (gameState.validMove(square)) {
			boardDisplayController.placeToken(e.target, gameState.getCurrPlayer().getToken());
			gameState.setSquare(square, gameState.getCurrPlayer().getToken());

			if (gameState.isWinner() || gameState.isDraw()) {
				boardDisplayController.toggleButtons();
			}
			boardDisplayController.displayStatus(gameState.getStatus());
		} else {
			alert("Choose an empty space.");
		}
	}
}

function getSquare(id) {
	const idNum = id.slice(1);

	return(idNum -1);
}

// Gets the players for this game
function getPlayers() {

	const players = [];

	const p1Name = prompt("Player One, enter your name: ");
	const p2Name = prompt("Player Two, enter your name: ");

	const p1 = player(p1Name);
	const p2 = player(p2Name);

	const tokenX = token('X');
	const tokenO = token('O');

	players.push(Object.assign({},p1,tokenX));
	players.push( Object.assign({},p2,tokenO));

	return players;
}

function ready() {
	const thisGame = gameState();
	const players = getPlayers();

	thisGame.setPlayers(players);

	boardDisplayController.displayLegend(players);

	boardDisplayController.displayStatus(thisGame.getStatus());

	setSquareListeners(thisGame);

	setButtonListeners(thisGame);
}

document.addEventListener("DOMContentLoaded", ready);
