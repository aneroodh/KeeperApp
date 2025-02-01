import { useState } from 'react'
import Logo from './assets/KeeperApp.svg'
import './App.css'

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  // Add a new note
  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title,
      content,
    };

    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };


  return (
    <>
      <div className="flex justify-center py-5">
        <img src={Logo} alt="KeeperApp logo" />
      </div>
      <h1 className="text-3xl text-center mb-10">
        Hello Aneroodh!
      </h1>
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
        <div className=" max-w-[75%] mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-yellow-200 p-4 rounded-md shadow-md relative">
              <h2 className=" text-black font-semibold break-words">{note.title}</h2>
              <p className="text-gray-700 w-full break-words whitespace-pre-wrap">{note.content}</p>
              
              {/* Delete Button */}
              <button
                className="absolute top-2 right-2 text-red-700 hover:text-white hover:bg-red-700 transition duration-300 font-semibold w-6 h-6 flex items-center justify-center rounded-md"
                onClick={() => handleDeleteNote(note.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>

      </>
  )
}

export default App
