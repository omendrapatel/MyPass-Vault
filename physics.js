/**
 * MyPass Vault — 60fps 3D Physics & Liquid Glass Interactivity Engine
 * 1. Physics-based cursor-trailing 3D Tilt & Specular Glare (lerp ~0.11)
 * 2. Global Cursor Spotlight Aura
 * 3. Magnetic 3D Pull & Tilt on Buttons
 * 4. Interactive 3D Frosted Glass Padlock Visual (Three.js)
 */

(function () {
    'use strict';

    // Helper: Standard linear interpolation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Touch device detection: disable mouse hover physics on touch devices
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    /* ==========================================================================
       1. GLOBAL CURSOR SPOTLIGHT AURA
       ========================================================================== */
    const spotlight = document.getElementById('cursor-spotlight-aura');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let spotCurrentX = mouseX;
    let spotCurrentY = mouseY;
    let isMouseActive = false;

    if (spotlight && !isTouchDevice) {
        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMouseActive) {
                isMouseActive = true;
                spotlight.style.opacity = '1';
            }
        }, { passive: true });

        window.addEventListener('mouseleave', function () {
            if (spotlight) spotlight.style.opacity = '0';
            isMouseActive = false;
        });
    }

    /* ==========================================================================
       2. PHYSICS-BASED CURSOR-TRAILING 3D TILT & SPECULAR GLARE ENGINE
       ========================================================================== */
    const cardElements = document.querySelectorAll('.bg-brand-card, .bg-brand-surface');
    const tiltCards = [];

    if (!isTouchDevice && cardElements.length > 0) {
        cardElements.forEach(function (card) {
            // Ensure card has relative positioning
            const computedStyle = window.getComputedStyle(card);
            if (computedStyle.position === 'static') {
                card.style.position = 'relative';
            }

            // Create and append specular glare element
            let glare = card.querySelector('.card-specular-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-specular-glare';
                card.appendChild(glare);
            }

            const state = {
                el: card,
                glareEl: glare,
                // Current animated values (lerped)
                currRotX: 0,
                currRotY: 0,
                currTransZ: 0,
                currGlareX: 50,
                currGlareY: 50,
                currGlareOpacity: 0,
                // Target values
                targetRotX: 0,
                targetRotY: 0,
                targetTransZ: 0,
                targetGlareX: 50,
                targetGlareY: 50,
                targetGlareOpacity: 0,
                isHovered: false
            };

            card.addEventListener('mouseenter', function () {
                state.isHovered = true;
                state.targetTransZ = 12;
                state.targetGlareOpacity = 0.85;
            });

            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max tilt angle: ±12 degrees
                const rotY = ((offsetX - centerX) / centerX) * 12;
                const rotX = -((offsetY - centerY) / centerY) * 12;

                state.targetRotX = rotX;
                state.targetRotY = rotY;
                state.targetTransZ = 14;

                // Glare percentage
                state.targetGlareX = (offsetX / rect.width) * 100;
                state.targetGlareY = (offsetY / rect.height) * 100;
                state.targetGlareOpacity = 0.85;
            }, { passive: true });

            card.addEventListener('mouseleave', function () {
                state.isHovered = false;
                state.targetRotX = 0;
                state.targetRotY = 0;
                state.targetTransZ = 0;
                state.targetGlareOpacity = 0;
            });

            tiltCards.push(state);
        });
    }

    /* ==========================================================================
       3. MAGNETIC 3D PULL & TILT ON BUTTONS
       ========================================================================== */
    const buttonElements = document.querySelectorAll('a[href="#download"], a.bg-gradient-to-r, a.bg-brand, .magnetic-btn');
    const magneticButtons = [];

    if (!isTouchDevice && buttonElements.length > 0) {
        buttonElements.forEach(function (btn) {
            btn.classList.add('magnetic-btn');
            const bState = {
                el: btn,
                currX: 0,
                currY: 0,
                currScale: 1,
                targetX: 0,
                targetY: 0,
                targetScale: 1,
                isHovered: false
            };

            btn.addEventListener('mouseenter', function () {
                bState.isHovered = true;
                bState.targetScale = 1.03;
            });

            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                // Pull offset capped at ±8px
                bState.targetX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.28));
                bState.targetY = Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.28));
            }, { passive: true });

            btn.addEventListener('mouseleave', function () {
                bState.isHovered = false;
                bState.targetX = 0;
                bState.targetY = 0;
                bState.targetScale = 1;
            });

            magneticButtons.push(bState);
        });
    }

    /* ==========================================================================
       MAIN 60FPS PHYSICS RENDER LOOP
       ========================================================================== */
    const LERP_FACTOR = 0.11; // requested lerp inertia ~0.11
    const SPOT_LERP = 0.09;
    const BTN_LERP = 0.12;

    function renderPhysics() {
        // 1. Update Global Cursor Spotlight
        if (spotlight && isMouseActive) {
            spotCurrentX = lerp(spotCurrentX, mouseX, SPOT_LERP);
            spotCurrentY = lerp(spotCurrentY, mouseY, SPOT_LERP);
            spotlight.style.transform = 'translate3d(' + spotCurrentX.toFixed(1) + 'px, ' + spotCurrentY.toFixed(1) + 'px, 0)';
        }

        // 2. Update Card 3D Tilts with Inertia
        for (let i = 0; i < tiltCards.length; i++) {
            const card = tiltCards[i];
            card.currRotX = lerp(card.currRotX, card.targetRotX, LERP_FACTOR);
            card.currRotY = lerp(card.currRotY, card.targetRotY, LERP_FACTOR);
            card.currTransZ = lerp(card.currTransZ, card.targetTransZ, LERP_FACTOR);
            card.currGlareX = lerp(card.currGlareX, card.targetGlareX, LERP_FACTOR);
            card.currGlareY = lerp(card.currGlareY, card.targetGlareY, LERP_FACTOR);
            card.currGlareOpacity = lerp(card.currGlareOpacity, card.targetGlareOpacity, LERP_FACTOR);

            // Apply 3D perspective transform
            card.el.style.transform = 'perspective(1000px) rotateX(' + card.currRotX.toFixed(2) + 'deg) rotateY(' + card.currRotY.toFixed(2) + 'deg) translateZ(' + card.currTransZ.toFixed(2) + 'px)';

            // Update internal specular glare
            if (card.glareEl) {
                card.glareEl.style.background = 'radial-gradient(circle at ' + card.currGlareX.toFixed(1) + '% ' + card.currGlareY.toFixed(1) + '%, rgba(255, 255, 255, 0.22) 0%, rgba(0, 210, 211, 0.12) 28%, transparent 68%)';
                card.glareEl.style.opacity = card.currGlareOpacity.toFixed(3);
            }
        }

        // 3. Update Magnetic Buttons
        for (let j = 0; j < magneticButtons.length; j++) {
            const btn = magneticButtons[j];
            btn.currX = lerp(btn.currX, btn.targetX, BTN_LERP);
            btn.currY = lerp(btn.currY, btn.targetY, BTN_LERP);
            btn.currScale = lerp(btn.currScale, btn.targetScale, BTN_LERP);
            btn.el.style.transform = 'translate3d(' + btn.currX.toFixed(2) + 'px, ' + btn.currY.toFixed(2) + 'px, 0) scale(' + btn.currScale.toFixed(3) + ')';
        }

        requestAnimationFrame(renderPhysics);
    }

    if (!isTouchDevice) {
        requestAnimationFrame(renderPhysics);
    }

    /* ==========================================================================
       4. INTERACTIVE 3D FROSTED GLASS PADLOCK VISUAL (THREE.JS)
       ========================================================================== */
    function initThreePadlock() {
        const container = document.getElementById('hero-padlock-container');
        const canvas = document.getElementById('padlock-canvas');
        if (!container || !canvas || typeof THREE === 'undefined') return;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const initialWidth = container.clientWidth || 280;
        const initialHeight = container.clientHeight || 210;

        const camera = new THREE.PerspectiveCamera(40, initialWidth / initialHeight, 0.1, 100);
        camera.position.set(0, 0, 4.6);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(initialWidth, initialHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

        // Master Group for Padlock
        const padlockGroup = new THREE.Group();
        scene.add(padlockGroup);

        // --- Materials ---
        // Frosted Liquid Glass Body
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8F82FF, // Brand light
            metalness: 0.04,
            roughness: 0.18, // Frosted liquid glass
            transmission: 0.92, // Glass refraction
            thickness: 1.2,
            ior: 1.52, // Standard glass IOR
            reflectivity: 0.85,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.94
        });

        // Semi-translucent Shackle
        const shackleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xE0E7FF,
            metalness: 0.82,
            roughness: 0.16,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            transmission: 0.3,
            transparent: true,
            opacity: 0.96
        });

        // Glowing Inner Security Core (Matches existing Accent #00D2D3)
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x00D2D3,
            emissive: 0x00D2D3,
            emissiveIntensity: 2.2,
            roughness: 0.12,
            metalness: 0.4
        });

        // --- Geometries ---
        // 1. Padlock Body
        const bodyGeom = new THREE.BoxGeometry(1.65, 1.4, 0.72, 4, 4, 4);
        const bodyMesh = new THREE.Mesh(bodyGeom, glassMaterial);
        bodyMesh.position.set(0, -0.18, 0);
        padlockGroup.add(bodyMesh);

        // 2. Padlock Shackle
        const shackleGroup = new THREE.Group();
        // Top U-arch
        const archGeom = new THREE.TorusGeometry(0.5, 0.13, 24, 48, Math.PI);
        const archMesh = new THREE.Mesh(archGeom, shackleMaterial);
        archMesh.position.set(0, 0.54, 0);
        shackleGroup.add(archMesh);

        // Left vertical leg
        const legGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.62, 24);
        const leftLeg = new THREE.Mesh(legGeom, shackleMaterial);
        leftLeg.position.set(-0.5, 0.23, 0);
        shackleGroup.add(leftLeg);

        // Right vertical leg
        const rightLeg = new THREE.Mesh(legGeom, shackleMaterial);
        rightLeg.position.set(0.5, 0.23, 0);
        shackleGroup.add(rightLeg);

        padlockGroup.add(shackleGroup);

        // 3. Inner Glowing Core
        const coreGeom = new THREE.OctahedronGeometry(0.32, 1);
        const coreMesh = new THREE.Mesh(coreGeom, coreMaterial);
        coreMesh.position.set(0, -0.18, 0);
        padlockGroup.add(coreMesh);

        // Inner Point Light
        const innerLight = new THREE.PointLight(0x00D2D3, 3.6, 5);
        innerLight.position.set(0, -0.18, 0);
        padlockGroup.add(innerLight);

        // 4. Subtle Keyhole Detail
        const keyholeGroup = new THREE.Group();
        const khCircleGeom = new THREE.CircleGeometry(0.1, 24);
        const khSlotGeom = new THREE.PlaneGeometry(0.08, 0.2);
        const khMat = new THREE.MeshBasicMaterial({ color: 0x0A0E21 });
        const khCircle = new THREE.Mesh(khCircleGeom, khMat);
        const khSlot = new THREE.Mesh(khSlotGeom, khMat);
        khSlot.position.set(0, -0.09, 0);
        keyholeGroup.add(khCircle);
        keyholeGroup.add(khSlot);
        keyholeGroup.position.set(0, -0.15, 0.37);
        padlockGroup.add(keyholeGroup);

        // 5. Orbiting Cyber Rings
        const ringGeom1 = new THREE.TorusGeometry(1.22, 0.014, 16, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00D2D3, transparent: true, opacity: 0.55 });
        const ringMesh1 = new THREE.Mesh(ringGeom1, ringMat1);
        ringMesh1.rotation.x = Math.PI / 3;
        padlockGroup.add(ringMesh1);

        const ringGeom2 = new THREE.TorusGeometry(1.36, 0.014, 16, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8F82FF, transparent: true, opacity: 0.45 });
        const ringMesh2 = new THREE.Mesh(ringGeom2, ringMat2);
        ringMesh2.rotation.y = Math.PI / 3.2;
        padlockGroup.add(ringMesh2);

        // 6. Glowing Particle Cloud
        const particleCount = 36;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let p = 0; p < particleCount * 3; p += 3) {
            particlePositions[p] = (Math.random() - 0.5) * 3.0;
            particlePositions[p + 1] = (Math.random() - 0.5) * 3.0;
            particlePositions[p + 2] = (Math.random() - 0.5) * 2.2;
        }
        const particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.045,
            color: 0x00D2D3,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });
        const particlePoints = new THREE.Points(particleGeom, particleMat);
        padlockGroup.add(particlePoints);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0x6C5CE7, 1.25);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
        keyLight.position.set(3, 4, 3);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0x00D2D3, 2.6);
        rimLight.position.set(-3, -2, -3);
        scene.add(rimLight);

        const topSpecular = new THREE.PointLight(0x8F82FF, 1.6, 8);
        topSpecular.position.set(0, 3, 2.5);
        scene.add(topSpecular);

        // --- Interaction State ---
        let isDragging = false;
        let prevPointerX = 0;
        let prevPointerY = 0;
        let dragVelX = 0;
        let dragVelY = 0;
        let userRotX = 0;
        let userRotY = 0;

        let targetParallaxX = 0;
        let targetParallaxY = 0;
        let currParallaxX = 0;
        let currParallaxY = 0;

        // Mouse Parallax across the Hero
        const heroSection = container.closest('section') || document.body;
        heroSection.addEventListener('mousemove', function (e) {
            const rect = heroSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            targetParallaxX = relX * 0.45;
            targetParallaxY = relY * 0.45;
        }, { passive: true });

        // Click / Touch Drag Interaction on the 3D Container
        container.addEventListener('pointerdown', function (e) {
            isDragging = true;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
            dragVelX = 0;
            dragVelY = 0;
            try {
                container.setPointerCapture(e.pointerId);
            } catch (err) {}
        });

        container.addEventListener('pointermove', function (e) {
            if (!isDragging) return;
            const deltaX = e.clientX - prevPointerX;
            const deltaY = e.clientY - prevPointerY;
            dragVelX = deltaX * 0.009;
            dragVelY = deltaY * 0.009;
            userRotY += dragVelX;
            userRotX += dragVelY;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
        });

        function endDrag(e) {
            if (!isDragging) return;
            isDragging = false;
            try {
                if (e && e.pointerId) container.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }

        container.addEventListener('pointerup', endDrag);
        container.addEventListener('pointercancel', endDrag);

        // Responsive Resize
        function handleResize() {
            const w = container.clientWidth || 280;
            const h = container.clientHeight || 210;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', handleResize, { passive: true });

        // --- Padlock Animation Loop ---
        const clock = new THREE.Clock();

        function animatePadlock() {
            requestAnimationFrame(animatePadlock);
            const elapsed = clock.getElapsedTime();

            // Idle floating motion
            padlockGroup.position.y = Math.sin(elapsed * 1.6) * 0.09;

            // Inner core rotation & glowing pulse
            coreMesh.rotation.y += 0.025;
            coreMesh.rotation.x += 0.015;
            const corePulse = 3.2 + Math.sin(elapsed * 3.2) * 0.8;
            innerLight.intensity = corePulse;
            coreMaterial.emissiveIntensity = corePulse * 0.65;

            // Orbit rings animation
            ringMesh1.rotation.z += 0.007;
            ringMesh2.rotation.z -= 0.005;
            particlePoints.rotation.y += 0.0025;

            // Inertia & drag momentum decay
            if (!isDragging) {
                userRotY += dragVelX;
                userRotX += dragVelY;
                dragVelX *= 0.94; // friction
                dragVelY *= 0.94;
                // Idle gentle auto-spin
                userRotY += 0.0035;
            }

            // Clamp vertical rotation
            userRotX = Math.max(-0.6, Math.min(0.6, userRotX));

            // Smooth parallax interpolation
            currParallaxX = lerp(currParallaxX, targetParallaxX, 0.08);
            currParallaxY = lerp(currParallaxY, targetParallaxY, 0.08);

            padlockGroup.rotation.y = userRotY + currParallaxX;
            padlockGroup.rotation.x = userRotX + currParallaxY;

            renderer.render(scene, camera);
        }

        animatePadlock();
    }

    // Initialize when DOM and Three.js are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThreePadlock);
    } else {
        initThreePadlock();
    }
})();
