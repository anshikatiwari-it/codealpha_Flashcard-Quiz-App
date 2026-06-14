const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.js');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// Helper to read data
const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET all cards
app.get('/api/cards', (req, res) => {
    res.json(readData());
});

// POST new card
app.post('/api/cards', (req, res) => {
    const cards = readData();
    const newCard = { id: Date.now(), ...req.body };
    cards.push(newCard);
    writeData(cards);
    res.status(201).json(newCard);
});

// PUT (update) card
app.put('/api/cards/:id', (req, res) => {
    let cards = readData();
    const id = parseInt(req.params.id);
    cards = cards.map(c => c.id === id ? { ...c, ...req.body } : c);
    writeData(cards);
    res.json({ message: "Updated successfully" });
});

// DELETE card
app.delete('/api/cards/:id', (req, res) => {
    let cards = readData();
    const id = parseInt(req.params.id);
    cards = cards.filter(c => c.id !== id);
    writeData(cards);
    res.json({ message: "Deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});