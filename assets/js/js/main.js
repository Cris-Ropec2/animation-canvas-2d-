const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Referencias a controles
const anchoInput = document.getElementById("anchoCanvas");
const altoInput = document.getElementById("altoCanvas");
const valAncho = document.getElementById("valAncho");
const valAlto = document.getElementById("valAlto");

// Físicas Globales
const GRAVEDAD = 0.8;
const FRICCION = 0.98;
const REBOTE_SUELO = 0.7;

let window_width, window_height;

function ajustarCanvas() {
    window_width = parseInt(anchoInput.value);
    window_height = parseInt(altoInput.value);
    canvas.width = window_width;
    canvas.height = window_height;
    valAncho.textContent = window_width;
    valAlto.textContent = window_height;
}

class Circle {
    constructor(x, y, radius, hue, text, dx, dy) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.hue = hue;
        this.text = text;
        this.dx = dx;
        this.dy = dy;
        
        // Propiedades para Squash & Stretch
        this.sX = 1;
        this.sY = 1;
    }

    draw(context) {
        context.save();
        context.translate(this.posX, this.posY);
        context.scale(this.sX, this.sY);

        context.beginPath();
        let grad = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 0.4)`);
        grad.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0.1)`);

        context.fillStyle = grad;
        context.strokeStyle = `hsla(${this.hue}, 100%, 80%, 0.8)`;
        context.lineWidth = 2;
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        // Texto sin deformación
        context.scale(1/this.sX, 1/this.sY);
        context.fillStyle = "white";
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.fillText(this.text, 0, 5);
        
        context.restore();
    }

    update(context) {
        // Recuperación de forma (Efecto resorte)
        this.sX += (1 - this.sX) * 0.15;
        this.sY += (1 - this.sY) * 0.15;

        this.dy += GRAVEDAD;
        this.posX += this.dx;
        this.posY += this.dy;

        // Colisión Suelo
        if (this.posY + this.radius > window_height) {
            this.dy = -this.dy * REBOTE_SUELO;
            this.posY = window_height - this.radius;
            this.dx *= FRICCION;
            
            if(Math.abs(this.dy) > 2) { // Squash al impactar
                this.sX = 1.3; this.sY = 0.7;
            }
        }

        // Colisión Paredes
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx * FRICCION;
            this.sX = 0.7; this.sY = 1.3; // Squash lateral
            this.posX = (this.posX - this.radius < 0) ? this.radius : window_width - this.radius;
        }

        // Umbral de parada
        if (Math.abs(this.dx) < 0.1 && Math.abs(this.dy) < 1 && this.posY + this.radius >= window_height) {
            this.dx = 0; this.dy = 0;
        }

        this.draw(context);
    }
}

let arrayCircles = [];

function lanzar() {
    ajustarCanvas();
    arrayCircles = [];
    const n = document.getElementById("cantidad").value;
    const modo = document.getElementById("lanzamiento").value;

    for (let i = 0; i < n; i++) {
        let r = Math.floor(Math.random() * 15 + 15);
        let x, y, dx, dy;
        let speed = Math.random() * 8 + 10;

        switch(modo) {
            case 'top-left': x = r; y = r; dx = speed; dy = 2; break;
            case 'top-right': x = window_width - r; y = r; dx = -speed; dy = 2; break;
            case 'bottom-left': x = r; y = window_height-r-20; dx = speed; dy = -speed*1.5; break;
            case 'bottom-right': x = window_width-r; y = window_height-r-20; dx = -speed; dy = -speed*1.5; break;
            case 'top': x = window_width/2; y = r; dx = (Math.random()-0.5)*10; dy = speed; break;
            case 'bottom': x = window_width/2; y = window_height-r; dx = (Math.random()-0.5)*20; dy = -speed*2; break;
        }
        arrayCircles.push(new Circle(x, y, r, Math.random()*360, i+1, dx, dy));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    arrayCircles.forEach(c => c.update(ctx));
    requestAnimationFrame(animate);
}

anchoInput.addEventListener("input", ajustarCanvas);
altoInput.addEventListener("input", ajustarCanvas);
document.getElementById("btnGenerar").addEventListener("click", lanzar);

ajustarCanvas();
lanzar();
animate();