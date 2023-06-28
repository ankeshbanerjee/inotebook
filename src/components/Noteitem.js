import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deletenote } = context;
  const { note, updateNote, showAlert } = props;
  return (
    <div className="col-md-3 my-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="fa-solid fa-trash-can ms-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                deletenote(note._id);
                showAlert("Note deleted successfully!", "success")
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square ms-3"
              style={{ cursor: "pointer" }}
              onClick={()=>{
                updateNote(note)
              }}
            ></i>
          </div>
          <p className="d-flex align-items-center"><i className="fa-solid fa-tag fa-xs me-1"></i>{note.tag}</p>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
