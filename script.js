
const API_URL = 'http://localhost:3000/api/cards';
let cards = [];
let currentIndex = 0;
let editId = null;

// UI Elements
const cardInner = document.getElementById('card-inner');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const cardIndicator = document.getElementById('cardIndicator');
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const saveBtn = document.getElementById('saveBtn');

// Load cards from Backend
async function fetchCards() {
    const res = await fetch(API_URL);
    cards = await res.json();
    updateUI();
}

function updateUI() {
    renderCard();
    renderList();
}

function renderCard() {
    cardInner.classList.remove('is-flipped');
    if (cards.length === 0) {
        questionText.innerText = "No cards found.";
        answerText.innerText = "Add some below.";
        cardIndicator.innerText = "0 / 0";
        return;
    }
    const current = cards[currentIndex];
    questionText.innerText = current.question;
    answerText.innerText = current.answer;
    cardIndicator.innerText = `${currentIndex + 1} / ${cards.length}`;
}

function renderList() {
    const cardList = document.getElementById('cardList');
    cardList.innerHTML = '<h3>Your Deck</h3>';
    cards.forEach((card) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${card.question.substring(0, 20)}...</span>
            <div>
                <button class="btn-edit" onclick="startEdit(${card.id}, '${card.question}', '${card.answer}')">Edit</button>
                <button class="btn-del" onclick="deleteCard(${card.id})">Delete</button>
            </div>
        `;
        cardList.appendChild(div);
    });
}

// Actions
async function saveCard() {
    const q = questionInput.value.trim();
    const a = answerInput.value.trim();
    if (!q || !a) return alert("Fill fields!");

    if (editId) {
        await fetch(`${API_URL}/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, answer: a })
        });
        editId = null;
        saveBtn.innerText = "Add Flashcard";
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, answer: a })
        });
    }
    
    questionInput.value = '';
    answerInput.value = '';
    fetchCards();
}

async function deleteCard(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (currentIndex > 0) currentIndex--;
    fetchCards();
}

function startEdit(id, q, a) {
    editId = id;
    questionInput.value = q;
    answerInput.value = a;
    saveBtn.innerText = "Update Card";
}

// Navigation
function nextCard() { if (currentIndex < cards.length - 1) { currentIndex++; renderCard(); } }
function prevCard() { if (currentIndex > 0) { currentIndex--; renderCard(); } }

document.getElementById('nextBtn').addEventListener('click', nextCard);
document.getElementById('prevBtn').addEventListener('click', prevCard);
document.getElementById('flipBtn').addEventListener('click', () => cardInner.classList.toggle('is-flipped'));
saveBtn.addEventListener('click', saveCard);

// Start
fetchCards();