/**
 * Smart Workout Application - V5.1 (Fixed Execution Order + Smart Rest & Audio)
 */

// --- 1. GLOBAL STATE ---
const state = {
    workouts: null,
    assessmentSchema: null,
    currentDay: 'day1',
    apiKey: localStorage.getItem('gemini_api_key') || "",
    audioCtx: null,
    timer: null,
    isTimerRunning: false,
    restTimer: null,
    restTimeRemaining: 0
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    app.initTheme(); 
    createRestWidgetDOM(); // اضافه کردن ویجت استراحت به صفحه
    await loadDatabase();
    if (state.workouts) renderDay(state.currentDay);
});

function createRestWidgetDOM() {
    const widget = document.createElement('div');
    widget.id = 'restWidget';
    widget.className = 'rest-widget';
    widget.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:0.8rem; color:#ccc;">استراحت (Rest)</div>
            <div id="restTimeDisplay" class="rest-time-display">00:00</div>
        </div>
        <button class="rest-skip-btn" onclick="app.skipRest()">رد کردن ⏭</button>
    `;
    document.body.appendChild(widget);
}

async function loadDatabase() {
    try {
        const [workoutsRes, assessmentRes] = await Promise.all([
            fetch('./data/workouts.json'),
            fetch('./data/assessment.json').catch(() => ({ ok: false }))
        ]);

        if (workoutsRes.ok) {
            const data = await workoutsRes.json();
            state.workouts = data.days;
            console.log("✅ Workouts Loaded");
        }
        if (assessmentRes.ok) {
            const data = await assessmentRes.json();
            state.assessmentSchema = data.assessment_flow;
            console.log("✅ Assessment Schema Loaded");
        }
    } catch (error) {
        document.getElementById('app-container').innerHTML = `<h3 style="color:red;text-align:center">خطا در بارگذاری اطلاعات.</h3>`;
    }
}

// --- 3. RENDERING ---
function renderDay(dayId) {
    const container = document.getElementById('app-container');
    const dayData = state.workouts[dayId];
    if (!dayData) return;

    let html = `<div id="${dayId}" class="day-section active">`;
    html += `<div class="day-header"><h2>${dayData.title}</h2></div>`;

    dayData.parts.forEach(part => {
        html += `<div class="section-title">${part.title}</div>`;
        html += `<div class="grid-container">`;
        
        part.exercises.forEach(ex => {
            const isTime = ex.time !== undefined;
            const targetVal = isTime ? `${ex.time}s` : ex.reps;
            const targetIcon = isTime ? '⏱️' : '🔁'; 
            const defaultRest = ex.rest || 90; // زمان استراحت پیش‌فرض
            
            let dotsHtml = '<div class="progress-dots">';
            for(let i=0; i<ex.sets; i++) dotsHtml += '<div class="dot"></div>';
            dotsHtml += '</div>';

            html += `
            <div class="ex-card locked" 
                 data-code="${ex.code}" 
                 data-sets="${ex.sets}" 
                 data-completed="0"
                 data-rest="${defaultRest}"
                 ${isTime ? `data-time="${ex.time}"` : ''}
                 onclick="app.handleClick(this)">
                ${dotsHtml}
                <div class="ex-code">${ex.code}</div>
                <span class="ex-name-en">${ex.name_en}</span>
                <span class="ex-name-fa">${ex.name_fa}</span>
                
                <div class="ex-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🔢</span>
                        <span class="stat-val">${ex.sets}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">${targetIcon}</span>
                        <span class="stat-val">${targetVal}</span>
                    </div>
                </div>
                
                <div class="ex-note">
                    ${ex.note}
                    <div class="ai-row"><button class="ai-hint-btn" onclick="app.askAI(event, '${ex.ai_query}')">✨</button></div>
                </div>
                ${isTime ? `<div class="timer-overlay">${ex.time}<span>Stop</span></div>` : ''}
            </div>`;
        });
        html += `</div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    
    const firstCard = container.querySelector('.ex-card');
    if(firstCard) activateCard(firstCard);
}

// --- 4. LOGIC ENGINE (Restored exactly to your working logic) ---
function getGroupId(code) {
    if (/^[a-zA-Z]/.test(code)) return code.charAt(0).toUpperCase();
    const match = code.match(/^\d+/);
    return match ? parseInt(match[0]) : code;
}

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

function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const currentCode = currentCard.dataset.code;
    const currentGroupId = getGroupId(currentCode);
    
    const groupCards = allCards.filter(c => getGroupId(c.dataset.code) === currentGroupId);
    const currentIndexInGroup = groupCards.indexOf(currentCard);

    const completed = parseInt(currentCard.dataset.completed);
    const total = parseInt(currentCard.dataset.sets);
    const isCurrentTotallyDone = completed >= total;

    if (isCurrentTotallyDone) {
        markCardAsDone(currentCard);
    } else {
        deactivateCard(currentCard);
    }

    let nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);
    let isSupersetTransition = false;

    if (nextCard) {
        // تشخیص هوشمند سوپرست: اگر کارت بعدی در لیست پایین‌تر از کارت فعلی است
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

    // کنترل استراحت بر اساس اینکه حرکت بعدی سوپرست است یا خیر
    if (isSupersetTransition) {
        app.skipRest(); 
    } else {
        const restTime = parseInt(currentCard.dataset.rest) || 90;
        startRestTimer(restTime);
    }
}

// --- 5. UI HELPERS ---
function activateCard(card, isSupersetAlert = false) {
    card.classList.remove('locked', 'superset-next', 'active-move');
    if (isSupersetAlert) {
        card.classList.add('superset-next');
        playAudioCue('superset');
    } else {
        card.classList.add('active-move');
    }
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

// --- 6. REST TIMER & AUDIO ENGINE ---
function startRestTimer(seconds) {
    app.skipRest(); 
    state.restTimeRemaining = seconds;
    const widget = document.getElementById('restWidget');
    const display = document.getElementById('restTimeDisplay');
    
    widget.classList.add('show');
    
    state.restTimer = setInterval(() => {
        state.restTimeRemaining--;
        const m = Math.floor(state.restTimeRemaining / 60).toString().padStart(2, '0');
        const s = (state.restTimeRemaining % 60).toString().padStart(2, '0');
        display.innerText = `${m}:${s}`;

        if (state.restTimeRemaining === 3 || state.restTimeRemaining === 2 || state.restTimeRemaining === 1) {
            playAudioCue('tick');
        } else if (state.restTimeRemaining <= 0) {
            playAudioCue('go');
            app.skipRest();
        }
    }, 1000);
}

function initAudio() {
    if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
}

function playAudioCue(type) {
    if (!state.audioCtx) return;
    const o = state.audioCtx.createOscillator();
    const g = state.audioCtx.createGain();
    o.connect(g); g.connect(state.audioCtx.destination);
    
    const now = state.audioCtx.currentTime;
    if (type === 'tick') {
        o.type = 'sine'; o.frequency.setValueAtTime(600, now);
        g.gain.setValueAtTime(0.1, now); o.start(now); o.stop(now + 0.1);
    } else if (type === 'go') {
        o.type = 'square'; o.frequency.setValueAtTime(880, now);
        g.gain.setValueAtTime(0.15, now); o.start(now); o.stop(now + 0.4);
    } else if (type === 'superset') {
        o.type = 'triangle'; o.frequency.setValueAtTime(400, now);
        o.frequency.setValueAtTime(600, now + 0.1);
        g.gain.setValueAtTime(0.1, now); o.start(now); o.stop(now + 0.2);
    }
}

// --- 7. INTERACTION, THEME & ASSESSMENT ---
const app = {
    skipRest: () => {
        clearInterval(state.restTimer);
        const w = document.getElementById('restWidget');
        if(w) w.classList.remove('show');
    },

    switchDay: (dayId) => {
        if(state.isTimerRunning) return alert('ابتدا تایمر را متوقف کنید!');
        app.skipRest();
        state.currentDay = dayId;
        renderDay(dayId);
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
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        app.updateMetaColor(next);
        app.updateThemeIcon(next);
    },

    updateMetaColor: (theme) => {
        const color = theme === 'dark' ? '#1e1e1e' : '#2c3e50';
        const meta = document.querySelector('meta[name="theme-color"]');
        if(meta) meta.setAttribute('content', color);
    },

    updateThemeIcon: (theme) => {
        const icon = document.getElementById('themeIcon');
        if(icon) {
            icon.innerText = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    initTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        app.updateMetaColor(savedTheme);
        app.updateThemeIcon(savedTheme);
    },

    showAssessment: () => {
        if(state.isTimerRunning) return alert('ابتدا تایمر را متوقف کنید!');
        app.skipRest();
        if(!state.assessmentSchema) return alert('فرم ارزیابی هنوز لود نشده است!');
        
        state.currentDay = 'assessment';
        const container = document.getElementById('app-container');
        const schema = state.assessmentSchema;
        const savedData = JSON.parse(localStorage.getItem('user_assessment') || '{}');

        let html = `<div class="day-section active">
            <div class="day-header"><h2>${schema.title}</h2></div>
            <form id="assessmentForm" onsubmit="app.submitAssessment(event)">`;

        schema.sections.forEach(sec => {
            html += `<div class="ex-card" style="margin-bottom:20px; cursor:default; transform:none; opacity:1; filter:none; animation:none; border-color:var(--glass-border);">
                        <h3 style="color:var(--accent); margin-top:0;">${sec.title}</h3>
                        ${sec.description ? `<p style="font-size:0.85rem; color:var(--text-secondary)">${sec.description}</p>` : ''}`;
            
            sec.questions.forEach(q => {
                const val = savedData[q.id] || '';
                html += `<div style="margin-top:15px; text-align:right;">
                            <label style="font-weight:bold; font-size:0.95rem; display:block;">${q.text}</label>`;
                
                if (q.type === 'textarea' || q.input_type === 'textarea') {
                    html += `<textarea name="${q.id}" class="glass-input" placeholder="${q.placeholder || ''}">${val}</textarea>`;
                } else if (q.type === 'number' || q.input_type === 'number') {
                    html += `<input type="number" name="${q.id}" class="glass-input" placeholder="${q.placeholder || ''}" value="${val}">`;
                } else if (q.type === 'select' || q.input_type === 'select' || q.type === 'boolean' || q.input_type === 'boolean') {
                    html += `<select name="${q.id}" class="glass-input">
                                <option value="">انتخاب کنید...</option>`;
                    q.options.forEach(opt => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        const selected = (val === optValue) ? 'selected' : '';
                        html += `<option value="${optValue}" ${selected}>${optLabel}</option>`;
                    });
                    html += `</select>`;
                }
                html += `</div>`;
            });
            html += `</div>`;
        });

        html += `<button type="submit" class="save-btn" style="margin-top:10px; padding:15px; font-size:1.1rem; border-radius:15px; background:var(--accent);">
                    💾 ثبت و ذخیره پروفایل بدنی
                 </button>
                 </form></div>`;
        
        container.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    submitAssessment: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const answers = Object.fromEntries(formData.entries());
        localStorage.setItem('user_assessment', JSON.stringify(answers));
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerText = "✅ با موفقیت ذخیره شد!";
        btn.style.background = "var(--success)";
        
        setTimeout(() => {
            app.switchDay('day1'); 
        }, 1500);
    },

    handleClick: (card) => {
        app.skipRest(); // با کلیک کاربر، استراحت قطع می‌شود
        
        if (!card.classList.contains('active-move') && !card.classList.contains('superset-next')) return; 

        initAudio();

        if (card.dataset.time) {
            if (card.classList.contains('timer-active')) {
                stopTimer(card, false);
            } else {
                if (state.isTimerRunning) return;
                startTimer(card);
            }
            return;
        }

        if (state.isTimerRunning) return;
        
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            completed++;
            card.dataset.completed = completed;
            card.querySelectorAll('.dot')[completed-1]?.classList.add('active');
            handleSetCompletion(card);
        }
    },

    toggleChat: () => document.getElementById('chatWindow').classList.toggle('open'),
    askAI: (e, query) => { e.stopPropagation(); app.toggleChat(); app.sendMessage(query); },
sendMessage: async (txt) => {
        const input = document.getElementById('chatInput');
        const text = txt || input.value;
        if(!text) return;
        
        const body = document.getElementById('chatBody');
        
        // 1. نمایش پیام کاربر (با قابلیت تشخیص خودکار جهت زبان)
        body.innerHTML += `<div class="msg user" dir="auto">${text}</div>`;
        input.value = '';
        
        // اسکرول نرم به پایین
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const id = Date.now();
        // 2. نمایش انیمیشن در حال تایپ
        body.innerHTML += `<div class="msg ai" id="${id}" dir="auto"><span style="color:var(--text-secondary);font-size:0.85rem;">... در حال تحلیل ...</span></div>`;
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const userProfileRaw = localStorage.getItem('user_assessment');
        let profileContext = "User has not completed the assessment yet.";
        if(userProfileRaw) {
            const p = JSON.parse(userProfileRaw);
            profileContext = `User Physical Profile => Pullups: ${p.pullups}, Pushups: ${p.pushups}, Plank: ${p.plank}sec, Sleep: ${p.sleep}h/night, Injuries: ${p.injury}, Shoulder Mobility: ${p.shoulder_mob}, Hamstring Mobility: ${p.hamstring_mob}. Use this context to personalize your advice.`;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    contents: [{ 
                        parts: [{ 
                            text: `Act as an Elite Fitness Coach. ${profileContext} User Question: ${text}` 
                        }] 
                    }] 
                })
            });
            const d = await res.json();
            let rawText = d.candidates?.[0]?.content?.parts?.[0]?.text || "خطا در دریافت پاسخ.";
            
            // --- مفسر Markdown ساده ---
            // تبدیل **متن** به <strong>متن</strong>
            let formattedText = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // تبدیل *متن* به <em>متن</em>
            formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
            // تبدیل اینترها به تگ <br>
            formattedText = formattedText.replace(/\n/g, '<br>');

            document.getElementById(id).innerHTML = formattedText;
            
            // اسکرول نهایی بعد از لود شدن جواب کامل
            setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        } catch(e) { 
            document.getElementById(id).innerHTML = "<strong style='color:#e74c3c;'>Error:</strong> لطفا بررسی کنید API Key ذخیره شده باشد و اینترنت وصل باشد."; 
        }
    }
};

// --- 8. EXERCISE TIMER ---
function startTimer(card) {
    state.isTimerRunning = true;
    card.classList.add('timer-active');
    const ov = card.querySelector('.timer-overlay');
    let t = parseInt(card.dataset.time);
    ov.innerHTML = `${t} <span>Stop</span>`;
    state.timer = setInterval(() => {
        t--;
        ov.innerHTML = `${t} <span>Stop</span>`;
        if (t <= 0) stopTimer(card, true);
    }, 1000);
}

function stopTimer(card, finished) {
    clearInterval(state.timer);
    state.isTimerRunning = false;
    card.classList.remove('timer-active');
    card.querySelector('.timer-overlay').innerHTML = `${card.dataset.time} <span>Stop</span>`;
    if (finished) {
        playAudioCue('go');
        let c = parseInt(card.dataset.completed);
        if (c < parseInt(card.dataset.sets)) {
            card.dataset.completed = ++c;
            card.querySelectorAll('.dot')[c-1]?.classList.add('active');
            handleSetCompletion(card);
        }
    }
}

window.app = app;