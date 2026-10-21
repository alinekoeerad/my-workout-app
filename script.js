/**
 * SMART COACH - V8.5 (Bespoke Minimalist Athletic Engine)
 * Pure Architectural Logic, Tactile Tiles, Weight Tracker, Haptics & Service Worker
 */

// --- 1. GLOBAL STATE ---
const state = {
    workouts: null,
    currentView: 'workout',
    currentParam: 'day1',
    apiKey: localStorage.getItem('gemini_api_key') || "",
    audioCtx: null,
    timer: null,
    isTimerRunning: false,
    restTimer: null,
    restTimeRemaining: 0,
    loggedWeights: JSON.parse(localStorage.getItem('workout_weights') || '{}'),
    
    // Cloud API & Auth System
    gasUrl: "https://script.google.com/macros/s/AKfycbwsBVIb8nIiGvVEp4pRh1_HWDwSNOd5ae-fYzmkWqi64X7iaEVjzuRi3o1G_0lT3jZFSg/exec",
    currentUser: JSON.parse(localStorage.getItem('user_auth')) || null
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    app.initTheme(); 
    createRestWidgetDOM();
    registerServiceWorker();

    // Enable Web Audio on first user interaction
    const unlockAudio = () => {
        initAudio();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Load workout database if user is logged in
    if (state.currentUser) {
        await loadDatabase();
    }

    // Hash routing listener for Back/Forward buttons and deep links
    window.addEventListener('hashchange', () => {
        app.handleRoute();
    });

    // Initial Route Handling
    if (!state.currentUser) {
        window.location.hash = '#login';
        app.loadView('login');
    } else {
        if (!window.location.hash || window.location.hash === '#login') {
            const firstDay = (state.workouts && Object.keys(state.workouts)[0]) || 'day1';
            window.location.hash = `#workout/${firstDay}`;
        }
        app.handleRoute();
    }
});

// PWA Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((reg) => console.log('✅ ServiceWorker Active:', reg.scope))
                .catch((err) => console.warn('⚠️ ServiceWorker note:', err));
        });
    }
}

// Create Swiss Stopwatch Rest Widget
function createRestWidgetDOM() {
    if (document.getElementById('restWidget')) return;
    const widget = document.createElement('div');
    widget.id = 'restWidget';
    widget.className = 'rest-widget';
    widget.innerHTML = `
        <div class="rest-time-display" id="restTimeDisplay">00:00</div>
        <div class="rest-btn-group">
            <button type="button" class="rest-adj-btn" onclick="app.adjustRestTime(-15)" title="کاهش ۱۵ ثانیه">-15s</button>
            <button type="button" class="rest-adj-btn" onclick="app.adjustRestTime(30)" title="افزایش ۳۰ ثانیه">+30s</button>
        </div>
        <button type="button" class="rest-skip-btn" onclick="app.skipRest()">رد کردن ⏭</button>
    `;
    document.body.appendChild(widget);
}

// Dynamically load workouts based on User's Assigned Program or Default
async function loadDatabase() {
    try {
        const programName = state.currentUser?.assignedProgram || 'workouts';
        let res = await fetch(`./data/${programName}.json`);
        if (!res.ok && programName !== 'workouts') {
            res = await fetch('./data/workouts.json');
        }
        if (res.ok) {
            const data = await res.json();
            state.workouts = data.days;
            console.log(`✅ Loaded Program: ${programName}.json`);
            app.renderWorkoutNav();
            return true;
        } else {
            console.error("برنامه تمرینی اختصاصی این کاربر یافت نشد.");
        }
    } catch (error) {
        console.error("Database load error, trying fallback:", error);
        try {
            const fallbackRes = await fetch('./data/workouts.json');
            if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                state.workouts = data.days;
                app.renderWorkoutNav();
                return true;
            }
        } catch(e) {}
    }
    return false;
}

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- 3. APP ROUTER & CORE LOGIC ---
const app = {
    navigateTo: (viewName, param = null) => {
        if (state.isTimerRunning) {
            alert('لطفاً ابتدا تایمر فعال حرکت را متوقف کنید!');
            return;
        }
        const targetHash = param ? `#${viewName}/${param}` : `#${viewName}`;
        if (window.location.hash === targetHash) {
            app.loadView(viewName, param);
        } else {
            window.location.hash = targetHash;
        }
    },

    handleRoute: async () => {
        const rawHash = window.location.hash.replace(/^#/, '').trim();
        if (!rawHash) {
            if (!state.currentUser) {
                window.location.hash = '#login';
                return;
            }
            const firstDay = (state.workouts && Object.keys(state.workouts)[0]) || 'day1';
            window.location.hash = `#workout/${firstDay}`;
            return;
        }

        const parts = rawHash.split('/');
        const view = parts[0];
        let param = parts[1] || null;

        if (!state.currentUser && view !== 'login') {
            window.location.hash = '#login';
            return;
        }
        if (state.currentUser && view === 'login') {
            window.location.hash = '#profile';
            return;
        }

        if (view === 'workout' && !param && state.workouts) {
            param = Object.keys(state.workouts)[0] || 'day1';
        }

        await app.loadView(view, param);
    },

    renderWorkoutNav: () => {
        const container = document.getElementById('dynamic-workout-days');
        if (!container || !state.workouts) return;

        let html = '';
        const dayKeys = Object.keys(state.workouts);
        dayKeys.forEach((key, index) => {
            const day = state.workouts[key];
            const label = `روز ${index + 1}`;
            html += `<button type="button" class="nav-tab" id="nav-btn-${key}" onclick="app.navigateTo('workout', '${key}')" title="${escapeHtml(day.title || label)}">${label}</button>`;
        });
        container.innerHTML = html;
        app.updateActiveNav();
    },

    updateActiveNav: () => {
        document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
        if (state.currentView === 'workout' && state.currentParam) {
            const activeDayBtn = document.getElementById(`nav-btn-${state.currentParam}`);
            if (activeDayBtn) activeDayBtn.classList.add('active');
        } else if (state.currentView) {
            const activeBtn = document.getElementById(`nav-btn-${state.currentView}`);
            if (activeBtn) activeBtn.classList.add('active');
        }
    },

    loadView: async (viewName, param = null) => {
        if (state.isTimerRunning) return alert('لطفاً ابتدا تایمر فعال حرکت را متوقف کنید!');
        app.skipRest();
        app.closeAllModals();
        
        if (!state.currentUser && viewName !== 'login') {
            return app.navigateTo('login');
        }
        if (state.currentUser && viewName === 'login') {
            return app.navigateTo('profile');
        }

        state.currentView = viewName;
        state.currentParam = param;
        
        const nav = document.getElementById('main-nav');
        if (nav) nav.style.display = (viewName === 'login') ? 'none' : 'block';

        const container = document.getElementById('app-container');
        container.innerHTML = `<div style="text-align:center; margin-top:50px; color:var(--text-secondary); font-size:0.88rem;">
            در حال بارگذاری...
        </div>`;

        try {
            const response = await fetch(`./views/${viewName}.html`);
            if (!response.ok) throw new Error(`View file ${viewName}.html not found`);
            const html = await response.text();
            
            container.innerHTML = html;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (viewName === 'workout') {
                if (!state.workouts) await loadDatabase();
                app.setupWorkoutView(param);
            } else if (viewName === 'profile') {
                app.setupProfileView();
            } else if (viewName === 'assessment') {
                app.setupAssessmentView();
            }

            app.updateActiveNav();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<h3 style="color:#ef4444; text-align:center; margin-top:50px; font-size:0.95rem;">
                خطا در بارگذاری صفحه. لطفاً اتصال اینترنت را بررسی کنید.
            </h3>`;
        }
    },

    // --- 4. AUTHENTICATION & API ---
    signup: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "در حال ثبت‌نام...";
        btn.disabled = true;

        const formData = new FormData(e.target);
        const fullName = (formData.get('fullName') || '').trim();
        const phone = (formData.get('phone') || '').trim();
        const password = (formData.get('password') || '').trim();

        try {
            const res = await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "register", phone, fullName, password })
            });
            const result = await res.json();
            
            if (result.status === "success") {
                alert("ثبت‌نام موفق! حالا می‌توانید وارد حساب خود شوید.");
                app.toggleAuth('login');
            } else {
                alert("خطا: " + result.message);
            }
        } catch(err) {
            alert("خطا در ارتباط با سرور ابری!");
        }
        btn.innerText = origText;
        btn.disabled = false;
    },

    login: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "در حال ورود...";
        btn.disabled = true;

        const formData = new FormData(e.target);
        const phone = (formData.get('phone') || '').trim();
        const password = (formData.get('password') || '').trim();

        try {
            const res = await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "login", phone, password })
            });
            const result = await res.json();
            
            if (result.status === "success") {
                state.currentUser = result.user;
                localStorage.setItem('user_auth', JSON.stringify(result.user));
                await loadDatabase();
                app.navigateTo('workout');
            } else {
                alert("خطا: " + result.message);
            }
        } catch(err) {
            alert("خطا در ارتباط با سرور ابری! در صورت عدم دسترسی به اینترنت، اتصال را بررسی کنید.");
        }
        btn.innerText = origText;
        btn.disabled = false;
    },

    logout: () => {
        localStorage.removeItem('user_auth');
        state.currentUser = null;
        state.workouts = null;
        app.navigateTo('login');
    },

    submitAssessment: async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const answers = Object.fromEntries(formData.entries());
        localStorage.setItem('user_assessment', JSON.stringify(answers));
        
        const btn = document.getElementById('assessment-submit-btn');
        const origText = btn ? btn.innerText : '';
        if (btn) {
            btn.innerText = "در حال ذخیره...";
            btn.disabled = true;
        }

        try {
            await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ 
                    action: "saveAssessment", 
                    phone: state.currentUser ? state.currentUser.phone : '', 
                    data: answers 
                })
            });
            if (btn) {
                btn.innerText = "✓ در سرور ثبت شد";
                btn.style.background = "var(--success)";
            }
            setTimeout(() => app.navigateTo('profile'), 1000);
        } catch(err) {
            alert("اطلاعات در دستگاه ذخیره شد اما به دلیل اینترنت به سرور ابری ارسال نشد.");
            if (btn) {
                btn.innerText = origText;
                btn.disabled = false;
            }
            app.navigateTo('profile');
        }
    },

    // --- 5. PROGRESSIVE OVERLOAD WEIGHT TRACKING ---
    saveWeight: (exerciseCode, value) => {
        state.loggedWeights[exerciseCode] = value;
        localStorage.setItem('workout_weights', JSON.stringify(state.loggedWeights));
    },

    getSavedWeight: (exerciseCode) => {
        return state.loggedWeights[exerciseCode] || '';
    },

    // --- 6. VIEWS SETUP ---
    setupWorkoutView: (dayId) => {
        const container = document.getElementById('workout-dynamic-content');
        if (!container || !state.workouts) return; 
        
        const activeDayId = dayId || Object.keys(state.workouts)[0] || 'day1';
        const dayData = state.workouts[activeDayId];
        if (!dayData) return;

        const titleEl = document.getElementById('workout-day-title');
        if (titleEl) titleEl.innerText = dayData.title;

        let html = '';
        dayData.parts.forEach(part => {
            html += `<div class="part-header">${escapeHtml(part.title)}</div><div class="exercise-list">`;
            part.exercises.forEach(ex => {
                const isTime = ex.time !== undefined;
                const targetVal = isTime ? `${ex.time}s` : ex.reps;
                
                // Tactical tactile set tiles (1, 2, 3, 4)
                let tilesHtml = '<div class="set-tiles-row">';
                for (let i = 0; i < ex.sets; i++) {
                    tilesHtml += `<div class="set-tile" data-set="${i+1}">${i+1}</div>`;
                }
                tilesHtml += '</div>';

                const savedWeight = app.getSavedWeight(ex.code);
                const safeQuery = encodeURIComponent(ex.ai_query || ex.name_en || '');

                html += `
                <article class="exercise-module locked" 
                    data-code="${escapeHtml(ex.code)}" 
                    data-sets="${ex.sets}" 
                    data-completed="0" 
                    data-rest="${ex.rest || 90}" 
                    ${isTime ? `data-time="${ex.time}"` : ''} 
                    onclick="app.handleClick(this)">
                    
                    <div class="module-header">
                        <div class="module-title-group">
                            <span class="module-code">${escapeHtml(ex.code)}</span>
                            <div class="module-names">
                                <h3 class="module-name-fa">${escapeHtml(ex.name_fa)}</h3>
                                <span class="module-name-en">${escapeHtml(ex.name_en)}</span>
                            </div>
                        </div>
                        <div class="module-badges">
                            <span class="metric-badge">${ex.sets} ست</span>
                            <span class="metric-badge">${targetVal}</span>
                        </div>
                    </div>

                    ${tilesHtml}

                    <div class="module-controls" onclick="event.stopPropagation()">
                        <div class="weight-stepper">
                            <span style="font-size:0.75rem;">وزنه:</span>
                            <input type="number" class="weight-input-field" placeholder="—" value="${savedWeight}" 
                                oninput="app.saveWeight('${escapeHtml(ex.code)}', this.value)" 
                                onkeydown="event.stopPropagation()">
                            <span class="weight-unit">kg</span>
                        </div>

                        <button type="button" class="btn-ai-consult" onclick="app.askAI(event, decodeURIComponent('${safeQuery}'))">
                            <span>✦</span> مشاوره
                        </button>
                    </div>

                    ${ex.note ? `<p class="module-note-text">${escapeHtml(ex.note)}</p>` : ''}
                    ${isTime ? `<div class="timer-overlay">${ex.time}<span>توقف</span></div>` : ''}
                </article>`;
            });
            html += `</div>`;
        });
        
        container.innerHTML = html;

        // Activate the first exercise module
        const allCards = container.querySelectorAll('.exercise-module');
        if (allCards.length > 0) {
            activateCard(allCards[0], false);
        }
    },

    setupProfileView: async () => {
        let savedData = JSON.parse(localStorage.getItem('user_assessment') || 'null');
        const emptyState = document.getElementById('profile-empty-state');
        const profileContainer = document.getElementById('profile-content');
        
        if (emptyState) emptyState.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'none';

        if (!savedData || Object.keys(savedData).length === 0) {
            if (emptyState) {
                emptyState.innerHTML = `<h3 style="color:var(--text-secondary); text-align:center; padding-top:30px; font-size:0.95rem;">در حال همگام‌سازی با سرور...</h3>`;
                emptyState.style.display = 'block';
            }

            try {
                const phone = state.currentUser ? state.currentUser.phone : '';
                const res = await fetch(`${state.gasUrl}?action=getAssessment&phone=${phone}`);
                const result = await res.json();
                
                if (result.status === "success" && result.data) {
                    savedData = result.data;
                    localStorage.setItem('user_assessment', JSON.stringify(savedData));
                    if (emptyState) emptyState.style.display = 'none';
                } else {
                    if (emptyState) {
                        emptyState.innerHTML = `
                            <h2 style="font-size:1.15rem; margin-bottom:8px;">پروفایل هنوز تکمیل نشده</h2>
                            <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:18px;">برای مشاهده اطلاعات بدنی و رکوردهای قدرت، ابتدا فرم ارزیابی را پر کنید.</p>
                            <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">رفتن به فرم ارزیابی</button>
                        `;
                    }
                    return;
                }
            } catch (err) {
                console.error("Cloud Sync Error:", err);
                if (emptyState) {
                    emptyState.innerHTML = `
                        <p style="color:#ef4444; font-size:0.85rem;">ارتباط با سرور برقرار نشد.</p>
                        <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">تکمیل فرم ارزیابی</button>
                    `;
                }
                return;
            }
        }

        if (profileContainer) profileContainer.style.display = 'block';

        if (profileContainer && !document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.type = 'button';
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'btn-logout';
            logoutBtn.innerHTML = 'خروج از حساب کاربری';
            logoutBtn.onclick = app.logout;
            profileContainer.appendChild(logoutBtn);
        }

        const dict = {
            "surplus": "حجم (مازاد)", "maintenance": "تثبیت", "deficit": "کات (نقصان)",
            "chest": "سینه", "back": "پشت", "legs": "پاها", "arms": "دست‌ها", "shoulders": "سرشانه", "calves": "ساق", "none": "هیچکدام",
            "palm": "کف دست", "fingers": "انگشتان", "ankle": "مچ پا", "shin": "وسط ساق"
        };
        const t = (val) => dict[val] || val || '-';

        const elements = {
            'val-age': `${savedData.age || '-'} سال`,
            'val-weight': `${savedData.weight || '-'} kg`,
            'val-height': `${savedData.height || '-'} cm`,
            'val-diet': t(savedData.diet_status),
            'val-squat': `${savedData.record_squat || 0} kg`,
            'val-deadlift': `${savedData.record_deadlift || 0} kg`,
            'val-bench': `${savedData.record_bench || 0} kg`,
            'val-pullups': `${savedData.max_pullups || 0}`,
            'val-pushups': `${savedData.max_pushups || 0}`,
            'val-plank': `${savedData.max_plank_time || 0}s`,
            'val-sleep': `${savedData.avg_sleep || '-'} ساعت`,
            'val-stubborn': t(savedData.stubborn_muscle),
            'val-hamstring': t(savedData.hamstring_toe_touch),
            'val-injury': savedData.injury_history || 'ندارد'
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        }
    },

    setupAssessmentView: () => {
        const savedData = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const form = document.getElementById('assessmentForm');
        if (!form) return;
        
        Object.keys(savedData).forEach(key => {
            const input = form.elements[key];
            if (input) input.value = savedData[key];
        });
    },

    // --- 7. REST TIMER & AUDIO ---
    skipRest: () => {
        clearInterval(state.restTimer);
        state.restTimer = null;
        state.restTimeRemaining = 0;
        const w = document.getElementById('restWidget');
        if(w) w.classList.remove('show');
    },

    adjustRestTime: (seconds) => {
        state.restTimeRemaining = Math.max(5, state.restTimeRemaining + seconds);
        const display = document.getElementById('restTimeDisplay');
        if (display) display.innerText = formatTime(state.restTimeRemaining);
        const widget = document.getElementById('restWidget');
        if (widget) {
            widget.style.transform = 'translateX(-50%) scale(1.05)';
            setTimeout(() => widget.style.transform = 'translateX(-50%) scale(1)', 120);
        }
    },

    // --- 8. MODALS & BACKDROP ---
    closeAllModals: () => {
        const sm = document.getElementById('settingsModal');
        const cm = document.getElementById('celebrationModal');
        const mb = document.getElementById('modalBackdrop');
        if (sm) sm.classList.remove('open');
        if (cm) cm.classList.remove('open');
        if (mb) mb.classList.remove('open');
    },

    toggleSettings: () => {
        const modal = document.getElementById('settingsModal');
        const backdrop = document.getElementById('modalBackdrop');
        const isOpen = modal.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('open', isOpen);
        if (isOpen) {
            const input = document.getElementById('apiKeyInput');
            if (input) input.value = state.apiKey || '';
        }
    },
    
    saveApiKey: () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            app.toggleSettings();
            alert('کلید هوش مصنوعی با موفقیت ذخیره شد.');
        } else {
            localStorage.removeItem('gemini_api_key');
            state.apiKey = "";
            app.toggleSettings();
        }
    },

    triggerCelebration: () => {
        playAudioCue('go');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        const cm = document.getElementById('celebrationModal');
        const mb = document.getElementById('modalBackdrop');
        if (cm) cm.classList.add('open');
        if (mb) mb.classList.add('open');
    },

    closeCelebration: () => {
        app.closeAllModals();
    },

    // --- 9. THEME CONTROLLER ---
    toggleTheme: () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        app.updateMetaColor(next);
        app.updateThemeIcon(next);
    },

    updateMetaColor: (theme) => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if(meta) meta.setAttribute('content', theme === 'dark' ? '#09090b' : '#f8fafc');
    },

    updateThemeIcon: (theme) => {
        const icon = document.getElementById('themeIcon');
        if(icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
    },

    initTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        app.updateMetaColor(savedTheme);
        app.updateThemeIcon(savedTheme);
    },

    // --- 10. AI ASSISTANT & QUICK CHIPS ---
    toggleChat: () => document.getElementById('chatWindow').classList.toggle('open'),
    
    sendQuickPrompt: (promptText) => {
        const input = document.getElementById('chatInput');
        if (input) input.value = promptText;
        app.sendMessage(promptText);
    },

    askAI: (e, query) => { 
        if (e) e.stopPropagation(); 
        const chatWin = document.getElementById('chatWindow');
        if (!chatWin.classList.contains('open')) app.toggleChat(); 
        app.sendMessage(query); 
    },

    sendMessage: async (txt) => {
        const input = document.getElementById('chatInput');
        const text = (txt || input.value || '').trim();
        if (!text) return;
        
        if (!state.apiKey) {
            app.toggleSettings();
            alert('لطفاً ابتدا کلید API جمینای خود را در تنظیمات (⚙️) وارد کنید.');
            return;
        }

        const body = document.getElementById('chatBody');
        
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg user';
        userMsgDiv.dir = 'auto';
        userMsgDiv.textContent = text;
        body.appendChild(userMsgDiv);
        
        if (input) input.value = '';
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const id = 'ai-msg-' + Date.now();
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.id = id;
        aiMsgDiv.dir = 'auto';
        aiMsgDiv.innerHTML = `<span style="color:var(--text-muted);font-size:0.8rem;">در حال نگارش پاسخ...</span>`;
        body.appendChild(aiMsgDiv);
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const p = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const profileContext = `
        کاربر: سن ${p.age||'?'} سال | وزن ${p.weight||'?'} کیلوگرم | سابقه آسیب: ${p.injury_history || 'ندارد'}
        رکوردها: اسکات ${p.record_squat||0} | ددلیفت ${p.record_deadlift||0} | پرس سینه ${p.record_bench||0}
        `;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    contents: [{ 
                        parts: [{ 
                            text: `نقش: مربی فوق‌حرفه‌ای و مشاور بیومکانیک. کوتاه، دقیق، فنی و به زبان فارسی پاسخ بده.\n${profileContext}\nسوال: ${text}` 
                        }] 
                    }] 
                })
            });
            const d = await res.json();
            
            if (d.error) {
                document.getElementById(id).innerHTML = `<strong style="color:#ef4444;">خطای API: ${escapeHtml(d.error.message)}</strong>`;
                return;
            }

            let rawText = d.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
            let escaped = escapeHtml(rawText);
            let formattedText = escaped
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');

            document.getElementById(id).innerHTML = formattedText;
            setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);
        } catch(e) { 
            document.getElementById(id).innerHTML = "<strong style='color:#ef4444;'>خطای شبکه در ارتباط با هوش مصنوعی.</strong>"; 
        }
    },

    // --- 11. EXERCISE PROGRESSION ---
    handleClick: (card) => {
        if (state.restTimer) {
            const widget = document.getElementById('restWidget');
            if (widget) {
                widget.style.transform = 'translateX(-50%) scale(1.06)';
                setTimeout(() => widget.style.transform = 'translateX(-50%) scale(1)', 150);
            }
            return;
        }

        if (!card.classList.contains('active-move') && !card.classList.contains('superset-next')) return; 
        initAudio();

        if (card.dataset.time) {
            if (card.classList.contains('timer-active')) stopTimer(card, false);
            else if (!state.isTimerRunning) startTimer(card);
            return;
        }

        if (state.isTimerRunning) return;
        let sets = parseInt(card.dataset.sets, 10);
        let completed = parseInt(card.dataset.completed, 10);
        
        if (completed < sets) {
            card.dataset.completed = ++completed;
            const tiles = card.querySelectorAll('.set-tile');
            if (tiles[completed - 1]) {
                tiles[completed - 1].classList.remove('active-next');
                tiles[completed - 1].classList.add('done');
            }
            if (tiles[completed]) {
                tiles[completed].classList.add('active-next');
            }
            handleSetCompletion(card);
        }
    },

    toggleAuth: (type) => {
        const loginForm = document.getElementById('form-login');
        const signupForm = document.getElementById('form-signup');
        const loginTab = document.getElementById('tab-login');
        const signupTab = document.getElementById('tab-signup');

        if (!loginForm || !signupForm) return;

        if (type === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
        }
    }
};

// --- CORE EXERCISE PROGRESSION ---
function getGroupId(code) {
    if (!code) return '';
    if (/^[a-zA-Z]/.test(code)) return code.charAt(0).toUpperCase();
    const match = String(code).match(/^\d+/);
    return match ? parseInt(match[0], 10) : code;
}

function findNextUnfinishedInGroup(groupCards, startIndex) {
    const len = groupCards.length;
    for (let i = 1; i <= len; i++) {
        const checkIndex = (startIndex + i) % len;
        const card = groupCards[checkIndex];
        const completed = parseInt(card.dataset.completed, 10);
        const total = parseInt(card.dataset.sets, 10);
        
        if (completed < total) return card;
    }
    return null; 
}

function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.exercise-module'));
    const currentCode = currentCard.dataset.code;
    const currentGroupId = getGroupId(currentCode);
    
    const groupCards = allCards.filter(c => getGroupId(c.dataset.code) === currentGroupId);
    const currentIndexInGroup = groupCards.indexOf(currentCard);

    const completed = parseInt(currentCard.dataset.completed, 10);
    const total = parseInt(currentCard.dataset.sets, 10);
    const isCurrentTotallyDone = completed >= total;

    if (isCurrentTotallyDone) {
        markCardAsDone(currentCard);
    } else {
        deactivateCard(currentCard);
    }

    let nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);
    let isSupersetTransition = false;

    if (nextCard) {
        const currGlobalIdx = allCards.indexOf(currentCard);
        const nextGlobalIdx = allCards.indexOf(nextCard);
        
        if (nextGlobalIdx > currGlobalIdx) {
            isSupersetTransition = true;
        }
        activateCard(nextCard, isSupersetTransition);
    } else {
        const globalIndex = allCards.indexOf(currentCard);
        for (let i = globalIndex + 1; i < allCards.length; i++) {
            const potentialNext = allCards[i];
            if (!potentialNext.classList.contains('completed')) {
                nextCard = potentialNext;
                activateCard(nextCard, false);
                break;
            }
        }
    }

    // Check if entire workout is completed
    const allCompleted = allCards.every(c => c.classList.contains('completed'));
    if (allCompleted && allCards.length > 0) {
        app.skipRest();
        setTimeout(() => app.triggerCelebration(), 500);
        return;
    }

    // Smart Rest Control
    if (isSupersetTransition) {
        app.skipRest(); 
    } else {
        const restTime = parseInt(currentCard.dataset.rest, 10) || 90;
        startRestTimer(restTime);
    }
}

function activateCard(card, isSuperset = false) {
    card.classList.remove('locked', 'superset-next', 'active-move');
    card.classList.add(isSuperset ? 'superset-next' : 'active-move');
    
    // Highlight next set tile
    const completed = parseInt(card.dataset.completed, 10) || 0;
    const tiles = card.querySelectorAll('.set-tile');
    tiles.forEach(t => t.classList.remove('active-next'));
    if (tiles[completed]) tiles[completed].classList.add('active-next');

    if (isSuperset) playAudioCue('superset');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) { 
    card.classList.remove('active-move', 'superset-next'); 
    card.classList.add('locked'); 
    card.querySelectorAll('.set-tile').forEach(t => t.classList.remove('active-next'));
}

function markCardAsDone(card) { 
    card.classList.remove('active-move', 'superset-next', 'locked'); 
    card.classList.add('completed'); 
    card.querySelectorAll('.set-tile').forEach(t => {
        t.classList.remove('active-next');
        t.classList.add('done');
    }); 
}

// --- TIMERS & AUDIO ---
function startTimer(card) {
    state.isTimerRunning = true; 
    card.classList.add('timer-active');
    const ov = card.querySelector('.timer-overlay');
    let t = parseInt(card.dataset.time, 10);
    ov.innerHTML = `${t} <span>توقف</span>`;
    
    state.timer = setInterval(() => { 
        t--; 
        ov.innerHTML = `${t} <span>توقف</span>`; 
        if (t <= 0) stopTimer(card, true); 
    }, 1000);
}

function stopTimer(card, finished) {
    clearInterval(state.timer); 
    state.isTimerRunning = false; 
    card.classList.remove('timer-active');
    card.querySelector('.timer-overlay').innerHTML = `${card.dataset.time} <span>توقف</span>`;
    if (finished) {
        playAudioCue('go');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        let c = parseInt(card.dataset.completed, 10);
        if (c < parseInt(card.dataset.sets, 10)) { 
            card.dataset.completed = ++c; 
            const tiles = card.querySelectorAll('.set-tile');
            if (tiles[c-1]) tiles[c-1].classList.add('done'); 
            handleSetCompletion(card); 
        }
    }
}

function startRestTimer(seconds) {
    app.skipRest(); 
    state.restTimeRemaining = seconds;
    const widget = document.getElementById('restWidget'); 
    const display = document.getElementById('restTimeDisplay');
    if (!widget || !display) return;
    
    display.innerText = formatTime(seconds);
    widget.classList.add('show');
    
    state.restTimer = setInterval(() => {
        state.restTimeRemaining--;
        display.innerText = formatTime(state.restTimeRemaining);
        
        if ([3, 2, 1].includes(state.restTimeRemaining)) {
            playAudioCue('tick');
        } else if (state.restTimeRemaining <= 0) { 
            playAudioCue('go'); 
            if (navigator.vibrate) navigator.vibrate([250, 150, 250]);
            app.skipRest(); 
        }
    }, 1000);
}

function formatTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function initAudio() { 
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume(); 
    }
}

function playAudioCue(type) {
    try {
        if (!state.audioCtx) initAudio();
        if (!state.audioCtx) return;
        
        const o = state.audioCtx.createOscillator(); 
        const g = state.audioCtx.createGain();
        o.connect(g); 
        g.connect(state.audioCtx.destination);
        const now = state.audioCtx.currentTime;
        
        if (type === 'tick') { 
            o.type = 'sine'; 
            o.frequency.setValueAtTime(600, now); 
            g.gain.setValueAtTime(0.1, now); 
            o.start(now); 
            o.stop(now + 0.08); 
        } else if (type === 'go') { 
            o.type = 'square'; 
            o.frequency.setValueAtTime(880, now); 
            g.gain.setValueAtTime(0.15, now); 
            o.start(now); 
            o.stop(now + 0.35); 
        } else if (type === 'superset') { 
            o.type = 'triangle'; 
            o.frequency.setValueAtTime(400, now); 
            o.frequency.setValueAtTime(650, now + 0.1); 
            g.gain.setValueAtTime(0.12, now); 
            o.start(now); 
            o.stop(now + 0.2); 
        }
    } catch (err) {
        console.warn('Audio cue play note:', err);
    }
}

window.app = app;