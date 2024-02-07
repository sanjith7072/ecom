require('dotenv').config();
const { app } = require('./middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json');
const mongoose = require('mongoose');
const routes = require('./routes/productcontroller');
// Adjust the path to your route controller
// Define the port and host from environment variables or use defaults
const PORT = process.env.PORT; // Make sure 'PORT' is defined in your .env file
const HOST = process.env.HOST; // Make sure 'HOST' is defined in your .env file
mongoose.connect('mongodb://127.0.0.1:27017/test_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Define routes
app.use('/', routes); // Use the routes defined in productcontroller

// Start the Express server and listen for incoming requests
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Swagger is running on ${HOST}:${PORT}/api-docs`);
});
