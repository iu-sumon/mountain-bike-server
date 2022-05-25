const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const ordersCollection = client.db('mountain-bicycle').collection('orders')
        const profilesCollection = client.db('my_profile').collection('profiles')

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

        //=======================================Single Parts data loading API

        app.get('/purchasePage/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const part = await partsCollection.findOne(query);
            res.send(part)


        })
        //===================================== Deleting Order API
        app.delete('/order/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result)

        })
        //======================================Order added API
        app.post('/order', async (req, res) => {

            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        })

        //====================================== Review Added API

        app.post('/reviews', async (req, res) => {

            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })


        //====================================== update profile API

        app.put('/profile', async (req, res) => {

            const email = req.query.email;
            const updatedProfile = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedProfile
            };
            const result = await profilesCollection.updateOne(filter, updatedDoc, options)
            res.send(result)

        })
        //====================================== My Order API 

        app.get('/order', async (req, res) => {

            const email = req.query.email;
            const query = { email: email };
            const orders = await ordersCollection.find(query).toArray();
            return res.send(orders);

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