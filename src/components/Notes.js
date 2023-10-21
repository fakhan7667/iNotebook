import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { AddNote } from "./AddNote";
import { Noteitem } from "./Noteitem";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [note, setnote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "default",
  });

  const handleClick = (e) => {
    console.log("updating the current note...", note);
    editNote(note.id, note.etitle, note.edescription, note.etag);
    handleClose();
    props.showAlert("updated SuccessFully", "success");
  };

  const onChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value });
  };

  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  let navigate = useNavigate();

  useEffect(
    () => {
      if (localStorage.getItem('token')) {
        getNotes();
      } else {
        navigate("/login");
      }
    }, // eslint-disable-next-line
    []
  );

  const ref = useRef(null);

  const updateNote = (currentNote) => {
    ref.current.click();
    setnote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <Button variant="primary d-none" ref={ref} onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="my-2">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                title
              </label>
              <input
                type="text"
                className="form-control"
                id="etitle"
                name="etitle"
                value={note.etitle}
                aria-describedby="emailHelp"
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="edescription"
                name="edescription"
                value={note.edescription}
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tag" className="form-label">
                Tag
              </label>
              <input
                type="text"
                className="form-control"
                id="etag"
                name="etag"
                value={note.etag}
                onChange={onChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            disabled={
              note.etitle.length < 5 || note.edescription.length < 5
                ? true
                : false
            }
            variant="primary"
            onClick={handleClick}
          >
            Update Note
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <div className="row my-3">
          <h2>Your Notes</h2>
          <div className="container mx-2">
            {notes.length === 0 && " No Notes to Display "}
          </div>
          {notes.map((note) => {
            return (
              <Noteitem
                key={note._id}
                note={note}
                updateNote={updateNote}
                showAlert={props.showAlert}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
