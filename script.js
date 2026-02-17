/**
 * Smart Workout Application Logic
 * Handles database loading, UI rendering, workout flow (Supersets/Straight sets),
 * Timer management, and AI integration.
 */

// --- Global Application State ---
const state = {
    workouts: null,             // Will hold the loaded JSON data
    currentDay: 'day1',         // Default active day
    apiKey: localStorage.getItem('gemini_api_key') || "", // Google Gemini API Key
    audioCtx: null,             // Audio Context for sound effects
    timer: null,                // Active timer interval reference
    isTimerRunning: false       // Flag to prevent multiple timers
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadDatabase();
    // Render the default day once DB is loaded
    if (state.workouts) {
        renderDay(state.currentDay);
    }
});

/**
 * Loads the workout structure from the external JSON file.
 * This makes the app modular; logic is separated from data.
 */
async function loadDatabase() {
    try {
        // Fetch the JSON file from the data folder
        const response = await fetch('./data/workouts.json');
        if (!response.ok) throw new Error('Failed to load database file.');
        
        const data = await response.json();
        state.workouts = data.days; // Store the 'days' object
        console.log("✅ Database loaded successfully:", state.workouts);
    } catch (error) {
        console.error("❌ Database Error:", error);
        document.getElementById('app-container').innerHTML = `
            <div style="text-align:center; padding: 20px; color: red;">
                <h3>Error Loading Database</h3>
                <p>${error.message}</p>
                <p>Ensure you are running this on a local server (e.g., Live Server) or GitHub Pages.</p>
            </div>`;
    }
}

// --- Rendering Logic ---

/**
 * Generates the HTML for a specific workout day.
 * @param {string} dayId - The ID of the day to render (e.g., 'day1', 'day2')
 */
function renderDay(dayId) {
    const container = document.getElementById('app-container');
    const dayData = state.workouts[dayId];
    
    if (!dayData) return;

    // Start building HTML string
    let html = `<div id="${dayId}" class="day-section active">`;
    html += `<div class="day-header"><h2>${dayData.title}</h2></div>`;

    // Loop through workout parts (Warmup, Heavy, Isolation, etc.)
    dayData.parts.forEach(part => {
        html += `<div class="section-title">${part.title}</div>`;
        html += `<div class="grid-container">`;
        
        // Loop through exercises in this part
        part.exercises.forEach(ex => {
            // Determine if target is Time based or Rep based
            const isTime = ex.time !== undefined;
            const targetVal = isTime ? `${ex.time}s` : ex.reps;
            const targetLabel = isTime ? 'Time' : 'Reps';
            
            // Generate progress dots (one for each set)
            let dotsHtml = '<div class="progress-dots">';
            for(let i=0; i<ex.sets; i++) {
                dotsHtml += '<div class="dot"></div>';
            }
            dotsHtml += '</div>';

            // Build the card HTML
            // Note: We initialize cards as 'locked' except potentially the first one later
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
        
        html += `</div>`; // End grid container
    });

    html += `</div>`; // End day section
    container.innerHTML = html;
    
    // Auto-unlock the very first card of the day to start the workout
    const firstCard = container.querySelector('.ex-card');
    if(firstCard) {
        activateCard(firstCard);
    }
}

// --- Core Logic: Progression & Flow ---

/**
 * The Master Logic for determining the next move.
 * Automatically handles Straight Sets, Supersets, Tri-sets, and Giant Sets
 * based purely on the exercise 'code' (e.g., 1a, 1b).
 */
function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.ex-card'));
    const currentCode = currentCard.dataset.code;
    
    // 1. Extract the Group Number (e.g., from "1a" -> get 1)
    const match = currentCode.match(/\d+/);
    if (!match) return; // Safety check
    const currentGroupNum = parseInt(match[0]);
    
    // 2. Find all cards that belong to this group (Superset Family)
    const groupCards = allCards.filter(card => {
        const code = card.dataset.code;
        const numMatch = code.match(/\d+/);
        return numMatch && parseInt(numMatch[0]) === currentGroupNum;
    });

    // 3. Find position of current card within its group
    const currentIndexInGroup = groupCards.indexOf(currentCard);
    
    // 4. Check status
    const completedSets = parseInt(currentCard.dataset.completed);
    const targetSets = parseInt(currentCard.dataset.sets);
    const isCardFinished = completedSets >= targetSets;

    // --- DECISION TREE ---

    // A. Is there a next exercise in this group? (e.g., Move from 1a -> 1b)
    if (currentIndexInGroup < groupCards.length - 1) {
        // Deactivate current (visual feedback only)
        deactivateCard(currentCard);
        
        // Activate the next sibling in the group
        const nextSibling = groupCards[currentIndexInGroup + 1];
        activateCard(nextSibling);
    } 
    // B. We are at the end of the group (e.g., at 1b).
    else {
        // Have we finished ALL sets for this card?
        // (Assumption: In supersets, usually all exercises have equal sets)
        if (isCardFinished) {
            // SUCCESS: The whole superset/exercise is done.
            // Mark all members of this group as fully complete (Green)
            groupCards.forEach(c => markCardAsDone(c));
            
            // Find the global index of the current card to jump to the NEXT Group
            const globalIndex = allCards.indexOf(currentCard);
            
            // Look for the next available card in the DOM that isn't finished
            for (let i = globalIndex + 1; i < allCards.length; i++) {
                const nextGlobalCard = allCards[i];
                if (!nextGlobalCard.classList.contains('completed')) {
                    activateCard(nextGlobalCard);
                    break;
                }
            }
        } 
        else {
            // LOOP: Sets are not done yet. Go back to the start of the group (1a).
            deactivateCard(currentCard);
            const firstCardInGroup = groupCards[0];
            activateCard(firstCardInGroup);
        }
    }
}

// --- Helper Functions for UI State ---

function activateCard(card) {
    card.classList.remove('locked');
    card.classList.add('active-move');
    // Smooth scroll to bring card into focus
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) {
    // Used when moving between superset items (waiting for turn)
    card.classList.remove('active-move');
    // We don't add 'locked' class to keep it readable, but we dim it via CSS opacity usually
    card.style.opacity = "0.6"; 
    card.style.transform = "scale(0.98)";
}

function markCardAsDone(card) {
    card.classList.remove('active-move');
    card.classList.add('completed');
    // Reset styles overridden by deactivateCard
    card.style.opacity = "1"; 
    card.style.transform = "scale(1)";
    // Ensure all dots are green
    card.querySelectorAll('.dot').forEach(d => d.classList.add('done'));
}

// --- Interaction Handlers (Exposed to HTML) ---

const app = {
    // Switch between workout days
    switchDay: (dayId) => {
        if(state.isTimerRunning) {
            alert('Please stop the timer first!');
            return;
        }
        state.currentDay = dayId;
        renderDay(dayId);
    },

    // Toggle API Key settings modal
    toggleSettings: () => {
        document.getElementById('settingsModal').classList.toggle('open');
    },

    // Save API Key to LocalStorage
    saveApiKey: () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if(key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            app.toggleSettings();
            alert('API Key Saved Successfully!');
        }
    },

    // Main Click Handler for Cards
    handleClick: (card) => {
        if (card.classList.contains('locked')) return; // Prevent clicking locked cards
        
        // Initialize Audio Context (Browser policy requires user gesture)
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } else if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }

        // 1. TIMER LOGIC
        if (card.dataset.time) {
            if (card.classList.contains('completed')) return;
            
            if (card.classList.contains('timer-active')) {
                // User clicked to STOP timer manually
                stopTimer(card, false); // false = didn't finish naturally
            } else {
                // User clicked to START timer
                if (state.isTimerRunning) return; // Prevent multiple timers
                startTimer(card);
            }
            return;
        }

        // 2. REPS LOGIC
        if (state.isTimerRunning) return; // Don't allow logging reps while timer runs
        
        let sets = parseInt(card.dataset.sets);
        let completed = parseInt(card.dataset.completed);
        
        if (completed < sets) {
            completed++;
            card.dataset.completed = completed;
            
            // Visual update: light up the dot
            const dots = card.querySelectorAll('.dot');
            if(dots[completed-1]) dots[completed-1].classList.add('active');
            
            // Trigger Progression Logic
            handleSetCompletion(card);
        }
    },

    // --- Chat / AI Features ---
    toggleChat: () => {
        document.getElementById('chatWindow').classList.toggle('open');
    },
    
    // Quick Trigger from Exercise Card
    askAI: (e, query) => {
        e.stopPropagation(); // Stop card click event
        app.toggleChat();
        app.sendMessage(query);
    },

    // Send Message to Gemini
    sendMessage: async (textOverride = null) => {
        const input = document.getElementById('chatInput');
        const text = textOverride || input.value;
        if(!text) return;
        
        // UI: Add User Message
        const body = document.getElementById('chatBody');
        body.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = '';
        
        // UI: Add Loading Bubble
        const loadingId = 'loading-' + Date.now();
        body.innerHTML += `<div class="msg ai" id="${loadingId}">...</div>`;
        body.scrollTop = body.scrollHeight;

        if(!state.apiKey) {
            document.getElementById(loadingId).innerText = "Please set your API Key in Settings.";
            return;
        }

        try {
            // Using Gemini 2.5 Flash Preview model
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${state.apiKey}`;
            
            // Prompt Engineering context
            const userContext = "User is Ali, male, 23 years old, 178cm, 83kg. Goal: Hybrid Athlete (Calisthenics + Bodybuilding).";
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Context: ${userContext}. Question: ${text}` }] }]
                })
            });
            
            const data = await response.json();
            
            if(data.error) throw new Error(data.error.message);
            
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
            
            // UI: Update with AI Response
            const loadingMsg = document.getElementById(loadingId);
            if(loadingMsg) loadingMsg.innerText = aiText;
            
        } catch(e) {
            const loadingMsg = document.getElementById(loadingId);
            if(loadingMsg) {
                loadingMsg.innerText = "Error: " + e.message;
                loadingMsg.classList.add('error');
            }
        }
        body.scrollTop = body.scrollHeight;
    }
};

// --- Timer Functions ---

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
            stopTimer(card, true); // true = finished naturally
        }
    }, 1000);
}

function stopTimer(card, finishedNaturally) {
    clearInterval(state.timer);
    state.isTimerRunning = false;
    state.timer = null;
    card.classList.remove('timer-active');
    
    // Reset overlay text
    const duration = card.dataset.time;
    card.querySelector('.timer-overlay').innerHTML = `${duration} <span>Click to Stop</span>`;

    if (finishedNaturally) {
        playSound();
        
        // Logic similar to Reps: Increment completion and move on
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

// --- Sound Effect ---
function playSound() {
    if (!state.audioCtx) return;
    
    // Simple Beep
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, state.audioCtx.currentTime); // High pitch
    gain.gain.setValueAtTime(0.1, state.audioCtx.currentTime);
    
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.2); // Play for 200ms
}

// Make 'app' global so HTML onclick attributes can access it
window.app = app;