const mongoose = require('mongoose') // to connect with the db

const validations = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
const connectDB = (url) => {
    return mongoose
    .connect(url, validations)
    .then(() => console.log('Succesfully connected to the database'))
    .catch((err) =>  console.log('error connecting to db', err))
}

module.exports = connectDB