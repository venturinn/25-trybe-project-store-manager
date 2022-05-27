const express = require('express');
const rescue = require('express-rescue'); 
const bodyParser = require('body-parser');

const productsControllers = require('./controllers/productsControllers');
const salesControllers = require('./controllers/salesControllers');
const errorMiddleware = require('./middlewares/error');
const productsValidate = require('./middlewares/productsValidate');
const salesValidate = require('./middlewares/salesValidate');

const app = express();

app.use(bodyParser.json());

app.get('/products', rescue(productsControllers.getAllProducts));
app.get('/products/:id', rescue(productsControllers.findProductById));
app.post('/products', productsValidate, rescue(productsControllers.addNewProduct));
app.put('/products/:id', productsValidate, rescue(productsControllers.updateProduct));
app.delete('/products/:id', rescue(productsControllers.deleteProduct));

app.get('/sales', rescue(salesControllers.getAllSales));
app.get('/sales/:id', rescue(salesControllers.findSaleById));
app.post('/sales', salesValidate, rescue(salesControllers.addNewSale));
app.put('/sales/:id', salesValidate, rescue(salesControllers.updateSale));

app.use(errorMiddleware);

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;
