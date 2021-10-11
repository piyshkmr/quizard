// variable to store questions and answer
let questions = [];
// questions number variable
let questionnumber = 0;

let correctanswers = 0;
let incorrectanswers = 0;


// function to swith to next question
function nextquestion() {
  setTimeout(() => {
    // increment question Number
    if (questionnumber == questions.length-1) {
      endgame();
    } else {
      questionnumber++;
      showquestion();
    }
  }, 1000);
}

// main game lopp
const quiz = async (no, level, catagory) => {
  // fetching questions to applicationCache
  const rslt = await fetch(
    `https://opentdb.com/api.php?amount=${no}&category=${catagory}&difficulty=${level}&type=multiple`
  );
  const data = await rslt.json();

  // store question array in results
  const results = data.results;

  // appending all questions in questions array
  results.map((e, index) => {
    questions.push({
      question: e.question,
      answer: [
        { text: e.correct_answer, correct: true },
        { text: e.incorrect_answers[0], correct: false },
        { text: e.incorrect_answers[1], correct: false },
        { text: e.incorrect_answers[2], correct: false },
      ],
    });
  });

  // after appending questions show the question to display
  showquestion();
};

// function to show questions
function showquestion() {
  // getting the question and answer div
  const question = document.querySelector(".question");
  const answersdiv = document.querySelector(".answers");
  // setting question to question div
  question.innerHTML = questions[questionnumber].question;

  // shuffling the answers array to change answer btn position
  const array = shuffleArray(questions[questionnumber].answer);

  // empty the answer div to append new button
  answersdiv.innerHTML = "";

  // loop for append button to the asnwer div
  for (let i = 0; i < 4; i++) {
    // craeting button Element or adding click event
    const button = document.createElement("button");
    // seeting class to button
    button.setAttribute("class", "btn btn-grad");
    // checking button is the correct answer btn or not
    if (array[i].correct) {
      button.addEventListener("click", clickbutton);
      // setting correct id to correct button
      button.setAttribute("id", "correct");
      button.innerHTML = array[i].text;
    } else {
      button.innerHTML = array[i].text;
      button.addEventListener("click", clickbutton);
      button.dataset = "incorrect";
    }
    answersdiv.appendChild(button);
  }
}

function clickbutton(e) {
  // geeting all the buttons
  const buttons = document.querySelectorAll(".btn");

  // checking if clciked button id is correct or not
  if (e.target.getAttribute("id") == "correct") {
    // incrementing correctanswers
    correctanswers++;
    // adding correct button class
    const audio = new Audio('audio/correct.mp3');
    audio.volume = 0.5
    audio.play()
    e.target.style.animation = "rightkey .5s infinite alternate"
    e.target.classList.add("cbtn");
  } else {
    // incrementing incorrectanswers
    incorrectanswers++;
    // adding incorrect button class
    const audio = new Audio('audio/wrong.mp3');
    audio.volume = 0.5
    audio.play()
    e.target.style.animation = "wrongkey .5s infinite alternate"
    e.target.classList.add("icbtn");
    // loop for finding button which id is correct
    buttons.forEach((e) => {
      if (e.getAttribute("id") == "correct") {
        // to show the user to correct answers
        e.classList.add("cbtn");
      }
    });
  }
  // after ones user cliked the button removing cliked event
  // so user not clicked again on any button
  buttons.forEach((e) => {
    e.removeEventListener("click", clickbutton);
  });

  // next function to change the question to next one
  nextquestion();
}

// function to shuffle the answer array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

// eng game function to show results to user
function endgame() {
  // setting display none to question or answer div or block to endscreendiv
  document.querySelector(".question").style.display = "none";
  document.querySelector(".answers").style.display = "none";
  document.querySelector("#endscreen").style.display = "block";

  // setting correct or incorrect to div
  document.getElementById(
    "correctanswer"
  ).innerText = `Correct: ${correctanswers}`;
  document.getElementById(
    "incorrectanswer"
  ).innerText = `Incorrect: ${incorrectanswers}`;

  const score = document.getElementById("score");
  // calculate userscore
  playerscore = Math.floor(correctanswers / 2);

  // appending stars on user score
  for (let i = 0; i < playerscore; i++) {
    const star = document.createElement("i");
    star.setAttribute("class", "fa fa-star");
    score.appendChild(star);
  }
}

function playagain() {
  window.location.reload();
}

function startgame() {
  document.querySelector("#startscreen").style.display = 'none';
  document.querySelector(".question").style.display = 'block';
  document.querySelector(".answers").style.display = 'flex';

  const noofquestions = document.getElementById("no-of-question").value;
  const level = document.getElementById("level").value;
  const category = document.getElementById("category").value;
  quiz(noofquestions, level, category);
}

