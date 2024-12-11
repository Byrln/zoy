// Countdown Timer
function updateCountdown() {
    const eventDate = new Date("2024-12-25T00:00:00");
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        document.getElementById('countdown').innerText = "The event is live now!";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText = `Next Event: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds!`;
}
setInterval(updateCountdown, 1000);

// Game Trigger
function startGame(event) {
    event.preventDefault();
    alert("Thanks for signing up! Get ready for the 2D game!");
    window.location.href = "2d-game.html";
}