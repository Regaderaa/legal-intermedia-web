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
    // PARTE F: PAGO CON STRIPE (BACKEND CON ARCHIVO)
    // ==========================================
    const paymentForm = document.getElementById('payment-form'); 

    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const submitBtn = paymentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = "SUBIENDO ARCHIVO...";
            submitBtn.style.opacity = "0.7";
            submitBtn.disabled = true;

            try {
                // 1. Empaquetamos todo el formulario (textos + archivo) automáticamente
                const formData = new FormData(paymentForm);

                // LLAMADA AL SERVIDOR
                const respuesta = await fetch('/api/crear-sesion-pago', {
                    method: 'POST',
                    // NOTA IMPORTANTE: Al usar FormData, NO ponemos 'Content-Type': 'application/json'
                    // El navegador lo pone solo automáticamente como 'multipart/form-data'
                    body: formData
                });

                const info = await respuesta.json();

                if (info.status === 'success' && info.url) {
                    submitBtn.innerText = "REDIRIGIENDO A STRIPE...";
                    submitBtn.style.backgroundColor = "#10b981";
                    
                    // REDIRECCIÓN A STRIPE
                    window.location.href = info.url; 
                    
                } else {
                    throw new Error('El servidor no devolvió una URL de pago');
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                submitBtn.innerText = "ERROR";
                submitBtn.style.backgroundColor = "#ef4444"; 
                alert("❌ Error al procesar el pedido o subir el archivo.");
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.style.opacity = "1";
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
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