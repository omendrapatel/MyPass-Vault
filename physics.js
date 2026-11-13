/**
 * MyPass Vault — Stealth Obsidian 2026 Engine
 * 1. 60fps Lerp-Inertia Physics-Based Tilt (lerp ~0.11)
 * 2. High-Precision Specular Glare (Polished Obsidian Catch)
 * 3. Minimalist Ambient Cursor Spotlight
 * 4. Three.js 3D Smoked Obsidian & Titanium Padlock Visual
 */

(function () {
    'use strict';

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

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
       2. PRECISION 3D TILT & SPECULAR GLARE ENGINE
       ========================================================================== */
    const cardElements = document.querySelectorAll('.bg-brand-card, .bg-brand-surface');
    const tiltCards = [];

    if (!isTouchDevice && cardElements.length > 0) {
        cardElements.forEach(function (card) {
            const computedStyle = window.getComputedStyle(card);
            if (computedStyle.position === 'static') {
                card.style.position = 'relative';
            }

            let glare = card.querySelector('.card-specular-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-specular-glare';
                card.appendChild(glare);
            }

            const state = {
                el: card,
                glareEl: glare,
                currRotX: 0,
                currRotY: 0,
                currTransZ: 0,
                currGlareX: 50,
                currGlareY: 50,
                currGlareOpacity: 0,
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
                state.targetTransZ = 8;
                state.targetGlareOpacity = 0.7;
            });

            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Subtle, elegant tilt: max ±8 degrees (not extreme)
                const rotY = ((offsetX - centerX) / centerX) * 8;
                const rotX = -((offsetY - centerY) / centerY) * 8;

                state.targetRotX = rotX;
                state.targetRotY = rotY;
                state.targetTransZ = 10;

                state.targetGlareX = (offsetX / rect.width) * 100;
                state.targetGlareY = (offsetY / rect.height) * 100;
                state.targetGlareOpacity = 0.75;
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
       3. MAGNETIC BUTTON PULL
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
                bState.targetScale = 1.025;
            });

            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                bState.targetX = Math.max(-6, Math.min(6, (e.clientX - centerX) * 0.22));
                bState.targetY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.22));
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
    const LERP_FACTOR = 0.11;
    const SPOT_LERP = 0.09;
    const BTN_LERP = 0.12;

    function renderPhysics() {
        if (spotlight && isMouseActive) {
            spotCurrentX = lerp(spotCurrentX, mouseX, SPOT_LERP);
            spotCurrentY = lerp(spotCurrentY, mouseY, SPOT_LERP);
            spotlight.style.transform = 'translate3d(' + spotCurrentX.toFixed(1) + 'px, ' + spotCurrentY.toFixed(1) + 'px, 0)';
        }

        for (let i = 0; i < tiltCards.length; i++) {
            const card = tiltCards[i];
            card.currRotX = lerp(card.currRotX, card.targetRotX, LERP_FACTOR);
            card.currRotY = lerp(card.currRotY, card.targetRotY, LERP_FACTOR);
            card.currTransZ = lerp(card.currTransZ, card.targetTransZ, LERP_FACTOR);
            card.currGlareX = lerp(card.currGlareX, card.targetGlareX, LERP_FACTOR);
            card.currGlareY = lerp(card.currGlareY, card.targetGlareY, LERP_FACTOR);
            card.currGlareOpacity = lerp(card.currGlareOpacity, card.targetGlareOpacity, LERP_FACTOR);

            card.el.style.transform = 'perspective(1000px) rotateX(' + card.currRotX.toFixed(2) + 'deg) rotateY(' + card.currRotY.toFixed(2) + 'deg) translateZ(' + card.currTransZ.toFixed(2) + 'px)';

            if (card.glareEl) {
                // Polished dark metallic sheen (subtle white reflection)
                card.glareEl.style.background = 'radial-gradient(circle at ' + card.currGlareX.toFixed(1) + '% ' + card.currGlareY.toFixed(1) + '%, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.02) 28%, transparent 68%)';
                card.glareEl.style.opacity = card.currGlareOpacity.toFixed(3);
            }
        }

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
       4. INTERACTIVE 3D SMOKED OBSIDIAN & TITANIUM PADLOCK (THREE.JS)
       ========================================================================== */
    function initThreePadlock() {
        const container = document.getElementById('hero-padlock-container');
        const canvas = document.getElementById('padlock-canvas');
        if (!container || !canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const initialWidth = container.clientWidth || 280;
        const initialHeight = container.clientHeight || 210;

        const camera = new THREE.PerspectiveCamera(38, initialWidth / initialHeight, 0.1, 100);
        camera.position.set(0, 0, 4.8);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(initialWidth, initialHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const padlockGroup = new THREE.Group();
        scene.add(padlockGroup);

        // --- Materials: Smoked Obsidian & Brushed Aerospace Titanium ---
        const smokedObsidianMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1A1D27, // Smoked dark obsidian
            metalness: 0.2,
            roughness: 0.12, // Polished crystalline surface
            transmission: 0.72, // Elegant dark translucent refraction
            thickness: 1.1,
            ior: 1.54,
            reflectivity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.96
        });

        const titaniumShackleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xF8FAFC, // Clean aerospace silver chrome
            metalness: 0.95,
            roughness: 0.08,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04
        });

        // Cryptographic Emerald Core (Swiss-bank security feel)
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981,
            emissive: 0x10B981,
            emissiveIntensity: 2.4,
            roughness: 0.1,
            metalness: 0.5
        });

        // --- Geometries ---
        // 1. Padlock Body
        const bodyGeom = new THREE.BoxGeometry(1.65, 1.4, 0.72, 4, 4, 4);
        const bodyMesh = new THREE.Mesh(bodyGeom, smokedObsidianMaterial);
        bodyMesh.position.set(0, -0.18, 0);
        padlockGroup.add(bodyMesh);

        // 2. Titanium Shackle
        const shackleGroup = new THREE.Group();
        const archGeom = new THREE.TorusGeometry(0.5, 0.125, 24, 48, Math.PI);
        const archMesh = new THREE.Mesh(archGeom, titaniumShackleMaterial);
        archMesh.position.set(0, 0.54, 0);
        shackleGroup.add(archMesh);

        const legGeom = new THREE.CylinderGeometry(0.125, 0.125, 0.62, 24);
        const leftLeg = new THREE.Mesh(legGeom, titaniumShackleMaterial);
        leftLeg.position.set(-0.5, 0.23, 0);
        shackleGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeom, titaniumShackleMaterial);
        rightLeg.position.set(0.5, 0.23, 0);
        shackleGroup.add(rightLeg);

        padlockGroup.add(shackleGroup);

        // 3. Cryptographic Core
        const coreGeom = new THREE.OctahedronGeometry(0.32, 1);
        const coreMesh = new THREE.Mesh(coreGeom, coreMaterial);
        coreMesh.position.set(0, -0.18, 0);
        padlockGroup.add(coreMesh);

        const innerLight = new THREE.PointLight(0x10B981, 3.8, 5);
        innerLight.position.set(0, -0.18, 0);
        padlockGroup.add(innerLight);

        // 4. Precision Keyhole
        const keyholeGroup = new THREE.Group();
        const khCircleGeom = new THREE.CircleGeometry(0.09, 24);
        const khSlotGeom = new THREE.PlaneGeometry(0.07, 0.18);
        const khMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
        const khCircle = new THREE.Mesh(khCircleGeom, khMat);
        const khSlot = new THREE.Mesh(khSlotGeom, khMat);
        khSlot.position.set(0, -0.08, 0);
        keyholeGroup.add(khCircle);
        keyholeGroup.add(khSlot);
        keyholeGroup.position.set(0, -0.15, 0.37);
        padlockGroup.add(keyholeGroup);

        // 5. Subtle Titanium Orbit Ring
        const ringGeom1 = new THREE.TorusGeometry(1.22, 0.012, 16, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.35 });
        const ringMesh1 = new THREE.Mesh(ringGeom1, ringMat1);
        ringMesh1.rotation.x = Math.PI / 3;
        padlockGroup.add(ringMesh1);

        // 6. Subdued Cyber Dust
        const particleCount = 28;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let p = 0; p < particleCount * 3; p += 3) {
            particlePositions[p] = (Math.random() - 0.5) * 2.8;
            particlePositions[p + 1] = (Math.random() - 0.5) * 2.8;
            particlePositions[p + 2] = (Math.random() - 0.5) * 2.0;
        }
        const particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.035,
            color: 0x38BDF8,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
        });
        const particlePoints = new THREE.Points(particleGeom, particleMat);
        padlockGroup.add(particlePoints);

        // --- Studio Lighting ---
        const ambientLight = new THREE.AmbientLight(0x1E2230, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.4);
        keyLight.position.set(3, 4, 3);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0x38BDF8, 1.8);
        rimLight.position.set(-3, -2, -3);
        scene.add(rimLight);

        const topSpecular = new THREE.PointLight(0xFFFFFF, 1.4, 8);
        topSpecular.position.set(0, 3, 2.5);
        scene.add(topSpecular);

        // --- Interaction ---
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

        const heroSection = container.closest('section') || document.body;
        heroSection.addEventListener('mousemove', function (e) {
            const rect = heroSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            targetParallaxX = relX * 0.35;
            targetParallaxY = relY * 0.35;
        }, { passive: true });

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
            dragVelX = deltaX * 0.008;
            dragVelY = deltaY * 0.008;
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

        function handleResize() {
            const w = container.clientWidth || 280;
            const h = container.clientHeight || 210;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', handleResize, { passive: true });

        const clock = new THREE.Clock();

        function animatePadlock() {
            requestAnimationFrame(animatePadlock);
            const elapsed = clock.getElapsedTime();

            padlockGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

            coreMesh.rotation.y += 0.02;
            coreMesh.rotation.x += 0.012;
            const corePulse = 3.2 + Math.sin(elapsed * 3) * 0.7;
            innerLight.intensity = corePulse;
            coreMaterial.emissiveIntensity = corePulse * 0.6;

            ringMesh1.rotation.z += 0.006;
            particlePoints.rotation.y += 0.002;

            if (!isDragging) {
                userRotY += dragVelX;
                userRotX += dragVelY;
                dragVelX *= 0.94;
                dragVelY *= 0.94;
                userRotY += 0.003;
            }

            userRotX = Math.max(-0.55, Math.min(0.55, userRotX));

            currParallaxX = lerp(currParallaxX, targetParallaxX, 0.08);
            currParallaxY = lerp(currParallaxY, targetParallaxY, 0.08);

            padlockGroup.rotation.y = userRotY + currParallaxX;
            padlockGroup.rotation.x = userRotX + currParallaxY;

            renderer.render(scene, camera);
        }

        animatePadlock();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThreePadlock);
    } else {
        initThreePadlock();
    }
})();
