/**
 * Smart Workout Application - V3.0 (Pro Logic)
 * Features:
 * - Dynamic Superset/Giant Set Logic with Uneven Sets (Skip finished cards)
 * - Strict Click Enforcement (Only active card is clickable)
 * - Gemini AI Integration
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

// --- 4. LOGIC ENGINE (The Brain) ---

function getGroupId(code) {
    if (/^[a-zA-Z]/.test(code)) return code.charAt(0).toUpperCase();
    const match = code.match(/^\d+/);
    return match ? parseInt(match[0]) : code;
}

/**
 * Finds the next card in the sequence that is NOT finished yet.
 * Handles wrapping around (Looping) for Supersets.
 */
function findNextUnfinishedInGroup(groupCards, startIndex) {
    const len = groupCards.length;
    // Check from current+1 to end, then from 0 to current
    for (let i = 1; i <= len; i++) {
        const checkIndex = (startIndex + i) % len;
        const card = groupCards[checkIndex];
        const completed = parseInt(card.dataset.completed);
        const total = parseInt(card.dataset.sets);
        
        // If this card still has sets remaining, return it
        if (completed < total) {
            return card;
        }
    }
    return null; // All cards in group are finished
}

function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const currentCode = currentCard.dataset.code;
    const currentGroupId = getGroupId(currentCode);
    
    // Find Group
    const groupCards = allCards.filter(c => getGroupId(c.dataset.code) === currentGroupId);
    const currentIndexInGroup = groupCards.indexOf(currentCard);

    // Check if current card is totally done
    const completed = parseInt(currentCard.dataset.completed);
    const total = parseInt(currentCard.dataset.sets);
    const isCurrentTotallyDone = completed >= total;

    if (isCurrentTotallyDone) {
        markCardAsDone(currentCard);
    } else {
        deactivateCard(currentCard); // Dim it while waiting
    }

    // --- PRO LOGIC: Find next valid move ---
    // Instead of just looking at the neighbor, we look for the next UNFINISHED card.
    const nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);

    if (nextCard) {
        // We found a card in this group that needs work (could be next sibling, or loop back)
        activateCard(nextCard);
    } else {
        // No cards left in this group! The whole group is done.
        // Move to the next Global Group.
        const globalIndex = allCards.indexOf(currentCard); // Index of the card just finished
        
        // Look ahead in the DOM for the next unlocked/incomplete card
        // Note: We scan from the LAST card of the group to be safe, or just scan forward
        // A safer bet is to scan from the current position forward
        for (let i = globalIndex + 1; i < allCards.length; i++) {
            const potentialNext = allCards[i];
            // Must belong to a different group (implicitly true as we cycle linear)
            // and must not be done
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
    card.classList.add('active-move'); // This class allows clicking
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) {
    card.classList.remove('active-move');
    card.classList.add('locked'); // Prevent clicking
    // Visuals handled by CSS for .locked
}

function markCardAsDone(card) {
    card.classList.remove('active-move');
    card.classList.add('completed');
    card.classList.remove('locked'); // Keep it visible but green
    card.querySelectorAll('.dot').forEach(d => d.classList.add('done'));
}

// --- 6. INTERACTION ---

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

    handleClick: (card) => {
        // --- STRICT CLICK ENFORCEMENT ---
        // Only allow if card is 'active-move' OR completed (to un-complete? maybe later)
        // For now: strictly active-move
        if (!card.classList.contains('active-move')) {
            // Optional: Shake effect or console log
            console.log("Not your turn!");
            return; 
        }

        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (state.audioCtx.state === 'suspended') state.audioCtx.resume();

        // Timer Logic
        if (card.dataset.time) {
            if (card.classList.contains('timer-active')) {
                stopTimer(card, false);
            } else {
                if (state.isTimerRunning) return;
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
            card.querySelectorAll('.dot')[completed-1]?.classList.add('active');
            handleSetCompletion(card);
        }
    },

    // Chat Logic
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