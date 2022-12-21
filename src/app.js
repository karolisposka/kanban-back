const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const usersRoute = require('./routes/v1/users');
const boardsRoute = require('./routes/v1/boards');
const {connectToDb, getDb} = require('./controllers/database');
const app = express();
app.use(cors());
app.use(express.json());


connectToDb((err)=>{
    if(!err) {
        app.listen(port, ()=>{
            console.log(`server is running on ${port}`)
        });
        db = getDb();
    }
})

app.get('/', async(req,res)=>{
    res.send('server is running');
});


app.use('/v1/users', usersRoute);
app.use('/v1/boards', boardsRoute);


app.get('*', async(req,res) => {
    res.send('invalid endpoint')
});




