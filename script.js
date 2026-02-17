/**
 * Smart Workout Application - Main Logic Controller
 * Features:
 * - Dynamic JSON Database Loading
 * - Intelligent Logic for Straight Sets, Supersets (1a/1b), and Circuits (A1/A2)
 * - Built-in Interval Timer
 * - Google Gemini AI Chat Integration
 */

// --- 1. GLOBAL STATE MANAGEMENT ---
const state = {
    workouts: null,             // Stores the loaded JSON data
    currentDay: 'day1',         // Default active day
    apiKey: localStorage.getItem('gemini_api_key') || "", // AI API Key
    audioCtx: null,             // Audio Context for sound effects
    timer: null,                // Reference to active timer interval
    isTimerRunning: false       // Flag to prevent multiple timers
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadDatabase();
    
    // Render the default day if data loaded successfully
    if (state.workouts) {
        renderDay(state.currentDay);
    }
});

/**
 * Loads workout data from external JSON file.
 * Logic is separated from Data for easier updates.
 */
async function loadDatabase() {
    try {
        const response = await fetch('./data/workouts.json');
        if (!response.ok) throw new Error('HTTP Error: ' + response.status);
        
        const data = await response.json();
        state.workouts = data.days;
        console.log("✅ Database Loaded:", state.workouts);
    } catch (error) {
        console.error("❌ Database Error:", error);
        document.getElementById('app-container').innerHTML = `
            <div style="text-align:center; padding:50px; color:red;">
                <h3>Error Loading Data</h3>
                <p>${error.message}</p>
                <p>Ensure you are running on a Local Server or GitHub Pages.</p>
            </div>`;
    }
}

// --- 3. RENDERING ENGINE ---

/**
 * Renders the specific workout day into the DOM.
 */
function renderDay(dayId) {
    const container = document.getElementById('app-container');
    const dayData = state.workouts[dayId];
    
    if (!dayData) return;

    let html = `<div id="${dayId}" class="day-section active">`;
    html += `<div class="day-header"><h2>${dayData.title}</h2></div>`;

    // Loop through workout parts
    dayData.parts.forEach(part => {
        html += `<div class="section-title">${part.title}</div>`;
        html += `<div class="grid-container">`;
        
        // Loop through exercises
        part.exercises.forEach(ex => {
            const isTime = ex.time !== undefined;
            const targetVal = isTime ? `${ex.time}s` : ex.reps;
            const targetLabel = isTime ? 'Time' : 'Reps';
            
            // Generate Progress Dots
            let dotsHtml = '<div class="progress-dots">';
            for(let i=0; i<ex.sets; i++) dotsHtml += '<div class="dot"></div>';
            dotsHtml += '</div>';

            // Build Card HTML (Initially Locked)
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
                    <div class="stat-item">
                        <span class="stat-label">Sets</span>
                        <span class="stat-val">${ex.sets}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">${targetLabel}</span>
                        <span class="stat-val">${targetVal}</span>
                    </div>
                </div>
                
                <div class="ex-note">
                    ${ex.note}
                    <div class="ai-row">
                        <button class="ai-hint-btn" onclick="app.askAI(event, '${ex.ai_query}')">✨</button>
                    </div>
                </div>
                
                ${isTime ? `<div class="timer-overlay">${ex.time}<span>Click to Stop</span></div>` : ''}
            </div>`;
        });
        
        html += `</div>`; // End Grid
    });

    html += `</div>`; // End Section
    container.innerHTML = html;
    
    // Unlock the first card to start the workout
    const firstCard = container.querySelector('.ex-card');
    if(firstCard) activateCard(firstCard);
}

// --- 4. CORE LOGIC ENGINE (THE BRAIN) --- [Updated]

/**
 * Determines the Group ID of an exercise.
 * - Starts with Letter (A1, B2) -> Group is "A", "B"
 * - Starts with Number (1a, 2b) -> Group is "1", "2"
 */
function getGroupId(code) {
    // Check if it starts with a Letter (Warmup/Circuit style: A1, A2...)
    if (/^[a-zA-Z]/.test(code)) {
        return code.charAt(0).toUpperCase(); // Returns "A"
    }
    // Check if it starts with a Number (Superset style: 1a, 1b...)
    const match = code.match(/^\d+/);
    if (match) {
        return parseInt(match[0]); // Returns 1
    }
    return code; // Fallback
}

/**
 * Handles the logic when a set is completed.
 * Decides whether to loop (superset) or move forward.
 */
function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const currentCode = currentCard.dataset.code;
    
    // 1. Identify the Family/Group
    const currentGroupId = getGroupId(currentCode);
    
    // 2. Find all cards belonging to this Group
    const groupCards = allCards.filter(card => {
        return getGroupId(card.dataset.code) === currentGroupId;
    });

    // 3. Find current position within the group
    const currentIndexInGroup = groupCards.indexOf(currentCard);
    
    // 4. Check Set Status
    const completedSets = parseInt(currentCard.dataset.completed);
    const targetSets = parseInt(currentCard.dataset.sets);
    const isCardFinished = completedSets >= targetSets;

    // --- DECISION LOGIC ---

    // Scenario A: Is there a next exercise in this Group? (e.g., A1 -> A2, or 1a -> 1b)
    if (currentIndexInGroup < groupCards.length - 1) {
        // Move to next sibling in group
        deactivateCard(currentCard);
        activateCard(groupCards[currentIndexInGroup + 1]);
    } 
    // Scenario B: We are at the end of the Group (e.g., A4 or 1b)
    else {
        // Have we finished ALL sets for the current card?
        // (Assumption: In circuits/supersets, all exercises usually have same set count)
        if (isCardFinished) {
            // SUCCESS: The whole group is done.
            // Mark all members as Green/Done
            groupCards.forEach(c => markCardAsDone(c));
            
            // Find the global index to jump to the NEXT Group
            const globalIndex = allCards.indexOf(currentCard);
            
            // Search for the next available unfinished card
            for (let i = globalIndex + 1; i < allCards.length; i++) {
                const nextGlobalCard = allCards[i];
                if (!nextGlobalCard.classList.contains('completed')) {
                    activateCard(nextGlobalCard);
                    break;
                }
            }
        } 
        else {
            // LOOP: Sets remain. Go back to the START of the group (A1 or 1a).
            deactivateCard(currentCard);
            activateCard(groupCards[0]);
        }
    }
}

// --- 5. UI HELPER FUNCTIONS ---

function activateCard(card) {
    card.classList.remove('locked');
    card.classList.add('active-move');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) {
    // Visually dim the card to show it's "waiting" for its turn in the loop
    card.classList.remove('active-move');
    card.style.opacity = "0.7"; 
    card.style.transform = "scale(0.98)";
}

function markCardAsDone(card) {
    card.classList.remove('active-move');
    card.classList.add('completed');
    // Reset styles
    card.style.opacity = "1"; 
    card.style.transform = "scale(1)";
    // Turn all dots green
    card.querySelectorAll('.dot').forEach(d => d.classList.add('done'));
}

// --- 6. INTERACTION HANDLERS (The 'app' Object) ---

const app = {
    // Switch Day Logic
    switchDay: (dayId) => {
        if(state.isTimerRunning) {
            alert('Please stop the timer first!');
            return;
        }
        state.currentDay = dayId;
        renderDay(dayId);
    },

    // Settings Modal
    toggleSettings: () => {
        document.getElementById('settingsModal').classList.toggle('open');
    },

    saveApiKey: () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            app.toggleSettings();
            alert('API Key Saved!');
        }
    },

    // MAIN CLICK HANDLER
    handleClick: (card) => {
        if (card.classList.contains('locked')) return;
        
        // Initialize Audio (Browser requires user gesture)
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } else if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }

        // A. TIMER LOGIC
        if (card.dataset.time) {
            if (card.classList.contains('completed')) return;
            
            if (card.classList.contains('timer-active')) {
                stopTimer(card, false); // Manually stopped
            } else {
                if (state.isTimerRunning) return; // Only one timer at a time
                startTimer(card);
            }
            return;
        }

        // B. REPS LOGIC
        if (state.isTimerRunning) return; // Prevent clicks while timer runs
        
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            completed++;
            card.dataset.completed = completed;
            
            // Light up the dot
            const dots = card.querySelectorAll('.dot');
            if(dots[completed-1]) dots[completed-1].classList.add('active');
            
            // Trigger Next Move Logic
            handleSetCompletion(card);
        }
    },

    // Chat / AI Logic
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
        
        const body = document.getElementById('chatBody');
        body.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = '';
        
        const loadingId = 'loading-' + Date.now();
        body.innerHTML += `<div class="msg ai" id="${loadingId}">...</div>`;
        body.scrollTop = body.scrollHeight;

        if(!state.apiKey) {
            document.getElementById(loadingId).innerText = "Please set API Key in settings.";
            return;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${state.apiKey}`;
            const context = "User: Ali, 23yo, 178cm, 83kg. Goal: Hybrid Athlete.";
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Context: ${context}. Question: ${text}` }] }]
                })
            });
            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
            document.getElementById(loadingId).innerText = aiText;
        } catch(e) {
            document.getElementById(loadingId).innerText = "Error: " + e.message;
        }
    }
};

// --- 7. TIMER FUNCTIONS ---

function startTimer(card) {
    state.isTimerRunning = true;
    card.classList.add('timer-active');
    
    const overlay = card.querySelector('.timer-overlay');
    let timeLeft = parseInt(card.dataset.time);
    overlay.innerHTML = `${timeLeft} <span>Click to Stop</span>`;

    state.timer = setInterval(() => {
        timeLeft--;
        overlay.innerHTML = `${timeLeft} <span>Click to Stop</span>`;
        
        if (timeLeft <= 0) {
            stopTimer(card, true); // Finished naturally
        }
    }, 1000);
}

function stopTimer(card, finishedNaturally) {
    clearInterval(state.timer);
    state.isTimerRunning = false;
    state.timer = null;
    card.classList.remove('timer-active');
    
    // Reset text
    card.querySelector('.timer-overlay').innerHTML = `${card.dataset.time} <span>Click to Stop</span>`;

    if (finishedNaturally) {
        playSound();
        
        // Treat timer finish like a rep completion
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            completed++;
            card.dataset.completed = completed;
            const dots = card.querySelectorAll('.dot');
            if(dots[completed-1]) dots[completed-1].classList.add('active');
            
            handleSetCompletion(card);
        }
    }
}

// --- 8. SOUND ---
function playSound() {
    if (!state.audioCtx) return;
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, state.audioCtx.currentTime);
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.3);
}

// Expose app to global scope
window.app = app;