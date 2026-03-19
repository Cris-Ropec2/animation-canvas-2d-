# 🏀 Simulador de Físicas de Pelotas 

Este proyecto es una aplicación web interactiva de alto rendimiento desarrollada con **HTML5 Canvas**. Simula el comportamiento físico de múltiples pelotas en un entorno con gravedad, fricción y elasticidad, todo envuelto en una interfaz moderna con estilo **Glassmorphism** y **Bootstrap 5**.

![GitHub repo size](https://img.shields.io/github/repo-size/Cris-Ropec2/animation-canvas-2d-)
![GitHub last commit](https://img.shields.io/github/last-commit/Cris-Ropec2/animation-canvas-2d-)

## 🚀 Características Principales

### 1. Motor de Físicas Avanzado
- **Gravedad Realista:** Aceleración constante hacia el eje inferior.
- **Elasticidad (Rebote):** Los objetos pierden energía cinética en cada impacto según un factor de restitución.
- **Fricción Dinámica:** Desaceleración progresiva en el movimiento horizontal al contacto con superficies.
- **Squash & Stretch:** Deformación elástica de los círculos al impactar a altas velocidades, aportando un realismo visual superior.

### 2. Interfaz y Personalización
- **Glassmorphism Design:** Paneles traslúcidos con desenfoque (`backdrop-filter`) sobre un fondo del Estadio Santiago Bernabéu.
- **Control de N-Objetos:** Capacidad de generar desde 1 hasta 100 pelotas simultáneamente.
- **Lanzamientos Multidireccionales:** Opciones para arrojar objetos desde las 4 esquinas, desde arriba o con impulsos desde abajo.
- **Canvas Dinámico:** Sliders interactivos para ajustar el ancho y alto del área de simulación en tiempo real.

## 🛠️ Tecnologías Utilizadas

* **JavaScript (ES6+):** Lógica basada en Programación Orientada a Objetos (POO).
* **HTML5 Canvas API:** Renderizado de gráficos 2D y animaciones a 60 FPS.
* **CSS3:** Efectos de transparencia, filtros de desenfoque y diseño responsivo.
* **Bootstrap 5:** Estructura de componentes y sistema de rejilla (Grid).

## 📂 Estructura del Repositorio

/
├── index.html              # Estructura principal y controles de usuario
├── README.md               # Documentación del proyecto
└── assets/
    ├── CSS/               # Definición de estilos y efectos Glassmorphism
    |   └── style.css 
    ├── IMG/
    │   ├── paisaje.jpg      # Imagen de fondo 
    │   └── icons8-lanzar.png # Icono personalizado para el botón
    └── js/
        └── js/
            └── main.js      # Motor lógico de físicas y renderizado