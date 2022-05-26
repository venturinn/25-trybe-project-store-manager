const rescue = require('express-rescue'); 

const app = require('./app');
require('dotenv').config();

const productsControllers = require('./controllers/productsControllers');
const salesControllers = require('./controllers/salesControllers');

const errorMiddleware = require('./middlewares/error');

app.get('/products', rescue(productsControllers.getAllProducts));
app.get('/products/:id', rescue(productsControllers.findProductById));

app.get('/sales', rescue(salesControllers.getAllSales));
app.get('/sales/:id', rescue(salesControllers.findSaleById));

app.use(errorMiddleware);

// não altere esse arquivo, essa estrutura é necessária para à avaliação do projeto
app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
