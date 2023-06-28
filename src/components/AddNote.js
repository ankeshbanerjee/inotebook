import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";

const AddNote = (props) => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const { addnote } = useContext(NoteContext);

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
    //https://stackoverflow.com/questions/50376353/why-we-need-to-put-e-target-name-in-square-brackets
  };
  const handleClick = (e) => {
    e.preventDefault(); // prevents the page to reload after clicking submit button. generally, clicking submit button causes the page to reload
    addnote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Note added succesfully!", "success")
  };

  return (
    <div className="container my-3">
      <h2 className="mb-2">Add a note</h2>
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
        <button
          disabled={
            note.title.length === 0 ||
            note.description.length === 0 ||
            note.tag.length === 0
          }
          type="submit"
          className="btn btn-primary my-2"
          onClick={handleClick}
        >
          Add note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
