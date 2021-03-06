const express = require('express')
const { MongoClient, CURSOR_FLAGS } = require("mongodb");
const ObjectId = require('mongodb').ObjectId

require("dotenv").config();
const cors = require('cors')

const app = express();
const port = 5000

//middleware
app.use(cors())
app.use(express.json())
const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzsrh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect()
        console.log('connect to database')
        const database = client.db("giniusCarServices");
        const servicesCollection = database.collection("servicesCollection");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //GET Single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting the id',id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post', service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)

        })

        //Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', async (req, res) => {
    res.send('Running Ginius Car Server')
})

app.listen(port, () => {
    console.log("running ginius car server on port", port )
})