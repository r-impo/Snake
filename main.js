var snake, scale, canvasWidth, canvasHeight;
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
	snake = new Snake();
	food = new Food();
	food.generate();
}

function draw() { // recorre este loop hasta game over;
	background(bkgColor); // pinta el canvas
	snake.refresh(); // +1 movimiento en la direccion que corresponda
	snake.mirror(); // se fija si el snake toca algun borde; si toca, espeja la coordenada
	snake.checkEat(); // se fija si el snake tiene el mismo x y que food
	snake.checkDeath(); // se fija si la cabeza del snake toca alguna parte del cuerpo de snake
	snake.draw(); // dibuja el snake
	food.draw(); // dibuja la comida
}

function Snake() { // Clase Snake
	this.x = 20;
	this.y = 20;
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
		fill(snkColor);
		for (i = 0; i < this.tail.length; i++) {
			rect(this.tail[i].x, this.tail[i].y, scale, scale);
		}
		fill(snkColor);
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
	}

	this.checkDeath = function() { // chequea si la cabeza de snake toca el cuerpo
		for (i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if (d == 0) {
				gameOver(this.total);
			}
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
			if (snake.yspeed !== 1) {
				snake.vector(0, -1);
			}
			break;
		case DOWN_ARROW:
			if (snake.yspeed !== -1) {
				snake.vector(0, 1);
			}
			break;
		case LEFT_ARROW:
			if (snake.xspeed !== 1) {
				snake.vector(-1, 0);
			}
			break;
		case RIGHT_ARROW:
			if (snake.xspeed !== -1) {
				snake.vector(1, 0);
			}
			break;	
	}
}

function gameOver(foods) {
	remove();
	var score = 100 * foods;
	document.getElementById('gameOver').style.display = 'block';
	document.getElementById('gameOver').innerHTML += '<br><br> Score: ' + score;
	gameBoo.play();
}