// Configuration
const API_BASE_URL = 'https://backend-2xm9.onrender.com'; // Backend API URL

document.addEventListener('DOMContentLoaded', () => {
  const noQuestionsDiv = document.getElementById('noQuestions');
  const quizContent = document.getElementById('quizContent');
  const questionContainer = document.getElementById('questionContainer');
  const questionNumber = document.getElementById('questionNumber');
  const questionText = document.getElementById('questionText');
  const options = document.querySelectorAll('.option');
  const actionBtn = document.getElementById('actionBtn');
  const feedbackMessage = document.getElementById('feedbackMessage');
  const resultDiv = document.getElementById('result');
  const scoreSpan = document.getElementById('score');
  const restartBtn = document.getElementById('restartBtn');

  if (!actionBtn || !restartBtn || options.length !== 4) {
    console.error('Quiz page is missing required elements.');
    return;
  }

  // State
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOption = null;
  let answerSubmitted = false;

  // Event listeners
  actionBtn.addEventListener('click', handleAction);
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
      if (!Array.isArray(questions) || questions.length === 0) {
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
    answerSubmitted = false;
    resultDiv.classList.add('hidden');
    quizContent.classList.remove('hidden');
    noQuestionsDiv.classList.add('hidden');
    feedbackMessage.classList.add('hidden');
    actionBtn.textContent = 'Submit Answer ✅';
    actionBtn.disabled = true;
  }

  function showQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question) {
      questionText.textContent = 'Question data is missing.';
      options.forEach((opt, idx) => {
        opt.textContent = `${idx + 1}️⃣ Option missing`;
      });
      actionBtn.disabled = true;
      return;
    }

    const correctAnswer = Number(question.correct);
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionText.textContent = question.question || 'No question text available.';
    options[0].textContent = `1️⃣ ${question.option1 || 'Option 1 missing'}`;
    options[1].textContent = `2️⃣ ${question.option2 || 'Option 2 missing'}`;
    options[2].textContent = `3️⃣ ${question.option3 || 'Option 3 missing'}`;
    options[3].textContent = `4️⃣ ${question.option4 || 'Option 4 missing'}`;
    question.correct = Number.isNaN(correctAnswer) ? null : correctAnswer;

    options.forEach(opt => opt.classList.remove('selected'));
    selectedOption = null;
    answerSubmitted = false;
    feedbackMessage.classList.add('hidden');
    actionBtn.textContent = 'Submit Answer ✅';
    actionBtn.disabled = true;
  }

  function selectOption(option) {
    if (answerSubmitted) {
      return;
    }

    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    selectedOption = parseInt(option.dataset.option);
    actionBtn.disabled = false;
  }

  function handleAction() {
    if (!answerSubmitted) {
      submitAnswer();
    } else {
      goToNextStep();
    }
  }

  function submitAnswer() {
    if (selectedOption === null) {
      return;
    }

    const question = questions[currentQuestionIndex];
    const correctAnswer = Number(question.correct);
    if (selectedOption === correctAnswer) {
      score++;
      showFeedback('Correct! Great job! 🎉', true);
    } else {
      const answerText = Number.isInteger(correctAnswer) ? ` ${correctAnswer}` : '';
      showFeedback(`Wrong answer.${answerText ? ` The correct option was${answerText}.` : ''}`, false);
    }

    answerSubmitted = true;
    actionBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz 🏁' : 'Next Question ➡️';
  }

  function showFeedback(text, success) {
    feedbackMessage.textContent = text;
    feedbackMessage.className = success ? 'success' : 'error';
    feedbackMessage.classList.remove('hidden');
  }

  function goToNextStep() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    quizContent.classList.add('hidden');
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
});