(function($) {

	$.fn.game = function()
	{

		// ----------------------------------------------------------------
		// Header creation
		// Title, game rules, score boxes, new game button
		// ----------------------------------------------------------------

		function generateHeader() {
			var header = '<h1>2048</h1>' + 
			'<div class="game-score">0</div>' + 
			'<div class="best-score">0</div>' +
			'<p>Join the numbers and get to the 2048 tile!</p>' + 
			'<button id="newGame">New game</button>'

			return header;
		}
		$(this).append(generateHeader());


		// ----------------------------------------------------------------
		// Gameboard creation
		// ----------------------------------------------------------------

		function generateGrid(width, heigth) {
			var gameboard = $('<table></table>').addClass('gameboard');

			for (var y = 0; y < heigth; y++) {
				var row = $('<tr></tr>').addClass('gamerow');
				for (var x = 0; x < width; x++) {
					var cell = $('<td></td>').addClass('gamecell').attr('x', x).attr('y', y).attr('nbr', 0);
					row.append(cell);
				}
				gameboard.append(row);
			}
			return (gameboard);
		}
		$(this).append(generateGrid(4, 4));


		// ----------------------------------------------------------------
		// Footer creation
		// ----------------------------------------------------------------

		function generateFooter() {
			var footer = $('<div></div>');
			var gameRules = 'How to play: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!';
			footer.append(gameRules);

			return footer;
		}
		$('table').after(generateFooter());

		// ----------------------------------------------------------------
		// Grid initialization
		// with weighted random numbers
		// ----------------------------------------------------------------

		function initializeGrid() {
			var x = [], y = [];
			for (var i = 0 ; i < 2 ; i++) {
				x.push(Math.floor((Math.random() * 4)));
				y.push(Math.floor((Math.random() * 4)));
				if ((i > 0) && ((x[i] == x[i - 1]) && (y[i] == y[i - 1]))) {
					cell.text("");
					cell.attr('nbr', '0');
					refreshClasses();
					initializeGrid();
				}
				else {
					var cell = $("td[x='"+x[i]+"'][y='"+y[i]+"']");
					if ((Math.floor((Math.random() * 10) + 1)) <= 9) {
						cell.text("2");
						cell.attr('nbr', '2');
						cell.addClass('cell-2');
					}
					else {
						cell.text("4");
						cell.attr('nbr', '4');
						cell.addClass('cell-4');
					}
				}
			}
		}
		initializeGrid();


		// ----------------------------------------------------------------
		// Restart game (button or 'r' key)
		// ----------------------------------------------------------------

		//Using the 'new game' button
		$('#newGame').click(function() {
			restartGame();
		});

		function restartGame() {
			if (confirm('Are you sure you want to start a new game ?')) {
				$('td').each(function(){
					$(this).attr('nbr', 0);
					$(this).text('');
				});
				refreshClasses();
				initializeGrid();
			}
			else {
				return;
			}
		}


		// ----------------------------------------------------------------
		// Create a new cell
		// ----------------------------------------------------------------

		function newCell() {
			var x = [], y = [];
			x.push(Math.floor((Math.random() * 4)));
			y.push(Math.floor((Math.random() * 4)));
			var cell = $("td[x='"+x+"'][y='"+y+"']");
			if (cell.attr('nbr') == 0) {
				if ((Math.floor((Math.random() * 10) + 1)) <= 9) {
					cell.text("2");
					cell.attr('nbr', '2');
				}
				else {
					cell.text("4");
					cell.attr('nbr', '4');
				}
			}
			else {
				refreshClasses();
				newCell();
			}
		}


		// ----------------------------------------------------------------
		// Update classes
		// Set default cell class and add value specific class
		// ----------------------------------------------------------------

		function refreshClasses() {
			$('td').each(function() {
				var currentValue = $(this).attr('nbr');
				$(this).removeClass();
				$(this).addClass('gamecell cell-'+ currentValue);
			});
		}


		// ----------------------------------------------------------------
		// Get pressed arrow keys
		// Call relative slide functions
		// ----------------------------------------------------------------

		$(document).keydown(function(e) {
			if (e.which == 37) {
				slideLeft();
			}
			if (e.which == 38) {
				slideTop();
			}
			if (e.which == 39) {
				slideRight();
			}
			if (e.which == 40) {
				slideDown();
			}
			if (e.which == 82) {
				restartGame();
			}
		});


		// ----------------------------------------------------------------
		// Slide left
		// ----------------------------------------------------------------

		function slideLeft() {
			var movementMade = false;

			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 4; x++) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (x+1); i < 4; i++) {
							var nextValue = $("td[x='"+i+"'][y='"+y+"']");
							if (nextValue.attr('nbr') != 0) {
								currentTD.attr('nbr', nextValue.attr('nbr'));
								currentTD.text(nextValue.text());
								nextValue.attr('nbr', 0);
								nextValue.text('');
								x--;
								movementMade = true;
								break;
							}
						}
					}
					else {
						for (var i = (x+1); i < 4; i++) {
							var nextValue = $("td[x='"+i+"'][y='"+y+"']");
							if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
								currentTD.attr('nbr', nextValue.attr('nbr')*2);
								currentTD.text(nextValue.text()*2);
								nextValue.attr('nbr', 0);
								nextValue.text('');
								var points = (currentTD.attr('nbr'));
								gameScore(points);
								movementMade = true;
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			if (movementMade == true) {
				newCell();
				refreshClasses();
			}
			gameOver();
		}

		// ----------------------------------------------------------------
		// Slide right
		// ----------------------------------------------------------------

		function slideRight() {
			var movementMade = false;

			for (var y = 0; y < 4; y++) {
				for (var x = 3; x >= 0; x--) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (x-1); i >= 0; i--) {
							var nextValue = $("td[x='"+i+"'][y='"+y+"']");
							if (nextValue.attr('nbr') != 0) {
								currentTD.attr('nbr', nextValue.attr('nbr'));
								currentTD.text(nextValue.text());
								nextValue.attr('nbr', 0);
								nextValue.text('');
								x++;
								movementMade = true;
								break;
							}
						}
					}
					else {
						for (var i = (x-1); i >= 0; i--) {
							var nextValue = $("td[x='"+i+"'][y='"+y+"']");
							if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
								currentTD.attr('nbr', nextValue.attr('nbr')*2);
								currentTD.text(nextValue.text()*2);
								nextValue.attr('nbr', 0);
								nextValue.text('');
								movementMade = true;
								var points = (currentTD.attr('nbr'));
								gameScore(points);
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			if (movementMade == true) {
				newCell();
				refreshClasses();
			}
			gameOver();
		}

		// ----------------------------------------------------------------
		// Slide top
		// ----------------------------------------------------------------

		function slideTop() {
			var movementMade = false;

			for (var x = 0; x < 4; x++) {
				for (var y = 0; y < 4; y++) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (y+1); i < 4; i++) {
							var nextValue = $("td[x='"+x+"'][y='"+i+"']");
							if (nextValue.attr('nbr') != 0) {
								currentTD.attr('nbr', nextValue.attr('nbr'));
								currentTD.text(nextValue.text());
								nextValue.attr('nbr', 0);
								nextValue.text('');
								y--;
								movementMade = true;
								break;
							}
						}
					}
					else {
						for (var i = (y+1); i < 4; i++) {
							var nextValue = $("td[x='"+x+"'][y='"+i+"']");
							if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
								currentTD.attr('nbr', nextValue.attr('nbr')*2);
								currentTD.text(nextValue.text()*2);
								nextValue.attr('nbr', 0);
								nextValue.text('');
								movementMade = true;
								var points = (currentTD.attr('nbr'));
								gameScore(points);
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			if (movementMade == true) {
				newCell();
				refreshClasses();
			}
			gameOver();
		}

		// ----------------------------------------------------------------
		// Slide down
		// ----------------------------------------------------------------

		function slideDown() {
			var movementMade = false;

			for (var x = 0; x < 4; x++) {
				for (var y = 3; y >= 0; y--) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (y-1); i >= 0; i--) {
							var nextValue = $("td[x='"+x+"'][y='"+i+"']");
							if (nextValue.attr('nbr') != 0) {
								currentTD.attr('nbr', nextValue.attr('nbr'));
								currentTD.text(nextValue.text());
								nextValue.attr('nbr', 0);
								nextValue.text('');
								y++;
								movementMade = true;
								break;
							}
						}
					}
					else {
						for (var i = (y-1); i >= 0; i--) {
							var nextValue = $("td[x='"+x+"'][y='"+i+"']");
							if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
								currentTD.attr('nbr', nextValue.attr('nbr')*2);
								currentTD.text(nextValue.text()*2);
								nextValue.attr('nbr', 0);
								nextValue.text('');
								movementMade = true;
								var points = (currentTD.attr('nbr'));
								gameScore(points);
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			if (movementMade == true) {
				newCell();
				refreshClasses();
			}
			gameOver();
		}


		// ----------------------------------------------------------------
		// Game over condition
		// ----------------------------------------------------------------

		function gameOver() {
			//Check if all cells are filled
			var filledCells = 0;
			$("td").each(function() {
				if ($(this).attr('nbr') != 0) {
					filledCells++;
				}
			});
			//If so, check if there is a possible merge
			if (filledCells == 16) {
				for (var x = 0; x < 4; x++) {
					for (var y = 0; y < 4; y++) {
						var currentTD = $("td[x='"+x+"'][y='"+y+"'");
						if (($("td[x='"+(x+1)+"'][y='"+y+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+(x-1)+"'][y='"+y+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+x+"'][y='"+(y+1)+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+x+"'][y='"+(y-1)+"']").attr('nbr') == currentTD.attr('nbr'))) {
							return false;
						}
					}
				}
				//If not, game over and save score to DB
				var player = prompt("Game over! Enter your name bellow and click 'OK' to save your score and start a new game.");
				if (player == null) {
					return;
				}
				else {
					initializeGrid();
					refreshClasses();
				}
				//Create cookies for the player's name and score
				createCookie('playerName', player, 1);
				var gameScore = $('.game-score').text();
				createCookie('gameScore', gameScore, 1);
			}
		}

		// ----------------------------------------------------------------
		// Game win condition
		// ----------------------------------------------------------------

		function gameWin() {
			$("td").each(function() {
				if ($(this).attr('nbr') == 2048) {
					var player = prompt("You won! Enter your name bellow to save your score. <br/>You can click 'OK' to start a new game or 'Cancel' to keep playing.");
					if (player == null) {
						return;
					}
					else {
						if (confirm("Congratulation " + player + "! Your score is saved in the leaderboard.") == true) {
							initializeGrid();
							refreshClasses();
							//Create cookies for the player's name and score
							createCookie('playerName', player, 1);
							var gameScore = $('.game-score').text();
							createCookie('gameScore', gameScore, 1);
						}
						else {
							return;
						}
					}
				}
			});
		}


		// ----------------------------------------------------------------
		// Game Score management
		// ----------------------------------------------------------------

		function gameScore(points = null) {
			var currentScore = $('.game-score').text();
			var newScore = parseInt(currentScore) + parseInt(points);
			$('.game-score').text(newScore);
			return newScore;
		}


		// ----------------------------------------------------------------
		// Cookie management
		// ----------------------------------------------------------------

		function createCookie(name, value, days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else {
				var expires = "";               
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		}

		function readCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		}

		function eraseCookie(name) {
			createCookie(name, "", -1);
		}

		// ----------------------------------------------------------------
		// Send final score to the database
		// ----------------------------------------------------------------

		function saveScoreToDB(winner, gameScore) {
			// WIP
		}


	};
} (jQuery));