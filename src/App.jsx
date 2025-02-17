import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./assets/KeeperApp.svg";
import "./styles.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [mode, setMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); // Track selected note

  const change = () => {
    setMode(!mode);
  };

  // Fetch notes from backend
  useEffect( ()=>{
    axios.get("https://keeper-app-backend-pink.vercel.app/loadData")
      .then((response) => setNotes(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Add a new note
  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) return;
  
    axios.post("https://keeper-app-backend-pink.vercel.app/addNote", { 
      user: "aneroodh14", // or dynamically from logged-in user
      title, 
      content 
    })
    .then((response) => {
      setNotes(prevNotes => [...prevNotes, response.data.note]);
      setTitle("");
      setContent("");
    })
    .catch((error) => console.error(error));
  };
  
  // Delete a note
  const handleDeleteNote = (id) => {
    axios.delete(`https://keeper-app-backend-pink.vercel.app/deleteNote/${id}`)
      .then(() => setNotes(notes.filter((note) => note._id !== id)))
      .catch((error) => console.error(error));
  };
  
  return (
    <div className={`min-h-screen w-full ${mode ? "light" : "dark"}`}>
      {/* Blurred Background Effect */}
      <div className={`z-10 ${selectedNote ? "blur-md" : ""}`}>
        {/* Header */}
        <div className="flex justify-center py-5">
          <img src={Logo} alt="KeeperApp logo" />
        </div>
        <h1 className="text-3xl text-center mb-10">Hello Aneroodh!</h1>

        {/* Note Input Section */}
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
            onClick={handleAddNote}
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="max-w-[75%] mx-auto p-4 columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-yellow-200 p-4 my-4 rounded-md shadow-md relative break-inside-avoid cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNote(note)} // Set selected note on click
            >
              <h2 className="text-black font-semibold break-words">{note.title}</h2>
              <p className="text-gray-700 w-full break-words whitespace-pre-wrap">{note.content}</p>

              {/* Delete Button */}
              <button
                className="absolute top-2 right-2 text-red-700 hover:text-white hover:bg-red-700 transition duration-300 font-semibold w-6 h-6 flex items-center justify-center rounded-md"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering zoom when clicking delete
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

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black transition"
              onClick={() => setSelectedNote(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle Button */}
      <button
        className="absolute top-2 right-2 font-semibold text-[#eb7979] active:bg-gray-600"
        onClick={change}
      >
        {mode ? "Light" : "Dark"}
      </button>
    </div>
  );
}

export default App;
