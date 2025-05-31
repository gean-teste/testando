// train.js
const fs = require('fs');
const path = require('path');

const conversationsPath = path.join(__dirname, 'conversations.json');
const faqPath = path.join(__dirname, 'faq.json');

if (!fs.existsSync(conversationsPath)) {
  console.log("Nenhuma conversa registrada.");
  process.exit(0);
}

const conversations = JSON.parse(fs.readFileSync(conversationsPath, 'utf-8'));
let faq = [];

if (fs.existsSync(faqPath)) {
  faq = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
}

const newFaq = [];

conversations.forEach(conv => {
  const exists = faq.find(item =>
    item.keywords.some(kw => conv.user.toLowerCase().includes(kw.toLowerCase()))
  );

  if (!exists) {
    newFaq.push({
      keywords: [conv.user.toLowerCase()],
      response: 'Defina uma resposta aqui.'
    });
  }
});

if (newFaq.length > 0) {
  faq = faq.concat(newFaq);
  fs.writeFileSync(faqPath, JSON.stringify(faq, null, 2));
  console.log('Novo FAQ salvo em faq.json');
} else {
  console.log('Nenhuma nova pergunta para treinar.');
}
