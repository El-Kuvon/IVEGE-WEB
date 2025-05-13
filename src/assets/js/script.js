document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuToggle && mobileNav && mobileMenuClose) {
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link'); // Seleccionar links DENTRO del menú

        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (event) => {
            if (mobileNav.classList.contains('active') &&
                !mobileNav.contains(event.target) &&
                event.target !== mobileMenuToggle &&
                !mobileMenuToggle.contains(event.target)) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                     e.preventDefault();
                    const headerOffset = document.querySelector('.header')?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                 // console.warn("Smooth scroll target not found or invalid selector:", href);
             }
        });
    });


    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- Scroll Animations (para elementos .animate-on-scroll) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay;
                    if (delay) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, parseInt(delay));
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Umbral bajo para animaciones
        });
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }


// ==================================================================
// --- Lógica de Navegación Activa con Intersection Observer (CORREGIDA) ---
// ==================================================================

// Selecciona solo las secciones dentro de <main> que tengan un ID
const sectionsForNav = document.querySelectorAll('main section[id]');
// Selecciona TODOS los links de navegación (escritorio y móvil) para simplificar
const allNavLinksForHighlight = document.querySelectorAll('.nav-link, .mobile-nav-link');

// Función para activar/desactivar SOLO el link de Inicio
function setHomeLinkActive(isActive) {
    const homeHref = '/'; // <-- CORREGIDO: Usamos la barra para la raíz del sitio
    allNavLinksForHighlight.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === homeHref) {
             link.classList.toggle('active', isActive); // Añade o quita 'active' según isActive
        } else if (isActive) {
             // Si estamos activando Inicio, nos aseguramos que los demás NO estén activos
             link.classList.remove('active');
        }
    });
}

// Define el umbral de visibilidad deseado (ej. 0.5 para 50%, 0.8 para 80%)
const navThreshold = 0.5; // <-- AJUSTA ESTE VALOR COMO PREFIERAS

// Opciones para el Intersection Observer
const sectionObserverOptions = {
    root: null, // Relativo al viewport
    // Ajusta el margen superior para compensar el header fijo
    rootMargin: `-${document.querySelector('.header')?.offsetHeight || 70}px 0px 0px 0px`,
    threshold: navThreshold // El umbral de visibilidad para activar
};

// Variable para saber qué sección activó el observer más recientemente
let observerActiveSectionId = null;

// Función que se ejecuta cuando una sección cruza el umbral
const sectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
        const sectionId = entry.target.id;

        // Si la sección está intersectando y cumple el umbral de visibilidad
        if (entry.isIntersecting && entry.intersectionRatio >= navThreshold) {
            observerActiveSectionId = sectionId; // Guardamos la sección activa detectada

            // Solo actualizamos si no estamos en la parte superior (Inicio se maneja aparte)
            if (window.scrollY >= 50) {
                 allNavLinksForHighlight.forEach(link => {
                    // Construimos el href esperado para la sección en la página actual (index)
                    const expectedHref = `/index.html#${sectionId}`; // Asegúrate que coincida con tus links
                    link.classList.toggle('active', link.getAttribute('href') === expectedHref);
                });
                // Nos aseguramos que Inicio esté inactivo
                setHomeLinkActive(false);
            }
        }
        // Si una sección deja de cumplir (ej. entry.isIntersecting es false o ratio < threshold)
        // y era la que teníamos como activa, podríamos quitarle el active si ninguna otra la reemplaza.
        // Por ahora, la lógica simple es que el nuevo elemento que cumpla quitará el active anterior.
        else if (!entry.isIntersecting && sectionId === observerActiveSectionId) {
             // Si la sección que estaba activa deja de estarlo (según el observer),
             // podríamos desactivar su link si ninguna otra toma el relevo pronto.
             // Opcional: podrías añadir lógica aquí para desactivar si es necesario.
        }
    });
};

// Crear y activar el observador
const sectionObserver = new IntersectionObserver(sectionObserverCallback, sectionObserverOptions);
sectionsForNav.forEach(section => {
    // Nos aseguramos que la sección y su ID existan antes de observar
    if (section && section.id) {
         sectionObserver.observe(section);
    }
});

// --- Manejo del Caso "Inicio" (Scroll en la Parte Superior) ---
// Mantenemos un listener ligero para asegurar que "Inicio" se active al estar arriba.
let topScrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(topScrollTimeout);
    topScrollTimeout = setTimeout(() => {
        if (window.scrollY < 50) { // Umbral para "estar arriba"
            if (!document.querySelector('.nav-link[href="/"]')?.classList.contains('active')) {
                setHomeLinkActive(true); // Activa Inicio y desactiva otros
            }
            observerActiveSectionId = null; // Reseteamos la sección activa por observer
        }
        // Si bajamos de 50px, el observer debería tomar el control al cumplirse su umbral.
        // Si ninguna sección cumple el umbral al bajar, podríamos desactivar Inicio aquí:
        // else if (document.querySelector('.nav-link[href="/"]')?.classList.contains('active')) {
        //     setHomeLinkActive(false);
        // }
    }, 50); // Debounce
}, { passive: true });

// Comprobación inicial al cargar la página
if (window.scrollY < 50) {
    setHomeLinkActive(true);
} else {
    // Si carga más abajo, dejamos que el observer actúe con el primer scroll/interacción.
    // Forzar una comprobación inicial aquí puede ser complejo y a veces innecesario.
    setHomeLinkActive(false); // Asegura que Inicio no quede activo si cargamos más abajo
}
// ==================================================================
// --- Fin Lógica de Navegación Activa ---
// ==================================================================

}); // Fin del DOMContentLoaded