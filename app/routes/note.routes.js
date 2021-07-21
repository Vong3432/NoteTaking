module.exports = app => {
  const notes = require("../controllers/note.controller.js");

  var router = require("express").Router();

  // Create a new note
  router.post("/", notes.create);

  // Retrieve all notes
  router.get("/", notes.findAll);

  // Retrieve a single note with id
  router.get("/:id", notes.findOne);

  // Update a note with id
  router.put("/:id", notes.update);

  // Delete a note with id
  router.delete("/:id", notes.delete);

  // Create a new note
  router.delete("/", notes.deleteAll);

  app.use("/api/notes", router);
};
