const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_DB_URI).then(console.log('connected to MongoDB')).catch((err) => console.log(err));
}

module.exports = connectToMongo