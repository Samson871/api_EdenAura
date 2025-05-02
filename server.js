const express = require('express');
const colors = require('colors');  
const dotenv = require('dotenv');
const morgan = require('morgan');
const {connectDB} = require('./config/db.js');
const cors = require('cors');
//import routes
const authRoute = require('./routes/authRoute.js');

//config dotenv
dotenv.config();

//connectDB(); //connect to database
connectDB(); 

//rest objects  
const app = express(); 

//middlewares
app.use(cors()); //allow cross-origin requests
app.use(express.urlencoded({extended: true})); //parse urlencoded data
app.use(express.json());
app.use(morgan('dev'));


//routes
app.use('/api/v1/auth', authRoute);


// Provide a default port if process.env.PORT is not set
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {    
    console.log(`Server is running on port http://localhost:${PORT}`);
});
