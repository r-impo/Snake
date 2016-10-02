var playerOne, playerTwo, scale, canvasWidth, canvasHeight;
var eatFood = new Audio('sounds/eatfood.wav');
var gameBoo = new Audio('sounds/boo.mp3');
var bkgColor = "#67b20c";
var snkColor = "#050505";
var eyeColor = "#db0a0a";
var fdColor = '#db0a0a';

function setup() { // se corre una vez antes de llamar automaticamente a draw();
	scale = 20;
	canvasWidth = 600;
	canvasHeight = 400;
	createCanvas(canvasWidth, canvasHeight);
	frameRate(12);
	playerOne = new Snake(40, 20, 255);
	playerTwo = new Snake(40, 360, 15);
	food = new Food();
	food.generate();
	food2 = new Food();
	food2.generate();
}

function draw() { // recorre este loop hasta game over;
	background(bkgColor); // pinta el canvas

	playerOne.refresh(); // +1 movimiento en la direccion que corresponda
	playerOne.mirror(); // se fija si el snake toca algun borde; si toca, espeja la coordenada
	playerOne.checkEat(); // se fija si el snake tiene el mismo x y que food
	playerOne.checkDeath(); // se fija si la cabeza del snake toca alguna parte del cuerpo de snake
	playerOne.draw(); // dibuja el snake

	playerTwo.refresh(); // +1 movimiento en la direccion que corresponda
	playerTwo.mirror(); // se fija si el snake toca algun borde; si toca, espeja la coordenada
	playerTwo.checkEat(); // se fija si el snake tiene el mismo x y que food
	playerTwo.checkDeath(); // se fija si la cabeza del snake toca alguna parte del cuerpo de snake
	playerTwo.draw(); // dibuja el snake

	food.draw(); // dibuja la comida
	food2.draw();
}

function Snake(x, y, clr) { // Clase Snake
	this.x = x;
	this.y = y;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];
	
	this.refresh = function() { // actualiza la posición del objeto
		for (i = 0; i < this.tail.length - 1; i++) {
			this.tail[i] = this.tail[i + 1];
		}
		
		this.tail[this.total - 1] = createVector(this.x, this.y);

		this.x = this.x + this.xspeed * scale;
		this.y = this.y + this.yspeed * scale;
	}

	this.draw = function() { // dibuja el objeto
		fill(clr);
		for (i = 0; i < this.tail.length; i++) {
			rect(this.tail[i].x, this.tail[i].y, scale, scale);
		}
		fill(clr);
		rect(this.x, this.y, scale, scale);
		fill(eyeColor);
		rect(this.x + 5, this.y + 5, 3, 6);
		rect(this.x + 12, this.y + 5, 3, 6);
	}

	this.vector = function(a, b) { // cambia la direccion en la que se mueve el objeto
		this.xspeed = a;
		this.yspeed = b;
	}

	this.checkEat = function() { // chequea si snake y food estan en el mismo lugar.
		if (dist(this.x + 10, this.y + 10, food.x, food.y) < 1) {
			food.eaten();
			eatFood.play();
			this.total++;
		}
		if (dist(this.x + 10, this.y + 10, food2.x, food2.y) < 1) {
			food2.eaten();
			eatFood.play();
			this.total++;
		}
	}

	this.checkDeath = function() { // chequea si la cabeza de snake toca el cuerpo
		for (i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if (d == 0) {
				gameOver(this);
			}
		}
		var player = checkWho(this);
		for (i = 0; i < player.tail.length; i++) {
			var pos = player.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if (d == 0) {
				gameOver(this);
			}
		}
		if (this.x === player.x && this.y === player.y) {
			gameOver(this);
		}
	}

	this.mirror = function() { // chequea si Snake se salio del canvas y lo devuelve en el lado opuesto
		if (this.x < 0) {
			this.x = canvasWidth - scale;
		}
		if (this.x > canvasWidth) {
			this.x = 0;
		}
		if (this.y < 0) {
			this.y = canvasHeight - scale;
		}
		if (this.y > canvasHeight) {
			this.y = 0;
		}
	}
}

function Food() { // Clase Food
	this.generate = function() { // genera el pedazo de comida cada vez que Snake.checkFood llama a food.eaten()
		this.x = foodInGrid(canvasWidth); // llama al randomizador
		this.y = foodInGrid(canvasHeight); // llama al randomizador
	}

	this.draw = function() { // dibuja la comida
		fill(fdColor);
		ellipse(this.x, this.y, scale/2, scale/2);	
	}

	this.eaten = function() { // genera nueva comida y la dibuja
		this.generate();
		this.draw();
	}
}

function foodInGrid(axis) { // randomizador de comida. Recube de parametro el ancho o alto del canvas
	var temp_array = [];
	for (i = 10; i < axis; i += 20) { // para hacer el grid itero de a 20. Empiezo en 10 porque la comida es un circulo con radio x+10,y+10;
		temp_array.push(i); //guardo el grid en el array
	}
	return temp_array[Math.floor(Math.random() * temp_array.length)]; // elijo una posicion random del array
}

function keyPressed() { // chequea el input del teclado.
	switch (keyCode) {
		case UP_ARROW:
			if (playerOne.yspeed !== 1) {
				playerOne.vector(0, -1);
			}
			break;
		case DOWN_ARROW:
			if (playerOne.yspeed !== -1) {
				playerOne.vector(0, 1);
			}
			break;
		case LEFT_ARROW:
			if (playerOne.xspeed !== 1) {
				playerOne.vector(-1, 0);
			}
			break;
		case RIGHT_ARROW:
			if (playerOne.xspeed !== -1) {
				playerOne.vector(1, 0);
			}
			break;
		case 87: // W
			if (playerTwo.yspeed !== 1) {
				playerTwo.vector(0, -1);
			}
			break;
		case 83: // S
			if (playerTwo.yspeed !== -1) {
				playerTwo.vector(0, 1);
			}
			break;
		case 65: // A
			if (playerTwo.xspeed !== 1) {
				playerTwo.vector(-1, 0);
			}
			break;
		case 68: // D
			if (playerTwo.xspeed !== -1) {
				playerTwo.vector(1, 0);
			}
			break;	
	}
}

function gameOver(loser) {
	remove();
	var scoreOne = 100 * playerOne.total;
	var scoreTwo = 100 * playerTwo.total;
	document.getElementById('ui').style.display = 'block';

	if (loser === playerTwo) {
		document.getElementById('gameOver').innerHTML += '<br><br> Player 1 Wins';	
	}
	else {
		document.getElementById('gameOver').innerHTML += '<br><br> Player 2 Wins';	
	}

	document.getElementById('score').innerHTML = 'Player 1 Score: ' + scoreOne + '<br>' + 'Player 2 Score: ' + scoreTwo;
	
	gameBoo.play();
}

function checkWho(player) {
	if (player === playerOne) {
		return playerTwo;
	}
	else {
		return playerOne;
	}
}