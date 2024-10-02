"use client"; // Make sure this is at the very top

import React, { useState, useEffect } from "react";
import { Input, Button, Modal, Upload, message } from "antd";
import { PlusOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import AddPhoto from '../photo/page'; 
const AlbumFamille = ({ userData }) => {
    const [albums, setAlbums] = useState([]); // State for albums
    const [currentAlbum, setCurrentAlbum] = useState(null); // State for the current album
    const [albumPhotos, setAlbumPhotos] = useState([]); // State for photos of the current album
    const [showAlbums, setShowAlbums] = useState(false);
    const [isAddingAlbum, setIsAddingAlbum] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');
  
    // Fonction pour charger les albums
    const loadAlbums = () => {
      // Remplacez ceci par votre logique pour charger les albums depuis l'API
      const fetchedAlbums = [
        { idalbum: 1, namealbum: 'Album 1' },
        { idalbum: 2, namealbum: 'Album 2' },
        // Ajoutez d'autres albums selon vos besoins
      ];
      setAlbums(fetchedAlbums);
    };
  
    // Fonction pour charger les photos d'un album
    const loadAlbumPhotos = (albumId) => {
      // Remplacez ceci par votre logique pour charger les photos de l'album depuis l'API
      const fetchedPhotos = [
        { idphoto: 1, albumId: 1, name: 'Photo 1' },
        { idphoto: 2, albumId: 1, name: 'Photo 2' },
        { idphoto: 3, albumId: 2, name: 'Photo 3' },
        // Ajoutez d'autres photos selon vos besoins
      ].filter(photo => photo.albumId === albumId);
  
      setAlbumPhotos(fetchedPhotos);
    };
  
    // Appel de la fonction pour charger les albums lors du premier rendu
    useEffect(() => {
      loadAlbums();
    }, []);

  // Fetch albums from the backend
  const fetchAlbums = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/albums?userId=${userData.iduser}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setAlbums(data);
      } else {
        console.error("La réponse n'est pas un tableau:", data);
        setAlbums([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des albums:", error);
      setAlbums([]);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Handle adding a new album
  const handleAddAlbum = async () => {
    if (!userData || !userData.iduser) {
      console.error("iduser n'est pas défini.");
      alert("Utilisateur non identifié. Veuillez vous reconnecter.");
      return;
    }

    const albumData = {
      namealbum: newAlbumName,
      iduser: userData.iduser,
    };

    try {
      const response = await fetch("http://localhost:5000/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(albumData),
      });

      if (response.ok) {
        const newAlbum = await response.json();
        alert("Album ajouté avec succès!");
        setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
        setNewAlbumName("");
        setIsAddingAlbum(false);
        setCurrentAlbum(newAlbum); // Set the current album to the newly created album
        setShowAlbums(true); // Show the albums
      } else {
        const errorData = await response.json();
        alert(
          "Une erreur est survenue lors de l'ajout de l'album: " +
            errorData.details
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Une erreur est survenue lors de l'ajout de l'album");
    }
  };

  // Handle adding a photo to the current album
  const handleAddPhoto = async (file) => {
    const formData = new FormData();
    formData.append("attachedfile", file); // Ensure this matches the backend field name
    formData.append("idalbum", currentAlbum.idalbum); // Add other fields as necessary

    try {
      const response = await fetch("http://localhost:5000/api/photos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Photo ajoutée avec succès!");
      } else {
        const errorData = await response.json();
        message.error("Erreur lors de l'ajout de la photo: " + errorData.details);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo:", error);
      message.error("Une erreur est survenue lors de l'ajout de la photo");
    }
  };

  // Component to display photos of an album
  const AlbumPhotos = ({ albumId }) => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/photos?idalbum=${albumId}`
          );
          const data = await response.json();
          setPhotos(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des photos:", error);
        }
      };

      fetchPhotos();
    }, [albumId]);



    

    return (
      <div style={{ padding: "2px", textAlign: "center", backgroundColor: "#ffffff" }}>
        <h2>Photos de l'album {albumId}</h2>
        <div className="photo-grid">
          {photos.map((photo) => (
            <img
              key={photo.idphoto}
              src={`data:image/jpeg;base64,${photo.attachedfile}`}
              alt={photo.namephoto}
              style={{ width: "200px", height: "150px", margin: "10px" }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2px', textAlign: 'center', backgroundColor: '#ffffff' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}>
        Albums
      </h1>
      <div>
        <Button
          onClick={() => setIsAddingAlbum(true)}
          style={{
            marginRight: '10px',
            fontSize: '18px',
            border: 'none',
            color: 'rgb(39, 39, 39)',
            fontWeight: 'bold',
          }}
        >
          <PlusOutlined /> Créer un album
        </Button>
        <Button
          onClick={() => setShowAlbums((prev) => !prev)}
          style={{ fontSize: '18px', border: 'none', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}
        >
          <EyeOutlined /> {showAlbums ? 'Cacher Albums' : 'Voir Albums'}
        </Button>
      </div>
    </div>
    <hr style={{ margin: '20px 0' }} />

    <Modal title="Ajouter un Album" open={isAddingAlbum} onCancel={() => setIsAddingAlbum(false)} footer={null}>
      <Input
        placeholder="Nom de l'album"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={handleAddAlbum} style={{ marginRight: '10px' }}>
          Sauvegarder
        </Button>
        <Button onClick={() => setIsAddingAlbum(false)}>Annuler</Button>
      </div>
    </Modal>

    {/* Afficher ce message si aucun album n'est affiché */}
    {!showAlbums && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '90px',
        }}
      >
        <img src="/images/album.jpg" width="30%" height="auto" alt="Album" />
        <Button
          onClick={() => setIsAddingAlbum(true)}
          style={{
            marginTop: '10px',
            backgroundColor: '#F8394D',
            fontFamily: "'Roboto', sans-serif",
            color: '#fff',
            padding: '23px 24px',
            fontSize: '18px',
            borderRadius: '30px',
          }}
        >
          Créer un album
        </Button>
        <h2 style={{ marginTop: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}>
          Les albums que vous créez s'affichent ici
        </h2>
      </div>
    )}

    {/* Afficher le contenu de l'album sélectionné */}
    {currentAlbum ? (
      <div style={{ marginTop: '20px' }}>
        <h2> {currentAlbum.namealbum} (ID: {currentAlbum.idalbum})</h2>
      
        <AddPhoto currentAlbum={currentAlbum} />
        <Button
  style={{ marginTop: '10px' }}
  className="btn-return" // Ajoute une classe pour le style
  onClick={() => setCurrentAlbum(null)} // Retourner à la liste des albums
>
  <span className="rocket-icon">🚀</span> {/* Icône fusée */}
Voir albums
</Button>

      </div>
    ) : (




      // Afficher les albums uniquement si aucun album spécifique n'est ouvert
    
    showAlbums && (
  <div className="album-container">
    {/* <h2 className="album-title">Les albums</h2> */}
    {albums.map((album) => (
      <div
        key={album.idalbum}
        onClick={() => setCurrentAlbum(album)} // Set current album on click
        className="album-card"
        style={{
          backgroundImage: `url(${album.backgroundImage})`, // Utilisez l'image de fond de chaque album
          backgroundSize: 'cover', // Assurez-vous que l'image couvre entièrement la carte
          backgroundPosition: 'center', // Centrez l'image
        }}
      >
        <h3>{album.namealbum}</h3>
        <button className="view-album-button">Voir l'album</button>
      </div>
    ))}
  </div>
)

      
    )}
  </div>
);
};


export default AlbumFamille;
