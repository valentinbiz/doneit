const body = document.querySelector("body");
const display = document.querySelector("#timer");
const container = document.querySelector("#container");
const modal = document.querySelector("#modal");
const modalInstructions = document.querySelector("#modal-instructions");
const settings = document.querySelector("#settings");
const finish = document.querySelector("#end-session");

const volume = document.querySelector("#volume");
const audio = document.querySelector("#audio");

const sessionBtns = document.querySelectorAll(".set");
const startBtn = document.querySelector("#btn");
const toggleBtn = document.querySelector("#check");
const closeModal = document.querySelector("#close");

const pomodoro = document.querySelector("#pomodoro");
const short = document.querySelector("#short");
const long = document.querySelector("#long");

const timePom = document.querySelector("#pom");
const timeShort = document.querySelector("#shorter");
const timeLong = document.querySelector("#longer");

let countdown;
let variable;
//Resetting the values on load or based on the changes made in the settings
function toSeconds(valueInMinutes) {
  return parseInt(valueInMinutes * 60);
}

let timeSet = toSeconds(pomodoro.dataset.min);
window.onload = resetInCase;
timePom.oninput = changePom;
timeShort.oninput = changeShort;
timeLong.oninput = changeLong;

function resetInCase() {
  timePom.value = "25";
  timeShort.value = "5";
  timeLong.value = "15";
  toggleBtn.checked = false;
}

function changePom(e) {
  pomodoro.dataset.min = timePom.value;
  if (pomodoro.classList.contains("active")) {
    resetElements(pomodoro);
  }
}

function changeShort(e) {
  short.dataset.min = timeShort.value;
  if (short.classList.contains("active")) {
    resetElements(short);
  }
}

function changeLong(e) {
  long.dataset.min = timeLong.value;
  if (long.classList.contains("active")) {
    resetElements(long);
  }
}

function closeIt(e) {
  modal.classList.remove("active");
  document.querySelector(".modal-wrapper").style.display = "none";
}

//Check the validity of the values before closing the modal
function checkIt() {
  if (
    timePom.value <= 0 ||
    timePom.value % 1 !== 0 ||
    timeShort.value % 1 !== 0 ||
    timeLong.value % 1 !== 0 ||
    timeShort.value <= 0 ||
    timeLong.value <= 0
  ) {
    return false;
  } else {
    return true;
  }
}

//Functionality of the timer
let closeWin = callClosure();
startBtn.addEventListener("click", closeWin);

function callClosure() {
  return function closure(e) {
    if (e.target.textContent === "START" && variable === undefined) {
      e.target.textContent = "STOP";
      timer(timeSet);
    } else if (e.target.textContent === "STOP") {
      e.target.textContent = "START";
      clearInterval(countdown);
      let minutes = [];
      let counter = 0;
      while (display.textContent[counter] !== ":") {
        minutes.push(display.textContent[counter]);
        counter++;
      }
      let seconds = parseInt(
        display.textContent[display.textContent.length - 2] +
          display.textContent[display.textContent.length - 1]
      );
      minutes = parseInt(minutes.join(""));
      variable = minutes * 60 + seconds;
    } else if (e.target.textContent === "START" && variable !== undefined) {
      e.target.textContent = "STOP";
      clearInterval(countdown);
      timer(variable);
    }
  };
}

//Reseting elements on session change
function resetElements(session) {
  clearInterval(countdown);
  variable = undefined;
  display.textContent = `${session.dataset.min}:00`;
  timeSet = toSeconds(session.dataset.min);
  startBtn.textContent = "START";
}

body.addEventListener("click", (e) => {
  if (e.target.id === "short") {
    resetElements(short);
    container.style.backgroundColor = "#729597";
    btn.style.color = "#729597";
  } else if (e.target.id === "pomodoro") {
    resetElements(pomodoro);
    container.style.backgroundColor = "#B68588";
    btn.style.color = "#B68588";
  } else if (e.target.id === "long") {
    resetElements(long);
    container.style.backgroundColor = "#486b6e";
    btn.style.color = "#486b6e";
  }
});

sessionBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    checkActive();
    e.target.classList.add("active");
  });
});

function checkActive() {
  sessionBtns.forEach((element) => {
    if (element.classList.contains("active")) {
      element.classList.remove("active");
    }
  });
}

//Control the behaviour of the timer, changing elements automatically and added 4 sessions as standard before long break
let sessions = 1;

function timer(seconds) {
  const current = Date.now();
  const target = current + seconds * 1000;
  displayTimeLeft(seconds);
  countdown = setInterval(() => {
    const remainingTime = Math.round((target - Date.now()) / 1000);
    if (remainingTime < 0) {
      audio.volume = volume.value;
      audio.play();
      clearInterval(countdown);
      showNotification();
      if (pomodoro.classList.contains("active")) {
        variable = undefined;
        pomodoro.classList.remove("active");
        if (sessions === 4) {
          short.classList.remove("active");
          long.classList.add("active");
          sessions = 0;
          container.style.backgroundColor = "#486b6e";
          btn.style.color = "#486b6e";
          display.textContent = `${long.dataset.min}:00`;
          timeSet = toSeconds(long.dataset.min);
          buttonChange();
        } else {
          short.classList.add("active");
          container.style.backgroundColor = "#729597";
          btn.style.color = "#729597";
          display.textContent = `${short.dataset.min}:00`;
          timeSet = toSeconds(short.dataset.min);
          buttonChange();
        }
      } else if (
        short.classList.contains("active") ||
        long.classList.contains("active")
      ) {
        short.classList.remove("active");
        long.classList.remove("active");
        pomodoro.classList.add("active");
        sessions++;
        variable = undefined;
        container.style.backgroundColor = "#B68588";
        btn.style.color = "#B68588";
        display.textContent = `${pomodoro.dataset.min}:00`;
        timeSet = toSeconds(pomodoro.dataset.min);
        buttonChange();
      }
      return;
    }
    displayTimeLeft(remainingTime);
  }, 1000);
}

//Change content of the main button
function buttonChange() {
  if (toggleBtn.classList.contains("active")) {
    timer(timeSet);
    startBtn.textContent = "STOP";
  } else {
    startBtn.textContent = "START";
  }
}

//Time display calculations
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  const value = `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  display.textContent = value;
  document.title = value;
}

//Instructions modal

//Adding eventListeners from buttons
toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
});

settings.addEventListener("click", () => {
  modal.classList.add("active");
  document.querySelector(".modal-wrapper").style.display = "block";
});

document.querySelector("#button-m").addEventListener("click", () => {
  if (checkIt()) {
    closeIt();
  }
});

closeModal.addEventListener("click", () => {
  if (checkIt()) {
    closeIt();
  }
});

//End session functionality
finish.addEventListener("click", () => {
  // swal('The current session will end now.');
  window.alert("The current session will end now.");
  if (
    pomodoro.classList.contains("active") ||
    pomodoro.classList.contains("inactive")
  ) {
    pomodoro.classList.remove("active") || pomodoro.classList.add("inactive");
    resetElements(pomodoro);
    buttonChange();
  }
  if (
    short.classList.contains("active") ||
    short.classList.contains("inactive")
  ) {
    short.classList.remove("active") || short.classList.add("inactive");
    resetElements(short);
    buttonChange();
  }
  if (
    long.classList.contains("active") ||
    long.classList.contains("inactive")
  ) {
    long.classList.remove("active") || long.classList.add("inactive");
    resetElements(long);
    buttonChange();
  }
});
