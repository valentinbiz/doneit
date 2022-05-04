
//Elements from the DOM
//Pomodoro:
const body = document.querySelector('body');
const display = document.querySelector('#timer');
const modal = document.querySelector('#modal');
const modalInstructions = document.querySelector('#modal-instructions');
const settings = document.querySelector('#settings');
const finish = document.querySelector('#end-session');
const instructions = document.querySelector('#instructions');

const volume = document.querySelector('#volume');
const audio = document.querySelector('#audio');

const sessionBtns = document.querySelectorAll('.set');
const startBtn = document.querySelector('#btn');
const toggleBtn = document.querySelector('#check');
const closeModal = document.querySelector('#close');
const closeInstructions = document.querySelector('#closeInstructions');

const pomodoro = document.querySelector('#pomodoro');
const short = document.querySelector('#short');
const long = document.querySelector('#long');

const timePom = document.querySelector('#pom');
const timeShort = document.querySelector('#shorter');
const timeLong = document.querySelector('#longer');

//Kanban Board:
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtn = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const removeItems = document.querySelectorAll('.remove-btn')

const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');

//Values for timer
let countdown;
let variable;

let updatedOnLoad = false;

// Initialize Arrays;
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let listArrays = [];

//Drag functionality
let draggedItem;
let currentColumn;
let dragging = false;

//Initialize the column on load with static or data from storage
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    backlogListArray = ['Task 1 (click here to edit)'];
    progressListArray = [];
    completeListArray = [];
  }
}

//Update the columns with the data we have 
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray];
  const arrayNames = ['backlog', 'progress', 'complete'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  })
}

function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  //Append
  columnEl.appendChild(listEl);
}

//Filter array to remove items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}


function updateDom() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  updatedOnLoad = true;
  updateSavedColumns();
}

//Update item - Delete the item if blank
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDom();
  }
}

//Add to column list
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  if (!itemText == '') {
    selectedArray.push(itemText);
  }
  addItems[column].textContent = '';
  updateDom();
}

//Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  removeItems[column].style.visibility = 'hidden';
  saveItemBtn[column].style.visibility = 'visible';
  addItemContainers[column].style.display = 'flex';
  addItemContainers[column].addEventListener('keypress', function(event) {
    if (event.key == 'Enter') {
        saveItemBtn[column].click();
    }
  });
}

//Hide Input Box when hitting save
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  removeItems[column].style.visibility = 'visible';
  saveItemBtn[column].style.visibility = 'hidden';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

//Delete all the elements of a column
function deleteItems(column) {
  let selectedArray = listArrays[column];
  if (!selectedArray == []) {
    selectedArray.length = 0;
  }
  updateDom()
}

//Allow arrays to reflect drag and drop Items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  updateDom();
}

//Drag and Drop functionality
function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

function allowDrop(event) {
  event.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(event) {
  event.preventDefault();
  //Remove bg color padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  })
  //Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}


//Pomodoro

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
  timePom.value = '25';
  timeShort.value = '5';
  timeLong.value = '15';
  toggleBtn.checked = false;
}

function changePom(e) {
  pomodoro.dataset.min = timePom.value;
  if (pomodoro.classList.contains('active')) {
    resetElements(pomodoro)
  }
}

function changeShort(e) {
  short.dataset.min = timeShort.value;
  if (short.classList.contains('active')) {
    resetElements(short);
  }
}

function changeLong(e) {
  long.dataset.min = timeLong.value;
  if (long.classList.contains('active')) {
    resetElements(long);
  }
}

function closeIt(e) {
  modal.classList.remove('active');
  document.querySelector('.modal-wrapper').style.display = 'none';
}

function closeInst(e) {
  modalInstructions.classList.remove('active');
  document.querySelector('.modal-instructions-wrapper').style.display = 'none';
};

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
startBtn.addEventListener('click', closeWin);

function callClosure() {
  return function closure(e) {
    if (e.target.textContent === 'START' && variable === undefined) {
      e.target.textContent = 'STOP';
      timer(timeSet);
    } else if (e.target.textContent === 'STOP') {
      e.target.textContent = 'START';
      clearInterval(countdown);
      let minutes = [];
      let counter = 0;
      while (display.textContent[counter] !== ':') {
        minutes.push(display.textContent[counter]);
        counter++;
      }
      let seconds = parseInt(
        display.textContent[display.textContent.length - 2] +
        display.textContent[display.textContent.length - 1]
      );
      minutes = parseInt(minutes.join(''));
      variable = minutes * 60 + seconds;
    } else if (e.target.textContent === 'START' && variable !== undefined) {
      e.target.textContent = 'STOP';
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
  startBtn.textContent = 'START';
}

body.addEventListener('click', (e) => {
  if (e.target.id === 'short') {
    resetElements(short)
    body.style.backgroundColor = '#4ca6a9';
    btn.style.color = '#4ca6a9';
  } else if (e.target.id === 'pomodoro') {
    resetElements(pomodoro)
    body.style.backgroundColor = '#B57170';
    btn.style.color = '#B57170';
  } else if (e.target.id === 'long') {
    resetElements(long)
    body.style.backgroundColor = '#498fc1';
    btn.style.color = '#498fc1';

  }
});

sessionBtns.forEach((element) => {
  element.addEventListener('click', (e) => {
    checkActive();
    e.target.classList.add('active');
  });
});


function checkActive() {
  sessionBtns.forEach((element) => {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
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
      if (pomodoro.classList.contains('active')) {
        variable = undefined;
        pomodoro.classList.remove('active');
        if (sessions === 4) {
          short.classList.remove('active');
          long.classList.add('active');
          sessions = 0;
          body.style.backgroundColor = '#498fc1';
          btn.style.color = '#498fc1';
          display.textContent = `${long.dataset.min}:00`;
          timeSet = toSeconds(long.dataset.min);
          buttonChange();
        } else {
          short.classList.add('active');
          body.style.backgroundColor = '#4ca6a9';
          btn.style.color = '#4ca6a9';
          display.textContent = `${short.dataset.min}:00`;
          timeSet = toSeconds(short.dataset.min);
          buttonChange()
        }
      } else if (
        short.classList.contains('active') || long.classList.contains('active')) {
        short.classList.remove('active');
        long.classList.remove('active');
        pomodoro.classList.add('active');
        sessions++;
        variable = undefined;
        body.style.backgroundColor = '#B57170';
        btn.style.color = '#B57170';
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
  if (toggleBtn.classList.contains('active')) {
    timer(timeSet);
    startBtn.textContent = 'STOP';
  } else {
    startBtn.textContent = 'START';
  }
}

//Time display calculations
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  const value = `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  display.textContent = value;
  document.title = value;
}

//Instructions modal
window.onload = function () {
  notifyMe();
  setTimeout(function () {
    modalInstructions.classList.add('active')
    document.querySelector('.modal-instructions-wrapper').style.display = 'block'
  }, 1000);
};

//Adding eventListeners from buttons
toggleBtn.addEventListener('click', () => {
  toggleBtn.classList.toggle('active');
});

settings.addEventListener('click', () => {
  modal.classList.add('active');
  document.querySelector('.modal-wrapper').style.display = 'block';
});

instructions.addEventListener('click', () => {
  modalInstructions.classList.add('active');
  document.querySelector('.modal-instructions-wrapper').style.display = 'block';
});

document.querySelector('#button-m').addEventListener('click', () => {
  if (checkIt()) {
    closeIt();
  }
});

closeModal.addEventListener('click', () => {
  if (checkIt()) {
    closeIt();
  }
});

closeInstructions.addEventListener('click', () => {
    closeInst();
});

//End session functionality
finish.addEventListener('click', () => {
  // swal('The current session will end now.');
  window.alert('The current session will end now.');
  if (pomodoro.classList.contains('active') || pomodoro.classList.contains('inactive')) {
    pomodoro.classList.remove('active') || pomodoro.classList.add('inactive');
    resetElements(pomodoro);
    buttonChange()
  }
  if (short.classList.contains('active') || short.classList.contains('inactive')) {
    short.classList.remove('active') || short.classList.add('inactive');
    resetElements(short);
    buttonChange()
  }
  if (long.classList.contains('active') || long.classList.contains('inactive')){
    long.classList.remove('active') || long.classList.add('inactive');
    resetElements(long);
    buttonChange()
  }
})

function notifyMe() {
  // Let's check if the browser supports notifications
  if (Notification.permission !== "denied") {
     Notification.requestPermission().then(permission => {
        console.log(permission);
     });
  }
}

function showNotification() {
  console.log('Session ended notification')
  const notification = new Notification("Congrats!", {
     body: "The session has ended."
  })
  notification.onclick = (e) => {
     window.location.href = "https://google.com";
  };
}

//On load;
updateDom();