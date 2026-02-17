/**
 * Smart Workout Application - V3.2
 * Features: Dark Mode Island, Dynamic Supersets, AI Integration
 */

// --- 1. GLOBAL STATE ---
const state = {
    workouts: null,
    currentDay: 'day1',
    apiKey: localStorage.getItem('gemini_api_key') || "",
    audioCtx: null,
    timer: null,
    isTimerRunning: false
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    app.initTheme(); // Initialize Theme Preference first
    await loadDatabase();
    if (state.workouts) renderDay(state.currentDay);
});

async function loadDatabase() {
    try {
        const response = await fetch('./data/workouts.json');
        if (!response.ok) throw new Error('HTTP Error');
        const data = await response.json();
        state.workouts = data.days;
        console.log("✅ Database Loaded");
    } catch (error) {
        document.getElementById('app-container').innerHTML = `<h3 style="color:red;text-align:center">Error loading database. Check console.</h3>`;
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
            const targetLabel = isTime ? 'Time' : 'Reps';
            
            let dotsHtml = '<div class="progress-dots">';
            for(let i=0; i<ex.sets; i++) dotsHtml += '<div class="dot"></div>';
            dotsHtml += '</div>';

            html += `
            <div class="ex-card locked" 
                 data-code="${ex.code}" 
                 data-sets="${ex.sets}" 
                 data-completed="0"
                 ${isTime ? `data-time="${ex.time}"` : ''}
                 onclick="app.handleClick(this)">
                ${dotsHtml}
                <div class="ex-code">${ex.code}</div>
                <span class="ex-name-en">${ex.name_en}</span>
                <span class="ex-name-fa">${ex.name_fa}</span>
                <div class="ex-stats">
                    <div class="stat-item"><span class="stat-label">Sets</span><span class="stat-val">${ex.sets}</span></div>
                    <div class="stat-item"><span class="stat-label">${targetLabel}</span><span class="stat-val">${targetVal}</span></div>
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
    
    // Unlock first card
    const firstCard = container.querySelector('.ex-card');
    if(firstCard) activateCard(firstCard);
}

// --- 4. LOGIC ENGINE ---

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

    const nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);

    if (nextCard) {
        activateCard(nextCard);
    } else {
        const globalIndex = allCards.indexOf(currentCard);
        for (let i = globalIndex + 1; i < allCards.length; i++) {
            const potentialNext = allCards[i];
            if (!potentialNext.classList.contains('completed')) {
                activateCard(potentialNext);
                return;
            }
        }
    }
}

// --- 5. UI HELPERS ---

function activateCard(card) {
    card.classList.remove('locked');
    card.classList.add('active-move');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) {
    card.classList.remove('active-move');
    card.classList.add('locked');
}

function markCardAsDone(card) {
    card.classList.remove('active-move');
    card.classList.add('completed');
    card.classList.remove('locked');
    card.querySelectorAll('.dot').forEach(d => d.classList.add('done'));
}

// --- 6. INTERACTION & THEME ---

const app = {
    switchDay: (dayId) => {
        if(state.isTimerRunning) return alert('Stop timer first!');
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

    // --- Theme Logic ---
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
            // If dark, show Sun (to switch to light). If light, show Moon.
            icon.innerText = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    initTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        app.updateMetaColor(savedTheme);
        app.updateThemeIcon(savedTheme);
    },
    // -------------------

    handleClick: (card) => {
        if (!card.classList.contains('active-move')) {
            console.log("Not your turn!");
            return; 
        }

        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (state.audioCtx.state === 'suspended') state.audioCtx.resume();

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
        body.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = '';
        const id = Date.now();
        body.innerHTML += `<div class="msg ai" id="${id}">...</div>`;
        body.scrollTop = body.scrollHeight;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${state.apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ contents: [{ parts: [{ text: `Fitness Coach Context. User: Ali. Q: ${text}` }] }] })
            });
            const d = await res.json();
            document.getElementById(id).innerText = d.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
        } catch(e) { document.getElementById(id).innerText = "Error: " + e.message; }
    }
};

// --- 7. TIMER ---
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
        playSound();
        let s = parseInt(card.dataset.sets);
        let c = parseInt(card.dataset.completed);
        if (c < s) {
            c++;
            card.dataset.completed = c;
            card.querySelectorAll('.dot')[c-1]?.classList.add('active');
            handleSetCompletion(card);
        }
    }
}

function playSound() {
    if (!state.audioCtx) return;
    const o = state.audioCtx.createOscillator();
    const g = state.audioCtx.createGain();
    o.connect(g); g.connect(state.audioCtx.destination);
    o.frequency.setValueAtTime(880, state.audioCtx.currentTime);
    g.gain.setValueAtTime(0.1, state.audioCtx.currentTime);
    o.start(); o.stop(state.audioCtx.currentTime + 0.3);
}

window.app = app;