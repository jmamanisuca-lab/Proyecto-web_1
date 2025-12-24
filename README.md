# Nombre del Proyecto: SportZone Web

## Equipo
- **Nombre del Equipo:** 
- **Líder del equipo:** Baldarrago Flores Mauro Daniel 
- **Integrantes y calificación asignada por el líder:**
  - Bernal Neyra Sebastian Colen - 16
  - Mamami Sucari Jose Carlos - 16
  - Baldarrago Flores Mauro Daniel - 16

## URL del Proyecto Hospedado
https://paginaprueba-ftfi.onrender.com/

## Descripción
SportZone Web es una plataforma de comercio electrónico enfocada en la venta de productos deportivos. Permite a los usuarios registrarse, iniciar sesión, explorar productos, agregar artículos a un carrito de compras, filtrar por categorías y finalizar o cancelar compras. El proyecto combina funcionalidades de frontend con backend en Python para manejar usuarios y compras, y una base de datos MySQL para almacenar información de usuarios y productos.

## Lenguajes y Tecnologías Utilizadas
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (WSGI app)
- **Base de datos:** MySQL

## Estructura del Proyecto
La organización del código sigue el estándar de aplicaciones Flask para asegurar escalabilidad y orden:

```text
/
├── app.py              # Lógica principal del servidor y API
├── requirements.txt    # Dependencias del proyecto
├── static/             # Archivos estáticos
│   ├── css/            # Estilos del sitio
│   ├── js/             # Lógica del lado del cliente
│   └── img/            # Imágenes de productos y logos
├── templates/          # Vistas HTML (Jinja2)
│   ├── index.html      # Inicio
│   ├── productos.html  # Catálogo
│   ├── login.html      # Acceso
│   └── form.html       # Carrito y Checkout
└── README.md           # Documentación del proyecto
