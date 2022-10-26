const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

/* Lista de Endpoints da Aplicação CRUD de Heróis:

- [GET] /herois - Retorna a lista de heróis
- [GET] /herois/{id} - Retorna apenas um herói pelo ID
- [POST] /herois - Cria um novo herói
- [PUT] /herois/{id} - Atualiza um herói pelo ID
- [DELETE] /herois/{id} - Remover o herói pelo ID

*/

const herois = [
  "Superman",
  "Batman",
  "Mulher Maravilha",
  "Flash",
  "Homem Aranha",
  "Arqueiro Verde"
];
// - [GET] /herois - Retorna a lista de heróis
app.get('/herois', (req, res) => {
    res.send(herois.filter(Boolean));
});

// - [GET] /herois/{id} - Retorna apenas um herói pelo ID
app.get('/herois/:id', (req, res) => {
  const id = req.params.id - 1;
  
  const heroi = herois[id];
  
  res.send(heroi);
});

// - [POST] /herois - Cria um novo herói
app.post('/herois', (req, res) => {
    const heroi = req.body.heroi;

    herois.push(heroi);

    res.send(`Novo Herói adicionado com sucesso!.'${heroi}'.`);

});

// - [PUT] /herois/{id} - Atualiza um herói pelo ID
app.put('/herois/:id', (req, res) => {
    const id = req.params.id - 1;

    const heroi = req.body.heroi;

    herois[id] = heroi;

    res.send(`Herói atualizado com sucesso:'${heroi}'.`);
});

// - [DELETE] /herois/{id} - Remover o herói pelo ID
app.delete('/herois/:id', (req, res) => {
    const id = req.params.id - 1;

    delete herois[id];

    res.send('Herói removido com sucesso!.');

});

app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}`);
});