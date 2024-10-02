"use client";
import React, { useState } from "react";
import "./login.css";


const AddAlbum = () => {
  const [idalbum, setIdalbum] = useState('');
  const [namealbum, setNamealbum] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch('http://localhost:5000/api/albums', {
 method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idalbum, namealbum }),
      });
  
      const responseText = await res.text(); // Lire la réponse en tant que texte brut
      console.log('Response from server:', responseText);
  
      if (res.ok) {
        const jsonData = JSON.parse(responseText); // Convertir en JSON si possible
        alert('Album added successfully!');
        setIdalbum('');
        setNamealbum('');
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.message || 'Failed to add album');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    }
  };
  
  return (
    <div>
      <h1>Add Album</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="idalbum">Album ID:</label><br /><br />
          <input
            type="text"
            id="idalbum"
            value={idalbum}
            onChange={(e) => setIdalbum(e.target.value)}
            required
          />
        </div>
        <div><br /><br />
          <label htmlFor="namealbum">Album Name:</label><br /><br />
          <input
            type="text"
            id="namealbum"
            value={namealbum}
            onChange={(e) => setNamealbum(e.target.value)}
            required
          />
        </div><br /><br />
        <button className="send" type="submit">Add Album</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AddAlbum;
