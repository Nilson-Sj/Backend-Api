const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

(async () => {

//const connectionString = 'mongodb://localhost:27017/'; RK1qEgg0VzdpGupX

const connectionString = 'mongodb+srv://admin:RK1qEgg0VzdpGupX@cluster0.0seejtp.mongodb.net/api-herois-marvel?retryWrites=true&w=majority';

console.info('Conectando ao banco de dados MongoDB...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

const app = express();

const port = process.env.PORT || 3000;

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

const getHeroiById = async id => herois.findOne({ _id: ObjectId(id) });

// - [GET] /herois - Retorna a lista de heróis
app.get('/herois', async (req, res) => {
  res.send(await getHeroisValidas());
});

// - [GET] /herois/{id} - Retorna apenas um herói pelo ID
app.get('/herois/:id', async (req, res) => {
  const id = req.params.id;
  
  const heroi = await getHeroiById(id);

  if (!heroi) {
    res.send('Herói não encontrado!.');
    return;
  };
  
  res.send(heroi);
});

// - [POST] /herois - Cria um novo herói
app.post('/herois', async (req, res) => {
  const heroi = req.body;

  if (!heroi 
    || !heroi.nome
    || !heroi.poder) {
    res.send('Herói Inválido!');
    return;
  }

const {acknowledged} = await herois.insertOne(heroi);
  
  if (acknowledged !== true){
    res.send('Ocorreu um error ao criar o Herói!.');

    return;
  }

  res.send(heroi);

});

// - [PUT] /herois/{id} - Atualiza um herói pelo ID
app.put('/herois/:id', async (req, res) => {
  const id = req.params.id;
  
  const novoHeroi = req.body;

    if (!novoHeroi
      || !novoHeroi.nome
      || !novoHeroi.poder) {
      res.send('Herói Inválido!.');
    
    return;
  }
  
  const quantidade_herois = await herois.countDocuments({ _id: ObjectId(id) });
    
    if (quantidade_herois !== 1) {
      res.send('Herói Não Encontrado!.');

    return;
    }
  
  const { modifiedCount } = await herois.updateOne(
      {
        _id: ObjectId(id)
      },
      {
        $set: novoHeroi
      }
    );

    if ( modifiedCount !== 1) {
      res.send('Ocorreu um erro ao atualizar o heroi!.');

      return;
    }

  res.send(await getHeroiById(id));
});

// - [DELETE] /herois/{id} - Remover o herói pelo ID
app.delete('/herois/:id', async (req, res) => {
  const id = req.params.id;

  const quantidade_herois = await herois.countDocuments({ _id: ObjectId(id) });
    
    if (quantidade_herois !== 1) {
      res.send('Herói não encontrado!.');

    return;
    }

  const { deletedCount } = await herois.deleteOne({ _id: ObjectId(id) });

    if ( deletedCount !== 1) {
      res.send('Ocorreu um erro ao remover o herói!.');

      return;
    }

      res.send('Herói removido com sucesso!.');

});

app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}`);
});

})();