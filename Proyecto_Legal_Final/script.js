// Esperamos a que TODA la página cargue para evitar errores
window.addEventListener("load", () => {
    
    // Registramos el plugin de GSAP (ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // PARTE A: LÓGICA SOLO PARA LA PORTADA (INDEX)
    // ==========================================
    if (document.querySelector(".hero-section")) {
        
        // 1. HERO INTERACTIVO (Ratón)
        const heroSection = document.querySelector(".hero-section");
        const heroContent = document.querySelector(".hero-content");

        if(heroSection && heroContent) {
            heroSection.addEventListener("mousemove", (e) => {
                // Solo si la pantalla es grande para no marear en móvil
                if (window.innerWidth > 768) {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;
                    gsap.to(heroContent, { x: x, y: y, duration: 1, ease: "power2.out" });
                }
            });

            // Animación de entrada
            var tl = gsap.timeline();
            tl.from(".hero-section h1", { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out" })
              .from(".subtitle", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.6")
              .from(".hero-desc", { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.6")
              .from(".hero-btns a", { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.2, clearProps: "all" }, "-=0.6");
        }
    }

    // ==========================================
    // PARTE B: LÓGICA PARA SCROLL HORIZONTAL (INNOVACIÓN)
    // ==========================================
    if (document.querySelector(".horizontal-scroll-section")) {
        
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            
            let sections = gsap.utils.toArray(".panel");
            
            // Mover los paneles horizontalmente
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-scroll-section",
                    pin: true,
                    scrub: 1,
                    end: "+=3000" 
                }
            });

            // Mover la tarjeta 3D si existe
            if (document.querySelector(".card-img-main")) {
                gsap.to(".card-img-main", {
                    rotationY: -35, rotationX: 15, z: 100, 
                    boxShadow: "30px 60px 100px rgba(0,0,0,0.4)", 
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".horizontal-scroll-section",
                        start: "top top",
                        end: "+=1500",
                        scrub: 1
                    }
                });
            }
        });
    }

    // ==========================================
    // PARTE C: OTRAS ANIMACIONES (Pasos, Catálogo, Ventajas)
    // ==========================================
    
    // 1. STEPS (Animación de pasos)
    if (document.querySelector(".steps-section")) {
        gsap.from(".step-card", {
            scrollTrigger: { trigger: ".steps-section", start: "top 75%", toggleActions: "play none none reverse" },
            y: 60, opacity: 0, duration: 1, stagger: 0.3, ease: "back.out(1.7)"
        });
    }

    // 2. CATÁLOGO
    if (document.querySelector(".catalog-item")) {
        gsap.set(".catalog-item", { y: 50, opacity: 0 });
        ScrollTrigger.batch(".catalog-item", {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out", overwrite: true }),
            once: true
        });
    }

    // 3. VENTAJAS
    if (document.querySelector(".features-section")) {
        gsap.from(".feature-card", {
            scrollTrigger: { trigger: ".features-section", start: "top 80%" },
            scale: 0.8, y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", clearProps: "all" 
        });
    }

    // ==========================================
    // PARTE D: LÓGICA SOLO PARA CONTACTO (VISUAL)
    // ==========================================
    if (document.querySelector(".order-form")) {
        let contactTl = gsap.timeline();
        contactTl.from(".contact-header", { y: -30, opacity: 0, duration: 0.8, ease: "power2.out" })
                 .from(".price-sidebar", { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
                 .from(".order-form", { x: 50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

        const priceBox = document.querySelector(".price-box");
        if(priceBox) {
            priceBox.addEventListener("mousemove", (e) => {
                if (window.innerWidth > 768) { // Solo PC
                    const rect = priceBox.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top;
                    const xPct = (x / rect.width - 0.5) * 20; 
                    const yPct = (y / rect.height - 0.5) * -20; 

                    gsap.to(priceBox, { rotationY: xPct, rotationX: yPct, ease: "power1.out", duration: 0.5, transformPerspective: 1000 });
                }
            });
            priceBox.addEventListener("mouseleave", () => {
                gsap.to(priceBox, { rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
            });
        }
    }

    // ==========================================
    // PARTE E: ANIMACIÓN IMAGEN "NOSOTROS"
    // ==========================================
    const nosotrosSection = document.querySelector('.product-showcase');
    const nosotrosImage = document.querySelector('.product-showcase .card-img-main');

    if (nosotrosSection && nosotrosImage && window.innerWidth > 768) {
        nosotrosSection.addEventListener('mousemove', (e) => {
            const rect = nosotrosSection.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const xPct = (x / rect.width - 0.5) * 15; 
            const yPct = (y / rect.height - 0.5) * -15; 

            gsap.to(nosotrosImage, { 
                rotationY: xPct, rotationX: yPct, ease: "power1.out", duration: 0.5, transformPerspective: 1000 
            });
        });

        nosotrosSection.addEventListener('mouseleave', () => {
            gsap.to(nosotrosImage, { rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
        });
    }


    // ==========================================
    // PARTE F: PAGO INTEGRADO (STRIPE ELEMENTS + APPLE PAY)
    // ==========================================

    const paymentForm = document.getElementById('payment-form');
    
    // Solo ejecutamos esto si estamos en la página de contacto
    if (paymentForm) {
        
        // 1. INICIALIZAR STRIPE (Pon tu CLAVE PÚBLICA aquí, la que empieza por pk_test_...)
        // OJO: Sustituye esto por tu clave real de Stripe Dashboard
        const stripe = Stripe("pk_test_51SyIJZAwxzQJK7hJc1LuamuAcyKYTrY1OeQDQVCq2MYa3LfMAkyPYnFcUxdCRAp3HpXAfbXJfCjG7K8fsnhrDZUr00V6g8f5IM"); 
        
        let elements;
        let clientSecret;

        // 2. CARGAR EL FORMULARIO DE PAGO AL ENTRAR
        async function initialize() {
            try {
                // Pedimos al servidor que inicie el proceso
                const response = await fetch("/api/crear-intento-pago", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                
                const data = await response.json();
                clientSecret = data.clientSecret;

                // Configuramos Stripe Elements
                const appearance = { theme: 'night', labels: 'floating' };
                elements = stripe.elements({ appearance, clientSecret });

                // Creamos el elemento de pago (Tarjeta + Apple/Google Pay)
                const paymentElement = elements.create("payment");
                paymentElement.mount("#payment-element");
                
            } catch (error) {
                console.error("Error al cargar Stripe:", error);
            }
        }

        // Llamamos a la función para que arranque
        initialize();

        // 3. CUANDO EL USUARIO PULSA "PAGAR"
        paymentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setLoading(true);

            // A) Primero validamos que haya rellenado todo
            const formData = new FormData(paymentForm);
            
            // Añadimos el ID de pago a los datos para guardarlo en Mongo
            // (El ID viene dentro del clientSecret, es la parte antes de '_secret')
            const paymentIntentId = clientSecret.split('_secret')[0];
            formData.append('stripeId', paymentIntentId);

            try {
                // B) Guardamos el archivo y los datos en MongoDB
                const respuestaMongo = await fetch('/api/guardar-pedido', {
                    method: 'POST',
                    body: formData
                });
                
                const infoMongo = await respuestaMongo.json();

                if (infoMongo.status !== 'success') {
                    throw new Error("Error al guardar el documento en el servidor.");
                }

                // C) Si Mongo ha guardado bien, CONFIRMAMOS EL PAGO en Stripe
                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        // A dónde ir cuando el pago sea ÉXITO
                        return_url: window.location.origin + "/index.html?pago=exito",
                    },
                });

                // Si llegamos aquí es que hubo un error (tarjeta rechazada, etc.)
                if (error) {
                    showMessage(error.message);
                }

            } catch (err) {
                showMessage(err.message);
            }

            setLoading(false);
        });

        // --- Funciones auxiliares visuales ---
        function showMessage(messageText) {
            const messageContainer = document.querySelector("#payment-message");
            messageContainer.classList.remove("hidden");
            messageContainer.textContent = messageText;
        }

        function setLoading(isLoading) {
            const submitBtn = document.querySelector("#submit-button");
            const spinner = document.querySelector("#spinner");
            const buttonText = document.querySelector("#button-text");
            
            if (isLoading) {
                submitBtn.disabled = true;
                spinner.style.display = "inline-block";
                buttonText.style.display = "none";
            } else {
                submitBtn.disabled = false;
                spinner.style.display = "none";
                buttonText.style.display = "inline-block";
            }
        }
    }


    // ==========================================
    // PARTE G: MENSAJE DE ÉXITO AL VOLVER DE STRIPE
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pago') === 'exito') {
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
            alert("✨ ¡PAGO REALIZADO CON ÉXITO! ✨\n\nGracias por confiar en Legal Intermedia.\nTu pedido ha sido procesado correctamente.");
        }, 1000);
    }

    // Refrescar GSAP al final
    ScrollTrigger.refresh();
});

// ==========================================
// PARTE H: MENÚ HAMBURGUESA (MÓVIL) - FUERA DEL LOAD
// ==========================================
// Esto lo ponemos fuera para que funcione instantáneo sin esperar a que carguen las imágenes
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }
    
    // ==========================================
    // PARTE I: BOTÓN VOLVER ARRIBA
    // ==========================================
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) { scrollTopBtn.classList.add("show"); }
            else { scrollTopBtn.classList.remove("show"); }
        });
        scrollTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});