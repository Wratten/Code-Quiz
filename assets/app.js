// Quiz Elements
const timerElement = document.querySelector("#time");
const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector("#start");
const questionScreen = document.querySelector(".question-screen");
const question = document.querySelector("#question");
const answers = document.querySelector(".answers");
const answerButtons = document.querySelector("answers.buttons");
const answerFeedback = document.querySelector("#feedback");

let questionIndex = 0; // What question are we on
let timeLeft = 60; // How much time is left
let timerInterval; // Timer
let flashTimeout; // Flash correct / incorrect messages

// Final Screen Elements
const endScreen = document.querySelector(".end-screen");
const quizScore = document.querySelector("#quiz-score");
const initialsInput = document.querySelector("#initials");
const saveButton = document.querySelector("#savebtn");
const scoreForm = document.querySelector("#score-form");

// Leaderboard Elements
const leaderboardScreen = document.querySelector(".leaderboard");
const scoreList = document.querySelector("#score-list");
const returnButton = document.querySelector("#return");
const clearScoreButton = document.querySelector("#clear");
const leaderboardLink = document.querySelector("#leaderboard");

// Questions and their respective answers
const questionBank = [
  {
    question: "What is JavaScript?",
    possibleAnswers: [
      "A language used to create and layout the structure of a webpage",
      "A programming language used to create and control dynamic website content",
      "A language used to beautify and control the way a website looks.",
      "When an actor goes through a script while drinking coffee",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a boolean?",
    possibleAnswers: [
      "A data type with a value of true or false",
      "The name for a piece of code used to reference a HTML Id or Class",
      "Shorthand for an if, else statement",
      "The correct name of the { symbol",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "What is the type of loop that continues through a block of code as long as the specified condition remainds true",
    possibleAnswers: [
      "While loop",
      "Else loop",
      "Conditional loop",
      "For loop",
    ],
    correctAnswer: 3,
  },
  {
    question:
      "Where is an external JavaScript file linked inside a HTML document",
    possibleAnswers: [
      "Inside the <footer> section",
      "Just before the <body> section",
      "Just before the </html> closing tag",
      "Inside the <head> section",
    ],
    correctAnswer: 2,
  },
  {
    question: "How do you create a function in JavaScript?",
    possibleAnswers: [
      "function myFunction()",
      "function = myFunction()",
      "function:myFunction()",
      "function {myFunction()}",
    ],
    correctAnswer: 1,
  },
  {
    question: "How would you call a function in JavaScript?",
    possibleAnswers: [
      "call function myFunction()",
      "call = myFunction()",
      "myFunction()",
      "function myFunction()",
    ],
    correctAnswer: 2,
  },
];

// DISPLAY FUNCTIONS

// Function to show elements
function show(element) {
  element.setAttribute("style", "display: block;");
}

// Function to hide elements
function hide(element) {
  element.setAttribute("style", "display: none;");
}

// Display question on page
function displayQuestion() {
  // Gets question from question bank
  const currentQuestion = questionBank[questionIndex];
  // Displays question in heading
  question.textContent = currentQuestion.question;

  // Fill the answer buttons with the answers to the questions
  const possibleAnswers = currentQuestion.possibleAnswers;
  for (let i = 0; i < possibleAnswers.length; i++) {
    answers.children[i].textContent = possibleAnswers[i];
  }
}

// QUIZ FUNCTIONS

// Starts the quiz, hides other screens and shows question screens, and runs the timer
function startQuiz() {
  // Get rid of the home screen
  hide(startScreen);
  // show the question screen
  show(questionScreen);
  // display the first question from question bank
  displayQuestion();
  // start the timer
  startTimer();
}

// Ends the quiz
function endQuiz() {
  // Stops the timer
  clearInterval(timerInterval);
  // Set timer to 0
  timerElement.textContent = 0;
  // if timer is more than zero, set to 0
  if (timeLeft < 0) {
    timeLeft = 0;
  }
  // Displays score as how much time was left
  quizScore.textContent = timeLeft;
  // Hides the question screen
  hide(questionScreen);
  // Hides Leaderboard Screen
  hide(leaderboardScreen);
  // Shows the end screen
  show(endScreen);
}

// Create function that starts the timer
function startTimer() {
  // Sets the counting part of the timer
  timerInterval = setInterval(function () {
    // Time ticks down 1 per second
    timeLeft--;
    // Displays time remaining
    timerElement.textContent = timeLeft;
    // Once the timer runs out
    if (timeLeft === 0) {
      // Clear the timer
      clearInterval(timerInterval);
      // End the Quiz
      endQuiz();
    }
  }, 1000);
}

// Runs the startquiz function when user clicks the Begin Quiz button
startBtn.addEventListener("click", startQuiz);

// Displays the next question
function nextQuestion() {
  // If there are more questions left to display
  if (questionIndex < questionBank.length - 1) {
    // Increment the question index
    questionIndex++;
    // Display the next question
    displayQuestion();
    // Otherwise
  } else {
    // Display the end screen
    endQuiz();
  }
}

// Check if user gets answer correct or incorrect
function checkAnswer(answer) {
  // If answer is correct
  if (questionBank[questionIndex].correctAnswer == answer) {
    // Make sure feedback doesn't show before answer is clicked
    clearTimeout(flashTimeout);
    // Set class attribute of div containing answer feedback to correct
    answerFeedback.setAttribute("class", "correct");
    // Change text to Correct!
    answerFeedback.textContent = "Correct!";
    // Show the feedback
    show(answerFeedback);
    // Set a timer for one second
    flashTimeout = setTimeout(function () {
      // Hide the feedback after timer is up
      hide(answerFeedback);
    }, 1000);

    // If answer is incorrect
  } else {
    // Make sure feedback doesn't show before answer is clicked
    clearTimeout(flashTimeout);
    // Set class attribute of div containing answer feedback to incorrect
    answerFeedback.setAttribute("class", "incorrect");
    // Change text to Incorrect!
    answerFeedback.textContent = "Incorrect!";
    // Show the feedback
    show(answerFeedback);
    // Set a timer for one second
    flashTimeout = setTimeout(function () {
      // Hide the feedback after timer is up
      hide(answerFeedback);
    }, 1000);
    // Take 10 seconds off clock
    timeLeft -= 10;
  }
  // Run the function to display the next question
  nextQuestion();
}

// Checks to see if user is clicking on an answer button, then runs the check answer function if they are
answers.addEventListener("click", function (event) {
  // Declare element as the element that triggers the event
  const element = event.target;
  // If user clicks on a button
  if (element.matches("button")) {
    // Then check the answer
    checkAnswer(element.value);
  }
});

// LEADERBOARD AND SCORE FUNCTIONS

// Make the array that holds the scores
let scores = [];

// Create a function that sorts scores
function compareScores(a, b) {
  return b.score - a.score;
}

// Creates a function that displays scores
function displayScores() {
  // Hides all screens that arent Leaderboard screen
  hide(questionScreen);
  hide(endScreen);
  hide(startScreen);

  // Set the score list to empty
  scoreList.innerHTML = "";

  // Sort the scores into descending order
  scores.sort(compareScores);

  // Loop through until scores are all displayed, incrementing one per time
  for (let i = 0; i < scores.length; i++) {
    // Create a list element
    const li = document.createElement("li");
    // Fill list element with score submission initials and score
    li.textContent = scores[i].initials + " - " + scores[i].score;
    // Add list element to the html
    scoreList.appendChild(li);
  }
  // Show the leaderboard screen
  show(leaderboardScreen);
}

// Create a function that stores scores to local storage
function storeScore() {
  // Put the contents of the scores array into local storage and turn the number into a string
  localStorage.setItem("scores", JSON.stringify(scores));
}

// Creates a function that loads scores from local storage
function loadScores() {
  // Declare storedScores as the stored local storage scores
  const storedScores = JSON.parse(localStorage.getItem("scores"));
  // If there are stored scores
  if (storedScores) {
    // Then update the scores from local storage
    scores = storedScores;
  }
}

// Load the scores in the background
loadScores();

// Event listener for clearing leaderboard listings.
// When user clicks the clear score button
clearScoreButton.addEventListener("click", function () {
  // Clear the local storage
  localStorage.clear();
  // Set scores array to empty
  scores = [];
  // Load the scores
  displayScores();
});

// Event listener for submitting Hall of Fame listing - initials and score
// When user clicks the save score button
saveButton.addEventListener("click", function (event) {
  // Stop event bubbling
  event.preventDefault();
  // Create initials variable from the letters user types in input form
  const initials = initialsInput.value.trim();
  // If input form is empty
  if (!initials) {
    // Then return
    return;
  } // Otherwise
  // Create object with initials and score
  const initialsScore = { initials: initials, score: timeLeft };
  // Add content of scores array to initialsScore
  scores.push(initialsScore);
  // Clear initials text input
  initialsInput.value = "";
  // Update local storage with scores array
  storeScore();
  // Display leaderboard with scores listing
  displayScores();
});

// NAVIGATION BUTTONS

// Upon clicking leaderboard button,
leaderboardLink.addEventListener("click", function () {
  // Hide the question screen
  hide(questionScreen);

  // Hide the start screen
  hide(startScreen);

  // Show the leaderboard screen
  show(leaderboardScreen);

  // Stop the timer
  clearInterval(timerInterval);

  displayScores();
});

// Upon clicking the return button,
returnButton.addEventListener("click", function () {
  // Stop the timer
  clearInterval(timerInterval);

  // Reset the questions
  questionIndex = 0;

  // Set the time display back to 60
  timeLeft = 60;
  timerElement.textContent = timeLeft;

  // Hide leaderbord, show start screen
  hide(leaderboardScreen);
  show(startScreen);
});
