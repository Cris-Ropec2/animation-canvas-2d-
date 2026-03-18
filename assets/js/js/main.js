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
        this.hue = Math.random() * 360; // Para el efecto glass

        this.dx = dx; 
        this.dy = dy;

        // --- NUEVAS PROPIEDADES DE REALISMO ---
        this.stretchX = 1; // Factor de estiramiento horizontal
        this.stretchY = 1; // Factor de estiramiento vertical
    }

    draw(context) {
        context.save(); // Guardamos el estado del canvas
        
        // Movemos el origen del canvas al centro de la pelota para rotar/escalar
        context.translate(this.posX, this.posY);
        context.scale(this.stretchX, this.stretchY);

        context.beginPath();
        // Efecto Glassmorphism en la pelota
        let grad = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 0.4)`);
        grad.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0.1)`);

        context.fillStyle = grad;
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        
        // Dibujamos el círculo en (0,0) porque ya tradujimos el contexto
        context.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();

        // Texto (invertimos la escala para que no se deforme el número)
        context.scale(1/this.stretchX, 1/this.stretchY);
        context.fillStyle = "white";
        context.font = "bold 14px Arial";
        context.fillText(this.text, 0, 0);
        
        context.restore(); // Restauramos el canvas para la siguiente pelota
    }

    update(context) {
        // Regresamos la forma a la normalidad gradualmente (Efecto resorte)
        this.stretchX += (1 - this.stretchX) * 0.15;
        this.stretchY += (1 - this.stretchY) * 0.15;

        this.dy += GRAVEDAD;
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebote Suelo
        if (this.posY + this.radius > window_height) {
            this.dy = -this.dy * REBOTE_SUELO;
            this.posY = window_height - this.radius;
            this.dx *= FRICCION;

            // --- EFECTO DE APLASTAMIENTO (SQUASH) ---
            // Solo si el impacto es fuerte
            if (Math.abs(this.dy) > 2) {
                this.stretchX = 1.3; // Se ensancha
                this.stretchY = 0.7; // Se aplasta
            }
        }

        // Rebote Paredes
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx * FRICCION;
            
            // Squash lateral
            this.stretchX = 0.7;
            this.stretchY = 1.3;
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