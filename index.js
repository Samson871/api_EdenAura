const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb  = require("./config/db.js")
const authRoute = require('./routes/authRoute.js');
const paymentRoute = require('./routes/paymentRoute.js');

dotenv.config();
const app = express(); 

app.use(cors()); 
app.use(express.json());



app.use('/api/v1/auth', authRoute);
app.use('/api/v1/payment', paymentRoute); 



const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    app.listen(PORT, () => {    
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
});
