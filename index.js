// implement your API here
const express = require("express");
const db = require("./data/db");

const server = express();

server.listen(4000, () => {
  console.log("Does this work");
});

server.use(express.json());

server.get("/", (req, res) => {
  res.send("hello world..");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ success: true, user });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The user with the specified ID does not exist." });
    });
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  const name = req.body.name;
  const bio = req.body.bio;

  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." })
      .end();
  }
  db.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: err, success: false });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        res.status(201).json(id);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const name = req.body.name;
  const bio = req.body.bio;

  if (!user.id) {
    return res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.update(id, user)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});
