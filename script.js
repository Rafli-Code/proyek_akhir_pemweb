/* Menu Icon */
const menuIcon = document.getElementById("menu-icon");
const menuList = document.getElementById("menu-list");

menuIcon.addEventListener("click", () => {
    menuList.classList.toggle("hidden");
});







fetch('kosakata.json')
    .then(res => res.json())
    .then(data => {
      const pilih = document.getElementById("pilih");
      const tabel = document.getElementById("tabelBahasa");

      function tampilkan(kunci) {
        let isi = "<div class='kartu-container'>";
        const semuaData = kunci === "Semua"
          ? Object.values(data).flat()
          : data[kunci] || [];

        semuaData.forEach(item => {
          isi += `
            <div class="kartu">
              <h4>${item.banjar}</h4>
              <p>${item.indonesia}</p>
            </div>`;
        });
        isi += "</div>";
        tabel.innerHTML = isi;
      }

      tampilkan("Semua"); // tampil di awal
      pilih.addEventListener("change", e => tampilkan(e.target.value));
    });

    

document.addEventListener("DOMContentLoaded", function () {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const buttonsContainer = document.getElementById("cerita-buttons");
            const contentContainer = document.getElementById("cerita-content");

            data.cerita_rakyat.forEach((cerita, index) => {
                const btn = document.createElement("button");
                btn.classList.add("story-btn");
                btn.textContent = cerita.judul;
                btn.dataset.index = index;

                btn.addEventListener("click", () => {
                    // Tampilkan konten cerita
                    contentContainer.innerHTML = `
                        <h3>${cerita.judul}</h3>
                        <p>${cerita.konten}</p>
                    `;

                    // Highlight tombol aktif
                    document.querySelectorAll(".story-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                });

                buttonsContainer.appendChild(btn);
            });

            // Tidak ada cerita yang ditampilkan di awal (kosong)
            contentContainer.innerHTML = `<p style="color: #777;">Pilih Cerita</p>`;
        })
        .catch(error => {
            console.error("Gagal mengambil data JSON:", error);
        });
});


/* Game Mencocokan Kata */
document.addEventListener('DOMContentLoaded', function() {
            // Daftar lengkap kata Bahasa Banjar dan Indonesia (15 pasang)
            const allWordPairs = [
                { banjar: "bubuhan", indonesia: "keluarga" },
                { banjar: "gawi", indonesia: "kerja" },
                { banjar: "handak", indonesia: "ingin" },
                { banjar: "jajak", indonesia: "jalan" },
                { banjar: "kada", indonesia: "tidak" },
                { banjar: "lading", indonesia: "pisau" },
                { banjar: "mamang", indonesia: "paman" },
                { banjar: "nang", indonesia: "di" },
                { banjar: "pian", indonesia: "kamu" },
                { banjar: "sakira", indonesia: "kira-kira" },
                { banjar: "talu", indonesia: "kalah" },
                { banjar: "ulun", indonesia: "saya" },
                { banjar: "wadai", indonesia: "kue" },
                { banjar: "yuyu", indonesia: "kepiting" },
                { banjar: "jaram", indonesia: "kuda" }
            ];
            
            // Variabel game
            let cards = [];
            let selectedCards = [];
            let matchedPairs = 0;
            let attempts = 0;
            let correctAttempts = 0;
            let gameActive = false;
            let currentLevel = null;
            let wordPairs = [];
            let totalPairs = 0;
            let timeLeft = 0;
            let timerInterval = null;
            let startTime = null;
            
            // Elemen DOM
            const gameBoard = document.getElementById('gameBoard');
            const matchesDisplay = document.getElementById('matches');
            const attemptsDisplay = document.getElementById('attempts');
            const accuracyDisplay = document.getElementById('accuracy');
            const timerDisplay = document.getElementById('timer');
            const resetBtn = document.getElementById('resetBtn');
            const resultModal = document.getElementById('resultModal');
            const modalContent = document.getElementById('modalContent');
            const celebrateEmoji = document.getElementById('celebrateEmoji');
            const resultTitle = document.getElementById('resultTitle');
            const finalScore = document.getElementById('finalScore');
            const finalTime = document.getElementById('finalTime');
            const finalAccuracy = document.getElementById('finalAccuracy');
            const playAgainBtn = document.getElementById('playAgainBtn');
            const easyBtn = document.getElementById('easyBtn');
            const mediumBtn = document.getElementById('mediumBtn');
            const hardBtn = document.getElementById('hardBtn');
            
            // Inisialisasi game berdasarkan level
            function initGame(level) {
                currentLevel = level;
                
                // Pilih jumlah pasangan kata dan waktu berdasarkan level
                switch(level) {
                    case 'easy':
                        wordPairs = allWordPairs.slice(0, 5);
                        totalPairs = 5;
                        timeLeft = 2 * 60; // 2 menit
                        break;
                    case 'medium':
                        wordPairs = allWordPairs.slice(0, 10);
                        totalPairs = 10;
                        timeLeft = 3 * 60; // 3 menit
                        break;
                    case 'hard':
                        wordPairs = allWordPairs.slice();
                        totalPairs = 15;
                        timeLeft = 5 * 60; // 5 menit
                        break;
                }
                
                // Reset variabel game
                cards = [];
                selectedCards = [];
                matchedPairs = 0;
                attempts = 0;
                correctAttempts = 0;
                gameActive = true;
                startTime = new Date();
                
                // Hentikan timer sebelumnya jika ada
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
                
                // Mulai timer
                updateTimerDisplay();
                timerInterval = setInterval(updateTimer, 1000);
                
                // Kosongkan papan game
                gameBoard.innerHTML = '';
                
                // Tampilkan tombol reset
                resetBtn.style.display = 'block';
                
                // Update tampilan skor
                updateScoreDisplay();
                
                // Buat array gabungan dari semua kata
                let allWords = [];
                wordPairs.forEach(pair => {
                    allWords.push({ text: pair.banjar, language: 'banjar', pairId: pair.indonesia });
                    allWords.push({ text: pair.indonesia, language: 'indonesia', pairId: pair.banjar });
                });
                
                // Acak urutan kartu
                allWords = shuffleArray(allWords);
                
                // Sesuaikan grid berdasarkan jumlah kartu
                adjustGridLayout(allWords.length);
                
                // Buat kartu di papan game
                allWords.forEach((word, index) => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.index = index;
                    card.dataset.language = word.language;
                    card.dataset.pairId = word.pairId;
                    card.textContent = word.text;
                    
                    card.addEventListener('click', () => handleCardClick(card));
                    
                    gameBoard.appendChild(card);
                    cards.push({
                        element: card,
                        text: word.text,
                        language: word.language,
                        pairId: word.pairId,
                        matched: false
                    });
                });
            }
            
            // Sesuaikan layout grid berdasarkan jumlah kartu
            function adjustGridLayout(cardCount) {
                // Untuk level mudah (10 kartu), gunakan 5 kolom
                if (cardCount === 10) {
                    gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
                } 
                // Untuk level sedang (20 kartu), gunakan 5 kolom
                else if (cardCount === 20) {
                    gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
                } 
                // Untuk level sulit (30 kartu), gunakan 6 kolom
                else if (cardCount === 30) {
                    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
                }
            }
            
            // Fungsi untuk mengacak array
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            // Handle klik kartu
            function handleCardClick(card) {
                if (!gameActive) return;
                
                const index = parseInt(card.dataset.index);
                const cardData = cards[index];
                
                // Jika kartu sudah dipilih atau sudah cocok, abaikan
                if (cardData.matched || selectedCards.includes(index)) {
                    return;
                }
                
                // Jika sudah ada 2 kartu terpilih, abaikan
                if (selectedCards.length >= 2) {
                    return;
                }
                
                // Tandai kartu sebagai terpilih
                selectedCards.push(index);
                card.classList.add('selected');
                
                // Jika 2 kartu sudah terpilih, cek kecocokan
                if (selectedCards.length === 2) {
                    attempts++;
                    const firstCard = cards[selectedCards[0]];
                    const secondCard = cards[selectedCards[1]];
                    
                    // Cek apakah kartu dari bahasa yang berbeda dan memiliki pairId yang cocok
                    if (firstCard.language !== secondCard.language && 
                        (firstCard.pairId === secondCard.text || secondCard.pairId === firstCard.text)) {
                        // Cocok
                        correctAttempts++;
                        matchedPairs++;
                        
                        // Tandai kartu sebagai cocok
                        firstCard.matched = true;
                        secondCard.matched = true;
                        firstCard.element.classList.add('matched');
                        secondCard.element.classList.add('matched');
                        firstCard.element.classList.remove('selected');
                        secondCard.element.classList.remove('selected');
                        
                        // Kosongkan kartu terpilih
                        selectedCards = [];
                        
                        // Update skor
                        updateScoreDisplay();
                        
                        // Cek apakah game sudah selesai
                        if (matchedPairs === totalPairs) {
                            endGame(true);
                        }
                    } else {
                        // Tidak cocok, balik kartu setelah jeda
                        setTimeout(() => {
                            firstCard.element.classList.remove('selected');
                            secondCard.element.classList.remove('selected');
                            selectedCards = [];
                        }, 1000);
                        
                        // Update skor
                        updateScoreDisplay();
                    }
                }
            }
            
            // Update tampilan skor
            function updateScoreDisplay() {
                matchesDisplay.textContent = `${matchedPairs}/${totalPairs}`;
                attemptsDisplay.textContent = attempts;
                
                const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
                accuracyDisplay.textContent = `${accuracy}%`;
            }
            
            // Update timer
            function updateTimer() {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    endGame(false);
                }
            }
            
            // Update tampilan timer
            function updateTimerDisplay() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Ubah warna menjadi merah jika waktu hampir habis
                if (timeLeft <= 30) {
                    timerDisplay.parentElement.style.backgroundColor = '#ffcdd2';
                    timerDisplay.parentElement.style.color = '#b71c1c';
                } else {
                    timerDisplay.parentElement.style.backgroundColor = '#ecf0f1';
                    timerDisplay.parentElement.style.color = '#2c3e50';
                }
            }
            
            // Akhiri game
            function endGame(success) {
                gameActive = false;
                clearInterval(timerInterval);
                
                const endTime = new Date();
                const timeUsed = Math.floor((endTime - startTime) / 1000);
                const minutesUsed = Math.floor(timeUsed / 60);
                const secondsUsed = timeUsed % 60;
                
                const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
                
                if (success) {
                    // Kemenangan
                    celebrateEmoji.textContent = '🎉';
                    resultTitle.textContent = 'Selamat! Anda Menang!';
                    modalContent.classList.remove('failed');
                    
                    finalScore.textContent = `Anda menyelesaikan game level ${getLevelName(currentLevel)} dengan ${attempts} percobaan.`;
                    finalTime.textContent = `Waktu yang digunakan: ${minutesUsed} menit ${secondsUsed} detik`;
                    finalAccuracy.textContent = `Akurasi: ${accuracy}%`;
                } else {
                    // Kekalahan
                    celebrateEmoji.textContent = '😢';
                    resultTitle.textContent = 'Waktu Habis!';
                    modalContent.classList.add('failed');
                    
                    finalScore.textContent = `Anda berhasil mencocokkan ${matchedPairs} dari ${totalPairs} pasangan.`;
                    finalTime.textContent = `Waktu yang digunakan: ${minutesUsed} menit ${secondsUsed} detik`;
                    finalAccuracy.textContent = `Akurasi: ${accuracy}%`;
                }
                
                resultModal.style.display = 'flex';
            }
            
            // Dapatkan nama level
            function getLevelName(level) {
                switch(level) {
                    case 'easy': return 'Mudah';
                    case 'medium': return 'Sedang';
                    case 'hard': return 'Sulit';
                    default: return '';
                }
            }
            
            // Event listener untuk tombol level
            easyBtn.addEventListener('click', () => initGame('easy'));
            mediumBtn.addEventListener('click', () => initGame('medium'));
            hardBtn.addEventListener('click', () => initGame('hard'));
            
            // Event listener untuk tombol reset
            resetBtn.addEventListener('click', () => {
                if (currentLevel) {
                    initGame(currentLevel);
                }
            });
            
            // Event listener untuk tombol main lagi
            playAgainBtn.addEventListener('click', function() {
                resultModal.style.display = 'none';
                if (currentLevel) {
                    initGame(currentLevel);
                }
            });
        });



        
/* Game Quiz */
// Data pertanyaan dan jawaban
        /* Game Quiz */
// Data pertanyaan dan jawaban
const questionPool = [
    {
        question: "Apa arti 'ikam' dalam bahasa Indonesia?",
        options: ["Saya", "Kamu", "Dia", "Mereka"],
        answer: 1,
        explanation: "'Ikam' dalam bahasa Banjar berarti 'Kamu' dalam bahasa Indonesia."
    },
    {
        question: "Apa arti 'Besar' dalam bahasa Banjar?",
        options: ["Ganal", "Guring", "Halus", "Larang"],
        answer: 0,
        explanation: "'Ganal' berarti 'Besar' dalam bahasa Indonesia."
    },
    {
        question: "Apa arti 'Isuk' dalam bahasa Indonesia?",
        options: ["Semalam", "Pabila", "Kaina", "Besok"],
        answer: 3,
        explanation: "'Isuk' adalah 'Besok' dalam bahasa Indonesia."
    },
    {
        question: "Bagaimana mengatakan 'Aku tidak mau' dalam bahasa Banjar?",
        options: ["aku handak bajalan", "aku kulir banar", "Aku handak guring", "Aku kada handak"],
        answer: 3,
        explanation: "'Aku kada handak' berarti 'Aku tidak mau' dalam bahasa Indonesia."
    },
    {
        question: "Apa arti 'Handak' dalam bahasa Indonesia?",
        options: ["Pergi", "Mau", "Tidur", "Makan"],
        answer: 1,
        explanation: "'Handak' berarti 'mau' atau 'ingin' dalam bahasa Indonesia."
    },
    {
        question: "Bagaimana mengatakan 'Saya' dalam bahasa Banjar yang sopan?",
        options: ["Pian", "Aku", "Ulun", "Unda"],
        answer: 2,
        explanation: "'Ulun' dalam bahasa Banjar sama dengan 'Saya' dalam bahasa Indonesia dan biasa digunakan ketika berbicara dengan orang yang lebih tua."
    },
    {
        question: "Apa arti 'Ading' dalam bahasa Indonesia?",
        options: ["Nenek", "Kakak", "Adik", "Bibi"],
        answer: 2,
        explanation: "'Ading' berarti 'Adik' dalam bahasa Indonesia."
    },
    {
        question: "jika 'Bosan' adalah bahasa Indonesia, maka bahasa Banjarnya adalah?",
        options: ["Dulak", "Kulir", "Isuk", "Guring"],
        answer: 0,
        explanation: "'Dulak' berarti 'Bosan' dalam bahasa Indonesia."
    },
    {
        question: "Pada pilihan berikut yang mana artinya 'Tante' atau 'Bibi' ",
        options: ["Abah", "Nini", "Kai", "Acil"],
        answer: 3,
        explanation: "'Acil' berarti 'Tante' atau 'Bibi' dalam bahasa Indonesia."
    },
    {
        question: "Bagaimana mengatakan 'Air' dalam bahasa Banjar?",
        options: ["Air", "Banyu", "Toya", "Warih"],
        answer: 1,
        explanation: "'Banyu' adalah kata untuk 'air' dalam bahasa Banjar."
    }
];

// Variabel game
let questions = [];
let currentQuestion = 0;
let score = 0;
let streak = 0;
let selectedOption = null;
let answered = false;

// Elemen DOM
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const retryButton = document.getElementById('retry-btn');
const endGameButtons = document.getElementById('end-game-buttons');
const progressBar = document.getElementById('progress');
const streakElement = document.getElementById('streak');
const questionCounter = document.getElementById('question-counter'); // Tambahan elemen counter

// Fungsi untuk mengacak array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fungsi untuk memilih 10 pertanyaan acak dari pool
function getRandomQuestions() {
    // Buat salinan array questionPool untuk menghindari modifikasi array asli
    const shuffledPool = [...questionPool];
    shuffleArray(shuffledPool);
    return shuffledPool.slice(0, 10); // Ambil 10 pertanyaan pertama setelah diacak
}

// Fungsi untuk memulai game baru dengan pertanyaan acak
function startNewGame() {
    questions = getRandomQuestions();
    currentQuestion = 0;
    score = 0;
    streak = 0;
    scoreElement.textContent = `Skor: ${score}`;
    streakElement.textContent = `Streak: ${streak}`;
    nextButton.style.display = 'inline-block';
    endGameButtons.style.display = 'none';
    showQuestion();
}

// Fungsi untuk mengulangi game dengan pertanyaan yang sama
function retryGame() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    scoreElement.textContent = `Skor: ${score}`;
    streakElement.textContent = `Streak: ${streak}`;
    nextButton.style.display = 'inline-block';
    endGameButtons.style.display = 'none';
    showQuestion();
}

// Fungsi untuk menampilkan pertanyaan
function showQuestion() {
    answered = false;
    const question = questions[currentQuestion];
    
    // Update counter pertanyaan
    questionCounter.textContent = `Pertanyaan ke-${currentQuestion + 1} dari ${questions.length}`;
    
    questionElement.textContent = question.question;
    
    optionsElement.innerHTML = '';
    
    // Acak urutan opsi jawaban
    const shuffledOptions = [...question.options];
    const correctAnswer = shuffledOptions[question.answer];
    shuffleArray(shuffledOptions);
    
    // Cari posisi baru untuk jawaban yang benar
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    
    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('div');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index, newCorrectIndex));
        optionsElement.appendChild(button);
    });
    
    nextButton.style.display = 'none';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    
    // Update progress bar
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

// Fungsi untuk memilih opsi
function selectOption(selectedIndex, correctIndex) {
    if (answered) return;
    
    selectedOption = selectedIndex;
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add('correct');
        feedbackElement.textContent = "Benar! " + questions[currentQuestion].explanation;
        feedbackElement.classList.add('correct-feedback');
        score += 10;
        streak++;
        streakElement.textContent = `Streak: ${streak}`;
        
        // Bonus untuk streak
        if (streak >= 3) {
            score += 5 * (streak - 2);
            feedbackElement.textContent += ` (+${5 * (streak - 2)} bonus streak!)`;
        }
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
        feedbackElement.textContent = "Salah. " + questions[currentQuestion].explanation;
        feedbackElement.classList.add('incorrect-feedback');
        streak = 0;
        streakElement.textContent = `Streak: 0`;
    }
    
    scoreElement.textContent = `Skor: ${score}`;
    nextButton.style.display = 'inline-block';
    answered = true;
}

// Fungsi untuk pertanyaan berikutnya
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        // Game selesai
        endGame();
    }
}

// Fungsi ketika game selesai
function endGame() {
    questionElement.textContent = `Permainan selesai! Skor akhir Anda: ${score}`;
    questionCounter.textContent = ''; // Kosongkan counter saat game selesai
    optionsElement.innerHTML = '';
    nextButton.style.display = 'none';
    feedbackElement.textContent = `Anda menjawab benar ${Math.round(score / 10)} dari ${questions.length} pertanyaan!`;
    progressBar.style.width = '100%';
    endGameButtons.style.display = 'flex';
}

// Event listener untuk tombol next
nextButton.addEventListener('click', nextQuestion);

// Event listener untuk tombol restart (dengan pertanyaan acak baru)
restartButton.addEventListener('click', startNewGame);

// Event listener untuk tombol retry (dengan pertanyaan yang sama)
retryButton.addEventListener('click', retryGame);

// Mulai game pertama kali
startNewGame();