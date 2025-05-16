const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.port || 3000 ;
const cors = require('cors');

//* middleware
app.use(cors())
app.use(express.json())

//* Database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const userCollection = client.db('coffeeDB').collection("users");

    //* Create user
    app.post('/users', async (req, res)=>{
      const userProfile = req.body;
      const result = await userCollection.insertOne(userProfile);
      res.send(result)
    })

    //* Read all user
    app.get('/users', async (req, res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    //* Delete user
    app.delete('/users/:id', async (req, res)=>{
      const id = req.params.id;
      const find = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(find);
      res.send(result)
    })

    //* Update Login lastSignInTime
    app.patch('/users', async (req, res)=>{
      const {email, lastSignInTime} = req.body
      const filter = {email:email};
      const updateDoc = {
        $set:{
          lastSignInTime: lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    //* Create coffee
    app.post('/coffees', async (req,res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    //* Read coffee
    app.get('/coffees', async (req, res)=>{
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    app.get('/coffees/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    //* Delete coffee
    app.delete('/coffees/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    //* Update coffee
    app.put('/coffees/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateCoffee = req.body;
      const updateDoc = {
        $set: updateCoffee
      }
      const options = { upsert: true };

      const result = await coffeeCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

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
