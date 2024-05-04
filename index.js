const express = require('express')
const cors=require('cors')
//mongodb 
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
//middleware
app.use(cors())
app.use(express.json())//req deye je data ta patabo ta json ei coverr kore pelbe
//envfil
require('dotenv').config()

//mongodb databasea 
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

/* ========================================================================================================================= */

//craete a mongodb db new collection and connect to the server
const servieCollection=client.db('car-doctor').collection('services')



//get the services collection data
app.get('/services',async(req,res)=>{


const cursor=servieCollection.find();
const result=await cursor.toArray()

res.send(result)

})



































    /* ============================================================================================================================= */
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);





//Testing expresss  server with m post 5000
app.get('/', (req, res) => {
  res.send('Hello Worlsafsafd!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})