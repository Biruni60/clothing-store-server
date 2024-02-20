const express=require("express")
const cors=require("cors")
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app =express()
const port=process.env.PORT ||5000



const corsOptions = {
  origin:[
  'http://localhost:5173',

  ],
  credentials:true,
  optionSuccessStatus: 200

}
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjhyf9f.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    

    
    const productCollection=client.db("clothingStore").collection("products")
    const cartCollection=client.db("clothingStore").collection("cart")
    
    
   
    
    app.get('/products', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get('/featuredproducts', async (req, res) => {
      const result = await productCollection.find().sort({ rating: -1 }).toArray();
      res.send(result);
    });
     


     app.get('/productdetail/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
    
      res.send(result);
    })




    app.post('/addproducts', async (req, res) => {
      const item = req.body;
      const result = await productCollection.insertOne(item);
      res.send(result);
    });
    app.post('/addtocart', async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });


    
    app.get('/cart/:email',async(req,res)=>{
      const email=req.params.email 
    
        const query={email:email}
        const result=await cartCollection.find(query).toArray()
        res.send(result)
      
    })



    
    app.put('/products/:id', async (req, res) => {
      const data= req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          name:data.name,
          type:data.type,
          price:data.price,
          rating:data.rating,
          brand:data.brand,
          description:data.description,
          image:data.image,
        }
      }

      const result = await cartCollection.updateOne(filter, updatedDoc)
      res.send(result);
    })
   



    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})