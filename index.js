const connectToMongo = require('./db')
const express = require('express')
const app = express()
var cors = require('cors')

connectToMongo();

const port = 5000;

app.use(cors())
app.use(express.json())   //middlware

//Available Routes
app.use('/test', ()=> console.log("testing is successful"))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
//  app.get('/', (req, res) => {
//      res.send('Hello Abdullah')
//  })

// app.get('/api/v1/login', (req, res) => {
//     res.send('Hello Login')
// })


app.listen(port, () => {
  console.log(`xNotebook backend listening at http://localhost:${port}`)
})