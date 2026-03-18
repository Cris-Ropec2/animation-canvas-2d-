const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Referencias a los controles del HTML
const anchoInput = document.getElementById("anchoControl");
const altoInput = document.getElementById("altoControl");
const cantidadInput = document.getElementById("cantidad");

/**
 * Ajusta el tamaño del canvas basándose en los sliders de la interfaz.
 */
function ajustarDimensiones() {
    // Calculamos el ancho restando márgenes para que no se salga del contenedor de Bootstrap
    canvas.width = (window.innerWidth * (anchoInput.value / 100)) * 0.6; 
    canvas.height = parseInt(altoInput.value);
}

class Circle {
    constructor(x, y, radius, hue, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.hue = hue;
        this.text = text;
        this.speed = speed;

        // Dirección aleatoria
        this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
    }

    // Busca el método draw dentro de tu clase Circle y reemplázalo por este:
draw(context) {
    context.beginPath();
    
    // Sombra de neón para el círculo
    context.shadowBlur = 15;
    context.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.5)`;
    
    // Relleno con degradado
    let grad = context.createRadialGradient(this.posX, this.posY, 0, this.posX, this.posY, this.radius);
    grad.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0.4)`);
    grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0.05)`);
    
    context.fillStyle = grad;
    context.strokeStyle = `hsla(${this.hue}, 100%, 80%, 0.8)`;
    context.lineWidth = 3;
    
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    
    // Texto
    context.shadowBlur = 0; // Quitamos sombra para el texto para que sea legible
    context.fillStyle = "white";
    context.font = "bold 16px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.closePath();
}

    update(context) {
        this.draw(context);

    // --- REBOTE ALEATORIO EN PAREDES ---

    // Paredes laterales (Izquierda / Derecha)
    if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
        // Invertimos dirección
        this.dx = -this.dx;
        // Aplicamos un "toque" aleatorio a la velocidad horizontal
        // Esto evita que el rebote sea siempre en el mismo ángulo
        this.dx = (this.dx > 0 ? 1 : -1) * (Math.random() * this.speed + 1);
        
        // Opcional: También variamos un poco la velocidad vertical al chocar de lado
        this.dy += (Math.random() - 0.5) * 2; 
    }

    // Paredes superiores (Techo / Suelo)
    if (this.posY - this.radius < 0 || this.posY + this.radius > canvas.height) {
        // Invertimos dirección
        this.dy = -this.dy;
        // Recalculamos velocidad vertical al azar basada en su speed base
        this.dy = (this.dy > 0 ? 1 : -1) * (Math.random() * this.speed + 1);
        
        // Opcional: Variamos un poco la horizontal para cambiar el ángulo
        this.dx += (Math.random() - 0.5) * 2;
    }

    // --- LÍMITE DE VELOCIDAD (Para que no se vuelvan locos) ---
    const maxSpeed = this.speed * 2;
    this.dx = Math.max(Math.min(this.dx, maxSpeed), -maxSpeed);
    this.dy = Math.max(Math.min(this.dy, maxSpeed), -maxSpeed);

    // Aplicar movimiento
    this.posX += this.dx;
    this.posY += this.dy;
    }
}

let arrayCircles = [];

/**
 * Crea la lista de círculos basándose en la cantidad seleccionada.
 */
function generarCirculos() {
    ajustarDimensiones();
    arrayCircles = [];
    const n = Math.min(cantidadInput.value, 100); // Límite de 100 por rendimiento

    for (let i = 0; i < n; i++) {
        let radius = Math.floor(Math.random() * 20 + 15);
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let hue = Math.random() * 360; 
        let speed = Math.random() * 2 + 1;

        arrayCircles.push(new Circle(x, y, radius, hue, i + 1, speed));
    }
}

/**
 * Bucle principal de animación
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrayCircles.forEach(circle => circle.update(ctx));
    requestAnimationFrame(animate);
}

// Escuchadores de eventos
anchoInput.addEventListener("input", () => {
    ajustarDimensiones();
});
altoInput.addEventListener("input", () => {
    ajustarDimensiones();
});
document.getElementById("btnGenerar").addEventListener("click", generarCirculos);

// Iniciar aplicación
generarCirculos();
animate();