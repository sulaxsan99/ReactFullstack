const mongoose = require('mongoose');
require('dotenv').config();

const DbConnection = async (req, res) => {

    try {
        const db = await mongoose.connect(process.env.mongodb);
        console.log("db connected")
        return db;
    } catch (error) {
        console.log(error)
    }
}

module.exports = DbConnection