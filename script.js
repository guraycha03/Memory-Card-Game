document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const startButton = document.getElementById("start");
    const restartButton = document.getElementById("restart");
    const timerDisplay = document.getElementById("timer");

    const imagePaths = [
        "assets/images/goat.png",
        "assets/images/girl.png",
        "assets/images/unicorn.png",
        "assets/images/vet.png",
        "assets/images/whale.png",
        "assets/images/fairy.png"
    ];

    let cardValues = [...imagePaths, ...imagePaths];
    let flippedCards = [];
    let matchedCards = [];
    let startTime;
    let timer;
    let gameStarted = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        startTime = Date.now();
        timer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = `Time: ${elapsedTime}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function createBoard() {
        gameBoard.innerHTML = "";
        shuffle(cardValues);
        cardValues.forEach(value => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.value = value;

            const img = document.createElement("img");
            img.src = value;
            card.appendChild(img);

            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
        matchedCards = [];
        flippedCards = [];
        gameStarted = false;
        timerDisplay.textContent = "Time: 0s";
        restartButton.disabled = true;
    }

    function flipCard() {
        if (!gameStarted) return;
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            this.classList.add("flipped");
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    function checkMatch() {
        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            matchedCards.push(...flippedCards);
        } else {
            flippedCards.forEach(card => {
                card.classList.remove("flipped");
            });
        }
        flippedCards = [];
        if (matchedCards.length === cardValues.length) {
            stopTimer();
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            setTimeout(() => {
                confetti();
                alert(`You win! Time: ${elapsedTime}s`);
            }, 500);
        }
    }

    startButton.addEventListener("click", () => {
        gameStarted = true;
        startButton.disabled = true;
        restartButton.disabled = false;
        startTimer();
    });

    restartButton.addEventListener("click", () => {
        gameStarted = false;
        startButton.disabled = false;
        restartButton.disabled = true;
        stopTimer();
        timerDisplay.textContent = "Time: 0s";
        createBoard();
    });

    createBoard();
});
