import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

  // get all notes
  const getnotes = async ()=>{
    // API call
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem('token')   
      },
    });
    const json = await response.json();
    setNotes(json)
  }

  // Add a note
  const addnote = async (title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  // edit a note
  const editnote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();

    // logic to edit in client side (frontend)

    // let newNotes = notes  // will not work, because assignment operator does shallow copy (makes a new object by copying the memory address of the original object)
    // let newNotes = [...notes] // will work here, becuase spread operator does deep copy (allocate new memory and copies there), but it shallow copies in nested arrays, but here, no nested stuffs are there, so it will work here

    // but the safest and most common way to deep copy is JSON.stringify() and JSON.parse()
    const newNotes = JSON.parse(JSON.stringify(notes));   // read here: https://stackoverflow.com/questions/61421873/object-copy-using-spread-operator-actually-shallow-or-deep

    for (let noteindex = 0; noteindex < newNotes.length; noteindex++) {
      if (newNotes[noteindex]._id === id) {
        newNotes[noteindex].title = title;
        newNotes[noteindex].description = description;
        newNotes[noteindex].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  };

  // Delete a node
  const deletenote = async (id) => {
    // API call - logic to delete in server side (backend-database)
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem('token')
          
      }
    });
    const json = await response.json();
    
    // logic to deleted in client side (frontend)
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };
  return (
    <NoteContext.Provider
      value={{ notes, setNotes, addnote, deletenote, editnote, getnotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
