document.addEventListener("DOMContentLoaded", () => {
  
  
  
   const backgroundMusic = document.getElementById("backgroundMusic");

  if (backgroundMusic) {
    backgroundMusic.volume = 0.18;

    let musicStarted = false;

    async function startMusic() {
      if (musicStarted) return;

      try {
        await backgroundMusic.play();
        musicStarted = true;
      } catch (error) {
        // El navegador bloqueó el autoplay.
        // Esperamos una interacción del visitante.
      }
    }

    // Intento automático al entrar.
    startMusic();

    function startMusicAfterInteraction() {
      startMusic();

      document.removeEventListener("click", startMusicAfterInteraction);
      document.removeEventListener("touchstart", startMusicAfterInteraction);
      document.removeEventListener("pointerdown", startMusicAfterInteraction);
      document.removeEventListener("wheel", startMusicAfterInteraction);
    }

    document.addEventListener("click", startMusicAfterInteraction, { passive: true });
    document.addEventListener("touchstart", startMusicAfterInteraction, { passive: true });
    document.addEventListener("pointerdown", startMusicAfterInteraction, { passive: true });
    document.addEventListener("wheel", startMusicAfterInteraction, { passive: true });
  }
  
  
  
  
  
  
  
  
  
  
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const loader = document.querySelector(".page-loader");

  // Loader
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("is-hidden"), 250);
  });

  // Header: compact on scroll + hide while scrolling down.
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    header?.classList.toggle("scrolled", current > 30);

    if (current > lastScroll && current > 150) {
      header?.classList.add("hidden");
    } else {
      header?.classList.remove("hidden");
    }
    lastScroll = current;
  }, { passive: true });

  // Mobile menu
  function closeMenu() {
    menuToggle?.classList.remove("active");
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const open = !mainNav.classList.contains("open");
    menuToggle.classList.toggle("active", open);
    mainNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    body.classList.toggle("menu-open", open);
  });

  mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));

  // Accordion de servicios / paquetes
  const serviceItems = document.querySelectorAll('.service-accordion-item');
  serviceItems.forEach(item => { item.classList.remove('is-open'); item.querySelector('.service-accordion-trigger')?.setAttribute('aria-expanded','false'); });
  serviceItems.forEach(item => {
    const trigger = item.querySelector('.service-accordion-trigger');
    trigger?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      serviceItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.service-accordion-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Gallery filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      galleryItems.forEach((item, index) => {
        const show = filter === "all" || item.dataset.category === filter;

        if (show) {
          item.classList.remove("is-hidden");
          item.animate(
            [
              { opacity: 0, transform: "translateY(20px) scale(.98)" },
              { opacity: 1, transform: "translateY(0) scale(1)" }
            ],
            { duration: 500, delay: Math.min(index * 45, 250), easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
          );
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentImage = 0;
  let visibleImages = [];

  function updateVisibleImages() {
    visibleImages = [...document.querySelectorAll(".gallery-item:not(.is-hidden)")];
  }

  function showLightboxImage(index) {
    updateVisibleImages();
    if (!visibleImages.length) return;

    currentImage = (index + visibleImages.length) % visibleImages.length;
    const item = visibleImages[currentImage];
    const img = item.querySelector("img");

    lightboxImage.classList.remove("loaded");
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = item.querySelector("figcaption span")?.textContent || "";

    lightboxImage.onload = () => lightboxImage.classList.add("loaded");
  }

  function openLightbox(index) {
    updateVisibleImages();
    showLightboxImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    lightboxImage.classList.remove("loaded");
  }

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      updateVisibleImages();
      openLightbox(visibleImages.indexOf(item));
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => showLightboxImage(currentImage - 1));
  lightboxNext?.addEventListener("click", () => showLightboxImage(currentImage + 1));

  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showLightboxImage(currentImage - 1);
    if (event.key === "ArrowRight") showLightboxImage(currentImage + 1);
  });

  // Touch swipe for mobile lightbox
  let touchStartX = 0;
  lightbox?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox?.addEventListener("touchend", event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 45) return;
    if (delta > 0) showLightboxImage(currentImage - 1);
    else showLightboxImage(currentImage + 1);
  }, { passive: true });

  // Testimonials
  const testimonials = [...document.querySelectorAll(".testimonial")];
  const dotsContainer = document.querySelector(".slider-dots");
  const prevTestimonial = document.querySelector(".slider-arrow.prev");
  const nextTestimonial = document.querySelector(".slider-arrow.next");
  let testimonialIndex = 0;
  let testimonialTimer;

  testimonials.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (index === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Ver testimonio ${index + 1}`);
    dot.addEventListener("click", () => {
      testimonialIndex = index;
      renderTestimonial();
      restartTestimonialTimer();
    });
    dotsContainer?.appendChild(dot);
  });

  function renderTestimonial() {
    testimonials.forEach((item, index) => item.classList.toggle("active", index === testimonialIndex));
    dotsContainer?.querySelectorAll(".slider-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === testimonialIndex);
    });
  }

  function moveTestimonial(direction) {
    testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
    renderTestimonial();
  }

  function restartTestimonialTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => moveTestimonial(1), 6500);
  }

  prevTestimonial?.addEventListener("click", () => {
    moveTestimonial(-1);
    restartTestimonialTimer();
  });

  nextTestimonial?.addEventListener("click", () => {
    moveTestimonial(1);
    restartTestimonialTimer();
  });

  if (testimonials.length) restartTestimonialTimer();

  // Booking form: selector de sesión -> selector dinámico de plan.
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.querySelector(".form-message");
  const serviceSelect = document.getElementById("serviceSelect");
  const packageSelect = document.getElementById("packageSelect");

  const packagesByService = {
    quinceanera: [
      ["XV Esencial — $85", "XV Esencial — $85"],
      ["XV Signature — $125", "XV Signature — $125"],
      ["XV Premium — $170", "XV Premium — $170"]
    ],
    maternidad: [
      ["Esencial — $80", "Esencial — $80"],
      ["Classic — $110", "Classic — $110"],
      ["Premium — $140", "Premium — $140"]
    ],
    infantil: [
      ["Mini — $65", "Mini — $65"],
      ["New Born — $90", "New Born — $90"],
      ["Smash Cake — $160", "Smash Cake — $160"]
    ],
    boda: [
      ["Esencia del Día — $385", "Esencia del Día — $385"],
      ["Wedding Premium — $685", "Wedding Premium — $685"]
    ],
    sesiones: [
      ["Individual — $65", "Individual — $65"],
      ["Pareja — $75", "Pareja — $75"],
      ["Familia — $90", "Familia — $90"]
    ]
  };

  function updatePackageOptions() {
    if (!serviceSelect || !packageSelect) return;
    const service = serviceSelect.value;
    packageSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = service ? "Selecciona un plan" : "Primero elige una sesión";
    placeholder.disabled = true;
    placeholder.selected = true;
    packageSelect.appendChild(placeholder);

    (packagesByService[service] || []).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      packageSelect.appendChild(option);
    });
    packageSelect.disabled = !service;
  }

  serviceSelect?.addEventListener("change", updatePackageOptions);
  updatePackageOptions();

  bookingForm?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const name = data.get("name")?.trim() || "Sin nombre";
    const phone = data.get("phone")?.trim() || "No indicado";
    const service = serviceSelect?.selectedOptions[0]?.textContent || "No indicado";
    const selectedPackage = packageSelect?.selectedOptions[0]?.textContent || "No indicado";
    const date = data.get("date") || "Por definir";
    
    const message = data.get("message")?.trim() || "Sin mensaje adicional";

    // CAMBIA ESTE NÚMERO POR TU WHATSAPP, EN FORMATO INTERNACIONAL SIN + NI ESPACIOS.
    const whatsappNumber = "593994241616";

    const text = [
      "Hola, quiero solicitar información / reservar una sesión.",
      "",
      `Nombre: ${name}`,
      `WhatsApp del cliente: ${phone}`,
      `Tipo de sesión: ${service}`,
      `Plan / paquete: ${selectedPackage}`,
      `Fecha aproximada: ${date}`,
      
      `Mensaje: ${message}`
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    if (formMessage) formMessage.textContent = "Abriendo WhatsApp...";
    window.open(url, "_blank", "noopener");
  });

  // Current year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Small magnetic effect only on pointer devices.
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * .06}px, ${y * .06}px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }
});
