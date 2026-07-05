// --- Game State Management ---
let gameMode = 'endless'; // endless, bo3, bo5
let playerLocalScore = 0;
let computerLocalScore = 0;
let tiesLocalScore = 0;
let roundsPlayed = 0;
let soundEnabled = true;
let isAnimating = false;

// Audio context reference
let audioCtx = null;

// Confetti engine state
let confettiActive = false;
let confettiAnimationId = null;

// --- DOM Cache ---
const elements = {
    modeBtns: document.querySelectorAll('.mode-btn'),
    soundToggle: document.getElementById('sound-toggle'),
    playerScore: document.getElementById('player-score'),
    tiesScore: document.getElementById('ties-score'),
    computerScore: document.getElementById('computer-score'),
    seriesStatus: document.getElementById('series-status'),
    targetWins: document.getElementById('target-wins'),
    
    playerCard: document.getElementById('player-card'),
    playerEmoji: document.getElementById('player-emoji'),
    playerChoiceName: document.getElementById('player-choice-name'),
    
    computerCard: document.getElementById('computer-card'),
    computerEmoji: document.getElementById('computer-emoji'),
    computerChoiceName: document.getElementById('computer-choice-name'),
    
    resultBanner: document.getElementById('result-banner'),
    resetBtn: document.getElementById('reset-btn'),
    historyTimeline: document.getElementById('history-timeline'),
    
    // Weapon Buttons
    btnRock: document.getElementById('btn-rock'),
    btnPaper: document.getElementById('btn-paper'),
    btnScissors: document.getElementById('btn-scissors'),
    weaponBtns: document.querySelectorAll('.weapon-btn'),
    
    // Modal Elements
    gameOverModal: document.getElementById('game-over-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalScore: document.getElementById('modal-score'),
    modalRestartBtn: document.getElementById('modal-restart-btn'),
    confettiCanvas: document.getElementById('confetti-canvas')
};

// --- Web Audio Synthesizer ---
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    switch (type) {
        case 'click':
            const cOsc = audioCtx.createOscillator();
            const cGain = audioCtx.createGain();
            cOsc.type = 'sine';
            cOsc.frequency.setValueAtTime(650, now);
            cOsc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
            cGain.gain.setValueAtTime(0.12, now);
            cGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            cOsc.connect(cGain);
            cGain.connect(audioCtx.destination);
            cOsc.start(now);
            cOsc.stop(now + 0.08);
            break;
            
        case 'thump':
            const tOsc = audioCtx.createOscillator();
            const tGain = audioCtx.createGain();
            tOsc.type = 'triangle';
            tOsc.frequency.setValueAtTime(110, now);
            tOsc.frequency.linearRampToValueAtTime(55, now + 0.12);
            tGain.gain.setValueAtTime(0.25, now);
            tGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            tOsc.connect(tGain);
            tGain.connect(audioCtx.destination);
            tOsc.start(now);
            tOsc.stop(now + 0.12);
            break;
            
        case 'win':
            playToneSeries([330, 440, 554, 659], 0.08, 'triangle');
            break;
            
        case 'lose':
            playToneSeries([392, 311, 246, 196], 0.12, 'sawtooth');
            break;
            
        case 'tie':
            playToneSeries([294, 294], 0.1, 'sine');
            break;
            
        case 'victory':
            playToneSeries([261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50], 0.15, 'sine');
            break;
            
        case 'defeat':
            playToneSeries([220.00, 207.65, 196.00, 146.83, 110.00], 0.22, 'triangle');
            break;
    }
}

function playToneSeries(frequencies, duration, type) {
    let delay = 0;
    frequencies.forEach((freq) => {
        setTimeout(() => {
            if (!soundEnabled || !audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.004, now + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + duration);
        }, delay * 1000);
        delay += duration * 0.85;
    });
}

// --- Event Handlers & Core Functions ---

// Setup event listeners
function init() {
    // Mode selector buttons
    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating) return;
            playSound('click');
            
            elements.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            gameMode = btn.dataset.mode;
            updateModeDisplay();
            resetGameSession();
        });
    });
    
    // Sound Toggle
    elements.soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        initAudio();
        elements.soundToggle.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';
        playSound('click');
    });
    
    // Weapon choice selectors
    elements.weaponBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating) return;
            initAudio();
            playRound(btn.dataset.choice);
        });
    });
    
    // Reset buttons
    elements.resetBtn.addEventListener('click', () => {
        if (isAnimating) return;
        playSound('click');
        resetGameSession();
    });
    
    elements.modalRestartBtn.addEventListener('click', () => {
        hideGameOverModal();
        resetGameSession();
    });
}

// Update game configuration details
function updateModeDisplay() {
    if (gameMode === 'endless') {
        elements.seriesStatus.style.display = 'none';
    } else {
        elements.seriesStatus.style.display = 'block';
        elements.targetWins.textContent = gameMode === 'bo3' ? '2' : '3';
    }
}

// Trigger animations and process a single round
function playRound(playerChoice) {
    isAnimating = true;
    
    // Lock all weapon selections
    elements.weaponBtns.forEach(btn => btn.disabled = true);
    
    // Play transition click
    playSound('click');
    
    // Reset cards to neutral shake position
    resetCardsToShake();
    
    // Perform shaking beat audio sync
    let thumpCount = 0;
    const thumpInterval = setInterval(() => {
        if (thumpCount < 3) {
            playSound('thump');
            thumpCount++;
        } else {
            clearInterval(thumpInterval);
        }
    }, 400);

    // Call Flask server in parallel
    const playPromise = fetch('/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice: playerChoice })
    }).then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
    });

    // Wait for BOTH the network response and minimum animation duration (1.2 seconds)
    Promise.all([
        playPromise,
        new Promise(resolve => setTimeout(resolve, 1200))
    ])
    .then(([data]) => {
        clearInterval(thumpInterval);
        renderRoundResult(data);
    })
    .catch(err => {
        clearInterval(thumpInterval);
        console.error(err);
        elements.resultBanner.textContent = "Error communicating with Arena Server.";
        elements.weaponBtns.forEach(btn => btn.disabled = false);
        isAnimating = false;
    });
}

// Clear card results and activate pump animation
function resetCardsToShake() {
    elements.playerCard.className = 'hand-card glass-panel shaking-player';
    elements.computerCard.className = 'hand-card glass-panel shaking-computer';
    
    elements.playerEmoji.textContent = '✊';
    elements.playerChoiceName.textContent = 'Ready...';
    
    elements.computerEmoji.textContent = '✊';
    elements.computerChoiceName.textContent = 'Ready...';
    
    elements.resultBanner.textContent = "Rock... Paper... Scissors...";
    elements.resultBanner.className = 'result-banner';
}

// Apply end outcomes after animation completes
function renderRoundResult(data) {
    // 1. Remove shaking animation classes
    elements.playerCard.classList.remove('shaking-player');
    elements.computerCard.classList.remove('shaking-computer');
    
    // 2. Display final selection details
    elements.playerEmoji.textContent = data.player_emoji;
    elements.playerChoiceName.textContent = data.player_name;
    
    elements.computerEmoji.textContent = data.computer_emoji;
    elements.computerChoiceName.textContent = data.computer_name;
    
    // 3. Highlight choice cards based on round results
    if (data.result === 'win') {
        elements.playerCard.classList.add('revealed-win');
        elements.computerCard.classList.add('revealed-lose');
        elements.resultBanner.textContent = `ROUND WON! ${data.player_emoji} BEATS ${data.computer_emoji}`;
        elements.resultBanner.classList.add('win');
        playSound('win');
    } else if (data.result === 'lose') {
        elements.playerCard.classList.add('revealed-lose');
        elements.computerCard.classList.add('revealed-win');
        elements.resultBanner.textContent = `ROUND LOST! ${data.computer_emoji} BEATS ${data.player_emoji}`;
        elements.resultBanner.classList.add('lose');
        playSound('lose');
    } else {
        elements.playerCard.classList.add('revealed-tie');
        elements.computerCard.classList.add('revealed-tie');
        elements.resultBanner.textContent = `ROUND TIED! BOTH CHOSE ${data.player_emoji}`;
        elements.resultBanner.classList.add('tie');
        playSound('tie');
    }
    
    // 4. Update Score display integers locally
    playerLocalScore = data.player_score;
    computerLocalScore = data.computer_score;
    tiesLocalScore = data.ties;
    roundsPlayed = data.rounds;
    
    elements.playerScore.textContent = playerLocalScore;
    elements.computerScore.textContent = computerLocalScore;
    elements.tiesScore.textContent = tiesLocalScore;
    
    // 5. Prepend the Round history log
    updateHistoryTimeline(data.history);
    
    // 6. Check Series Game-Over Conditions
    setTimeout(() => {
        checkSeriesStatus();
        
        // Re-enable weapon panel buttons unless modal is active
        if (!elements.gameOverModal.classList.contains('active')) {
            elements.weaponBtns.forEach(btn => btn.disabled = false);
            isAnimating = false;
        }
    }, 400);
}

// Update log items dynamically
function updateHistoryTimeline(history) {
    if (!history || history.length === 0) {
        elements.historyTimeline.innerHTML = '<p class="empty-history">No rounds played yet. Choose a weapon above!</p>';
        return;
    }
    
    elements.historyTimeline.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = `log-item ${item.result}`;
        
        div.innerHTML = `
            <span class="log-round">R${item.round_num}</span>
            <div class="log-vs">
                <span>YOU: ${item.player_emoji}</span>
                <span class="vs-text">vs</span>
                <span>CPU: ${item.computer_emoji}</span>
            </div>
            <span class="log-result">${item.result}</span>
        `;
        elements.historyTimeline.appendChild(div);
    });
}

// Reset server session statistics and client variables
function resetGameSession() {
    fetch('/reset', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
        playerLocalScore = 0;
        computerLocalScore = 0;
        tiesLocalScore = 0;
        roundsPlayed = 0;
        
        elements.playerScore.textContent = '0';
        elements.computerScore.textContent = '0';
        elements.tiesScore.textContent = '0';
        
        elements.playerCard.className = 'hand-card glass-panel idle';
        elements.computerCard.className = 'hand-card glass-panel idle';
        
        elements.playerEmoji.textContent = '✊';
        elements.playerChoiceName.textContent = 'Ready';
        
        elements.computerEmoji.textContent = '✊';
        elements.computerChoiceName.textContent = 'Ready';
        
        elements.resultBanner.textContent = "Select your weapon to begin!";
        elements.resultBanner.className = 'result-banner';
        
        updateHistoryTimeline([]);
        
        // Ensure UI buttons unlocked
        elements.weaponBtns.forEach(btn => btn.disabled = false);
        isAnimating = false;
    });
}

// Determine if series has a final winner
function checkSeriesStatus() {
    if (gameMode === 'endless') return;
    
    const targetWins = gameMode === 'bo3' ? 2 : 3;
    
    if (playerLocalScore >= targetWins) {
        showGameOverModal(true);
    } else if (computerLocalScore >= targetWins) {
        showGameOverModal(false);
    }
}

// Show terminal popup screen
function showGameOverModal(isPlayerWinner) {
    elements.gameOverModal.classList.add('active');
    
    const content = elements.gameOverModal.querySelector('.modal-content');
    content.className = 'modal-content glass-panel ' + (isPlayerWinner ? 'glow-border-win' : 'glow-border-lose');
    
    elements.modalTitle.textContent = isPlayerWinner ? "VICTORY!" : "DEFEAT!";
    elements.modalTitle.className = 'modal-title ' + (isPlayerWinner ? 'glow-text-win' : 'glow-text-lose');
    
    elements.modalMessage.textContent = isPlayerWinner 
        ? "Superb! You have outmatched the CPU and conquered the arena series." 
        : "Unfortunate! The CPU has won the series. Hone your strategy and try again.";
        
    elements.modalScore.textContent = `${playerLocalScore} - ${computerLocalScore}`;
    
    if (isPlayerWinner) {
        playSound('victory');
        startConfetti();
    } else {
        playSound('defeat');
    }
}

function hideGameOverModal() {
    elements.gameOverModal.classList.remove('active');
    stopConfetti();
}

// --- Confetti Particle System Canvas ---
let canvasCtx = null;
let confettiParticles = [];

function startConfetti() {
    confettiActive = true;
    const canvas = elements.confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCtx = canvas.getContext('2d');
    
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 5,
            color: getRandomColor(),
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    // Add resize event
    window.addEventListener('resize', resizeConfettiCanvas);
    
    animateConfetti();
}

function stopConfetti() {
    confettiActive = false;
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }
    const canvas = elements.confettiCanvas;
    if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
    window.removeEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
    const canvas = elements.confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function getRandomColor() {
    const colors = ['#00d2ff', '#ff007f', '#ffb700', '#00ff88', '#ffffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function animateConfetti() {
    if (!confettiActive) return;
    
    const canvas = elements.confettiCanvas;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiParticles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Reset particle if off bottom screen
        if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
        }
        
        canvasCtx.save();
        canvasCtx.translate(p.x, p.y);
        canvasCtx.rotate(p.rotation * Math.PI / 180);
        canvasCtx.fillStyle = p.color;
        canvasCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        canvasCtx.restore();
    });
    
    confettiAnimationId = requestAnimationFrame(animateConfetti);
}

// Start core initialization on page load
document.addEventListener('DOMContentLoaded', init);
