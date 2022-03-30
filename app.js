const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Index Page');
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Smart Edu project is starting on ${port} port`);
});