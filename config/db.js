const moongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async ()=> {
    try {
        const conn = await moongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected ${(conn.connection.host)}`.bgCyan.white);
    } catch (error) {
        console.error(`Error in mongoDb connection: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {connectDB};