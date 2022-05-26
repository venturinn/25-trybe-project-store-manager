const rescue = require('express-rescue'); 
const bodyParser = require('body-parser');

const app = require('./app');
require('dotenv').config();

app.use(bodyParser.json());

const productsControllers = require('./controllers/productsControllers');
const salesControllers = require('./controllers/salesControllers');

const errorMiddleware = require('./middlewares/error');

app.get('/products', rescue(productsControllers.getAllProducts));
app.get('/products/:id', rescue(productsControllers.findProductById));

app.get('/sales', rescue(salesControllers.getAllSales));
app.get('/sales/:id', rescue(salesControllers.findSaleById));

app.post('/products', rescue(productsControllers.addNewProduct));

app.put('/products/:id', rescue(productsControllers.updateProduct));

app.use(errorMiddleware);

// não altere esse arquivo, essa estrutura é necessária para à avaliação do projeto
app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
