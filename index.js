const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.eventNames.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ihxtrhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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

    const craftCollection = client.db("craftDB").collection("craft");

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    //  update method starts

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });
    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          photoUrl: updatedCraft.photoUrl,
          itemName: updatedCraft.itemName,
          subcategoryName: updatedCraft.subcategoryName,
          price: updatedCraft.price,
          customization: updatedCraft.customization,
          rating: updatedCraft.rating,
          stockStatus: updatedCraft.stockStatus,
          textarea: updatedCraft.textarea,
          processingTime: updatedCraft.processingTime,
        },
      };
      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    // filter


//    const filter= craftCollection.aggregate( [
//     {
//        $project: {
//           items: {
//              $filter: {
//                 input: "$craftDB",
//                 as: "email",
//                 cond: { $eq: [ "$$item.name", ""] }
//              }
//           }
//        }
//     }
//  ] )


//    console.log(filter);

app.get("/crafts/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const crafts = await craftCollection.find({ email: email }).toArray();
    res.json(crafts);
  } catch (error) {
    console.error("Error fetching crafts by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("crafted server is running");
});

app.listen(port, () => {
  console.log(`Crafted server is running on port:${port}`);
});
