const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes/router');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use("/", routes);

app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
})