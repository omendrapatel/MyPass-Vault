/**
 * MyPass Vault — Interactive Live Showcase Engine
 * 1. Live 2FA TOTP Ticking Engine with SVG Circular Gauge & 1-Click Copy
 * 2. Interactive Decoy Duress Vault Morphing Switch
 * 3. Live Cryptographic Password Generator Tool
 * 4. FAQ Smooth Accordion
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. LIVE 2FA TOTP ENGINE (RFC 6238 Simulation)
       ========================================================================== */
    const totpCodes = {
        google: '849 201',
        github: '519 384',
        aws: '902 447',
        binance: '381 729'
    };

    let secondsLeft = 24;
    const totalSeconds = 30;
    const ringCircle = document.getElementById('totp-gauge-circle');
    const timerText = document.getElementById('totp-timer-sec');
    const totpDisplay = document.getElementById('totp-code-display');
    const activeServiceLabel = document.getElementById('totp-service-name');
    let currentService = 'google';

    // Calculate ring circumference (radius = 16) => 2 * PI * 16 ~ 100.53
    const circumference = 2 * Math.PI * 16;
    if (ringCircle) {
        ringCircle.style.strokeDasharray = circumference;
    }

    function generateRandom6Digits() {
        const n1 = Math.floor(100 + Math.random() * 900);
        const n2 = Math.floor(100 + Math.random() * 900);
        return n1 + ' ' + n2;
    }

    function updateTotpEngine() {
        secondsLeft--;
        if (secondsLeft < 0) {
            secondsLeft = 30;
            // Roll new codes for all services
            for (let key in totpCodes) {
                totpCodes[key] = generateRandom6Digits();
            }
            if (totpDisplay) {
                totpDisplay.classList.add('scale-105');
                setTimeout(() => totpDisplay.classList.remove('scale-105'), 200);
            }
        }

        if (timerText) {
            timerText.textContent = secondsLeft + 's';
        }

        if (ringCircle) {
            const offset = circumference - (secondsLeft / totalSeconds) * circumference;
            ringCircle.style.strokeDashoffset = offset;
            if (secondsLeft <= 5) {
                ringCircle.setAttribute('stroke', '#F43F5E'); // Alert rose in final 5 seconds
            } else {
                ringCircle.setAttribute('stroke', '#10B981'); // Emerald
            }
        }

        if (totpDisplay && totpCodes[currentService]) {
            totpDisplay.textContent = totpCodes[currentService];
        }
    }

    setInterval(updateTotpEngine, 1000);
    updateTotpEngine();

    // Service Selector Buttons
    window.selectTotpService = function (serviceKey, serviceName, el) {
        currentService = serviceKey;
        if (totpDisplay) totpDisplay.textContent = totpCodes[serviceKey] || generateRandom6Digits();
        if (activeServiceLabel) activeServiceLabel.textContent = serviceName;

        // Highlight selected tab
        document.querySelectorAll('.totp-tab-btn').forEach(btn => {
            btn.classList.remove('bg-white/10', 'border-indigo-500/50', 'text-white');
            btn.classList.add('bg-transparent', 'border-transparent', 'text-slate-400');
        });
        if (el) {
            el.classList.add('bg-white/10', 'border-indigo-500/50', 'text-white');
            el.classList.remove('bg-transparent', 'border-transparent', 'text-slate-400');
        }
    };

    // 1-Click Copy TOTP
    window.copyTotpCode = function (btnEl) {
        if (!totpDisplay) return;
        const code = totpDisplay.textContent.replace(/\s+/g, '');
        navigator.clipboard.writeText(code).then(() => {
            const originalHTML = btnEl.innerHTML;
            btnEl.innerHTML = '<i class="fas fa-check text-emerald-400"></i> Copied!';
            btnEl.classList.add('border-emerald-500/40', 'text-emerald-400');
            setTimeout(() => {
                btnEl.innerHTML = originalHTML;
                btnEl.classList.remove('border-emerald-500/40', 'text-emerald-400');
            }, 1800);
        });
    };

    /* ==========================================================================
       2. INTERACTIVE DECOY DURESS VAULT SWITCH
       ========================================================================== */
    window.setDecoyMode = function (isDecoy) {
        const realScreen = document.getElementById('vault-screen-real');
        const decoyScreen = document.getElementById('vault-screen-decoy');
        const toggleTrack = document.getElementById('decoy-toggle-track');
        const toggleThumb = document.getElementById('decoy-toggle-thumb');
        const statusBadge = document.getElementById('vault-status-indicator');

        if (!realScreen || !decoyScreen) return;

        if (isDecoy) {
            realScreen.classList.add('hidden');
            decoyScreen.classList.remove('hidden');
            if (toggleTrack) toggleTrack.classList.add('bg-rose-500/30', 'border-rose-500/50');
            if (toggleThumb) toggleThumb.style.transform = 'translateX(26px)';
            if (statusBadge) {
                statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span> Decoy Mode: Active (Duress PIN)';
                statusBadge.className = 'badge-pill text-rose-400 border-rose-500/30 bg-rose-500/10 text-[10px]';
            }
        } else {
            decoyScreen.classList.add('hidden');
            realScreen.classList.remove('hidden');
            if (toggleTrack) toggleTrack.classList.remove('bg-rose-500/30', 'border-rose-500/50');
            if (toggleThumb) toggleThumb.style.transform = 'translateX(0px)';
            if (statusBadge) {
                statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Master Vault: Authenticated';
                statusBadge.className = 'badge-pill emerald text-[10px]';
            }
        }
    };

    /* ==========================================================================
       3. LIVE CRYPTOGRAPHIC PASSWORD GENERATOR TOOL
       ========================================================================== */
    const lengthSlider = document.getElementById('pwd-length-slider');
    const lengthVal = document.getElementById('pwd-length-val');
    const pwdOutput = document.getElementById('pwd-output-text');
    const chkUpper = document.getElementById('pwd-chk-upper');
    const chkNum = document.getElementById('pwd-chk-numbers');
    const chkSym = document.getElementById('pwd-chk-symbols');
    const strengthBar = document.getElementById('pwd-strength-bar');
    const strengthLabel = document.getElementById('pwd-strength-label');

    const charsLower = 'abcdefghjkmnpqrstuvwxyz';
    const charsUpper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const charsNum = '23456789';
    const charsSym = '!@#$%^&*()-_=+[]{}<>';

    window.generatePassword = function () {
        if (!pwdOutput) return;
        const len = lengthSlider ? parseInt(lengthSlider.value, 10) : 20;
        let pool = charsLower;
        if (chkUpper && chkUpper.checked) pool += charsUpper;
        if (chkNum && chkNum.checked) pool += charsNum;
        if (chkSym && chkSym.checked) pool += charsSym;

        let password = '';
        const randomValues = new Uint32Array(len);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < len; i++) {
            password += pool[randomValues[i] % pool.length];
        }

        pwdOutput.value = password;

        // Entropy / Strength calculation
        const poolSize = pool.length;
        const entropy = Math.round(len * Math.log2(poolSize));

        if (strengthBar && strengthLabel) {
            if (entropy >= 110) {
                strengthBar.style.width = '100%';
                strengthBar.style.backgroundColor = '#10B981'; // Emerald
                strengthLabel.textContent = 'Cryptographically Unbreakable (' + entropy + '-bit entropy)';
                strengthLabel.style.color = '#34D399';
            } else if (entropy >= 75) {
                strengthBar.style.width = '75%';
                strengthBar.style.backgroundColor = '#0EA5E9'; // Cyan
                strengthLabel.textContent = 'Very Strong (' + entropy + '-bit entropy)';
                strengthLabel.style.color = '#38BDF8';
            } else {
                strengthBar.style.width = '45%';
                strengthBar.style.backgroundColor = '#F59E0B'; // Amber
                strengthLabel.textContent = 'Moderate (' + entropy + '-bit entropy)';
                strengthLabel.style.color = '#FBBF24';
            }
        }
    };

    if (lengthSlider) {
        lengthSlider.addEventListener('input', function () {
            if (lengthVal) lengthVal.textContent = this.value;
            window.generatePassword();
        });
    }

    [chkUpper, chkNum, chkSym].forEach(chk => {
        if (chk) chk.addEventListener('change', window.generatePassword);
    });

    window.copyGeneratedPassword = function (btnEl) {
        if (!pwdOutput) return;
        navigator.clipboard.writeText(pwdOutput.value).then(() => {
            const originalHTML = btnEl.innerHTML;
            btnEl.innerHTML = '<i class="fas fa-check text-emerald-400"></i> Copied!';
            setTimeout(() => {
                btnEl.innerHTML = originalHTML;
            }, 1800);
        });
    };

    // Initial password generation on page load
    setTimeout(window.generatePassword, 100);

    /* ==========================================================================
       4. FAQ ACCORDION ENGINE
       ========================================================================== */
    window.toggleFaq = function (btnEl) {
        const item = btnEl.closest('.faq-item');
        if (!item) return;
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        if (!content) return;

        const isExpanded = !content.classList.contains('hidden');
        if (isExpanded) {
            content.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            content.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    };

})();
