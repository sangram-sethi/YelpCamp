// Local dev / traditional Node start
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`YelpCamp listening on port ${port}`);
});
