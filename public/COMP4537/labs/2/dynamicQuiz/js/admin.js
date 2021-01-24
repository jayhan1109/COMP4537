const quizList = document.querySelector(".quiz_list");
const btnContainer = document.querySelector(".btn_container");
const addBtn = document.querySelector(".btn_add");
const saveBtn = document.querySelector(".btn_save");
const deleteBtn = document.querySelector(".btn_delete");
const saveTxt = document.querySelector(".text_save");
let questionLen = 0;


/*
Create an question
 */
const getQuestion = (num, question = "", options = [], answer = -1) => {

  // creates div block that holds each question
  const quizDiv = document.createElement("div");

  // question number and title
  const quizTitle = document.createElement("p");
  quizDiv.className = "quiz";
  quizDiv.appendChild(quizTitle);
  quizTitle.className = "quiz_title";
  quizTitle.innerHTML = `Question ${num}`;
  quizDiv.appendChild(document.createElement("br"));

  // text area for question
  const textareaQuestion = document.createElement("textarea");
  textareaQuestion.className = "textarea quiz_question";
  textareaQuestion.rows = 5;
  textareaQuestion.cols = 50;
  textareaQuestion.innerHTML = `${question}`;
  textareaQuestion.required = true;
  quizDiv.appendChild(textareaQuestion);
  quizDiv.appendChild(document.createElement("br"));

  // answer title
  const answerTitle = document.createElement("p");
  answerTitle.innerHTML = "Answer*";
  quizDiv.appendChild(answerTitle);

  // creates div block that holds mc options
  const mc = document.createElement("div");
  mc.className = "mc";
  quizDiv.appendChild(mc);

  for (let i = 0; i < 4; i++) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    container.appendChild(input);
    container.appendChild(textarea);

    // radio button
    input.type = "radio";
    input.name = `q${num}`;
    input.required = true;
    input.checked = (i === answer);

    // mc options
    textarea.className = "choice";
    textarea.rows = 1;
    textarea.cols = 30;
    textarea.innerHTML = `${options[i] || ""}`;
    textarea.required = true;

    mc.appendChild(container);
  }

  console.log(quizDiv);
  return quizDiv;
};

/*
Add new question
 */
const addQuestion = (num, question = "", options = [], answer = -1) => {
  let quiz = document.createElement("div");
  quiz.appendChild(getQuestion(num, question, options, answer));
  quizList.insertBefore(quiz, btnContainer);
};

/*
Saves the new line state
*/
function setNewLine(text){
  
  let newText = "";
  newText = text.replace(/(\r\n|\n|\r)/gm, "&#13;&#10");

  console.log(newText);
  return newText;
}

/*
Check Localstorage when the page loads
If any questions in Localstorage, load them with an extra empty Question element
Or load an empty Question element
 */
window.addEventListener("load", () => {
  let questions = JSON.parse(localStorage.getItem("questions"));
  saveTxt.innerHTML = "Unsaved Changes";
  saveTxt.classList.add("auto_unsaved");
  saveTxt.classList.remove("auto_saved");
  if (questions && questions.length !== 0) {
    console.log(questions);
    questionLen = 0;
    for (let i = 0; i < questions.length; i++) {
      const options = [questions[i].option1, questions[i].option2, questions[i].option3, questions[i].option4];
      console.log(questions[i].answer);
      addQuestion(i + 1, setNewLine(questions[i].question), options, questions[i].answer);
      questionLen++;
    }
  }
  addQuestion(questionLen + 1);
  questionLen++;
});

/*
Update localstorage
 */
const updateStorage = () => {
  const arr = [];
  const questions = document.querySelectorAll(".quiz");
  let questionNum;

  for (let i = 0; i < questions.length; i++) {
    const questionObj = {};

    if (!questions[i].children[2].value)
      continue;

    questionNum = "q" + (i + 1);

    questionObj.question = questions[i].children[2].value;
    questionObj.option1 = questions[i].children[5].children[0].children[1].value;
    questionObj.option2 = questions[i].children[5].children[1].children[1].value;
    questionObj.option3 = questions[i].children[5].children[2].children[1].value;
    questionObj.option4 = questions[i].children[5].children[3].children[1].value;

    const options = document.getElementsByName(`${questionNum}`);

    questionObj.answer = Array.from(options.values()).findIndex((o) => o.checked);

    arr.push(questionObj);
  }

  localStorage.setItem("questions", JSON.stringify(arr));
};


/*
Add button click event
 */
addBtn.addEventListener("click", () => {
  addQuestion(questionLen + 1);
  questionLen++;
  saveTxt.innerHTML = "Unsaved Changes";
  saveTxt.classList.add("auto_unsaved");
  saveTxt.classList.remove("auto_saved");
  updateStorage();
});


/*
Save button click event
 */
saveBtn.addEventListener("click", () => {
  saveTxt.innerHTML = "Saved";
  saveTxt.classList.add("auto_saved");
  saveTxt.classList.remove("auto_unsaved");
  updateStorage();
});

/*
Delete button click event
 */
deleteBtn.addEventListener("click", () => {
  const questions = document.querySelectorAll(".quiz");
  const lastElement = questions[questions.length - 1];
  lastElement.parentNode.remove();
  questionLen--;
  updateStorage();
});

/*
Autosaves contents every 2 seconds
*/
let saveTimer = setInterval(autoSave, 2000);

/*
Function for saving
*/
function autoSave() {
  saveTxt.innerHTML = "Saved";
  saveTxt.classList.add("auto_saved");
  saveTxt.classList.remove("auto_unsaved");
  updateStorage();
}