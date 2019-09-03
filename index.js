import { Server } from "tls";

// implement your API here
Server.get('/api/users', (req, res) => {
    res.send('hello');
});

// import express
const express = require('express');

// import hubs-model file
const Hubs = require('./data/hubs-model');

const server = express();

//add this line to teach express to parse JSON
server.use(express.json());

//see a list of Hubs (like a channel on slack): /hubs
Server.get('/api/users', (req, res) => {
    //Hubs.find() returns a promise. We need .then() and .catch()
    Hubs.find()
        .then(hubs => {
            // .json will convert the data passed in to JSON. 
            // tells the client we're sending JSON through an HTTP header
            res.status(200).json(hubs);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        });
});

// create a Hub
Server.post('/hubs', (req, res) => {
    // http message is an object w/ headers and body => {headers: {}, body: {data sent by client} }.
    // we care about the data in the body
    const HubInformation = req.body;
    console.log('hub info from body', hubInformation);
    Hubs.add(hubInformation)
        .then(result => {
            res.status(201).json(Created);
        })
        .catch(error => {
            res.status(500).json({ message: 'error adding the Hub' });
        });
});

// delete a Hub
server.delete('/api/users/:id', (req, res) => {
    const hubId = req.params.id;
    Hubs.remove(id)
        .then(result => {
            res.status(201).json({ message: "hub deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ error: "The user could not be removed" });
        });
});

//update a Hub
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Hubs.update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be modified." })
        });
});

const port = 8000;
Server.listen(port, () => console.log('\napi running\n'));
