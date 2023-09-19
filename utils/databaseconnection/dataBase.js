const mongoose = require('mongoose')
require('dotenv').config();

// Create a function to connect to the database
const databaseconnect = async () => {
    try {
        await mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1); // Exit the process if unable to connect
    }
}

module.exports=databaseconnect;