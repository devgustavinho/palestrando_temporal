const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const random = Math.random();
  if (random < 0.1) {
    const randomValue = Math.floor(Math.random() * (235874 - 52365 + 1)) + 300;
    res.json({ value: randomValue });
  } else {
    console.log("Não foi dessa vez hein");
    res.status(500).json({ error: 'timor-lest-error', cause: 'oops' });
  }
});

app.listen(port, () => {
    console.log(`[XX-BANK] Servidor rodando em http://localhost:${port}`);
});
