const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('cleaning-supplies-l2')

    const products = db.collection('products')
    const flashSale = db.collection('flash-sale')


    app.post('/products', async (req, res) => {
        const query = req.body
        const result = await products.insertOne(query)
        res.send(result)
    })

    app.get('/products', async (req, res) => {
        const query = {}
        const result = await products.find(query).toArray()
        res.send(result)
    })

    app.get('/products/:category', async (req, res) => {
      const query = {}
      const result = await products.find(query).toArray()
      res.send(result)


      // const query = req.query.category
      // const category = query.toLowerCase()
      // console.log(category);

      // const filterPro = products.filter((p) => p.category.toLowerCase() === category)
     
      //   const result = await products.find(filterPro).toArray()
      //   res.status(200).json({
      //     success: true,
      //     message: 'Products retrieved successfully!',
      //     data: filterPro,
      //   });
    })

    app.get('/products/:id', async (req, res) => {
        const ids = req.params.id
        const query = {_id: new ObjectId(ids)}
        const result = await products.findOne(query)
        res.send(result)
    })


    //flash-sale
    app.post('/flash-sale', async (req, res) => {
      const query = req.body
      const result = await flashSale.insertOne(query)
      res.send(result)
  })

    app.get('/flash-sale', async (req, res) => {
      const query = {}
      const result = await flashSale.find().toArray()
      res.send(result)
  })


    //Start server
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });

  } finally {
  }
}
run().catch(console.dir);


//test route
app.get("/", async (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  await res.json(serverStatus);
});
