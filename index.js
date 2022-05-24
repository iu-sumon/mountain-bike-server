const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()

require('dotenv').config()
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4adv5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const brandsCollection = client.db('mountain-bicycle').collection('brands')
        const partsCollection = client.db('mountain-bicycle').collection('parts')
        const reviewsCollection = client.db('mountain-bicycle').collection('reviews')

        //====================================== Get all brands loading API

        app.get('/brands', async (req, res) => {
            const query = {};
            const brands = await brandsCollection.find(query).toArray();
            res.send(brands)
        })
        
        //====================================== Get all Reviews loading API

        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviews = await reviewsCollection.find(query).toArray()
            res.send(reviews)
        })
        //====================================== Get all Parts loading API

        app.get('/parts', async (req, res) => {
            const query = {};
            const parts = (await partsCollection.find(query).toArray()).reverse();
            res.send(parts)
        })













    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Mountain Bike...........!')
})

app.listen(port, () => {
    console.log('Server is ok !', port)
})