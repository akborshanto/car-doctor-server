const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors({
//cookie//cookie parser client --> backend



//origin//kon jaigai theke set korbo
origin:['http://localhost:5173'],
credentials:true

}));
app.use(express.json()); //req deye je data ta patabo ta json ei coverr kore 
app.use(cookieParser())
//cookie parse
//envfil
require("dotenv").config();

//mongodb databasea
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    /* ========================================================================================================================= */

    //craete a mongodb db new collection and connect to the server
    const serviceCollection = client.db("car-doctor").collection("services");
    //create anew booking collection andconnec to the server
    const bookingCollection = client.db("car-doctor").collection("booking");

    //========AUTH REALTDED API==========
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
      console.log(token);

      //res.send(token);
      ///send the cookie to the server side 
res.cookie('token',token,{

maxAge:360000,//cookie expire agter 1 hour
httpOnly:true,//cookie is accesingleo oly https,
secure:false

})
.send({success:true})

    });

    //=========SERVICE REALTDED API==========
    //get the services collection data
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    // will i  get the ingle services data form thte server
    // problem with mongodbsingle value of id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: id };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await serviceCollection.findOne(query,options);
      res.send(result);
    });

    //get booking add data from checkout form
    app.get("/booking", async (req, res) => {

      console.log(req.query.email);
      
      console.log('tok tok token',req.cookies.token)
      //quey
      let query = {};

      if (req.query?.email) {
        query = { email: req.query.email };
      }

      const result = await bookingCollection.find(query).toArray();

      res.send(result);
    });

    //booking collection wit post
    app.post("/booking", async (req, res) => {
      const quary = req.body;
      const result = await bookingCollection.insertOne(quary);
      res.send(result);
      console.log(quary);
    });
    //singleBOoing delete from  bokking collection
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(filter);
      res.send(result);
    });
    //put the booking collection
    app.patch("/booking/:id", async (req, res) => {
      //paramsid
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const option = { upset: true };

      const updateBooking = req.body;
      //updaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      const updateDoc = {
        $set: {
          status: updateBooking.status,
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
      // console.log(updateBooking);
    });

    /* ============================================================================================================================= */
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//Testing expresss  server with m post 5000
app.get("/", (req, res) => {
  res.send("Hello Worlsafsafd!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
