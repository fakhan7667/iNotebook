const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");

// Routes 1: //get all the notes GET "/api/notes/fetchallnote" . login require
router.get("/fetchallnote", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server  error occurred");
  }
});

// -------------------------------------------------------------------------------------------------------------

// Routes 2:  Add a new notes : post "/api/notes/addnote".  log required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be  atleast 5 characters").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server  error occurred");
    }
  }
);

// -------------------------------------------------------------------------------------------------------------

// Routes 3 : update the existing node PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //creating a new note
    const newNote = {};

    // if present then replace
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("NOt Found");
    }

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server  error occurred");
  }
});

// -------------------------------------------------------------------------------------------------------------

// Routes 4 : Delete the existing node DELETE "/api/notes/deletenote".  login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  try {
    // find the note to be DELEted and delete it
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("NOt Found");
    }
    // allows deletion only if user owns this Note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Notes has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server  error occurred");
  }
});

// -------------------------------------------------------------------------------------------------------------

module.exports = router;
