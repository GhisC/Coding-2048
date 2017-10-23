(function($) {

	$.fn.game = function(width, height)
	{

		//Prevents arrow keys from scrolling
		window.addEventListener("keydown", function(e) {
			if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);


		// ----------------------------------------------------------------
		// Header creation
		// Title, game rules, score boxes, new game button
		// ----------------------------------------------------------------

		function generateHeader() {
			var header = $('<div class="header"></div>');
			var scores = $('<div class="scores"></div>');
			var scoreContainer = $('<div class="score-container">Score</div>');
			var score = $('<div class="game-score">0</div>');
			var bestContainer = $('<div class="best-container">Best</div>');
			var best = $('<div class="best-score"></div>');
			var title = '<h1>2048</h1>'+'<p>Join the numbers and get to the 2048 tile!</p>';
			var top = '<div class="gameboard-top"><div id="newGame">New game</div>' + 
			'<div class="game-timer">Time 00 : 00</div></div>'

			if (readCookie('bestScore') != null) {
				best.append(readCookie('bestScore'));
			}
			else {
				best.text('0');
			}
			bestContainer.append(best);
			scoreContainer.append(score);
			scores.append(scoreContainer, bestContainer);

			header.append(scores, title, top);

			return header;
		}
		$(this).append(generateHeader());


		// ----------------------------------------------------------------
		// Gameboard creation
		// ----------------------------------------------------------------

		function generateGrid(width, height) {
			var gameboard = $('<table></table>').addClass('gameboard');

			for (var y = 0; y < height; y++) {
				var row = $('<tr></tr>').addClass('gamerow');
				for (var x = 0; x < width; x++) {
					var cell = $('<td></td>').addClass('gamecell').attr('x', x).attr('y', y).attr('nbr', 0);
					row.append(cell);
				}
				gameboard.append(row);
			}
			return (gameboard);
		}
		$(this).append(generateGrid(width, height));


		// ----------------------------------------------------------------
		// Footer creation
		// ----------------------------------------------------------------

		function generateFooter() {
			// Game rules
			var footer = $('<div class="footer"></div>');
			var gameRules = $('<div class="game-rules"></div>');
			gameRules.text('How to play: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!');
			
			// Leaderboard
			var leaderboard = $('<div class="leaderboard"></div>');
			var topScores = $('<div class="top-scores"></div>');
			var flopScores = $('<div class="flop-scores"></div>');
			leaderboard.append(topScores, flopScores);

			footer.append(gameRules);
			footer.append(leaderboard);

			return footer;
		}
		$('table').after(generateFooter());


		// ----------------------------------------------------------------
		// Grid initialization
		// with weighted random numbers
		// ----------------------------------------------------------------

		function initializeGrid(width) {
			var x = [], y = [];
			for (var i = 0 ; i < ((width*width)/8) ; i++) {
				x.push(Math.floor((Math.random() * width)));
				y.push(Math.floor((Math.random() * height)));
				if ((i > 0) && ((x[i] == x[i - 1]) && (y[i] == y[i - 1]))) {
					cell.text("");
					cell.attr('nbr', '0');
					refreshClasses();
					initializeGrid(width);
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
		initializeGrid(width);


		// ----------------------------------------------------------------
		// Timer management
		// Starts on first keypress
		// ----------------------------------------------------------------

		var timerIsOn = false;
		var counter = 0;
		var timer = null;

		function clock() {
			counter++;
			var minutes = parseInt(counter / 60) > 9 ? parseInt(counter / 60) : ("0" + parseInt(counter / 60));
			var seconds = (counter % 60) > 9 ? (counter % 60) : ("0" + (counter % 60));
			var chronometer = minutes + " : " + seconds;
			$('.game-timer').text('Time ' + chronometer);
		}
		function startTimer() {
			timer = setInterval(clock, 1000);
		}
		function resetTimer() {
			clearInterval(timer);
			counter = 0;
			$('.game-timer').text('Time 00 : 00');
			timerIsOn = false;
		}

		$(document).keydown(function(e) {
			if (timerIsOn == false) {
				if ((e.which == 37) || (e.which == 38) || (e.which == 39) || (e.which == 40)) {
					startTimer();
					timerIsOn = true;
				}
			}
		});

		
		// ----------------------------------------------------------------
		// Restart game (button or 'r' key)
		// ----------------------------------------------------------------

		//Using the 'new game' button
		$('#newGame').click(function() {
			restartGame();
		});

		function restartGame() {
			$('td').each(function() {
				$(this).attr('nbr', 0);
				$(this).text('');
			});
			refreshClasses();
			initializeGrid(width);
			resetTimer();
			// importLeaderboard();
			$('.game-score').text('0');
		}


		// ----------------------------------------------------------------
		// Create a new cell
		// ----------------------------------------------------------------

		function newCell() {
			var x = [], y = [];
			x.push(Math.floor((Math.random() * width)));
			y.push(Math.floor((Math.random() * height)));
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
			saveTable();

			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (x+1); i < width; i++) {
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
						for (var i = (x+1); i < width; i++) {
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
			saveTable();

			for (var y = 0; y < height; y++) {
				for (var x = (width-1); x >= 0; x--) {
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
			saveTable();

			for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");

					if (currentTD.attr('nbr') == 0) {
						for (var i = (y+1); i < height; i++) {
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
						for (var i = (y+1); i < height; i++) {
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
			saveTable();

			for (var x = 0; x < width; x++) {
				for (var y = (height-1); y >= 0; y--) {
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
		// Undo function
		// Limited to the last move 
		// ----------------------------------------------------------------


		function saveTable() {
			var scoreBackup = $('.game-score').text();
			localStorage.setItem('score', scoreBackup);

			// Saving table
			var tableBackup = [];
			$('td').each(function() {
				tableBackup.push($(this).text());
			});
			localStorage.setItem('undo', JSON.stringify(tableBackup));
		}

		function undoMove() {
			var scoreBackup = localStorage.getItem('score');
			$('.game-score').text(scoreBackup);

			var backup = JSON.parse(localStorage.getItem('undo'));
			var i = 0;
			$('td').each(function() {
				$(this).text(backup[i]);
				$(this).attr('nbr', $(this).text());
				i++;
			});
			refreshClasses();
		}

		function undoButton() {
			var undo = $('<button id="undo-move">Undo!</button>');
			return undo;
		}
		// $('.gameboard').after(undoButton());
		$('#newGame').after(undoButton());

		$('#undo-move').click(function() {
			undoMove();
		});

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
			if (filledCells == (width*height)) {
				for (var x = 0; x < width; x++) {
					for (var y = 0; y < height; y++) {
						var currentTD = $("td[x='"+x+"'][y='"+y+"'");
						if (($("td[x='"+(x+1)+"'][y='"+y+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+(x-1)+"'][y='"+y+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+x+"'][y='"+(y+1)+"']").attr('nbr') == currentTD.attr('nbr')) || ($("td[x='"+x+"'][y='"+(y-1)+"']").attr('nbr') == currentTD.attr('nbr'))) {
							return false;
						}
					}
				}

				// If not, game over and save score to DB
				var player = prompt("Game over! Enter your name bellow and click 'OK' to save your score and start a new game.");
				if (player == null) {
					resetTimer();					
					return true;
				}
				else {
					// Create cookies for the player's name and score
					createCookie('playerName', player, 365);
					var score = $('.game-score').text();

					// Save score in the database
					saveScoreToDB(player, score);
					restartGame();
					resetTimer();
					return true;
				}
			}
		}


		// ----------------------------------------------------------------
		// Game win condition
		// ----------------------------------------------------------------

		function gameWin() {
			$("td").each(function() {
				if ($(this).attr('nbr') == 2048) {
					var player = prompt("You won! Enter your name bellow and click 'OK' to save your score. You're free to continue this game or start a new one.");
					if (player == null) {
						return;
					}
					else {
						//Create cookies for the player's name
						createCookie('playerName', player, 365);
						var score = $('.game-score').text();

						// Save score in the database
						saveScoreToDB(player, score);

						return true;
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
			if (newScore != 'NaN') {
				$('.game-score').text(newScore);
			}

			if (newScore > readCookie('bestScore')) {
				createCookie('bestScore', newScore, 365);
				$('.best-score').text(readCookie('bestScore'));
			}

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

		function saveScoreToDB(player, score) {
			var data = [player, score];
			data =JSON.stringify(data);
			$.ajax({
				url: "insert.php",
				type: "post",
				dataType: "JSON",
				data: {"insert": data},
				success: function(message){
					alert("Congratulation " + player + "! Your score is saved in the leaderboard.");
				}
			});
		}


		// ----------------------------------------------------------------
		// Import top and worst scores from database
		// ----------------------------------------------------------------

		function importLeaderboard() {
			//Import top scores
			$.ajax({
				url: 'import_top.php',
				type: 'GET',
				dataType: "json",
			}).done(function(data) {
				$('.top-scores').text('');
				$('.top-scores').append('Top 10 scores:<br/><br/>');
				for (var i = 0; i < data.length; i++) {
					$('.top-scores').append((i+1)+'- '+data[i]['player']+' scored '+data[i]['score']+' points! ('+data[i]['created_at']+')<br/>');
				}
			});

			//Import flop scores
			$.ajax({
				url: 'import_flop.php',
				type: 'GET',
				dataType: "json",
			}).done(function(data) {
				$('.flop-scores').text('');
				$('.flop-scores').append('Worst 10 scores:<br/>Because being the best at loosing is awesome<br/><br/>');
				for (var i = 0; i < data.length; i++) {
					$('.flop-scores').append((i+1)+'- '+data[i]['player']+' scored '+data[i]['score']+' points! ('+data[i]['created_at']+')<br/>');
				}
			});
		}
		importLeaderboard();

	};

	return this;
} (jQuery));