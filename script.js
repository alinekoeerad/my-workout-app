/**
 * Smart Workout Application - V7.0 (Cloud Database Integration)
 * Core Logic, Router, Auth, and State Management
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
    
    // Security check: Route to Login if not authenticated
    if (!state.currentUser) {
        app.loadView('login');
    } else {
        await loadDatabase();
        app.loadView('workout', 'day1');
    }
});

function createRestWidgetDOM() {
    const widget = document.createElement('div');
    widget.id = 'restWidget';
    widget.className = 'rest-widget';
    widget.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:0.8rem; color:#ccc;">Rest</div>
            <div id="restTimeDisplay" class="rest-time-display">00:00</div>
        </div>
        <button class="rest-skip-btn" onclick="app.skipRest()">Skip ⏭</button>
    `;
    document.body.appendChild(widget);
}

// Dynamically load workouts based on User's Assigned Program
async function loadDatabase() {
    if (!state.currentUser) return;
    try {
        const programName = state.currentUser.assignedProgram || 'workouts';
        const res = await fetch(`./data/${programName}.json`);
        if (res.ok) {
            const data = await res.json();
            state.workouts = data.days;
            console.log(`✅ Loaded Program: ${programName}.json`);
        } else {
            console.error("برنامه تمرینی اختصاصی این کاربر یافت نشد.");
        }
    } catch (error) {
        console.error("Database load error", error);
    }
}

// --- 3. APP ROUTER & CORE LOGIC ---
const app = {
    loadView: async (viewName, param = null) => {
        if (state.isTimerRunning) return alert('Please stop the active timer first!');
        app.skipRest();
        
        // --- Security Check ---
        if (!state.currentUser && viewName !== 'login') {
            return app.loadView('login');
        }
        if (state.currentUser && viewName === 'login') {
            return app.loadView('profile');
        }
        // ----------------------

        state.currentView = viewName;
        state.currentParam = param;
        
        // Show/Hide Navbar
        const nav = document.getElementById('main-nav');
        if (nav) nav.style.display = (viewName === 'login') ? 'none' : 'flex';

        const container = document.getElementById('app-container');
        container.innerHTML = `<div style="text-align:center; margin-top:50px; color:var(--text-secondary);">Loading...</div>`;

        try {
            const response = await fetch(`./views/${viewName}.html`);
            if (!response.ok) throw new Error('View file not found');
            const html = await response.text();
            
            container.innerHTML = html;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (viewName === 'workout') app.setupWorkoutView(param);
            else if (viewName === 'profile') app.setupProfileView();
            else if (viewName === 'assessment') app.setupAssessmentView();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<h3 style="color:red;text-align:center">Error loading page (404).</h3>`;
        }
    },

    // --- 4. AUTHENTICATION & API ---
    signup: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "⏳ در حال ثبت‌نام...";
        btn.disabled = true;

        const inputs = e.target.querySelectorAll('input');
        const fullName = inputs[0].value;
        const phone = inputs[1].value;
        const password = inputs[2].value;

        try {
            const res = await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "register", phone, fullName, password })
            });
            const result = await res.json();
            
            if (result.status === "success") {
                alert("ثبت‌نام موفق! حالا می‌توانید وارد حساب خود شوید.");
                toggleAuth('login');
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

        const inputs = e.target.querySelectorAll('input');
        const phone = inputs[0].value;
        const password = inputs[1].value;

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
                await loadDatabase(); // Load their specific program
                app.loadView('profile');
            } else {
                alert("خطا: " + result.message);
            }
        } catch(err) {
            alert("خطا در ارتباط با سرور ابری!");
        }
        btn.innerText = origText;
        btn.disabled = false;
    },

    logout: () => {
        localStorage.removeItem('user_auth');
        state.currentUser = null;
        state.workouts = null;
        app.loadView('login');
    },

    submitAssessment: async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const answers = Object.fromEntries(formData.entries());
        localStorage.setItem('user_assessment', JSON.stringify(answers)); // Save locally
        
        const btn = document.getElementById('assessment-submit-btn');
        const origText = btn.innerText;
        btn.innerText = "⏳ در حال ارسال به سرور مربی...";
        btn.disabled = true;

        try {
            await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ 
                    action: "saveAssessment", 
                    phone: state.currentUser.phone, 
                    data: answers 
                })
            });
            btn.innerText = "✅ در دیتابیس ثبت شد!";
            btn.style.background = "var(--success)";
            setTimeout(() => app.loadView('profile'), 1500);
        } catch(err) {
            alert("اخطار نت: اطلاعات در گوشی ذخیره شد اما به سرور نرسید.");
            btn.innerText = origText;
            btn.disabled = false;
        }
    },

    // --- 5. VIEWS SETUP ---
    setupWorkoutView: (dayId) => {
        const container = document.getElementById('workout-dynamic-content');
        if (!container || !state.workouts) return; 
        
        const dayData = state.workouts[dayId];
        if (!dayData) return;

        document.getElementById('workout-day-title').innerText = dayData.title;

        let html = '';
        dayData.parts.forEach(part => {
            html += `<div class="section-title">${part.title}</div><div class="grid-container">`;
            part.exercises.forEach(ex => {
                const isTime = ex.time !== undefined;
                const targetVal = isTime ? `${ex.time}s` : ex.reps;
                const targetIcon = isTime ? '⏱️' : '🔁'; 
                
                // Build dots for set progression
                let dotsHtml = '<div class="progress-dots">';
                for(let i=0; i<ex.sets; i++) dotsHtml += '<div class="dot"></div>';
                dotsHtml += '</div>';

                // Add 'locked' class by default to all cards
                html += `
                <div class="ex-card locked" 
                    data-code="${ex.code}" 
                    data-sets="${ex.sets}" 
                    data-completed="0" 
                    data-rest="${ex.rest || 90}" 
                    ${isTime ? `data-time="${ex.time}"` : ''} 
                    onclick="app.handleClick(this)">
                    ${dotsHtml}
                    <div class="ex-code">${ex.code}</div>
                    <span class="ex-name-en">${ex.name_en}</span>
                    <span class="ex-name-fa">${ex.name_fa}</span>
                    <div class="ex-stats">
                        <div class="stat-item"><span class="stat-icon">🔢</span><span class="stat-val">${ex.sets}</span></div>
                        <div class="stat-item"><span class="stat-icon">${targetIcon}</span><span class="stat-val">${targetVal}</span></div>
                    </div>
                    <div class="ex-note">${ex.note} <div class="ai-row"><button class="ai-hint-btn" onclick="app.askAI(event, '${ex.ai_query}')">✨</button></div></div>
                    ${isTime ? `<div class="timer-overlay">${ex.time}<span>Stop</span></div>` : ''}
                </div>`;
            });
            html += `</div>`;
        });
        
        container.innerHTML = html;

        // IMPORTANT: Activate the very first card in the list immediately after rendering
        const allCards = container.querySelectorAll('.ex-card');
        if (allCards.length > 0) {
            activateCard(allCards[0], false);
        }
    },
    // --- Setup Profile View with Cloud Sync (Pull) ---
    setupProfileView: async () => {
        // 1. Try to load data from local storage first
        let savedData = JSON.parse(localStorage.getItem('user_assessment') || 'null');
        const emptyState = document.getElementById('profile-empty-state');
        const profileContainer = document.getElementById('profile-content');
        
        // Hide both containers initially to prevent flickering
        if (emptyState) emptyState.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'none';

        // 2. If no local data is found (e.g., logging in from a new phone), fetch from Cloud
        if (!savedData || Object.keys(savedData).length === 0) {
            
            // Show a temporary loading message
            if (emptyState) {
                emptyState.innerHTML = `<h3 style="color:var(--accent); text-align:center; padding-top:40px;">⏳ Syncing with Cloud Database...</h3>`;
                emptyState.style.display = 'block';
            }

            try {
                // Fetch user data using a GET request to Google Apps Script
                const res = await fetch(`${state.gasUrl}?action=getAssessment&phone=${state.currentUser.phone}`);
                const result = await res.json();
                
                if (result.status === "success" && result.data) {
                    savedData = result.data;
                    // Save to local storage for fast loading in the future
                    localStorage.setItem('user_assessment', JSON.stringify(savedData));
                    if (emptyState) emptyState.style.display = 'none';
                } else {
                    // Truly empty state: User has never filled the assessment form
                    if (emptyState) {
                        emptyState.innerHTML = `
                            <h2 style="color:var(--accent);">پروفایل شما هنوز تکمیل نشده!</h2>
                            <p style="color:var(--text-secondary);">برای مشاهده اطلاعات بدنی، ابتدا فرم ارزیابی را پر کنید.</p>
                            <button onclick="app.loadView('assessment')" class="btn-primary">📋 رفتن به فرم ارزیابی</button>
                        `;
                    }
                    return; // Stop execution here
                }
            } catch (err) {
                console.error("Cloud Sync Error:", err);
                if (emptyState) emptyState.innerHTML = `<h3 style="color:red; text-align:center;">❌ Network Error during sync.</h3>`;
                return;
            }
        }

        // 3. Data is ready, display the main profile container
        if (profileContainer) profileContainer.style.display = 'block';

        // 4. Inject Logout Button dynamically if it doesn't exist
        if (profileContainer && !document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'btn-logout';
            logoutBtn.innerHTML = '🚪 خروج از حساب کاربری';
            logoutBtn.onclick = app.logout;
            profileContainer.appendChild(logoutBtn);
        }

        // 5. English to Persian translation dictionary for database values
        const dict = {
            "surplus": "حجم", "maintenance": "تثبیت", "deficit": "کات",
            "chest": "سینه", "back": "پشت", "legs": "پاها", "arms": "دست‌ها", "shoulders": "سرشانه", "calves": "ساق", "none": "هیچکدام",
            "palm": "کف دست", "fingers": "انگشتان", "ankle": "مچ پا", "shin": "ساق"
        };
        const t = (val) => dict[val] || val || '-';

        // 6. Map JSON data to DOM Element IDs
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

        // 7. Render values into the HTML
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
        const w = document.getElementById('restWidget');
        if(w) w.classList.remove('show');
    },

    toggleSettings: () => document.getElementById('settingsModal').classList.toggle('open'),
    
    saveApiKey: () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
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
        if(meta) meta.setAttribute('content', theme === 'dark' ? '#1e1e1e' : '#2c3e50');
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
    askAI: (e, query) => { e.stopPropagation(); app.toggleChat(); app.sendMessage(query); },

    sendMessage: async (txt) => {
        const input = document.getElementById('chatInput');
        const text = txt || input.value;
        if(!text) return;
        
        const body = document.getElementById('chatBody');
        body.innerHTML += `<div class="msg user" dir="auto">${text}</div>`;
        input.value = '';
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const id = Date.now();
        body.innerHTML += `<div class="msg ai" id="${id}" dir="auto"><span style="color:var(--text-secondary);font-size:0.85rem;">... Analyzing ...</span></div>`;
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const p = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const profileContext = `
        User Stats: Age ${p.age||'?'} | Weight ${p.weight||'?'}kg
        Records: Squat ${p.record_squat||0} | Deadlift ${p.record_deadlift||0} | Bench ${p.record_bench||0} | Pullups ${p.max_pullups||0}
        Goal/Level: Advanced PPL.
        `;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ contents: [{ parts: [{ text: `Act as Elite Coach. ${profileContext} User Q: ${text}` }] }] })
            });
            const d = await res.json();
            let rawText = d.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";
            
            let formattedText = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
            document.getElementById(id).innerHTML = formattedText;
            setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);
        } catch(e) { 
            document.getElementById(id).innerHTML = "<strong style='color:#e74c3c;'>Network Error</strong>"; 
        }
    },

    // --- 7. EXERCISE LOGIC ---
    handleClick: (card) => {
        app.skipRest(); 
        if (!card.classList.contains('active-move') && !card.classList.contains('superset-next')) return; 
        initAudio();

        if (card.dataset.time) {
            if (card.classList.contains('timer-active')) stopTimer(card, false);
            else if (!state.isTimerRunning) startTimer(card);
            return;
        }

        if (state.isTimerRunning) return;
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            card.dataset.completed = ++completed;
            card.querySelectorAll('.dot')[completed-1]?.classList.add('active');
            handleSetCompletion(card);
        }
    },

    // --- Add this inside the "const app = { ... }" object in script.js ---

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
            loginTab.style.background = 'var(--accent)';
            loginTab.style.color = 'white';
            signupTab.style.background = 'transparent';
            signupTab.style.color = 'var(--text)';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            signupTab.style.background = 'var(--accent)';
            signupTab.style.color = 'white';
            loginTab.style.background = 'transparent';
            loginTab.style.color = 'var(--text)';
        }
    },
};

// --- CORE EXERCISE PROGRESSION ---
// --- 1. HELPER FUNCTIONS FOR CIRCUIT LOGIC ---

// Extracts Group ID (e.g., "A" from "A1", "A2" or "1" from "1.1")
function getGroupId(code) {
    if (/^[a-zA-Z]/.test(code)) return code.charAt(0).toUpperCase();
    const match = code.match(/^\d+/);
    return match ? parseInt(match[0]) : code;
}

// Finds the next exercise in the same group that still has sets to complete
function findNextUnfinishedInGroup(groupCards, startIndex) {
    const len = groupCards.length;
    for (let i = 1; i <= len; i++) {
        const checkIndex = (startIndex + i) % len;
        const card = groupCards[checkIndex];
        const completed = parseInt(card.dataset.completed);
        const total = parseInt(card.dataset.sets);
        
        if (completed < total) return card;
    }
    return null; 
}

// --- 2. CORE PROGRESSION LOGIC ---

function handleSetCompletion(currentCard) {
    // Refresh the list of cards in the current view
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const currentCode = currentCard.dataset.code;
    const currentGroupId = getGroupId(currentCode);
    
    // Filter all cards that belong to the same group (e.g., all "A" cards)
    const groupCards = allCards.filter(c => getGroupId(c.dataset.code) === currentGroupId);
    const currentIndexInGroup = groupCards.indexOf(currentCard);

    const completed = parseInt(currentCard.dataset.completed);
    const total = parseInt(currentCard.dataset.sets);
    const isCurrentTotallyDone = completed >= total;

    // Update UI status of the current card
    if (isCurrentTotallyDone) {
        markCardAsDone(currentCard);
    } else {
        deactivateCard(currentCard);
    }

    let nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);
    let isSupersetTransition = false;

    if (nextCard) {
        // Circuit Logic: If the next unfinished card exists in the group
        const currGlobalIdx = allCards.indexOf(currentCard);
        const nextGlobalIdx = allCards.indexOf(nextCard);
        
        // If the next card is further down the DOM, it's a direct superset/circuit jump
        if (nextGlobalIdx > currGlobalIdx) {
            isSupersetTransition = true;
        }
        activateCard(nextCard, isSupersetTransition);
    } else {
        // Group Finished: Find the first card of the NEXT group
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

    // --- 3. SMART REST CONTROL ---
    // If we are moving within a cycle (A1 -> A2), skip rest or use specific cue.
    // If the group is finished or we are repeating a move, start rest.
    if (isSupersetTransition) {
        app.skipRest(); 
    } else {
        const restTime = parseInt(currentCard.dataset.rest) || 90;
        startRestTimer(restTime);
    }
}

function activateCard(card, isSuperset = false) {
    card.classList.remove('locked', 'superset-next', 'active-move');
    card.classList.add(isSuperset ? 'superset-next' : 'active-move');
    if (isSuperset) playAudioCue('superset');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}
function deactivateCard(card) { card.classList.remove('active-move', 'superset-next'); card.classList.add('locked'); }
function markCardAsDone(card) { card.classList.remove('active-move', 'superset-next', 'locked'); card.classList.add('completed'); card.querySelectorAll('.dot').forEach(d => d.classList.add('done')); }

// --- TIMERS & AUDIO ---
function startTimer(card) {
    state.isTimerRunning = true; card.classList.add('timer-active');
    const ov = card.querySelector('.timer-overlay');
    let t = parseInt(card.dataset.time);
    ov.innerHTML = `${t} <span>Stop</span>`;
    state.timer = setInterval(() => { t--; ov.innerHTML = `${t} <span>Stop</span>`; if (t <= 0) stopTimer(card, true); }, 1000);
}
function stopTimer(card, finished) {
    clearInterval(state.timer); state.isTimerRunning = false; card.classList.remove('timer-active');
    card.querySelector('.timer-overlay').innerHTML = `${card.dataset.time} <span>Stop</span>`;
    if (finished) {
        playAudioCue('go');
        let c = parseInt(card.dataset.completed);
        if (c < parseInt(card.dataset.sets)) { card.dataset.completed = ++c; card.querySelectorAll('.dot')[c-1]?.classList.add('active'); handleSetCompletion(card); }
    }
}
function startRestTimer(seconds) {
    app.skipRest(); state.restTimeRemaining = seconds;
    const widget = document.getElementById('restWidget'); const display = document.getElementById('restTimeDisplay');
    widget.classList.add('show');
    state.restTimer = setInterval(() => {
        state.restTimeRemaining--;
        display.innerText = `${Math.floor(state.restTimeRemaining / 60).toString().padStart(2, '0')}:${(state.restTimeRemaining % 60).toString().padStart(2, '0')}`;
        if ([3, 2, 1].includes(state.restTimeRemaining)) playAudioCue('tick');
        else if (state.restTimeRemaining <= 0) { playAudioCue('go'); app.skipRest(); }
    }, 1000);
}
function initAudio() { if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (state.audioCtx.state === 'suspended') state.audioCtx.resume(); }
function playAudioCue(type) {
    if (!state.audioCtx) return;
    const o = state.audioCtx.createOscillator(); const g = state.audioCtx.createGain();
    o.connect(g); g.connect(state.audioCtx.destination);
    const now = state.audioCtx.currentTime;
    if (type === 'tick') { o.type = 'sine'; o.frequency.setValueAtTime(600, now); g.gain.setValueAtTime(0.1, now); o.start(now); o.stop(now + 0.1); }
    else if (type === 'go') { o.type = 'square'; o.frequency.setValueAtTime(880, now); g.gain.setValueAtTime(0.15, now); o.start(now); o.stop(now + 0.4); }
    else if (type === 'superset') { o.type = 'triangle'; o.frequency.setValueAtTime(400, now); o.frequency.setValueAtTime(600, now + 0.1); g.gain.setValueAtTime(0.1, now); o.start(now); o.stop(now + 0.2); }
}

window.app = app;