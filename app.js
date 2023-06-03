const express = require('express')
const connectDB = require('./db/connect')
const app = express()
const items = require('./routes/items')
require('dotenv').config() // passing .env value to (Url)
const cors = require('cors')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const getCart = require('./routes/cart')
const postCart = require('./routes/postCart')

//Middleware
app.use(express.json())
app.use(cors())
app.use('/', items)
app.use('/images', express.static('./images'))

//Authentication routes
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', getCart)
app.use('/api/postcart', postCart)

app.use(function(req, res, next) {
    res.status(404).send('Page not found');
  });

const port = 3001

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI) // passing the .env file with the credentials to login
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log('Error connecting the server', error)
    }
}

start()