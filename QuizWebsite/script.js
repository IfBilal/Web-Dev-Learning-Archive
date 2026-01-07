let count = 0;
let correct = 0;
let selectedAnswer = "";
const questions = [
  {
    type: "mcq",
    question: "What is the capital city of France?",
    options: ["Rome", "Berlin", "Paris", "Madrid"],
    answer: "Paris",
  },
  {
    type: "input",
    question: "Who is known as the founder of Microsoft?",
    answer: "Bill Gates",
  },
  {
    type: "mcq",
    question: "What is 5 x 6?",
    options: ["11", "30", "56", "60"],
    answer: "30",
  },
  {
    type: "input",
    question: "What is the chemical symbol for water?",
    answer: "H2O",
  },
  {
    type: "mcq",
    question:
      "Which programming language is primarily used for web development?",
    options: ["Python", "C++", "JavaScript", "Java"],
    answer: "JavaScript",
  },
  {
    type: "input",
    question: "What is the square root of 64?",
    answer: "8",
  },
  {
    type: "mcq",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    type: "input",
    question: "In which year did World War II end?",
    answer: "1945",
  },
  {
    type: "mcq",
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Rhino"],
    answer: "Blue Whale",
  },
  {
    type: "input",
    question: "What is the result of 12 + 15?",
    answer: "27",
  },
];
let timeLeft = 10;
let time = null;
function startTimer() {
  if (time != null) {
    clearInterval(time);
    time = null;
  }
  time = setInterval(() => {
    timeLeft--;
    console.log(correct);
    let timer = document.querySelector(".timer");
    if (timeLeft <= 0) {
      alert("Time ended");
      clearInterval(time);
      time = null;
      if (count < questions.length - 1) {
        count++;
        loadQuestion(count);
      } else {
        printResult(correct);
      }
    }
    timer.innerText = `Time Left: ${timeLeft}`;
  }, 1000);
}

function loadQuestion(count) {
  timeLeft = 10;
  startTimer();
  selectedAnswer = "";
  let questionNo = document.querySelector(".question-no");
  questionNo.innerText = `Question No: ${count + 1}`;
  let question = document.querySelector("#question");
  question.innerText = questions[count]["question"];
  let answer = document.querySelector("#answer");
  if (questions[count].type == "input") {
    answer.innerHTML = `<input type="text" class="answerInput" placeholder="answer">`;

    let input = document.querySelector("input");
    input.addEventListener("input", (event) => {
      selectedAnswer = input.value;
    });
  } else {
    let answerHTML = "";
    for (let i = 0; i < 4; i++) {
      answerHTML += `<button class="answerButton" type="button">${questions[count]["options"][i]}</button>`;
    }
    answer.innerHTML = answerHTML;

    buttons = document.querySelectorAll(".answerButton");
    for (let btn of buttons) {
      btn.addEventListener("click", () => {
        selectedAnswer = btn.innerText;
        for (let temp of buttons) {
          temp.classList.remove("answerSelected");
        }
        btn.classList.add("answerSelected");
      });
    }
  }
}

function printResult(correct) {
  let result = document.querySelector(".question-no");
  result.innerText = `You Got ${correct} answers correct out of 10`;
  result.style.fontSize = "30px";
  result.style.fontWeight = "700";
  if (correct < 5) {
    result.style.color = "Red";
  } else {
    result.style.color = "green";
  }
  let form = document.querySelector("form");
  let submitButton = document.querySelector(".submit");
  let answerBox = document.querySelector("#answer");
  let quizQuestion = document.querySelector("#question");
  let answerType = document.querySelector("#answer-type");
  let wrapper = document.querySelector("#quiz-wrapper");
  let timer = document.querySelector(".timer");

  wrapper.removeChild(timer);
  form.removeChild(submitButton);
  form.removeChild(answerBox);
  document.querySelector("#quiz-box").removeChild(quizQuestion);
  document.querySelector("#quiz-box").removeChild(answerType);
}

loadQuestion(count);

submission = document.querySelector("form");
submission.addEventListener("submit", (e) => {
  e.preventDefault();
  let answerType = document.querySelector("#answer-type");
  if (selectedAnswer == "") {
    answerType.innerText = "Give an Answer first";
    answerType.style.color = "red";
  } else if (selectedAnswer == questions[count]["answer"]) {
    answerType.innerText = "Correct";
    correct += 1;
    answerType.style.color = "green";
    if (count < questions.length - 1) {
      count += 1;
      loadQuestion(count);
    } else {
      if (time != null) {
        clearInterval(time);
      }
      printResult(correct);
    }
  } else {
    answerType.innerText = "Incorrect";
    answerType.style.color = "red";
    if (count < questions.length - 1) {
      count += 1;
      loadQuestion(count);
    } else {
      if (time != null) {
        clearInterval(time);
      }
      printResult(correct);
    }
  }
});
