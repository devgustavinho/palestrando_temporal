const express = require('express');
const app = express();
const port = 3000;
const users = [
  {
    id: 1,
    name: "gustavo",
  },
  {
    id: 2,
    name: "carneiro"
  }
];

app.get('/user', (req, res) => {
  const random = Math.random();
  const user = users.find((user) => user.name.toLowerCase() === req.query?.name?.toLocaleLowerCase());
  if(!user) {
    res.status(404).json({ error: 'not_found', cause: 'no_ecxistes' });
    return;
  }
  if (random < 0.2) {
    res.json(user);
  } else {
    res.status(500).json({ error: 'try_again', cause: 'oops' });
  }
});

app.listen(port, () => {
    console.log(`[01_CONHECENDO] Servidor rodando em http://localhost:${port}`);
});
