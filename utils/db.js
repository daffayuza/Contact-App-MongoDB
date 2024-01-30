const mongoose = require('mongoose')
const dbName = 'app-contact'

// connect to mongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/app_contact')
  .then(() => {
    console.log('Connected to MongDB');
  })
  .catch((error) => {
    console.log(error);
  });

