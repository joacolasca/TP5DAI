const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.get('/api/events', async (req, res) => { 
    
    res.status(200).send();
})


app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`);
   })