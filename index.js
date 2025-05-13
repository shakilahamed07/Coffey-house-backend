const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.port || 3000 ;
const cors = require('cors');

//* middleware
app.use(cors())
app.use(express.json())

//* Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.hwdnjgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

//* Database End

app.get('/', (req, res) => {
  res.send('Coffey server is running.')
})

app.listen(port, () => {
  console.log(`Coffey server running on port ${port}`)
})
