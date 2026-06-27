// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCustomCursor();
  initBackgroundVideoSync();
  initThreeJSBackground();
  initScrollAnimations();
  initProjectTilt();
  initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });

  // Track active section and update nav links
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    const id = section.getAttribute("id");
    
    // Different start points depending on section
    const startVal = id === "hero" ? "top 20%" : "top 40%";
    
    ScrollTrigger.create({
      trigger: section,
      start: startVal,
      end: "bottom 40%",
      onEnter: () => activateNavLink(id),
      onEnterBack: () => activateNavLink(id)
    });
  });

  function activateNavLink(id) {
    navLinks.forEach(link => {
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Handle CTA or scroll button clicks smoothly
  document.getElementById("scroll-btn").addEventListener("click", () => {
    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  });
}

/* ==========================================================================
   2. CUSTOM MOUSE CURSOR GLOW
   ========================================================================== */
function initCustomCursor() {
  const glow = document.getElementById("cursor-glow");
  
  // Custom cursor follower only for non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    const xTo = gsap.quickTo(glow, "left", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "top", { duration: 0.35, ease: "power3.out" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Make glow pulse and expand when hovering interactive items
    const hoverElements = document.querySelectorAll("a, button, .btn, .project-card, .stat-card, .menu-toggle, .form-input");
    hoverElements.forEach(el => {
      el.addEventListener("mouseenter", () => glow.classList.add("active"));
      el.addEventListener("mouseleave", () => glow.classList.remove("active"));
    });
  } else {
    // Hide cursor glow on touch screens
    glow.style.display = "none";
  }
}

/* ==========================================================================
   3. BACKGROUND VIDEO SCROLL SYNCHRONIZATION
   ========================================================================== */
function initBackgroundVideoSync() {
  const vid1 = document.getElementById("vid-1");
  const vid2 = document.getElementById("vid-2");
  const vid3 = document.getElementById("vid-3");
  const vid4 = document.getElementById("vid-4");

  // Keep videos paused - ScrollTrigger controls playhead
  [vid1, vid2, vid3, vid4].forEach(vid => {
    vid.pause();
    vid.currentTime = 0;
  });

  // Setup transitions and scrubs
  setupVideoScrub(vid1, "#hero", "top top", "bottom top", vid1);
  setupVideoScrub(vid2, "#about", "top bottom", "#skills", "bottom top", vid2);
  setupVideoScrub(vid3, "#projects", "top bottom", "#projects", "bottom top", vid3);
  setupVideoScrub(vid4, "#experience", "top bottom", "#contact", "bottom bottom", vid4);

  // Setup visibility/activation triggers
  setupVideoActivation(vid1, "#hero", "top top", "bottom top");
  setupVideoActivation(vid2, "#about", "top bottom", "#skills", "bottom top");
  setupVideoActivation(vid3, "#projects", "top bottom", "#projects", "bottom top");
  setupVideoActivation(vid4, "#experience", "top bottom", "#contact", "bottom bottom");

  function setupVideoScrub(video, triggerEl, startPos, endTriggerEl, endPos, targetVid) {
    const applyScrub = () => {
      const duration = video.duration || 5;
      
      gsap.fromTo(video, 
        { currentTime: 0.05 }, 
        {
          currentTime: duration - 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            endTrigger: endTriggerEl !== triggerEl ? endTriggerEl : undefined,
            start: startPos,
            end: endPos,
            scrub: 1.2, // Adds inertia so video frame updates are silky smooth
          }
        }
      );
    };

    if (video.readyState >= 1) {
      applyScrub();
    } else {
      video.addEventListener("loadedmetadata", applyScrub);
    }
  }

  function setupVideoActivation(video, triggerEl, startPos, endTriggerEl, endPos) {
    ScrollTrigger.create({
      trigger: triggerEl,
      endTrigger: endTriggerEl !== triggerEl ? endTriggerEl : undefined,
      start: startPos,
      end: endPos,
      onEnter: () => activateVideo(video),
      onEnterBack: () => activateVideo(video),
    });
  }

  function activateVideo(activeVid) {
    [vid1, vid2, vid3, vid4].forEach(vid => {
      if (vid === activeVid) {
        vid.classList.add("active");
      } else {
        vid.classList.remove("active");
      }
    });
  }
}

/* ==========================================================================
   4. THREE.JS 3D BACKGROUND
   ========================================================================== */
function initThreeJSBackground() {
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas) return;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Dynamic Colored Lights that follow cursor
  const purpleLight = new THREE.PointLight(0x915eff, 2.5, 12);
  purpleLight.position.set(0, 0, 2);
  scene.add(purpleLight);

  const cyanLight = new THREE.PointLight(0x00e5ff, 2.5, 12);
  cyanLight.position.set(0, 0, 2);
  scene.add(cyanLight);

  // Floating Geometries
  // Torus Knot
  const torusKnotGeom = new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16);
  const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x915eff,
    roughness: 0.15,
    metalness: 0.85,
    flatShading: true
  });
  const torusKnot = new THREE.Mesh(torusKnotGeom, torusKnotMat);
  torusKnot.position.set(-2.2, 1.2, -1);
  scene.add(torusKnot);

  // Icosahedron (Wireframe)
  const icosahedronGeom = new THREE.IcosahedronGeometry(0.9, 1);
  const icosahedronMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    wireframe: true,
    roughness: 0.1,
    metalness: 0.9
  });
  const icosahedron = new THREE.Mesh(icosahedronGeom, icosahedronMat);
  icosahedron.position.set(2.4, -1.5, -1.5);
  scene.add(icosahedron);

  // Octahedron
  const octahedronGeom = new THREE.OctahedronGeometry(0.6, 0);
  const octahedronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.95,
    flatShading: true
  });
  const octahedron = new THREE.Mesh(octahedronGeom, octahedronMat);
  octahedron.position.set(-1.8, -2, -2);
  scene.add(octahedron);

  // Dodecahedron
  const dodecahedronGeom = new THREE.DodecahedronGeometry(0.7, 0);
  const dodecahedronMat = new THREE.MeshStandardMaterial({
    color: 0x915eff,
    wireframe: true,
    roughness: 0.4,
    metalness: 0.2
  });
  const dodecahedron = new THREE.Mesh(dodecahedronGeom, dodecahedronMat);
  dodecahedron.position.set(1.8, 1.8, -2);
  scene.add(dodecahedron);

  // Particle System (Starfield)
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;      // X
    positions[i+1] = (Math.random() - 0.5) * 15;    // Y
    positions[i+2] = (Math.random() - 0.5) * 10 - 2; // Z (behind camera focus)
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const starField = new THREE.Points(particleGeom, particleMat);
  scene.add(starField);

  // Mouse Parallax & Light Positioning
  let mouseX = 0;
  let mouseY = 0;
  
  window.addEventListener("mousemove", (e) => {
    // Normalise to values between -0.5 and 0.5
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Responsive Layout Scaling for 3D Positions
  function adjust3DLayout() {
    const width = window.innerWidth;
    if (width <= 768) {
      // Stack geometries closer to center on smaller screens
      torusKnot.position.set(-1.2, 2.2, -2);
      icosahedron.position.set(1.2, -2.4, -2.5);
      octahedron.position.set(-0.8, -3.2, -3);
      dodecahedron.position.set(0.8, 3.2, -3);
    } else {
      // Reset desktop layout positions
      torusKnot.position.set(-2.2, 1.2, -1);
      icosahedron.position.set(2.4, -1.5, -1.5);
      octahedron.position.set(-1.8, -2, -2);
      dodecahedron.position.set(1.8, 1.8, -2);
    }
  }
  adjust3DLayout();

  // Resize Handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    adjust3DLayout();
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    const scrollY = window.scrollY;

    // Gentle floating animation (Sin/Cos)
    torusKnot.position.y += Math.sin(time * 1.5) * 0.002;
    icosahedron.position.y += Math.cos(time * 1.2) * 0.002;
    octahedron.position.y += Math.sin(time * 0.8) * 0.003;
    dodecahedron.position.y += Math.cos(time * 1.4) * 0.0025;

    // Slow rotation updated by time + scroll velocity
    torusKnot.rotation.x = time * 0.15 + scrollY * 0.001;
    torusKnot.rotation.y = time * 0.25 + scrollY * 0.0015;
    
    icosahedron.rotation.x = time * 0.12 - scrollY * 0.0008;
    icosahedron.rotation.y = time * 0.18 + scrollY * 0.0012;

    octahedron.rotation.x = time * 0.25 + scrollY * 0.002;
    octahedron.rotation.y = time * 0.15 - scrollY * 0.001;

    dodecahedron.rotation.x = time * 0.08 + scrollY * 0.0005;
    dodecahedron.rotation.y = time * 0.12 - scrollY * 0.0008;

    // Particles rotation
    starField.rotation.y = time * 0.02 + scrollY * 0.0001;
    starField.rotation.x = time * 0.01;

    // Mouse Lights Parallax (interpolate light to cursor)
    const targetPurpleX = mouseX * 8;
    const targetPurpleY = -mouseY * 8;
    purpleLight.position.x += (targetPurpleX - purpleLight.position.x) * 0.08;
    purpleLight.position.y += (targetPurpleY - purpleLight.position.y) * 0.08;

    const targetCyanX = -mouseX * 8;
    const targetCyanY = mouseY * 8;
    cyanLight.position.x += (targetCyanX - cyanLight.position.x) * 0.08;
    cyanLight.position.y += (targetCyanY - cyanLight.position.y) * 0.08;

    // Camera tilt parallax
    const targetCamX = mouseX * 1.5;
    const targetCamY = -mouseY * 1.5;
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -3);

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   5. GSAP SCROLL REVEALS & ANIMS
   ========================================================================== */
function initScrollAnimations() {
  // Reveal titles
  gsap.utils.toArray("h2.section-title").forEach(title => {
    gsap.from(title, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // Stagger reveal cards
  gsap.from("#about .about-image-container", {
    x: -80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#about",
      start: "top 75%"
    }
  });

  gsap.from("#about .about-desc", {
    x: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#about",
      start: "top 75%"
    }
  });

  // Stats numerical count-up
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute("data-target"), 10);
    const countObj = { value: 0 };
    
    gsap.to(countObj, {
      value: target,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%"
      },
      onUpdate: () => {
        stat.innerHTML = Math.floor(countObj.value) + "+";
      }
    });
  });

  // Skills Bar Fill Reveal
  gsap.fromTo(".skill-bar-fill", 
    { width: "0%" },
    {
      width: (index, target) => target.getAttribute("data-percent"),
      duration: 1.6,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#skills",
        start: "top 75%"
      }
    }
  );

  // Projects slide-up stagger
  gsap.from(".project-card", {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#projects",
      start: "top 75%"
    }
  });

  // Timeline items reveal
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, idx) => {
    const direction = idx % 2 === 0 ? -60 : 60;
    gsap.from(item, {
      x: direction,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%"
      }
    });
  });

  // Achievements scale-in stagger
  gsap.from(".achievement-card", {
    scale: 0.85,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: "#achievements",
      start: "top 80%"
    }
  });

  // Contact form & details reveal
  gsap.from(".contact-info", {
    x: -50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#contact",
      start: "top 80%"
    }
  });

  gsap.from("#contact .glass-card", {
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#contact",
      start: "top 80%"
    }
  });
}

/* ==========================================================================
   6. PREMIUM 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initProjectTilt() {
  const cards = document.querySelectorAll(".project-card");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // X mouse inside card
      const y = e.clientY - rect.top;  // Y mouse inside card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt value (-15 to 15 degrees max)
      const tiltX = -(y - centerY) / 8;
      const tiltY = (x - centerX) / 8;
      
      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        boxShadow: "0 25px 50px rgba(0, 229, 255, 0.15), 0 0 25px rgba(145, 94, 255, 0.4)",
        borderColor: "rgba(0, 229, 255, 0.45)",
        duration: 0.3,
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0 10px 30px rgba(0, 229, 255, 0.05), 0 0 20px rgba(145, 94, 255, 0.35)",
        borderColor: "rgba(145, 94, 255, 0.15)",
        duration: 0.5,
        ease: "power3.out"
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Clear previous classes
    status.className = "form-status";
    status.style.display = "block";
    status.innerText = "Transmitting message...";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.classList.add("error");
      status.innerText = "Please complete all fields before transmission.";
      return;
    }

    if (!validateEmail(email)) {
      status.classList.add("error");
      status.innerText = "Please input a valid email coordinate.";
      return;
    }

    // Simulate sending message
    setTimeout(() => {
      status.classList.add("success");
      status.innerText = "Transmission successful. I will connect with you shortly!";
      form.reset();

      // Clear input active classes
      const inputs = form.querySelectorAll(".form-input");
      inputs.forEach(input => {
        // Force blur
        input.blur();
      });

      // Clear status after 5s
      setTimeout(() => {
        gsap.to(status, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            status.style.display = "none";
            status.style.opacity = 1;
            status.innerText = "";
          }
        });
      }, 5000);

    }, 1800);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
