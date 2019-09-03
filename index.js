// implement your API here
const express = require('express');
const db = require('./data/db.js');

// create server by calling express
const server = express();

// add this line to teach express how to parse JSON from body. This line says we're using some express middleware
server.use(express.json());

// get all users endpoint
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

// create a user
server.post('/api/users', (req, res) => {
    // http message is an object w/ headers and body => {headers: {}, body: {data sent by client} }. we care about the data in the body
    // console.log(req.body);
    // res.end();
    const { name, bio } = req.body;
    // check that information is valid
    if (!name || !bio) {
        res.status(400).json({ error: 'Please provide name and bio for the user.' });
    }
    db.insert({ name, bio })
        // destructured first argument into an object called id
        .then(({ id }) => {
            db.findById(id)
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "There was an error retrieving user." });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the user to the database." });
        });
});

// get individual user endpoint
server.get('/api/users/:id', (req, res) => {
    // contains id of user being requested. can destructure: const {id} = req.params;
    const id = req.params.id;
    // console.log(req.params);
    // res.end();
    db.findById(id)
        .then(user => {
            console.log('user', user);
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ error: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The user information could not be retrieved." });
        });
});

// delete a user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(deleted => {
            if (deleted) {
                // console.log(something);
                res.status(204).end();
            } else {
                res.status(404).json({ error: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The user could not be removed" });
        });
});

// update a user
server.put('/api/users/:id', (req, res) => {
    const { name, bio } = req.body;
    if (!name && !bio) {
        res.status(400).json({ error: "Please provide name and bio for the user." })
    }
    db.update(id, { name, bio })
        .then(updated => {
            if (updated) {
                db.findById(id)
                    .then(user => res.status(200).json(user))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "The user information could not be modified." });
                    });
            } else {
                res.status(404).json({ error: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The user information could not be modified." });
        });
});

// have server listen on a specified port. alternative: server.listen(8000, () => console.log("server on 8000"));
server.listen(8000, () => console.log('\napi on port 8000\n'))