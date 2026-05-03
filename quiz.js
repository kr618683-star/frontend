// Configuration
const API_BASE_URL = 'https://backend-2xm9.onrender.com'; // Backend API URL

// DOM elements
const noQuestionsDiv = document.getElementById('noQuestions');
const quizContent = document.getElementById('quizContent');
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const options = document.querySelectorAll('.option');
const nextBtn = document.getElementById('nextBtn');
const resultDiv = document.getElementById('result');
const scoreSpan = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// State
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Event listeners
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Option selection
options.forEach(option => {
  option.addEventListener('click', () => selectOption(option));
});

// Functions
async function startQuiz() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    questions = await response.json();
    if (questions.length === 0) {
      showNoQuestions();
      return;
    }
    resetQuizState();
    showQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
    alert('Oops! Failed to load questions. Please try again.');
  }
}

function showNoQuestions() {
  noQuestionsDiv.classList.remove('hidden');
  quizContent.classList.add('hidden');
}

function resetQuizState() {
  currentQuestionIndex = 0;
  score = 0;
  selectedOption = null;
  resultDiv.classList.add('hidden');
  questionContainer.classList.remove('hidden');
  noQuestionsDiv.classList.add('hidden');
  quizContent.classList.remove('hidden');
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.question;
  options[0].textContent = `1️⃣ ${question.option1}`;
  options[1].textContent = `2️⃣ ${question.option2}`;
  options[2].textContent = `3️⃣ ${question.option3}`;
  options[3].textContent = `4️⃣ ${question.option4}`;

  // Reset selection
  options.forEach(option => option.classList.remove('selected'));
  selectedOption = null;
  nextBtn.disabled = true;
}

function selectOption(option) {
  options.forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  selectedOption = parseInt(option.dataset.option);
  nextBtn.disabled = false;
}

function nextQuestion() {
  const question = questions[currentQuestionIndex];
  if (selectedOption === question.correct) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionContainer.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  scoreSpan.textContent = `${score} / ${questions.length}`;
  if (score === questions.length) {
    scoreSpan.textContent += ' 🎉 Perfect!';
  } else if (score >= questions.length / 2) {
    scoreSpan.textContent += ' 👍 Great job!';
  } else {
    scoreSpan.textContent += ' 💪 Keep trying!';
  }
}

function restartQuiz() {
  startQuiz();
}

// Start the quiz when the page loads
startQuiz();