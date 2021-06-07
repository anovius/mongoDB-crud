const { urlencoded } = require('express');
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const Users = require('./models/user')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const databaseLink = 'mongodb+srv://<username>:<password>@nodelearn.cwsu1.mongodb.net/<DB name>?retryWrites=true&w=majority'
mongoose.connect(databaseLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then((result) => {
        console.log('Connected to Database')
        app.listen(3000)
    })
    .catch((err) => console.log(err))
    
app.post('/addUser', (req, res) => {
    const newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    newUser.save()
        .then((result) => res.status(201).send({msg: 'User created successfully'}))
        .catch((err) => res.status(403).send({msg: 'Something went wrong'}))
})

app.get('/getUser/:email', (req, res) => {
    Users.find({email:req.params.email}, (err, data) => {
        if(!err)
            res.status(302).send(data)
        res.end()
    })
})

app.delete('/deleteUser/:email', (req, res) => {
    Users.deleteOne({email:req.params.email}, (err) => {
        if(!err)
            res.status(200).send({msg: 'User deleted successfully'})
    })
})

app.put('/updateUser', (req, res) => {
    Users.updateOne({email: req.body.email}, {name: req.body.name, password:req.body.password}, (err, result) => {
        if(!err)
            res.status(200).send({msg: 'User Updated successfully'})
    })
})