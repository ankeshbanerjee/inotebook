const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const router = express.Router();

// ROUTE 1 : fetch all notes using GET : 'api/notes/fetchnotes' - login required
router.get("/fetchnotes", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await Note.find({ user: userId });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error occurred");
  }
});

// ROUTE 2 : add a note using POST : 'api/notes/addnote' - login required
router.post(
  "/addnote",
  fetchUser,
  body("title", "Enter a valid title").isLength({ min: 3 }),
  body("description", "Please provide description").isLength({ min: 3 }),
  body("tag", "tag cannot be empty!").optional().notEmpty(),
  async (req, res) => {
    const { title, description, tag } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = new Note({
        // using es6 object shorthand
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error occurred");
    }
  }
);

// ROUTE 3 : update a note using PUT : 'api/notes/updatenote/:id' - login required
router.put("/updatenote/:noteid", fetchUser, async (req, res) => {
  // get the update requests for req.body
  const { title, description, tag } = req.body;

  // create a newObject with the fields of req.body
  const newObject = {};
  if (title) {
    newObject.title = title;
  }
  if (description) {
    newObject.description = description;
  }
  if (tag) {
    newObject.tag = tag;
  }

  // find the note to be updated
  let note = await Note.findById(req.params.noteid);
  if (!note) {
    return res.status(404).send("Not found!");
  }

  // check whether the user is trying to access his/her own notes, if trying to access another person's note, don't allow that
  if (note.user.toString() !== req.user.id) {
    return res.status(403).send("Access denied!");
  }

  // if all ok, then find the note and update it
  note = await Note.findByIdAndUpdate(
    req.params.noteid,
    { $set: newObject },
    { new: true }
  );
  res.json(note);
});

// ROUTE 3 : delete a note using PUT : 'api/notes/deletenode/:id' - login required
router.delete("/deletenote/:noteid", fetchUser, async (req, res) => {
  try {
    // find the note to be deleted
    let note = await Note.findById(req.params.noteid);
    if (!note) {
      return res.status(404).send("note not found!");
    }

    // check if the note to be deleted, is owned by the user or not
    if (req.user.id !== note.user.toString()) {
      return res.status(403).send("not allowed!");
    }

    // if all ok, then delete
    note = await Note.findByIdAndDelete(req.params.noteid);
    res.json({ success: "successfully deleted", note });
    
  } catch (error) {
    console.log(error)
    res.status(500).send("internal server error occured")
  }
});
module.exports = router;
