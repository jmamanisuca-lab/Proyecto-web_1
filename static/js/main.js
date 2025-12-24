// CONTROL DE SESIÓN Y PROTECCIÓN
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    protegerCarrito();
});

function verificarSesion() {
    const botonLogin = document.getElementById('menuUsuario');
    const datosUsuario = localStorage.getItem('usuario');

    if (botonLogin && datosUsuario) {
        const usuario = JSON.parse(datosUsuario);
        const primerNombre = usuario.nombre_completo.split(' ')[0];

        botonLogin.innerHTML = `Hola, ${primerNombre} <span style="font-size: 0.8em;">(Salir)</span>`;
        botonLogin.style.color = "#ffffff";
        botonLogin.href = "#";

        botonLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Quieres cerrar tu sesión?')) {
                localStorage.removeItem('usuario');
                window.location.reload();
            }
        });
    }
}

function protegerCarrito() {
    if (window.location.pathname === "/form") {
        const usuarioLogueado = localStorage.getItem("usuario");
        if (!usuarioLogueado) {
            alert("Acceso denegado. Debes iniciar sesión para ver tu carrito.");
            window.location.href = "/iniciarSesion";
        }
    }
}

// GESTIÓN DE PRODUCTOS Y CARRITO
let botonesComprar = document.querySelectorAll(".btn-comprar");

botonesComprar.forEach(boton => {
    boton.addEventListener("click", function (e) {
        e.preventDefault();
        const usuarioLogueado = localStorage.getItem("usuario");

        if (!usuarioLogueado) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            window.location.href = "/iniciarSesion";
            return;
        }

        let producto = {
            nombre: this.dataset.nombre,
            precio: parseFloat(this.dataset.precio),
            imagen: this.dataset.imagen,
            color: this.dataset.color,
            cantidad: 1
        };

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let productoExistente = carrito.find(item =>
            item.nombre === producto.nombre &&
            item.color === producto.color
        );

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push(producto);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert("Producto agregado al carrito");
        window.location.href = "/form";
    });
});

// VISUALIZACIÓN EN FORM.HTML
let contenedorCarrito = document.getElementById("lista-carrito");
let resumenCompra = document.getElementById("resumen");

if (contenedorCarrito) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad;
            contenedorCarrito.innerHTML += `
                <article>
                    <h3>${producto.nombre}</h3>
                    <img src="${producto.imagen}" width="100">
                    <p>Color: ${producto.color}</p>
                    <p>Precio: S/ ${producto.precio.toFixed(2)}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <hr>
                </article>
            `;
        });

        resumenCompra.innerHTML = `
            <h2>Resumen de la compra</h2>
            <p>Total: <strong>S/ ${total.toFixed(2)}</strong></p>
        `;
    }
}

// BOTONES DE ACCIÓN FINAL
let btnConfirmar = document.getElementById("confirmar");
let btnCancelar = document.getElementById("cancelar");

if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
        alert("Procesando compra...");
        localStorage.removeItem("carrito");
        alert("Compra realizada con éxito");
        location.reload();
    });
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        if (confirm("¿Deseas cancelar la compra y vaciar el carrito?")) {
            localStorage.removeItem("carrito");
            location.reload();
        }
    });
}

// INTERACCIONES DE PRODUCTO
let productosUI = document.querySelectorAll(".producto");

productosUI.forEach(producto => {
    let imagen = producto.querySelector(".img-producto");
    let colores = producto.querySelectorAll(".color");
    let boton = producto.querySelector(".btn-comprar");

    colores.forEach(color => {
        color.addEventListener("click", () => {
            let nuevaImagen = color.dataset.imagen;
            let nombreColor = color.dataset.color;
            imagen.src = nuevaImagen;
            boton.dataset.color = nombreColor;
            boton.dataset.imagen = nuevaImagen;
        });
    });
});

// FILTROS
const selectCategoria = document.getElementById("categoria");
const secciones = document.querySelectorAll(".categoria-section");

if (selectCategoria) {
    selectCategoria.addEventListener("change", () => {
        const categoria = selectCategoria.value;
        secciones.forEach(section => {
            if (categoria === "all") {
                section.style.display = "block";
            } else {
                section.style.display = section.dataset.categoria === categoria ? "block" : "none";
            }
        });
    });
}

// REGISTRO DE USUARIOS
const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(formRegistro);
        const datos = {
            nombre_completo: formData.get('nombre_completo'),
            correo: formData.get('correo'),
            contrasenia: formData.get('contrasenia')
        };
        const confirmar = formData.get('confirmar');

        if (datos.nombre_completo.length < 3 || datos.contrasenia.length < 6) {
            alert("Verifique que el nombre tenga 3 caracteres y la clave 6.");
            return;
        }

        if (datos.contrasenia !== confirmar) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await response.json();
            if (resultado.success) {
                alert('¡Registro exitoso!');
                window.location.href = '/iniciarSesion';
            } else {
                alert('Error: ' + resultado.message);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}

// LOGIN DE USUARIOS
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(formLogin);
        const datos = {
            correo: formData.get('correo'),
            contrasenia: formData.get('contrasenia')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await response.json();
            if (resultado.success) {
                localStorage.setItem('usuario', JSON.stringify(resultado.user));
                alert('¡Bienvenido, ' + resultado.user.nombre_completo + '!');
                window.location.href = '/'; 
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}