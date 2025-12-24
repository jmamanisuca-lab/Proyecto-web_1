/*AGREGAR PRODUCTOS AL CARRITO*/

let botonesComprar = document.querySelectorAll(".btn-comprar");

botonesComprar.forEach(boton => {
    boton.addEventListener("click", function (e) {
        e.preventDefault();

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
                alert('¡Registro exitoso en Railway!');
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