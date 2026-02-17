// --- Application State ---
const state = {
    workouts: null,
    currentDay: 'day1',
    apiKey: localStorage.getItem('gemini_api_key') || "",
    audioCtx: null,
    timer: null,
    isTimerRunning: false
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadDatabase();
    renderDay(state.currentDay);
});

// --- Logic: Load Database ---
async function loadDatabase() {
    try {
        const response = await fetch('./data/workouts.json');
        if (!response.ok) throw new Error('Failed to load DB');
        const data = await response.json();
        state.workouts = data.days;
        console.log("Database loaded:", state.workouts);
    } catch (error) {
        document.getElementById('app-container').innerHTML = `<h3 style="color:red; text-align:center;">خطا در بارگذاری دیتابیس. لطفا از Local Server استفاده کنید.<br>${error.message}</h3>`;
    }
}

// --- Logic: Render UI ---
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
            
            // Generate dots HTML
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
                    <div class="ai-row">
                        <button class="ai-hint-btn" onclick="app.askAI(event, '${ex.ai_query}')">✨</button>
                    </div>
                </div>
                ${isTime ? `<div class="timer-overlay">${ex.time}<span>توقف</span></div>` : ''}
            </div>`;
        });
        
        html += `</div>`; // End grid
    });

    html += `</div>`; // End day section
    container.innerHTML = html;
    
    // Unlock first card
    const firstCard = container.querySelector('.ex-card');
    if(firstCard) {
        firstCard.classList.remove('locked');
        firstCard.classList.add('active-move');
    }
}

// --- Interaction Handlers (Exposed via 'app' object) ---
const app = {
    switchDay: (dayId) => {
        if(state.isTimerRunning) return alert('تایمر را متوقف کنید.');
        state.currentDay = dayId;
        renderDay(dayId);
    },

    toggleSettings: () => {
        document.getElementById('settingsModal').classList.toggle('open');
    },

    saveApiKey: () => {
        const key = document.getElementById('apiKeyInput').value;
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            app.toggleSettings();
            alert('ذخیره شد');
        }
    },

    handleClick: (card) => {
        if (card.classList.contains('locked')) return;
        
        // Sound unlock
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } else if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }

        // Timer Logic
        if (card.dataset.time) {
            if (card.classList.contains('completed')) return;
            if (card.classList.contains('timer-active')) {
                // Stop Timer
                clearInterval(state.timer);
                state.isTimerRunning = false;
                card.classList.remove('timer-active');
                card.querySelector('.timer-overlay').innerHTML = card.dataset.time + '<span>توقف</span>';
            } else {
                // Start Timer
                if (state.isTimerRunning) return; // Only one timer at a time
                startTimer(card);
            }
            return;
        }

        // Reps Logic
        if (state.isTimerRunning) return;
        
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            completed++;
            card.dataset.completed = completed;
            const dots = card.querySelectorAll('.dot');
            if(dots[completed-1]) dots[completed-1].classList.add('active');
            handleNextMove(card, completed, sets);
        }
    },

    // Chat Functions
    toggleChat: () => document.getElementById('chatWindow').classList.toggle('open'),
    
    askAI: (e, query) => {
        e.stopPropagation();
        app.toggleChat();
        app.sendMessage(query);
    },

    sendMessage: async (textOverride = null) => {
        const input = document.getElementById('chatInput');
        const text = textOverride || input.value;
        if(!text) return;
        
        // UI Update
        const body = document.getElementById('chatBody');
        body.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = '';
        const loadingId = Date.now();
        body.innerHTML += `<div class="msg ai" id="${loadingId}">...</div>`;
        body.scrollTop = body.scrollHeight;

        if(!state.apiKey) {
            document.getElementById(loadingId).innerText = "کلید API را تنظیم کنید.";
            return;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${state.apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Fitness Coach Context. User: Ali. Q: ${text}` }] }]
                })
            });
            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
            document.getElementById(loadingId).innerText = aiText;
        } catch(e) {
            document.getElementById(loadingId).innerText = "Error: " + e.message;
        }
    }
};

// --- Internal Helper Functions ---
function startTimer(card) {
    state.isTimerRunning = true;
    card.classList.add('timer-active');
    const overlay = card.querySelector('.timer-overlay');
    let timeLeft = parseInt(card.dataset.time);
    overlay.innerHTML = timeLeft;

    state.timer = setInterval(() => {
        timeLeft--;
        overlay.innerHTML = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(state.timer);
            state.isTimerRunning = false;
            card.classList.remove('timer-active');
            playSound();
            
            // Auto progress logic same as reps
            let sets = parseInt(card.dataset.sets);
            let completed = parseInt(card.dataset.completed);
            completed++;
            card.dataset.completed = completed;
            const dots = card.querySelectorAll('.dot');
            if(dots[completed-1]) dots[completed-1].classList.add('active');
            handleNextMove(card, completed, sets);
        }
    }, 1000);
}

function handleNextMove(card, completed, totalSets) {
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const index = allCards.indexOf(card);
    const code = card.dataset.code;

    // Logic: If incomplete, check logic (like A4 -> A1 loop), else check set completion
    if (completed < totalSets) {
        // Just visual updates or loops (A1-A4 cycle)
        if (code.startsWith('A') && code !== 'A4') {
            card.classList.add('locked');
            card.classList.remove('active-move');
            allCards[index+1].classList.remove('locked');
            allCards[index+1].classList.add('active-move');
            allCards[index+1].scrollIntoView({behavior:"smooth", block:"center"});
        } else if (code === 'A4') {
             // Loop back to start of A cycle (approx logic)
             card.classList.add('locked');
             card.classList.remove('active-move');
             const a1 = allCards.find(c => c.dataset.code === 'A1');
             a1.classList.remove('locked');
             a1.classList.add('active-move');
             a1.scrollIntoView({behavior:"smooth", block:"center"});
        }
    } else {
        // Set Finished
        card.classList.add('completed');
        card.querySelectorAll('.dot').forEach(d => d.classList.add('done'));
        card.classList.remove('active-move');

        // Move to next available card
        const nextCard = allCards[index + 1];
        if (nextCard) {
            nextCard.classList.remove('locked');
            nextCard.classList.add('active-move');
            nextCard.scrollIntoView({behavior:"smooth", block:"center"});
        }
    }
}

function playSound() {
    if (!state.audioCtx) return;
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.frequency.setValueAtTime(800, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, state.audioCtx.currentTime);
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.5);
}

// Make 'app' global so HTML onclicks work
window.app = app;