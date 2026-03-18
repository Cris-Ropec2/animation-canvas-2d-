const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// 1. Obtiene las dimensiones de la pantalla (50%)
const window_height = window.innerHeight * 0.5;
const window_width = window.innerWidth * 0.5;

// 2. Configuración del canvas
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    // Velocidad en ejes X e Y
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillStyle = this.color; // Color para el texto
    context.fillText(this.text, this.posX, this.posY);

    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Rebote Derecha: Si la posición + radio toca el ancho
    if (this.posX + this.radius > window_width) {
      this.dx = -this.dx;
    }

    // Rebote Izquierda: Si la posición - radio toca el 0
    if (this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Rebote Superior: Si la posición - radio toca el 0
    if (this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Rebote Inferior: Si la posición + radio toca el alto
    if (this.posY + this.radius > window_height) {
      this.dy = -this.dy;
    }

    // Actualización de movimiento
    this.posX += this.dx;
    this.posY += this.dy;
  }
}

// --- LÓGICA DE CREACIÓN SEGURA ---

// Función para obtener un número aleatorio entre un mínimo y un máximo
function getSafeRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Círculo 1 (Azul)
let radius1 = Math.floor(Math.random() * 40 + 20); // Radio entre 20 y 60
// El centro (X, Y) debe estar al menos a una distancia "radius" de cada borde
let x1 = getSafeRandom(radius1, window_width - radius1);
let y1 = getSafeRandom(radius1, window_height - radius1);
let miCirculo = new Circle(x1, y1, radius1, "blue", "Tec1", 5);

// Círculo 2 (Rojo)
let radius2 = Math.floor(Math.random() * 40 + 20);
let x2 = getSafeRandom(radius2, window_width - radius2);
let y2 = getSafeRandom(radius2, window_height - radius2);
let miCirculo2 = new Circle(x2, y2, radius2, "red", "Tec2", 2);

// --- ANIMACIÓN ---

let updateCircle = function () {
  requestAnimationFrame(updateCircle);
  
  // Limpiar el canvas en cada frame para evitar estelas
  ctx.clearRect(0, 0, window_width, window_height);
  
  // Actualizar y dibujar ambos círculos
  miCirculo.update(ctx);
  miCirculo2.update(ctx);
};

// Iniciar el bucle de animación
updateCircle();