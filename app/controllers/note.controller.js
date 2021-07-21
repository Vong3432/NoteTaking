const db = require("../models");
const Note = db.notes;
const User = db.users;

// Create and Save a new Note
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const user = await User.findById(req.body.user_id)

  if(!user)
    return res.status(401).send({ message: "Unauthorized" })

  // Create a Note
  const note = new Note({
    title: req.body.title,
    body: req.body.body,
    geolocation: req.body.geolocation ? req.body.geolocation : {},
    tags: req.body.tags,
    createdBy: user._id
  });

  // Save Note in the database
  note
    .save(note)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Note."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Note.find(condition)
    .populate('createdBy')
    .exec((error, data) => {
      if(error) throw error;

      console.log(data.user)

      res.send(data)
    });
};

// Find a single Note with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Note.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Note with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Note with id=" + id });
    });
};

// Update a Note by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Note.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Note with id=${id}. Maybe Note was not found!`
        });
      } else res.send({ message: "Note was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Note with id=" + id
      });
    });
};

// Delete a Note with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Note with id=${id}. Maybe Note was not found!`
        });
      } else {
        res.send({
          message: "Note was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Notes from the database.
exports.deleteAll = (req, res) => {
  Note.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Notes were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all notes."
      });
    });
};

