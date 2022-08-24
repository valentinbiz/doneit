const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtn = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addButtonGroup = document.querySelectorAll(".add-btn-group");
const addItems = document.querySelectorAll(".add-item");
const removeItems = document.querySelectorAll(".remove-btn");

const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");

//Values for timer

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
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    backlogListArray = [
      "1.Use the button bellow to add an item to the list",
      "2.To edit a task simply click the item",
    ];
    progressListArray = ["3.Move the task between the columns accordingly"];
    completeListArray = [
      '4.Once you are done with all the tasks use the "delete" button to clear the list',
    ];
  }
}

//Update the columns with the data we have
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray];
  const arrayNames = ["backlog", "progress", "complete"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);

  //Append
  columnEl.appendChild(listEl);
}

//Filter array to remove items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function updateDom() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  completeList.textContent = "";
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
  if (!itemText == "") {
    selectedArray.push(itemText);
  }
  addItems[column].textContent = "";
  updateDom();
}

//Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  removeItems[column].style.visibility = "hidden";
  addButtonGroup[column].style.visibility = "hidden";
  saveItemBtn[column].style.visibility = "visible";
  addItemContainers[column].style.display = "flex";
  addItemContainers[column].addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      saveItemBtn[column].click();
    }
  });
}

//Hide Input Box when hitting save
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  removeItems[column].style.visibility = "visible";
  addButtonGroup[column].style.visibility = "visible";
  saveItemBtn[column].style.visibility = "hidden";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

//Delete all the elements of a column
function deleteItems(column) {
  let selectedArray = listArrays[column];
  if (!selectedArray == []) {
    selectedArray.length = 0;
  }
  updateDom();
}

//Allow arrays to reflect drag and drop Items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressList.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (item) => item.textContent
  );
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
  listColumns[column].classList.add("over");
  currentColumn = column;
}

function drop(event) {
  event.preventDefault();
  //Remove bg color padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  //Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}
//On load;
updateDom();
