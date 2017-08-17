(function($) {

	$.fn.games = function()
	{

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
		//Grid initialization
		//with weighted random numbers
		// ----------------------------------------------------------------

		function initializeGrid() {
			var x = [], y = [];
			for (var i = 0 ; i < 2 ; i++) {
				x.push(Math.floor((Math.random() * 4)));
				y.push(Math.floor((Math.random() * 4)));
				if ((i > 0) && ((x[i] == x[i - 1]) && (y[i] == y[i - 1]))) {
					cell.text("");
					cell.attr('nbr', '0');
					initializeGrid();
				}
				else {
					var cell = $("td[x='"+x[i]+"'][y='"+y[i]+"']");
					if ((Math.floor((Math.random() * 10) + 1)) <= 9) {
						cell.text("2");
						cell.attr('nbr', '2');
					}
					else {
						cell.text("4");
						cell.attr('nbr', '4');
					}
				}
			}
		}
		initializeGrid();


		// ----------------------------------------------------------------
		//Create a new cell
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
				newCell();
			}
		}


		// ----------------------------------------------------------------
		//Set classes from all cells to default
		// ----------------------------------------------------------------

		function refreshClasses() {
			// WIP
		}



		// ----------------------------------------------------------------
		//Get pressed arrow keys
		//Call relative slide functions
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
		});


		// ----------------------------------------------------------------
		//Cell swap function
		// ----------------------------------------------------------------

		function cellSwap(currentCell, nextCell) {

		}

		// ----------------------------------------------------------------
		//Slide left
		// ----------------------------------------------------------------

		function slideLeft() {
			var movementMade = false;

			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 4; x++) {
					var currentTD = $("td[x='"+x+"'][y='"+y+"']");
					for (var i = (x+1); i < 4; i++) {
						var nextValue = $("td[x='"+i+"'][y='"+y+"']");
						if (currentTD.attr('nbr') == 0) {
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
						else {
							if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
								currentTD.attr('nbr', nextValue.attr('nbr')*2);
								currentTD.text(nextValue.text()*2);
								nextValue.attr('nbr', 0);
								nextValue.text('');
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


		// function slideLeft() {
		// 	var movementMade = false;

		// 	for (var y = 0; y < 4; y++) {
		// 		for (var x = 0; x < 4; x++) {
		// 			var currentTD = $("td[x='"+x+"'][y='"+y+"']");

		// 			if (currentTD.attr('nbr') == 0) {
		// 				for (var i = (x+1); i < 4; i++) {
		// 					var nextValue = $("td[x='"+i+"'][y='"+y+"']");
		// 					if (nextValue.attr('nbr') != 0) {
		// 						currentTD.attr('nbr', nextValue.attr('nbr'));
		// 						currentTD.text(nextValue.text());
		// 						nextValue.attr('nbr', 0);
		// 						nextValue.text('');
		// 						x--;
		// 						movementMade = true;
		// 						break;
		// 					}
		// 				}
		// 			}
		// 			else {
		// 				for (var i = (x+1); i < 4; i++) {
		// 					var nextValue = $("td[x='"+i+"'][y='"+y+"']");
		// 					if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') == currentTD.attr('nbr'))) {
		// 						currentTD.attr('nbr', nextValue.attr('nbr')*2);
		// 						currentTD.text(nextValue.text()*2);
		// 						nextValue.attr('nbr', 0);
		// 						nextValue.text('');
		// 						movementMade = true;
		// 						break;
		// 					}
		// 					else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
		// 						break;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		gameOver();
		if (movementMade == true) {
			newCell();
				// refreshClasses();
			}
		}

		// ----------------------------------------------------------------
		//Slide right
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
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			gameOver();
			if (movementMade == true) {
				newCell();
				// refreshClasses();
			}
		}

		// ----------------------------------------------------------------
		//Slide top
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
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			gameOver();
			if (movementMade == true) {
				newCell();
				// refreshClasses();
			}
		}

		// ----------------------------------------------------------------
		//Slide down
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
								break;
							}
							else if ((nextValue.attr('nbr') != 0) && (nextValue.attr('nbr') != currentTD.attr('nbr'))) {
								break;
							}
						}
					}
				}
			}

			gameOver();
			if (movementMade == true) {
				newCell();
				// refreshClasses();
			}
		}


		// ----------------------------------------------------------------
		//Game over condition
		// ----------------------------------------------------------------

		function gameOver() {
			var filledCells = 0;
			$("td").each(function() {
				if ($(this).attr('nbr') != 0) {
					filledCells++;
				}
			});
			if (filledCells == 16) {
				var gameOver = confirm("You lost! Do you want to play a new game?");
				
			}
		}

		//Modif à faire : 
		//Game over même si encore un déplacement est possible si la touche 
		//sur laquelle on appuie ne produit pas de déplacement et que la 
		//grille est pleine


	};
} (jQuery));