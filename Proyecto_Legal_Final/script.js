// ============================================================================
// ARCHIVO: script.js
// DESCRIPCIÓN: Este archivo controla toda la interactividad de la página web.
// Contiene las animaciones visuales (usando la librería GSAP) y la lógica 
// para procesar el pago seguro con Stripe.
// Desarrollador: Adrián Regadera
// ============================================================================

// Esperamos a que TODA la página cargue (imágenes, textos) para evitar errores de animación
window.addEventListener("load", () => {
    
    // Registramos la herramienta que nos permite animar cosas al hacer scroll (ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger);

    // ========================================================================
    // SECCIÓN A: ANIMACIONES DE LA PÁGINA DE INICIO (PORTADA)
    // ========================================================================
    
    // Comprobamos si estamos en la página de inicio buscando la clase '.seccion-principal-de-portada'
    const seccionDePortada = document.querySelector(".seccion-principal-de-portada");
    const contenidoPrincipalDeLaPortada = document.querySelector(".contenido-principal-de-la-portada");

    if (seccionDePortada && contenidoPrincipalDeLaPortada) {
        
        // Efecto Parallax: Los elementos se mueven ligeramente cuando movemos el ratón
        seccionDePortada.addEventListener("mousemove", (eventoDelRaton) => {
            // Solo aplicamos este efecto en ordenadores (pantallas de más de 768px) para no marear en móviles
            if (window.innerWidth > 768) {
                const posicionEjeX = (eventoDelRaton.clientX / window.innerWidth - 0.5) * 20;
                const posicionEjeY = (eventoDelRaton.clientY / window.innerHeight - 0.5) * 20;
                gsap.to(contenidoPrincipalDeLaPortada, { x: posicionEjeX, y: posicionEjeY, duration: 1, ease: "power2.out" });
            }
        });

        // Animación de entrada: Los textos y botones aparecen flotando al cargar la página
        var lineaDeTiempoAnimacion = gsap.timeline();
        lineaDeTiempoAnimacion.from(".seccion-principal-de-portada h1", { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out" })
              .from(".subtitulo-de-la-portada", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.6")
              .from(".descripcion-de-la-portada", { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.6")
              .from(".caja-de-botones-de-la-portada a", { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.2, clearProps: "all" }, "-=0.6");
    }

    // ========================================================================
    // SECCIÓN B: EFECTO DE DESPLAZAMIENTO HORIZONTAL (PÁGINA INNOVACIÓN)
    // ========================================================================
    const seccionScrollHorizontal = document.querySelector(".seccion-de-desplazamiento-horizontal");
    
    if (seccionScrollHorizontal) {
        
        // Creamos una regla para que este efecto complejo solo se active en ordenadores
        let comprobadorDePantalla = gsap.matchMedia();

        comprobadorDePantalla.add("(min-width: 769px)", () => {
            
            // Recogemos todos los "paneles" que se van a mover de lado
            let panelesDeInformacion = gsap.utils.toArray(".panel-individual");
            
            // Animación principal: Mueve los paneles hacia la izquierda mientras el usuario baja (hace scroll)
            gsap.to(panelesDeInformacion, {
                xPercent: -100 * (panelesDeInformacion.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".seccion-de-desplazamiento-horizontal",
                    pin: true, // "Clava" la sección en la pantalla hasta que termine la animación
                    scrub: 1,  // Vincula la animación a la rueda del ratón de forma suave
                    end: "+=3000" 
                }
            });

            // Si hay una tarjeta 3D en esta sección, la hacemos rotar mientras el usuario hace scroll
            const imagenDeTarjeta3D = document.querySelector(".imagen-principal-de-la-tarjeta");
            if (imagenDeTarjeta3D) {
                gsap.to(".imagen-principal-de-la-tarjeta", {
                    rotationY: -35, rotationX: 15, z: 100, 
                    boxShadow: "30px 60px 100px rgba(0,0,0,0.4)", 
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".seccion-de-desplazamiento-horizontal",
                        start: "top top",
                        end: "+=1500",
                        scrub: 1
                    }
                });
            }
        });
    }

    // ========================================================================
    // SECCIÓN C: ANIMACIONES SECUNDARIAS (Pasos, Catálogo y Ventajas)
    // ========================================================================
    
    // 1. Animación de los "Pasos" (Aparecen desde abajo)
    if (document.querySelector(".seccion-de-pasos-del-proceso")) {
        gsap.from(".tarjeta-individual-del-paso", {
            scrollTrigger: { trigger: ".seccion-de-pasos-del-proceso", start: "top 75%", toggleActions: "play none none reverse" },
            y: 60, opacity: 0, duration: 1, stagger: 0.3, ease: "back.out(1.7)"
        });
    }

    // 2. Animación del "Catálogo" (Aparecen en cascada)
    if (document.querySelector(".tarjeta-individual-del-catalogo")) {
        gsap.set(".tarjeta-individual-del-catalogo", { y: 50, opacity: 0 });
        ScrollTrigger.batch(".tarjeta-individual-del-catalogo", {
            start: "top 85%",
            onEnter: loteDeElementos => gsap.to(loteDeElementos, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out", overwrite: true }),
            once: true // Solo se anima la primera vez que los ves
        });
    }

    // 3. Animación de "Ventajas" (Efecto de zoom al aparecer)
    if (document.querySelector(".seccion-de-caracteristicas")) {
        gsap.from(".tarjeta-de-caracteristica", {
            scrollTrigger: { trigger: ".seccion-de-caracteristicas", start: "top 80%" },
            scale: 0.8, y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", clearProps: "all" 
        });
    }

    // ========================================================================
    // SECCIÓN D: ANIMACIONES DE LA PÁGINA DE CONTACTO (FORMULARIO)
    // ========================================================================
    if (document.querySelector(".estilos-generales-del-formulario")) {
        // Hacemos que la cabecera, la caja de precio y el formulario entren por separado
        let lineaDeTiempoContacto = gsap.timeline();
        lineaDeTiempoContacto.from(".cabecera-de-la-zona-de-compra", { y: -30, opacity: 0, duration: 0.8, ease: "power2.out" })
                 .from(".columna-lateral-con-el-precio", { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
                 .from(".estilos-generales-del-formulario", { x: 50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

        // Efecto de inclinación 3D para la caja del precio cuando pasas el ratón
        const cajaDelPrecio = document.querySelector(".tarjeta-visual-del-resumen-de-precio");
        if (cajaDelPrecio) {
            cajaDelPrecio.addEventListener("mousemove", (eventoDelRaton) => {
                if (window.innerWidth > 768) { // Solo en PC
                    const dimensionesDeLaCaja = cajaDelPrecio.getBoundingClientRect();
                    const posicionRatonX = eventoDelRaton.clientX - dimensionesDeLaCaja.left; 
                    const posicionRatonY = eventoDelRaton.clientY - dimensionesDeLaCaja.top;
                    const porcentajeGiroX = (posicionRatonX / dimensionesDeLaCaja.width - 0.5) * 20; 
                    const porcentajeGiroY = (posicionRatonY / dimensionesDeLaCaja.height - 0.5) * -20; 

                    gsap.to(cajaDelPrecio, { rotationY: porcentajeGiroX, rotationX: porcentajeGiroY, ease: "power1.out", duration: 0.5, transformPerspective: 1000 });
                }
            });
            // Al quitar el ratón, la caja vuelve a su sitio original con un rebote
            cajaDelPrecio.addEventListener("mouseleave", () => {
                gsap.to(cajaDelPrecio, { rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
            });
        }
    }

    // ========================================================================
    // SECCIÓN E: ANIMACIÓN 3D PARA LA IMAGEN (ESCAPARATE/NOSOTROS)
    // ========================================================================
    const seccionNosotros = document.querySelector('.escaparate-de-productos');
    const imagenNosotros3D = document.querySelector('.escaparate-de-productos .imagen-principal-de-la-tarjeta');

    // Mismo efecto que la caja de precio: la imagen sigue al ratón
    if (seccionNosotros && imagenNosotros3D && window.innerWidth > 768) {
        seccionNosotros.addEventListener('mousemove', (eventoDelRaton) => {
            const dimensionesSeccion = seccionNosotros.getBoundingClientRect();
            const posicionRatonX = eventoDelRaton.clientX - dimensionesSeccion.left; 
            const posicionRatonY = eventoDelRaton.clientY - dimensionesSeccion.top;
            const porcentajeGiroX = (posicionRatonX / dimensionesSeccion.width - 0.5) * 15; 
            const porcentajeGiroY = (posicionRatonY / dimensionesSeccion.height - 0.5) * -15; 

            gsap.to(imagenNosotros3D, { 
                rotationY: porcentajeGiroX, rotationX: porcentajeGiroY, ease: "power1.out", duration: 0.5, transformPerspective: 1000 
            });
        });

        seccionNosotros.addEventListener('mouseleave', () => {
            gsap.to(imagenNosotros3D, { rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
        });
    }

    // ========================================================================
    // SECCIÓN F: PASARELA DE PAGO INTEGRADA (STRIPE + APPLE PAY + GOOGLE PAY)
    // ========================================================================

    const formularioDeCompra = document.getElementById('formulario-de-datos-del-cliente');
    
    // Todo este bloque solo se ejecuta si estamos en la página de contacto (donde está el formulario)
    if (formularioDeCompra) {
        
        // 1. INICIALIZAR STRIPE CON LA CLAVE DE PRUEBAS
        const conexionStripe = Stripe("pk_test_51SyIJZAwxzQJK7hJc1LuamuAcyKYTrY1OeQDQVCq2MYa3LfMAkyPYnFcUxdCRAp3HpXAfbXJfCjG7K8fsnhrDZUr00V6g8f5IM"); 
        
        let bloqueVisualDeStripe;
        let codigoSecretoDelPago;

        // 2. CARGAR EL RECUADRO DE PAGO (TARJETA / GOOGLE PAY / APPLE PAY)
        async function prepararPasarelaDePago() {
            try {
                const respuestaDelServidor = await fetch("/api/crear-intento-pago", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                
                const datosDelServidor = await respuestaDelServidor.json();
                codigoSecretoDelPago = datosDelServidor.clientSecret;

                const configuracionDeDiseno = { theme: 'night', labels: 'above' };
                bloqueVisualDeStripe = conexionStripe.elements({ appearance: configuracionDeDiseno, clientSecret: codigoSecretoDelPago });

                const huecoParaLaTarjeta = bloqueVisualDeStripe.create("payment");
                huecoParaLaTarjeta.mount("#hueco-para-la-tarjeta-de-stripe");
                
            } catch (errorAlCargarPago) {
                console.error("Error crítico al intentar cargar la pasarela de Stripe:", errorAlCargarPago);
            }
        }

        // Ejecutamos la función de arriba nada más cargar la página de contacto
        prepararPasarelaDePago();

        // 3. QUÉ PASA CUANDO EL CLIENTE PULSA EL BOTÓN AZUL DE PAGO
        formularioDeCompra.addEventListener("submit", async (eventoDeEnvio) => {
            eventoDeEnvio.preventDefault(); // Evitamos que la página se recargue bruscamente
            activarRuedaDeCarga(true); // Ponemos el botón en modo "cargando..."

            // Recogemos todos los datos escritos (Nombre, Email, Archivo adjunto)
            const paqueteDeDatosDelCliente = new FormData(formularioDeCompra);
            
            // Extraemos el identificador único del pago para guardarlo en nuestra base de datos
            const identificadorDeStripe = codigoSecretoDelPago.split('_secret')[0];
            paqueteDeDatosDelCliente.append('stripeId', identificadorDeStripe);

            try {
                // PRIMER PASO: Enviar el Título Náutico y los datos a nuestra base de datos (MongoDB)
                const guardadoEnBaseDeDatos = await fetch('/api/guardar-pedido', {
                    method: 'POST',
                    body: paqueteDeDatosDelCliente
                });
                
                const confirmacionDeGuardado = await guardadoEnBaseDeDatos.json();

                if (confirmacionDeGuardado.status !== 'success') {
                    throw new Error("Ocurrió un error al guardar el título náutico en la nube.");
                }

                // SEGUNDO PASO: Si se ha guardado bien, procesamos el cobro de la tarjeta con Stripe
                const { error: errorEnLaTarjeta } = await conexionStripe.confirmPayment({
                    elements: bloqueVisualDeStripe,
                    confirmParams: {
                        // Si el cobro es exitoso, redirigimos al usuario aquí mismo para mostrarle la alerta
                        return_url: window.location.origin + "/index.html?pago=exito",
                    },
                });

                // Si llegamos a esta línea es porque la tarjeta fue rechazada o no tiene fondos
                if (errorEnLaTarjeta) {
                    mostrarMensajeDeErrorVisual(errorEnLaTarjeta.message);
                }

            } catch (errorGeneral) {
                mostrarMensajeDeErrorVisual(errorGeneral.message);
            }

            activarRuedaDeCarga(false); // Quitamos la rueda de carga si hubo un error
        });

        // --- Funciones auxiliares para mostrar la rueda giratoria y los errores en pantalla ---
        function mostrarMensajeDeErrorVisual(textoDelMensaje) {
            const contenedorDelError = document.querySelector("#caja-de-mensajes-de-error-de-pago");
            contenedorDelError.classList.remove("ocultar-este-elemento");
            contenedorDelError.textContent = textoDelMensaje;
        }

        function activarRuedaDeCarga(estaCargando) {
            const botonAzul = document.querySelector("#boton-para-procesar-el-pago");
            const iconoDeRueda = document.querySelector("#icono-de-cargando");
            const textoDelBoton = document.querySelector("#texto-interior-del-boton-de-pago");
            
            if (estaCargando) {
                botonAzul.disabled = true; // Bloqueamos el botón para que no pulse dos veces
                iconoDeRueda.style.display = "inline-block";
                textoDelBoton.style.display = "none";
            } else {
                botonAzul.disabled = false;
                iconoDeRueda.style.display = "none";
                textoDelBoton.style.display = "inline-block";
            }
        }
    }

    // ========================================================================
    // SECCIÓN G: MENSAJE FINAL DE ÉXITO ("¡PAGO REALIZADO CON ÉXITO!")
    // ========================================================================
    // Leemos la URL de arriba del navegador buscando la palabra secreta '?pago=exito'
    const parametrosURL = new URLSearchParams(window.location.search);
    
    if (parametrosURL.get('pago') === 'exito') {
        // Borramos la palabra secreta de la URL para que quede limpio
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Esperamos 1 segundo y mostramos la alerta de victoria al usuario
        setTimeout(() => {
            alert("✨ ¡PAGO REALIZADO CON ÉXITO! ✨\n\nGracias por confiar en Legal Intermedia.\nTu pedido ha sido procesado correctamente.");
        }, 1000);
    }

    // Actualizamos el motor de animaciones para que calcule bien las posiciones
    ScrollTrigger.refresh();
});

// ============================================================================
// SECCIÓN H: MENÚ HAMBURGUESA (MÓVILES) - Lógica Independiente
// ============================================================================
// Ejecutamos esto nada más leer el HTML para que el menú del móvil funcione al instante,
// sin esperar a que carguen las fotos pesadas de la web.
document.addEventListener('DOMContentLoaded', () => {
    
    const iconoMenuMovil = document.querySelector('#boton-abrir-menu-movil'); // Las 3 rayitas
    const contenedorEnlacesNavegacion = document.querySelector('.lista-de-enlaces-del-menu'); // Los enlaces (Inicio, Contacto...)

    // Si existen ambos elementos en la página actual, le damos vida al menú
    if (iconoMenuMovil && contenedorEnlacesNavegacion) {
        iconoMenuMovil.addEventListener('click', function() {
            // El 'toggle' añade una clase si no la tiene, y se la quita si la tiene (Efecto abrir/cerrar)
            iconoMenuMovil.classList.toggle('esta-activo');
            contenedorEnlacesNavegacion.classList.toggle('activo');
        });
    }
    
    // ========================================================================
    // SECCIÓN I: BOTÓN "VOLVER ARRIBA" (El círculo de la esquina inferior derecha)
    // ========================================================================
    const botonSubirArriba = document.getElementById("identificador-boton-subir");
    
    if (botonSubirArriba) {
        // Vigilamos cuánto ha bajado el usuario en la página
        window.addEventListener("scroll", () => {
            // Si ha bajado más de 300 píxeles, enseñamos el botón
            if (window.scrollY > 300) { 
                botonSubirArriba.classList.add("visible"); 
            } else { 
                botonSubirArriba.classList.remove("visible"); 
            }
        });
        
        // Cuando hace clic en el botón, le subimos suavemente al principio de la web
        botonSubirArriba.addEventListener("click", (eventoDeClic) => {
            eventoDeClic.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});