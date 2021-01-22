const quizList = document.querySelector(".quiz_list");
const btnContainer = document.querySelector(".btn_container");
const submitBtn = document.querySelector(".btn_submit");
const scoreTxt = document.querySelector(".score");
let questionLen = 0;
let score = 0;
const answerList = [];


/*
Create an question
 */
const getQuestion = (num, question = "", options = [], answer = -1) => {
  const quizDiv = document.createElement("div");

  const quizTitle = document.createElement("p");
  quizDiv.className = "quiz";
  quizDiv.appendChild(quizTitle);
  quizTitle.className = "quiz_title";
  quizTitle.innerText = `Question ${num}`;
  quizDiv.appendChild(document.createElement("br"));

  const textareaQuestion = document.createElement("textarea");
  textareaQuestion.className = "textarea quiz_question";
  textareaQuestion.rows = 5;
  textareaQuestion.cols = 50;
  textareaQuestion.innerText = `${question}`;
  textareaQuestion.required = true;
  textareaQuestion.disabled = true;
  quizDiv.appendChild(textareaQuestion);
  quizDiv.appendChild(document.createElement("br"));

  const answerTitle = document.createElement("p");
  answerTitle.innerText = "Answer*";
  quizDiv.appendChild(answerTitle);

  const mc = document.createElement("div");
  mc.className = "mc";
  quizDiv.appendChild(mc);

  for (let i = 0; i < 4; i++) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    container.appendChild(input);
    container.appendChild(textarea);

    input.type = "radio";
    input.name = `q${num}`;
    input.required = true;

    textarea.className = "choice";
    textarea.rows = 1;
    textarea.cols = 30;
    textarea.innerText = `${options[i] || ""}`;
    textarea.required = true;
    textarea.disabled = true;

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
      const options = [questions[i].option1, questions[i].option2, questions[i].option3, questions[i].option4];
      addQuestion(i + 1, questions[i].question, options, currentAnswer);
      answerList.push(currentAnswer);
      questionLen = questions.length;
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
Submit button click event
 */
submitBtn.addEventListener("click", () => {
  score = 0;
  for (let i = 0; i < questionLen; i++) {
    const questions = document.getElementsByName(`q${i + 1}`);

    for (let j = 0; j < questions.length; j++) {
      if (questions[j].checked) {
        if (answerList[i] === j) {
          questions[j].nextElementSibling.classList.add("answer");
          score++;
        }
        questions[j].nextElementSibling.classList.add("wrong");

        break;
      }
    }

    console.log(score);

    console.log(questions[answerList[i]]);

    questions[answerList[i]].nextElementSibling.classList.add("answer");
    questions[answerList[i]].nextElementSibling.classList.remove("wrong");
  }

  scoreTxt.textContent = `SCORE - ${score}/${questionLen}`;
});
