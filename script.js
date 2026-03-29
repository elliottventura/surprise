// Date cible : 12 avril de cette année à 09:00
const targetDate = new Date(new Date().getFullYear(), 3, 12, 9, 0, 0).getTime();
// (Mois en JS : 0 = janvier, donc 3 = avril)[web:60][web:67]

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("countdown-message");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    if (messageEl) {
      messageEl.textContent = "C’est le grand jour ! ✨";
    }
    clearInterval(countdownInterval);
    return;
  }

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(distance / oneDay);
  const hours = Math.floor((distance % oneDay) / oneHour);
  const minutes = Math.floor((distance % oneHour) / oneMinute);
  const seconds = Math.floor((distance % oneMinute) / oneSecond);

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
