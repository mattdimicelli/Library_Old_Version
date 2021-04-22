`use strict`;

let myLibrary = [];

const libraryDiv = document.querySelector(`.library`);
const addBookBtn = document.querySelector(`.add-book-btn`);
const submitBtnForAddBook = document.querySelector(`.submit-btn`);
const newBookFormModal = document.querySelector(`.new-book-form-modal`);
const modalContainer = document.querySelector(`.modal-container`);
const titleInput = document.querySelector(`#title`);
const authorInput = document.querySelector(`#author`);
const pagesInput = document.querySelector(`#pages`);
const readNotReadRadioBtns = document.querySelector(`.radio-form-row`);
const readRadioBtn = readNotReadRadioBtns.querySelector(`#yesread`);
const notReadRadioBtn = readNotReadRadioBtns.querySelector(`#notread`);
const totalStat = document.querySelector(`.total-stat`);
const readStat = document.querySelector(`.read-stat`);
const unreadStat = document.querySelector(`.unread-stat`);
const closeFormIcon = newBookFormModal.querySelector(`button:first-of-type`);

//run on startup
loadFromLocalStorage();
displayBooks(myLibrary);
updateStats();

//event listeners
libraryDiv.addEventListener(`click`, (e) => {
  if (e.target.matches(`button[class="remove-btn"]`)) {
    const titleOfBook =
      e.target.previousElementSibling.firstElementChild.outerText;
    removeBook(titleOfBook);
  }
  if (e.target.matches(`input[type="checkbox"]`)) {
    const titleOfBook =
      e.target.parentElement.parentElement.parentElement.firstElementChild
        .firstElementChild.outerText;
    toggleReadNotRead(titleOfBook);
  }
});

addBookBtn.addEventListener(`click`, () => {
  newBookFormModal.classList.add(`open`);
  modalContainer.classList.add(`open`);
});

closeFormIcon.addEventListener(`click`, (e) => {
  e.preventDefault();
  newBookFormModal.classList.remove(`open`);
  modalContainer.classList.remove(`open`);
});

submitBtnForAddBook.addEventListener(`click`, (e) => {
  addBookToLibrary(e);
  newBookFormModal.classList.remove(`open`);
  modalContainer.classList.remove(`open`);
});

function Book(title, author, pages, alreadyRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.alreadyRead = alreadyRead === `true`;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.alreadyRead === true ? `read` : `not read yet`
    }`;
  };
}

function toggleReadNotRead(bookTitle) {
  myLibrary = myLibrary.map((book) => {
    if (book.title === bookTitle) {
      book.alreadyRead = !book.alreadyRead;
    }
    return book;
  });
  setTimeout(function () {
    displayBooks(myLibrary);
  }, 400);
  saveToLocalStorage();
  updateStats();
}

function addBookToLibrary(e) {
  e.preventDefault();
  const selectedRadioBtn =
    readRadioBtn.checked === true ? readRadioBtn : notReadRadioBtn;
  const book = new Book(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    selectedRadioBtn.value
  );
  myLibrary.push(book);
  displayBooks(myLibrary);
  saveToLocalStorage();
  updateStats();
}

function generateReadStat() {
  let read = 0;
  for (let book of myLibrary) {
    if (book.alreadyRead === true) read += 1;
  }
  return read;
}

function generateUnreadStat() {
  let unread = 0;
  for (let book of myLibrary) {
    if (book.alreadyRead === false) unread += 1;
  }
  return unread;
}

function updateStats() {
  totalStat.textContent = myLibrary.length;
  readStat.textContent = generateReadStat();
  unreadStat.textContent = generateUnreadStat();
}

function displayBooks(myLibrary) {
  const html = myLibrary
    .map((book) => {
      const classSwitch =
        book.alreadyRead === true ? `class="book read"` : `class="book"`;
      const checkboxSwitch = book.alreadyRead === true ? `checked` : ``;
      return `
      <div ${classSwitch}>
        <ul>
          <li>${book.title}</li>
          <li>By: ${book.author}</li>
          <li>Pages: ${book.pages}</li>
        </ul>
        <button class="remove-btn">❌</button>
        <div class="toggle-switch-container">
          <span>Not Read</span>
          <label class="toggle-switch-read-unread">
            <input type="checkbox" ${checkboxSwitch}>
            <span class="slider round"></span>
          </label>
          <span>Read</span>
        </div>
      </div>
      `;
    })
    .join(``);
  libraryDiv.innerHTML = html;
}

function removeBook(titleOfBookToRemove) {
  myLibrary = myLibrary.filter((book) => {
    if (book.title === titleOfBookToRemove) return false;
    else return true;
  });
  displayBooks(myLibrary);
  saveToLocalStorage();
  updateStats();
}

function saveToLocalStorage() {
  localStorage.setItem(`myLibrary`, JSON.stringify(myLibrary));
}

function loadFromLocalStorage() {
  const myLibraryFromStorage = JSON.parse(localStorage.getItem(`myLibrary`));
  if (myLibraryFromStorage) myLibrary.push(...myLibraryFromStorage);
}
