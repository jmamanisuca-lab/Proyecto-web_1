/*AGREGAR PRODUCTOS AL CARRITO*/

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

/*MOSTRAR CARRITO EN form.html*/

let contenedorCarrito = document.getElementById("lista-carrito");
let resumenCompra = document.getElementById("resumen");

if (contenedorCarrito) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        alert("Carrito cargado con " + carrito.length + " producto(s)");

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

/*CONFIRMAR / CANCELAR COMPRA*/

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
        alert("Compra cancelada");
        localStorage.removeItem("carrito");
        location.reload();
    });
}

/*CAMBIO DE COLOR DEL PRODUCTO*/

let productos = document.querySelectorAll(".producto");

productos.forEach(producto => {
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

/*FILTRO POR CATEGORÍA*/
const selectCategoria = document.getElementById("categoria");
const secciones = document.querySelectorAll(".categoria-section");

if (selectCategoria) {
    selectCategoria.addEventListener("change", () => {
        const categoria = selectCategoria.value;

        secciones.forEach(section => {
            if (categoria === "all") {
                section.style.display = "block";
            } else {
                section.style.display =
                    section.dataset.categoria === categoria ? "block" : "none";
            }
        });
    });
}
const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    console.log("Formulario de registro detectado"); // Esto te confirmará en consola que el JS cargó

    formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita que la página se recargue sola
        
        const formData = new FormData(formRegistro);
        const datos = {
            nombre_completo: formData.get('nombre_completo'),
            correo: formData.get('correo'),
            contrasenia: formData.get('contrasenia')
        };
        const confirmar = formData.get('confirmar');

        if (datos.nombre_completo.length < 3) {
            alert("El nombre es demasiado corto");
            return;
        }

        if (datos.contrasenia.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
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
            console.error("Error detallado:", error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}

/* --- LOGIN --- */
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita que la página se recargue
        
        const formData = new FormData(formLogin);
        const datos = {
            correo: formData.get('correo'),
            contrasenia: formData.get('contrasenia')
        };

        try {
            // Enviamos los datos a la ruta que configuramos en app.py
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (resultado.success) {
                // Guardamos los datos del usuario (Juan) en el navegador
                localStorage.setItem('usuario', JSON.stringify(resultado.user));
                
                alert('¡Bienvenido de nuevo, ' + resultado.user.nombre_completo + '!');
                
                // Redirigir a la página principal (presentacion)
                window.location.href = '/'; 
            } else {
                alert('Error: ' + resultado.message);
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}

/* --- CONTROL DE SESIÓN EN EL HEADER --- */
function verificarSesion() {
    const botonLogin = document.getElementById('menuUsuario');
    const datosUsuario = localStorage.getItem('usuario');

    if (botonLogin && datosUsuario) {
        const usuario = JSON.parse(datosUsuario);
        
        // Sacamos solo el primer nombre (por si puso nombre completo)
        const primerNombre = usuario.nombre_completo.split(' ')[0];

        // Cambiamos el texto y el color para que resalte que ya entró
        botonLogin.innerHTML = `Hola, ${primerNombre} <span style="font-size: 0.8em;">(Salir)</span>`;
        botonLogin.style.color = "#ffffffff"; // Un amarillo suave o el color que prefieras
        botonLogin.href = "#"; // Quitamos el link al login

        // Si hace clic en su nombre, cerramos la sesión
        botonLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Quieres cerrar tu sesión?')) {
                localStorage.removeItem('usuario');
                window.location.reload(); // Recarga para volver a mostrar "Iniciar Sesión"
            }
        });
    }
}

// Llamamos a la función siempre que cargue la página
document.addEventListener('DOMContentLoaded', verificarSesion);

/* PROTECCIÓN DE LA PÁGINA DEL CARRITO (form.html) */
function protegerCarrito() {
    // Verificamos si la URL actual es la del carrito
    if (window.location.pathname === "/form") {
        const usuarioLogueado = localStorage.getItem("usuario");

        if (!usuarioLogueado) {
            alert("Acceso denegado. Debes iniciar sesión para ver tu carrito.");
            window.location.href = "/iniciarSesion";
        }
    }
}

// Ejecutar apenas cargue cualquier página
protegerCarrito();