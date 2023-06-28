import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "default",
  });

  const { notes, getnotes, editnote } = useContext(NoteContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getnotes();
    } else {
      navigate("/login");
    }
    //eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const updateNote = (currentNote) => {
    ref.current.click(); //The click() method simulates a mouse-click on an element. This method can be used to execute a click on an element as if the user manually clicked on it. Here, it is used to execute a click on the 'Launch demo modal' button, whenever the user clicks on edit icon
    setNote(currentNote);
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const refClose = useRef(null);
  const handleClick = () => {
    editnote(note._id, note.title, note.description, note.tag);
    refClose.current.click(); //Here, it is used to execute a click on the 'Close' button, whenever the user clicks on 'Update' button
    props.showAlert("Note updated successfully!", "success");
  };

  return (
    <div className="container">
      <AddNote showAlert={props.showAlert} />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container my-3">
                <form>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      onChange={onChange}
                      value={note.title}
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
                      id="description"
                      name="description"
                      onChange={onChange}
                      value={note.description}
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
                      id="tag"
                      name="tag"
                      onChange={onChange}
                      value={note.tag}
                      minLength={5}
                      required
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                disabled={
                  note.title.length === 0 ||
                  note.description.length === 0 ||
                  note.tag.length === 0
                }
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleClick();
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h2>Your notes</h2>
        <div className="row my-2">
          <div className="container">
            {notes.length === 0 && "No notes to show!! Please add notes."}
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
    </div>
  );
};

export default Notes;
