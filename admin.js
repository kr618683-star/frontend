// Configuration
const API_BASE_URL = 'https://backend-2xm9.onrender.com'; // Backend API URL

// DOM elements
const questionForm = document.getElementById('questionForm');
const messageDiv = document.getElementById('message');

// Event listeners
questionForm.addEventListener('submit', addQuestion);

// Functions
async function addQuestion(e) {
  e.preventDefault();
  const question = document.getElementById('question').value;
  const option1 = document.getElementById('option1').value;
  const option2 = document.getElementById('option2').value;
  const option3 = document.getElementById('option3').value;
  const option4 = document.getElementById('option4').value;
  const correct = parseInt(document.getElementById('correct').value);

  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        option1,
        option2,
        option3,
        option4,
        correct
      }),
    });

    if (response.ok) {
      messageDiv.textContent = 'Question added successfully! 🎉';
      messageDiv.className = 'success';
      questionForm.reset();
    } else {
      throw new Error('Failed to add question');
    }
  } catch (error) {
    console.error('Error adding question:', error);
    messageDiv.textContent = 'Oops! Failed to add question. Please try again.';
    messageDiv.className = 'error';
  }
}