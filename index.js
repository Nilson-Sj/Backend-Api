const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

(async () => {

const connectionString = 'mongodb://localhost:27017/';

console.info('Conectando ao banco de dados MongoDB...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

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

const db = client.db('Herois_API');

const herois = db.collection('Herois');

const getHeroisValidas = () => herois.find({}).toArray();

const getHeroiById = id => getHeroisValidas().find(hero => hero.id === id);

// - [GET] /herois - Retorna a lista de heróis
app.get('/herois', async (req, res) => {
  res.send(await getHeroisValidas());
});

// - [GET] /herois/{id} - Retorna apenas um herói pelo ID
app.get('/herois/:id', (req, res) => {
  const id = req.params.id;
  
  const heroi = getHeroiById(id);

  if (!heroi) {
    res.send('Herói não encontrado!.');
    return;
  };
  
  res.send(heroi);
});

// - [POST] /herois - Cria um novo herói
app.post('/herois', (req, res) => {
  const heroi = req.body;

  if (!heroi || !heroi.nome) {
    res.send('Herói Inválido!');
    return;
  };

  heroi.id = herois.length + 1;
  herois.push(heroi);

  res.send(heroi);

});

// - [PUT] /herois/{id} - Atualiza um herói pelo ID
app.put('/herois/:id', (req, res) => {
  const id = +req.params.id;
  
  const heroi = getHeroiById(id);
    
  const novoNome = req.body.nome;

    if (!novoNome) {
      res.send('Herói Inválido!.');
      
      return;
    };
    
  heroi.nome = novoNome;

  res.send(heroi);
});

// - [DELETE] /herois/{id} - Remover o herói pelo ID
app.delete('/herois/:id', (req, res) => {
  const id = +req.params.id;
  
  const heroi = getHeroiById(id);

  if (!heroi) {
    res.send('Herói não encontrado!.');
    
    return;
  }

  const index = herois.indexOf(heroi);
  
  delete herois[index];

  res.send('Herói removido com sucesso!.');

});

app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}`);
});

})();