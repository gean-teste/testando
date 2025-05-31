// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const conversationsPath = path.join(__dirname, 'conversations.json');
const faqPath = path.join(__dirname, 'faq.json');

// Função para normalizar texto
function normalize(text) {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Carrega o FAQ (ou cria vazio)
let faq = [];
if (fs.existsSync(faqPath)) {
  faq = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
} else {
  faq = [
    {
      keywords: ['oi', 'ola', 'hello'],
      response: 'Olá! Eu sou seu assistente virtual. Como posso te ajudar hoje?'
    },
    {
      keywords: ['deus', 'criador', 'humano', 'gean'],
      response: 'Gean Carlos me desenvolveu. O que deseja, Humano? 😊'
    },
    {
      keywords: ['ajuda', 'ajudar', 'socorro', 'help'],
      response: 'Estou aqui para ajudar! Pergunte qualquer coisa!'
    },
    {
      keywords: ['nome', 'quem é voce', 'seu nome'],
      response: 'Sou um assistente virtual criado por Gean Carlos.'
    },
    {
      keywords: ['tchau', 'adeus', 'sair'],
      response: 'Até logo! Volte sempre que precisar!'
    },
    {
      keywords: ['toledo', 'fibra', 'onu'],
      response: 'Você está falando com o Gean, suporte da Toledo Fibra.'
    }
  ];
  fs.writeFileSync(faqPath, JSON.stringify(faq, null, 2));
}

// Função para registrar a conversa
function logConversation(userInput, botResponse) {
  let conversations = [];

  if (fs.existsSync(conversationsPath)) {
    conversations = JSON.parse(fs.readFileSync(conversationsPath, 'utf-8'));
  }

  conversations.push({
    timestamp: new Date().toISOString(),
    user: userInput,
    bot: botResponse
  });

  fs.writeFileSync(conversationsPath, JSON.stringify(conversations, null, 2));
}

app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const normalizedQuery = normalize(query);

  const result = faq.find(item =>
    item.keywords.some(kw => normalizedQuery.includes(normalize(kw)))
  );

  if (result) {
    logConversation(query, result.response);
    res.json([result]);
  } else {
    logConversation(query, 'Não entendi.');
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
