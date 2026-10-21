/**
 * Smart Workout Application - V7.5 (PWA & Offline Gym Ready)
 * Core Logic, Dynamic Router, Service Worker Registration, Auth & State Management
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
    
    // Cloud API & Auth System
    gasUrl: "https://script.google.com/macros/s/AKfycbwsBVIb8nIiGvVEp4pRh1_HWDwSNOd5ae-fYzmkWqi64X7iaEVjzuRi3o1G_0lT3jZFSg/exec",
    currentUser: JSON.parse(localStorage.getItem('user_auth')) || null
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    app.initTheme(); 
    createRestWidgetDOM();
    registerServiceWorker();

    // Enable Web Audio on first user interaction (gym touch gesture)
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
                .then((reg) => console.log('✅ ServiceWorker Active for Gym Offline use:', reg.scope))
                .catch((err) => console.warn('⚠️ ServiceWorker registration note:', err));
        });
    }
}

function createRestWidgetDOM() {
    if (document.getElementById('restWidget')) return;
    const widget = document.createElement('div');
    widget.id = 'restWidget';
    widget.className = 'rest-widget';
    widget.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:0.8rem; color:#ccc; letter-spacing:1px;">زمان استراحت</div>
            <div id="restTimeDisplay" class="rest-time-display">00:00</div>
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
            console.log(`✅ Loaded Program: ${programName}.json (${Object.keys(state.workouts).length} Days)`);
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

// Helper: Escape HTML to prevent XSS
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
    // Navigate with browser history support (Back/Forward buttons in gym)
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

    // Handle hash change
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

        // Security check
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

    // Dynamically render navigation buttons based on current program's days
    renderWorkoutNav: () => {
        const container = document.getElementById('dynamic-workout-days');
        if (!container || !state.workouts) return;

        let html = '';
        const dayKeys = Object.keys(state.workouts);
        dayKeys.forEach((key, index) => {
            const day = state.workouts[key];
            const label = `Day ${index + 1}`;
            html += `<button type="button" class="nav-btn nav-day-btn" id="nav-btn-${key}" onclick="app.navigateTo('workout', '${key}')" title="${escapeHtml(day.title || label)}">${label}</button>`;
        });
        container.innerHTML = html;
        app.updateActiveNav();
    },

    // Update active highlight on nav buttons
    updateActiveNav: () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
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
        
        // Security Check
        if (!state.currentUser && viewName !== 'login') {
            return app.navigateTo('login');
        }
        if (state.currentUser && viewName === 'login') {
            return app.navigateTo('profile');
        }

        state.currentView = viewName;
        state.currentParam = param;
        
        // Show/Hide Navbar
        const nav = document.getElementById('main-nav');
        if (nav) nav.style.display = (viewName === 'login') ? 'none' : 'flex';

        const container = document.getElementById('app-container');
        container.innerHTML = `<div style="text-align:center; margin-top:50px; color:var(--text-secondary);">
            <span style="font-size: 2rem;">⏳</span><br>در حال بارگذاری...
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
            container.innerHTML = `<h3 style="color:#e74c3c; text-align:center; margin-top:50px;">
                خطا در بارگذاری صفحه. لطفاً اتصال اینترنت را بررسی کنید.
            </h3>`;
        }
    },

    // --- 4. AUTHENTICATION & API ---
    signup: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "⏳ در حال ثبت‌نام...";
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
        btn.innerText = "⏳ در حال ورود...";
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
        localStorage.setItem('user_assessment', JSON.stringify(answers)); // Save locally
        
        const btn = document.getElementById('assessment-submit-btn');
        const origText = btn ? btn.innerText : '';
        if (btn) {
            btn.innerText = "⏳ در حال ارسال به سرور مربی...";
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
                btn.innerText = "✅ در دیتابیس ثبت شد!";
                btn.style.background = "var(--success)";
            }
            setTimeout(() => app.navigateTo('profile'), 1200);
        } catch(err) {
            alert("اطلاعات در دستگاه ذخیره شد اما به دلیل اینترنت به سرور ابری ارسال نشد.");
            if (btn) {
                btn.innerText = origText;
                btn.disabled = false;
            }
            app.navigateTo('profile');
        }
    },

    // --- 5. VIEWS SETUP ---
    setupWorkoutView: (dayId) => {
        const container = document.getElementById('workout-dynamic-content');
        if (!container || !state.workouts) return; 
        
        // If no dayId provided, pick the first day
        const activeDayId = dayId || Object.keys(state.workouts)[0] || 'day1';
        const dayData = state.workouts[activeDayId];
        if (!dayData) return;

        const titleEl = document.getElementById('workout-day-title');
        if (titleEl) titleEl.innerText = dayData.title;

        let html = '';
        dayData.parts.forEach(part => {
            html += `<div class="section-title">${escapeHtml(part.title)}</div><div class="grid-container">`;
            part.exercises.forEach(ex => {
                const isTime = ex.time !== undefined;
                const targetVal = isTime ? `${ex.time}s` : ex.reps;
                const targetIcon = isTime ? '⏱️' : '🔁'; 
                
                // Build dots for set progression
                let dotsHtml = '<div class="progress-dots">';
                for(let i=0; i<ex.sets; i++) dotsHtml += '<div class="dot"></div>';
                dotsHtml += '</div>';

                const safeQuery = encodeURIComponent(ex.ai_query || ex.name_en || '');

                html += `
                <div class="ex-card locked" 
                    data-code="${escapeHtml(ex.code)}" 
                    data-sets="${ex.sets}" 
                    data-completed="0" 
                    data-rest="${ex.rest || 90}" 
                    ${isTime ? `data-time="${ex.time}"` : ''} 
                    onclick="app.handleClick(this)">
                    ${dotsHtml}
                    <div class="ex-code">${escapeHtml(ex.code)}</div>
                    <span class="ex-name-en">${escapeHtml(ex.name_en)}</span>
                    <span class="ex-name-fa">${escapeHtml(ex.name_fa)}</span>
                    <div class="ex-stats">
                        <div class="stat-item"><span class="stat-icon">🔢</span><span class="stat-val">${ex.sets} ست</span></div>
                        <div class="stat-item"><span class="stat-icon">${targetIcon}</span><span class="stat-val">${targetVal}</span></div>
                    </div>
                    <div class="ex-note">
                        ${escapeHtml(ex.note)} 
                        <div class="ai-row">
                            <button type="button" class="ai-hint-btn" onclick="app.askAI(event, decodeURIComponent('${safeQuery}'))" title="مشاوره هوشمند این حرکت">✨ مربی</button>
                        </div>
                    </div>
                    ${isTime ? `<div class="timer-overlay">${ex.time}<span>توقف</span></div>` : ''}
                </div>`;
            });
            html += `</div>`;
        });
        
        container.innerHTML = html;

        // Activate the very first card in the list immediately after rendering
        const allCards = container.querySelectorAll('.ex-card');
        if (allCards.length > 0) {
            activateCard(allCards[0], false);
        }
    },

    // Setup Profile View with Cloud Sync (Pull)
    setupProfileView: async () => {
        let savedData = JSON.parse(localStorage.getItem('user_assessment') || 'null');
        const emptyState = document.getElementById('profile-empty-state');
        const profileContainer = document.getElementById('profile-content');
        
        if (emptyState) emptyState.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'none';

        // If no local data found, try pulling from cloud
        if (!savedData || Object.keys(savedData).length === 0) {
            if (emptyState) {
                emptyState.innerHTML = `<h3 style="color:var(--accent); text-align:center; padding-top:40px;">⏳ در حال همگام‌سازی با سرور ابری...</h3>`;
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
                            <h2 style="color:var(--accent);">پروفایل شما هنوز تکمیل نشده!</h2>
                            <p style="color:var(--text-secondary);">برای مشاهده اطلاعات بدنی و برنامه‌ریزی هوشمند، فرم ارزیابی را پر کنید.</p>
                            <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">📋 رفتن به فرم ارزیابی</button>
                        `;
                    }
                    return;
                }
            } catch (err) {
                console.error("Cloud Sync Error:", err);
                if (emptyState) {
                    emptyState.innerHTML = `
                        <h3 style="color:#e74c3c; text-align:center;">داده‌ای در گوشی ذخیره نشده و اتصال به سرور برقرار نشد.</h3>
                        <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">📋 تکمیل فرم ارزیابی</button>
                    `;
                }
                return;
            }
        }

        if (profileContainer) profileContainer.style.display = 'block';

        // Inject Logout Button dynamically if it doesn't exist
        if (profileContainer && !document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.type = 'button';
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'btn-logout';
            logoutBtn.innerHTML = '🚪 خروج از حساب کاربری';
            logoutBtn.onclick = app.logout;
            profileContainer.appendChild(logoutBtn);
        }

        const dict = {
            "surplus": "کالری مازاد (حجم)", "maintenance": "تثبیت وزن", "deficit": "کالری نقصان (کات)",
            "chest": "سینه", "back": "پشت / زیربغل", "legs": "پاها", "arms": "دست‌ها", "shoulders": "سرشانه", "calves": "ساق", "none": "هیچکدام",
            "palm": "لمس کف دست", "fingers": "لمس نوک انگشتان", "ankle": "مچ پا", "shin": "وسط ساق"
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
            'val-pullups': `${savedData.max_pullups || 0} تکرار`,
            'val-pushups': `${savedData.max_pushups || 0} تکرار`,
            'val-plank': `${savedData.max_plank_time || 0} ثانیه`,
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

    // --- 6. GLOBAL CONTROLS & AI ---
    skipRest: () => {
        clearInterval(state.restTimer);
        state.restTimer = null;
        state.restTimeRemaining = 0;
        const w = document.getElementById('restWidget');
        if(w) w.classList.remove('show');
    },

    toggleSettings: () => {
        const modal = document.getElementById('settingsModal');
        modal.classList.toggle('open');
        if (modal.classList.contains('open')) {
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
            alert('کلید هوش مصنوعی با موفقیت ذخیره شد!');
        } else {
            localStorage.removeItem('gemini_api_key');
            state.apiKey = "";
            app.toggleSettings();
        }
    },

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
        if(meta) meta.setAttribute('content', theme === 'dark' ? '#0f2027' : '#2c3e50');
    },

    updateThemeIcon: (theme) => {
        const icon = document.getElementById('themeIcon');
        if(icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
    },

    initTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        app.updateMetaColor(savedTheme);
        app.updateThemeIcon(savedTheme);
    },

    toggleChat: () => document.getElementById('chatWindow').classList.toggle('open'),
    
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
        
        // Safely append user message (Zero XSS)
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
        aiMsgDiv.innerHTML = `<span style="color:var(--text-secondary);font-size:0.85rem;">⏳ مربی در حال تحلیل...</span>`;
        body.appendChild(aiMsgDiv);
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const p = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const profileContext = `
        اطلاعات کاربر: سن ${p.age||'?'} سال | وزن ${p.weight||'?'} کیلوگرم | سابقه آسیب: ${p.injury_history || 'ندارد'}
        رکوردهای وزنه: اسکات ${p.record_squat||0} | ددلیفت ${p.record_deadlift||0} | پرس سینه ${p.record_bench||0} | بارفیکس ${p.max_pullups||0}
        سطح برنامه: برنامه تمرینی اختصاصی بدنسازی
        `;

        try {
            // Standard and officially supported Gemini 1.5 Flash endpoint
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    contents: [{ 
                        parts: [{ 
                            text: `نقش: مربی حرفه‌ای بدنسازی و بیومکانیک. کوتاه، علمی و به زبان فارسی پاسخ بده.\n${profileContext}\nسوال کاربر: ${text}` 
                        }] 
                    }] 
                })
            });
            const d = await res.json();
            
            if (d.error) {
                document.getElementById(id).innerHTML = `<strong style="color:#e74c3c;">خطای API: ${escapeHtml(d.error.message)}</strong>`;
                return;
            }

            let rawText = d.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
            
            // Format markdown safely: bold, italic, line breaks
            let escaped = escapeHtml(rawText);
            let formattedText = escaped
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');

            document.getElementById(id).innerHTML = formattedText;
            setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);
        } catch(e) { 
            document.getElementById(id).innerHTML = "<strong style='color:#e74c3c;'>خطای ارتباط شبکه با هوش مصنوعی.</strong>"; 
        }
    },

    // --- 7. EXERCISE LOGIC ---
    handleClick: (card) => {
        // Prevent accidental clicks while rest timer is active
        if (state.restTimer) {
            const widget = document.getElementById('restWidget');
            if (widget) {
                widget.style.transform = 'translateX(-50%) scale(1.08)';
                setTimeout(() => widget.style.transform = 'translateX(-50%) scale(1)', 200);
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
            const dots = card.querySelectorAll('.dot');
            if (dots[completed - 1]) dots[completed - 1].classList.add('active');
            handleSetCompletion(card);
        }
    },

    // Toggle between Login and Signup forms in the UI
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
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
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
    if (isSuperset) playAudioCue('superset');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) { 
    card.classList.remove('active-move', 'superset-next'); 
    card.classList.add('locked'); 
}

function markCardAsDone(card) { 
    card.classList.remove('active-move', 'superset-next', 'locked'); 
    card.classList.add('completed'); 
    card.querySelectorAll('.dot').forEach(d => d.classList.add('done')); 
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
            const dots = card.querySelectorAll('.dot');
            if (dots[c-1]) dots[c-1].classList.add('active'); 
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
            g.gain.setValueAtTime(0.12, now); 
            o.start(now); 
            o.stop(now + 0.1); 
        } else if (type === 'go') { 
            o.type = 'square'; 
            o.frequency.setValueAtTime(880, now); 
            g.gain.setValueAtTime(0.18, now); 
            o.start(now); 
            o.stop(now + 0.4); 
        } else if (type === 'superset') { 
            o.type = 'triangle'; 
            o.frequency.setValueAtTime(400, now); 
            o.frequency.setValueAtTime(650, now + 0.1); 
            g.gain.setValueAtTime(0.15, now); 
            o.start(now); 
            o.stop(now + 0.25); 
        }
    } catch (err) {
        console.warn('Audio cue play note:', err);
    }
}

window.app = app;