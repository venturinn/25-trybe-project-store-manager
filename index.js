const rescue = require('express-rescue'); 

const app = require('./app');
require('dotenv').config();

const productsControllers = require('./controllers/productsControllers');
const errorMiddleware = require('./middlewares/error');

app.get('/products', rescue(productsControllers.getAllProducts));

app.get('/products/:id', rescue(productsControllers.findProductById));

app.use(errorMiddleware);

// não altere esse arquivo, essa estrutura é necessária para à avaliação do projeto
app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
