const express = require('express')
const app = express()
const port = process.env.port || 3000 ;
const cors = require('cors');

//* middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Coffey server is running.')
})

app.listen(port, () => {
  console.log(`Coffey server running on port ${port}`)
})
