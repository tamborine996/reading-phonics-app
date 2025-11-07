// Word packs data (first 4 packs)
let wordPacks = [
  {
    "id": 1,
    "title": "P1: 0A. YEAR 1 HIGH FREQUENCY - Pack 1",
    "description": "100 words to know by end of Year 1 (Pack 1 of 4)",
    "words": [
      "a", "about", "all", "an", "and", "are", "as", "asked", "at", "back",
      "be", "big", "but", "by", "called", "came", "can", "children", "come", "could",
      "dad", "day", "do", "don't", "down", "for", "from", "get", "go", "got"
    ]
  },
  {
    "id": 2,
    "title": "P2: 0A. YEAR 1 HIGH FREQUENCY - Pack 2",
    "description": "100 words to know by end of Year 1 (Pack 2 of 4)",
    "words": [
      "had", "have", "he", "help", "her", "here", "him", "his", "house", "i",
      "i'm", "if", "in", "into", "is", "it", "it's", "just", "like", "little",
      "look", "looked", "made", "make", "me", "mr", "mrs", "mum", "my", "no"
    ]
  },
  {
    "id": 3,
    "title": "P3: 0A. YEAR 1 HIGH FREQUENCY - Pack 3",
    "description": "100 words to know by end of Year 1 (Pack 3 of 4)",
    "words": [
      "not", "now", "of", "off", "oh", "old", "on", "one", "out", "people",
      "put", "said", "saw", "see", "she", "so", "some", "that", "the", "their",
      "them", "then", "there", "they", "this", "time", "to", "too", "up", "very"
    ]
  },
  {
    "id": 4,
    "title": "P4: 0A. YEAR 1 HIGH FREQUENCY - Pack 4",
    "description": "100 words to know by end of Year 1 (Pack 4 of 4)",
    "words": [
      "was", "we", "went", "were", "what", "when", "will", "with", "you", "your"
    ]
  }
];

let currentPack = null;
let currentWordIndex = 0;
let reviewMode = false;

// Load word packs from JSON
async function loadWordPacks() {
    // Data is now embedded, just render
    renderPackList();
}

// Get progress data from localStorage
function getProgress() {
    const saved = localStorage.getItem('wordPackProgress');
    return saved ? JSON.parse(saved) : {};
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem('wordPackProgress', JSON.stringify(progress));
}

// Get pack progress
function getPackProgress(packId) {
    const progress = getProgress();
    if (!progress[packId]) {
        progress[packId] = {
            words: {},
            completed: false
        };
    }
    return progress[packId];
}

// Update pack progress
function updatePackProgress(packId, wordIndex, status) {
    const progress = getProgress();
    if (!progress[packId]) {
        progress[packId] = { words: {}, completed: false };
    }
    progress[packId].words[wordIndex] = status;
    saveProgress(progress);
}

// Render pack list on home screen
function renderPackList() {
    const packList = document.getElementById('packList');
    packList.innerHTML = '';

    wordPacks.forEach(pack => {
        const packProgress = getPackProgress(pack.id);
        const totalWords = pack.words.length;
        const reviewedWords = Object.keys(packProgress.words).length;
        const progressPercent = (reviewedWords / totalWords) * 100;

        const packCard = document.createElement('div');
        packCard.className = 'pack-card';
        packCard.onclick = () => startPack(pack.id);

        packCard.innerHTML = `
            <div class="pack-card-title">${pack.title}</div>
            <div class="pack-card-info">
                <span>${totalWords} words</span>
                <div class="pack-progress">
                    <span>${reviewedWords}/${totalWords}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
        `;

        packList.appendChild(packCard);
    });
}

// Start practicing a pack
function startPack(packId) {
    currentPack = wordPacks.find(p => p.id === packId);
    currentWordIndex = 0;
    reviewMode = false;

    showScreen('practiceScreen');
    document.getElementById('packTitle').textContent = currentPack.title;
    updateWordDisplay();
}

// Update word display
function updateWordDisplay() {
    const words = reviewMode ? getTrickyWords() : currentPack.words;
    const word = words[currentWordIndex];

    document.getElementById('currentWord').textContent = word;
    document.getElementById('wordCounter').textContent =
        `${currentWordIndex + 1} / ${words.length}`;

    // Update word styling based on status
    const progress = getPackProgress(currentPack.id);
    const status = progress.words[currentWordIndex];
    const wordElement = document.getElementById('currentWord');

    wordElement.className = 'word';
    if (status === 'got-it') wordElement.classList.add('mastered');
    if (status === 'tricky') wordElement.classList.add('tricky');

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentWordIndex === 0;
    document.getElementById('nextBtn').disabled = currentWordIndex === words.length - 1;
}

// Mark current word
function markWord(status) {
    updatePackProgress(currentPack.id, currentWordIndex, status);

    // Add animation
    const wordElement = document.getElementById('currentWord');
    wordElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        wordElement.style.transform = 'scale(1)';
    }, 200);

    // Auto-advance to next word
    setTimeout(() => {
        if (currentWordIndex < currentPack.words.length - 1) {
            nextWord();
        } else {
            showCompleteScreen();
        }
    }, 300);
}

// Navigate to next word
function nextWord() {
    const words = reviewMode ? getTrickyWords() : currentPack.words;
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        updateWordDisplay();
    }
}

// Navigate to previous word
function previousWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        updateWordDisplay();
    }
}

// Get tricky words for current pack
function getTrickyWords() {
    const progress = getPackProgress(currentPack.id);
    return currentPack.words.filter((word, index) =>
        progress.words[index] === 'tricky'
    );
}

// Show complete screen
function showCompleteScreen() {
    const progress = getPackProgress(currentPack.id);
    const totalWords = currentPack.words.length;

    let trickyCount = 0;
    let gotItCount = 0;
    let trickyWords = [];

    currentPack.words.forEach((word, index) => {
        const status = progress.words[index];
        if (status === 'tricky') {
            trickyCount++;
            trickyWords.push(word);
        } else if (status === 'got-it') {
            gotItCount++;
        }
    });

    document.getElementById('totalWords').textContent = totalWords;
    document.getElementById('trickyWords').textContent = trickyCount;
    document.getElementById('gotItWords').textContent = gotItCount;

    // Show tricky words list
    const trickyListDiv = document.getElementById('trickyWordsList');
    if (trickyWords.length > 0) {
        trickyListDiv.innerHTML = `
            <div class="tricky-list">
                <h3>Words to Review:</h3>
                <div class="tricky-list-words">
                    ${trickyWords.map(word =>
                        `<span class="tricky-word-tag">${word}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    } else {
        trickyListDiv.innerHTML = '<p style="color: white; text-align: center;">Great job! No tricky words!</p>';
    }

    showScreen('completeScreen');
}

// Review tricky words
function reviewTricky() {
    const trickyWords = getTrickyWords();
    if (trickyWords.length === 0) {
        goHome();
        return;
    }

    reviewMode = true;
    currentWordIndex = 0;
    showScreen('practiceScreen');
    document.getElementById('packTitle').textContent = currentPack.title + ' - Review';
    updateWordDisplay();
}

// Show parent view
function showParentView() {
    const parentStats = document.getElementById('parentStats');
    parentStats.innerHTML = '';

    wordPacks.forEach(pack => {
        const progress = getPackProgress(pack.id);
        const totalWords = pack.words.length;

        let trickyWords = [];
        let gotItWords = [];

        pack.words.forEach((word, index) => {
            const status = progress.words[index];
            if (status === 'tricky') trickyWords.push(word);
            if (status === 'got-it') gotItWords.push(word);
        });

        const packDiv = document.createElement('div');
        packDiv.className = 'parent-pack';

        packDiv.innerHTML = `
            <h3>${pack.title}</h3>
            <div class="parent-pack-info">
                <strong>Progress:</strong> ${Object.keys(progress.words).length} / ${totalWords} words reviewed
            </div>
            <div class="parent-pack-info">
                <strong>Mastered:</strong> ${gotItWords.length} words
            </div>
            <div class="parent-pack-info">
                <strong>Needs Practice:</strong> ${trickyWords.length} words
            </div>
            ${trickyWords.length > 0 ? `
                <div style="margin-top: 10px;">
                    <strong style="color: #ff6b6b;">Tricky Words:</strong>
                    <div class="tricky-list-words" style="margin-top: 10px;">
                        ${trickyWords.map(word =>
                            `<span class="tricky-word-tag">${word}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        parentStats.appendChild(packDiv);
    });

    showScreen('parentScreen');
}

// Navigate to home
function goHome() {
    currentPack = null;
    currentWordIndex = 0;
    reviewMode = false;
    renderPackList();
    showScreen('homeScreen');
}

// Show specific screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize app
loadWordPacks();
