import { useState } from 'react'
import Logo from './assets/KeeperApp.svg'
import './App.css'

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  return (
    <>
      <div className="flex justify-center py-5">
        <img src={Logo} alt="KeeperApp logo" />
      </div>
      <h1 className="text-3xl text-center mb-[50px]">
        Hello Aneroodh!
      </h1>
      <div className="px-[20%] m-4 flex-col justify-center">
          <input
            type="text"
            className=" mx-auto flex items-center w-[50%] h-auto p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className=" mx-auto flex items-center justify-center w-[50%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Note
          </button>
        </div>    
        <div className="px-[20%] m-4 flex-col justify-center space-y-4">
            <div className="bg-yellow-200 p-4 rounded-md shadow-md relative">
            <h2 className="text-black font-semibold">{title}</h2>
            <p className="text-gray-700">{content}</p>
          </div>
        </div>
      </>
  )
}

export default App
