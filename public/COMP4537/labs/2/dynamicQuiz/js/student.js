/*
Query selectors
*/
const quizList = document.querySelector(".quiz_list");
const btnContainer = document.querySelector(".btn_container");
const submitBtn = document.querySelector(".btn_submit");
const scoreTxt = document.querySelector(".score");

/*
Initial values
*/
let questionLen = 0;
let score = 0;
const answerList = [];
let checkedQ = 0;

/*
Create a question
 */
const getQuestion = (num, question = "", options = [], answer = -1) => {

  // creates div block that holds each question
  const quizDiv = document.createElement("div");

  // question number and title
  const quizTitle = document.createElement("p");
  quizDiv.className = "quiz";
  quizDiv.appendChild(quizTitle);
  quizTitle.className = "quiz_title";
  quizTitle.innerText = `Question ${num}`;
  quizDiv.appendChild(document.createElement("br"));

  // text area for question
  const divQuestion = document.createElement("div");
  divQuestion.className = "textarea quiz_question textDivQuestion";
  divQuestion.rows = 5;
  divQuestion.cols = 50;
  divQuestion.innerHTML = `${question}`;
  divQuestion.required = true;
  divQuestion.disabled = true;
  quizDiv.appendChild(divQuestion);
  quizDiv.appendChild(document.createElement("br"));

  // answer title
  const answerTitle = document.createElement("p");
  answerTitle.innerText = "Answer*";
  quizDiv.appendChild(answerTitle);

  // creates div block that holds mc options
  const mc = document.createElement("div");
  mc.className = "mc";
  quizDiv.appendChild(mc);

  // generates mc choice options
  for (let i = 0; i < 4; i++) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const div = document.createElement("div");
    container.appendChild(input);
    container.appendChild(div);

    // radio button
    input.type = "radio";
    input.name = `q${num}`;
    input.required = true;

    // mc options
    div.className = "choice textDivOption";
    div.rows = 1;
    div.cols = 30;
    div.innerHTML = `${options[i] || ""}`;
    div.required = true;
    div.disabled = true;

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
Check Localstorage when the page loads
If any questions in Localstorage, load them with an extra empty Question element
Or load an empty Question element
 */
window.addEventListener("load", () => {
  let questions = JSON.parse(localStorage.getItem("questions"));
  if (questions && questions.length !== 0) {
    console.log(questions);
    for (let i = 0; i < questions.length; i++) {
      const currentAnswer = questions[i].answer;
      const options = [
        highlightSyntax(questions[i].option1),
        highlightSyntax(questions[i].option2),
        highlightSyntax(questions[i].option3),
        highlightSyntax(questions[i].option4),
      ];
      addQuestion(
        i + 1,
        highlightSyntax(questions[i].question),
        options,
        currentAnswer
      );
      answerList.push(currentAnswer);
      questionLen = questions.length;
      scoreTxt.textContent = `SCORE - ${score}/${questionLen}`;
    }
  } else {
    // TODO: error message
    scoreTxt.remove();
    submitBtn.remove();
    const errorMsg = document.createElement("h2");
    errorMsg.className = "score";
    errorMsg.textContent = `No Questions.`;
    quizList.insertBefore(errorMsg, btnContainer);
  }
});

/*
 Highlight reserved words in red
*/
function highlightSyntax(text) {
  let newText = "";
  newText = text.replace(/(\r\n|\n|\r)/gm, "<br>");
  newText = newText.replace(
    /let|var|const|{|}|\(|\)|\+|\-|\*|\/|\=/gi,
    (x) => `<span class="reserved">${x}</span>`
  );

  console.log(newText);
  return newText;
}


/* 
Checks how many questions have been checked off
*/
function countCheck(){
  let checkedQ = 0;

  for (let i = 0; i < questionLen; i++) {
    const questions = document.getElementsByName(`q${i + 1}`);
    for (let j = 0; j < questions.length; j++) {
      if (questions[j].checked) {
        checkedQ++;
      }
    }
  }
  return checkedQ;
}

/*
Submit button click event
 */
submitBtn.addEventListener("click", () => {
  score = 0;

  // checks if all the questions have been checked
  if (countCheck() !== questionLen) {
    alert("Please complete all the questions");
  } else {
    
    // checks if answer is correct or wrong
    for (let i = 0; i < questionLen; i++) {
      const questions = document.getElementsByName(`q${i + 1}`);
      for (let j = 0; j < questions.length; j++) {
        if (questions[j].checked) {
          checkedQ++;
          if (answerList[i] === j) {
            questions[j].nextElementSibling.classList.add("answer");
            score++;
          }
          questions[j].nextElementSibling.classList.add("wrong");
          break;
        }
      }
      questions[answerList[i]].nextElementSibling.classList.add("answer");
      questions[answerList[i]].nextElementSibling.classList.remove("wrong");
    }
    scoreTxt.textContent = `SCORE - ${score}/${questionLen}`;
  }
});