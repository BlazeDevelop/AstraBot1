const mongoose = require('mongoose');
const config = require('../json/config.json');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log('MongoDB connected successfully!');
}).catch(err => {
    console.error(`Error connecting to MongoDB: ${err}`);
});

mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
});