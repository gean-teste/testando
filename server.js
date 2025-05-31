// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const mockResults = [
  {
    title: 'Inteligência Artificial - Wikipédia',
    link: 'https://pt.wikipedia.org/wiki/Intelig%C3%AAncia_artificial', 
    snippet: 'Inteligência artificial refere-se à capacidade de máquinas executar funções normalmente associadas à inteligência humana.',
  },
  {
    title: 'O que é IA? - Microsoft Azure',
    link: 'https://azure.microsoft.com/pt-br/resources/cloud-computing-dictionary/what-is-ai/', 
    snippet: 'Entenda os fundamentos da inteligência artificial e como ela está transformando indústrias.',
  },
  {
    title: 'IA Generativa - OpenAI',
    link: 'https://openai.com/', 
    snippet: 'OpenAI desenvolve modelos avançados de IA generativa como o GPT-4.',
  },
  {
    title: 'Quem é o seu - Deus?',
    link: '', 
    snippet: 'Gean carlos me desenvolveu, o que deseja Humano?',
  },
];

app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Simulando resultados com base na consulta
  const results = mockResults.filter(
    result => result.title.toLowerCase().includes(query.toLowerCase()) ||
             result.snippet.toLowerCase().includes(query.toLowerCase())
  );

  setTimeout(() => {
    res.json(results);
  }, 800); // Simula latência
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});