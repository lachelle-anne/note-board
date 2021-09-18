const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const toDoList = document.getElementById('to-do-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let toDoListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

//Drag functionality
let draggedItem;
let dragging = false;
let currentColumn;

//Get arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('toDoItems')) {
    toDoListArray = JSON.parse(localStorage.toDoItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    toDoListArray = ['Apply for jobs'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Complete a Udemy project'];
    onHoldListArray = ['My social life'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [toDoListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['toDo', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

//Filter arrays to remove empty items
function filterArray(array){
  const filteredArray = array.filter(item => item !== null);
  return filteredArray
}

// Create DOM Elements for each list item
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
  // Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // To Do Column
  toDoList.textContent = '';
  toDoListArray.forEach((toDoItem, index) => {
    createItemEl(toDoList, 0, toDoItem, index);
  });
  toDoListArray = filterArray(toDoListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

//Update item - Delete if necessary or update array value
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if(!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }
    else{
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

//Add to column list, reset textbox
function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

//Show add item input box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

//Hide item input box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none'; 
  addToColumn(column);
}

//Allow arrays to reflect drag and drop items
function rebuildArrays(){
  toDoListArray = [];
  for (let i = 0; i < toDoList.children.length; i++){
    toDoListArray.push(toDoList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

//Commencing item drag
function drag(e){
  draggedItem = e.target;
  dragging = true;
}

//Column allows item to be dropped in
function allowDrop(e){
  e.preventDefault();
}

//Item entering the column area
function dragEnter(column){
  listColumns[column].classList.add('over');
  currentColumn = column;
}

//Dropping item in the column
function drop(e){
  e.preventDefault();
  //Remove the background color/padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  //Add item to the column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  //Dragging complete
  dragging = false;
  rebuildArrays();

}

//On load
updateDOM();

