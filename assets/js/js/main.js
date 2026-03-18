const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Dimensiones fijas para el canvas (puedes ajustarlas)
const window_height = 500;
const window_width = 700;

canvas.height = window_height;
canvas.width = window_width;

// --- CONSTANTES FÍSICAS ---
const GRAVEDAD = 0.8;       // Fuerza que tira hacia abajo en cada frame
const FRICCION = 0.98;      // Freno horizontal (aire/suelo). 1 = sin fricción.
const REBOTE_SUELO = 0.75; // Energía que se conserva al rebotar (0-1)

class Circle {
    constructor(x, y, radius, color, text, speed, dx, dy) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        // Velocidades iniciales (recibidas desde el lanzador)
        this.dx = dx; 
        this.dy = dy;
    }

    draw(context) {
        context.beginPath();
        // Relleno semi-transparente
        context.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.2)`;
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();

        // Texto
        context.fillStyle = "white";
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
        context.closePath();
    }

    update(context) {
        // --- APLICAR FÍSICAS ---

        // 1. Gravedad: Sumamos gravedad a la velocidad vertical
        this.dy += GRAVEDAD;

        // 2. Movimiento: Aplicamos velocidades a la posición
        this.posX += this.dx;
        this.posY += this.dy;

        // --- DETECCIÓN DE COLISIONES ---

        // Paredes laterales (Izquierda / Derecha)
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx * FRICCION; // Frena un poco al chocar de lado
        }

        // Suelo (Rebote con pérdida de energía)
        if (this.posY + this.radius > window_height) {
            // Invertimos velocidad Y y aplicamos pérdida de energía
            this.dy = -this.dy * REBOTE_SUELO;
            // Corregimos posición para que no se "entierre"
            this.posY = window_height - this.radius;
            // Aplicamos fricción del suelo al movimiento horizontal
            this.dx *= FRICCION;
        }

        // Techo
        if (this.posY - this.radius < 0) {
            this.dy = -this.dy;
            this.posY = this.radius; // Corregimos posición
        }

        // --- DETENERSE (Umbral) ---
        // Si se mueve muy lento en ambos ejes, lo frenamos del todo
        if (Math.abs(this.dx) < 0.1 && Math.abs(this.dy) < 1) {
            this.dx = 0;
            this.dy = 0;
        }

        this.draw(context);
    }
}

let arrayCircles = [];

// --- GESTOR DE LANZAMIENTOS ---
function lanzarPelotas() {
    arrayCircles = [];
    const n = document.getElementById("cantidad").value;
    const tipo = document.getElementById("lanzamiento").value;

    for (let i = 0; i < n; i++) {
        let radius = Math.floor(Math.random() * 20 + 10);
        let hue = Math.random() * 360; 
        let color = `hsla(${hue}, 100%, 70%, 0.7)`;
        let speed = Math.random() * 5 + 10; // Velocidad base del lanzamiento

        let x, y, dx, dy;

        // Definimos posición y velocidad inicial según el control HTML
        switch (tipo) {
            case 'top-left':
                x = radius; y = radius;
                dx = Math.random() * speed + 2; 
                dy = Math.random() * 5;
                break;
            case 'top-right':
                x = window_width - radius; y = radius;
                dx = -(Math.random() * speed + 2); 
                dy = Math.random() * 5;
                break;
            case 'bottom-left':
                x = radius; y = window_height - radius - 50;
                dx = Math.random() * speed + 2; 
                dy = -(Math.random() * speed + 10); // Lanza hacia arriba
                break;
            case 'bottom-right':
                x = window_width - radius; y = window_height - radius - 50;
                dx = -(Math.random() * speed + 2); 
                dy = -(Math.random() * speed + 10); // Lanza hacia arriba
                break;
            case 'top':
                x = window_width / 2; y = radius;
                dx = (Math.random() - 0.5) * 10; // Dispersión horizontal
                dy = Math.random() * speed;
                break;
            case 'bottom':
                x = window_width / 2; y = window_height - radius - 20;
                dx = (Math.random() - 0.5) * 15; // Gran dispersión
                dy = -(Math.random() * speed + 15); // Gran fuerza hacia arriba
                break;
        }

        arrayCircles.push(new Circle(x, y, radius, color, i + 1, speed, dx, dy));
        // Guardamos el hue para el efecto glass en draw()
        arrayCircles[i].hue = hue;
    }
}

// --- ANIMACIÓN ---
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    
    arrayCircles.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(animate);
}

// Eventos
document.getElementById("btnGenerar").addEventListener("click", lanzarPelotas);

// Inicio inicial
lanzarPelotas();
animate();