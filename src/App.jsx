import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./assets/KeeperApp.svg";
import "./styles.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';


export default function App() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [newNote, setNewNote] = useState("hidden");
  const [showNewNoteButton, setShowNewNoteButton] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [mode, setMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null); // Track note being edited

  const button1 = () => {
    setMode(!mode);
  };

  const button2 = () => {
    setNewNote(newNote === "" ? "hidden" : "");
    setShowNewNoteButton(false);
    setEditingNote(null); // Reset editing state
    setTitle(""); 
    setContent(""); 
  };
    useEffect(() => {
      if(user){
      axios
        .get("https://keeper-app-backend-pink.vercel.app/loadData",{
          params : {user : user.primaryEmailAddress.emailAddress}
        })
        .then((response) => {
          console.log("Fetched Notes:", response.data);
          setNotes(response.data);
        })
        .catch((error) => console.error(error));
        console.log(user.firstName);
      }
    }, [isLoaded]);

  
  // Handle adding or updating a note
  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      // Update existing note
      axios
        .put(`https://keeper-app-backend-pink.vercel.app/updateNote/${editingNote._id}`, {
          title,
          content,
        })
        // .then((response) => {
          // console.log("Note Updated:", response.data);
          setNotes((prevNotes) =>
            prevNotes.map((note) => note._id === editingNote._id ? {"_id": editingNote._id,"title": title, "content": content} : note)
          );
          resetForm();
        // })
        // .catch((error) => console.error(error));
    } else {
      // Add new note
      axios
        .post("https://keeper-app-backend-pink.vercel.app/addNote", {
          user: user.primaryEmailAddress.emailAddress,
          title,
          content,
        })
        .then((response) => {
          console.log("Note Added:", response.data);
          setNotes([...notes, response.data.note || response.data]);
          resetForm();
        })
        .catch((error) => console.error(error));
    }
  };

  // Handle deleting a note
  const handleDeleteNote = (id) => {
    axios
      .delete(`https://keeper-app-backend-pink.vercel.app/deleteNote/${id}`)
      .then(() => {
        console.log("Note Deleted");
        setNotes(notes.filter((note) => note._id !== id));
      })
      .catch((error) => console.error(error));
  };

  // Reset form after saving
  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
    setTimeout(() => {
      setNewNote("hidden");
      setShowNewNoteButton(true);
    }, 300);
  };

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn >
        <div className={`min-h-screen w-full ${mode ? "light" : "dark"}`}>
          <div className="absolute top-4 left-4 scale-130 ">
            <UserButton />
          </div>
          {/* Dark Mode Toggle Button */}
          <button
            className="px-[5px] absolute top-4 right-4 font-semibold bg-[#eb7979] active:bg-gray-600"
            onClick={button1}
          >
            {mode ? "Light" : "Dark"}
          </button>

          <div className={`z-10 ${selectedNote ? "blur-md" : ""}`}>
            {/* Header */}
            <div className="flex justify-center py-5">
              <img src={Logo} alt="KeeperApp logo" />
            </div>
            <h1 className="text-3xl text-center mb-10">Hello {isLoaded && isSignedIn ? user.firstName : "Guest"}!</h1>

            <div className="flex justify-center mb-6">
              {showNewNoteButton && (
                <button
                  className="self-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={button2}
                >
                  + New Note
                </button>
              )}
            </div>

            {/* Note Input Form */}
            <div className={`note-form ${newNote}`}>
              <div className="px-[20%] m-4 flex flex-col items-center">
                <input
                  type="text"
                  className="mb-4 w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded-md mb-2 min-h-[10rem] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button
                  className="self-center w-[50%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={handleSaveNote}
                >
                  {editingNote ? "Save Changes" : "Add Note"}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="max-w-[75%] mx-auto p-4 columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-yellow-200 p-4 my-4 rounded-md shadow-md relative break-inside-avoid cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedNote(note)}
                >
                  <h2 className="text-black font-semibold break-words">{note.title}</h2>
                  <p className="text-gray-700 w-full break-words whitespace-pre-wrap">{note.content}</p>

                  {/* Edit Button */}
                  <button
                    className="absolute bottom-2 right-10 bg-green-500 text-white px-2 py-1 rounded-md text-sm hover:bg-green-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingNote(note);
                      setTitle(note.title);
                      setContent(note.content);
                      setNewNote("");
                      setShowNewNoteButton(false);
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2 text-red-700 hover:text-white hover:bg-red-700 transition duration-300 font-semibold w-6 h-6 flex items-center justify-center rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note._id);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Zoomed Note Popup */}
          {selectedNote && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              <div className="bg-yellow-200 p-6 rounded-lg shadow-lg max-w-lg w-full transform scale-105 max-h-[80vh] overflow-y-auto relative">
                <h2 className="text-2xl font-bold text-black mb-4">{selectedNote.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.content}</p>
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-black transition"
                  onClick={() => setSelectedNote(null)}
                >
                  ✖
                </button>
              </div>
            </div>
          )}

        
        </div>
      </SignedIn>
    </header>
  );
}

