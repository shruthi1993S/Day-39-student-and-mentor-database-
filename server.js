const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./route/routes');
require ("dotenv").config()
const app = express();


// MongoDB connection
mongoose.connect(process.env.MONGODB).then(()=>{
  console.log("MongoDB connected successfully")
})


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Start the server

const PORT=process.env.PORT 
 app.listen(PORT,()=>{
    console.log(`Server running in the port ${PORT}`)
 })