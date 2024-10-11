import React, { useState } from 'react';
import {  Avatar,TextField, Button } from '@mui/material'; // Importer Material-UIù

import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import './ContactU.css';

const ContactCard = ({ onAdd, title, bgImage, userData }) => {
   
  const [isAdding, setIsAdding] = useState(false); // Pour montrer ou cacher le formulaire
  const [isEditing, setIsEditing] = useState(true); // Pour basculer entre formulaire et profil
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mpass: '',
    relation: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };   

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0], // Met à jour le fichier sélectionné
    });
  };

 const handleSubmit = async () => {
  onAdd(formData);
  setIsEditing(false);
    const data = new FormData();
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('email', formData.email);
    data.append('mpass', formData.mpass);
    data.append('relation', formData.relation);
    data.append('photo', formData.photo);
    // data.append('iduser', iduser);  // Ajout de l'iduser

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        console.log('Utilisateur ajouté avec succès');
      } else {
        console.error('Erreur lors de l’ajout de l’utilisateur');
      }
    } catch (err) {
      console.error('Erreur de communication avec le serveur:', err);
    }
  };


  return (
   
      <div
      className={`card ${isEditing ? 'slide-in' : 'slide-out'}`}
      style={{
        backgroundImage: !isAdding && bgImage ? `url(${bgImage})` : 'none',  // Afficher l'image de fond uniquement si !isAdding
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity:'5',   
        position: 'relative',
      }}
    > 
        {!isAdding ? (
           <div
           className="card-start"
           style={{
             backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Overlay gris blanchâtre semi-transparent
             padding: '42px', // Pas de marge
             position: 'absolute', // Couvre toute l'image
             top: 0, // Alignement au haut
             left: 0, // Alignement à gauche   
             right: 0, // Alignement à droite   
             bottom: 0, // Alignement en bas
             zIndex: 1,  // Assurer que le contenu  est au-dessus de l'image floutée
           }}   
         >
         
            <h2 className="title">{title}</h2>
            <p className='phrase'>C'est la personne la plus proche à qui vous pouvez confier tous vos testaments et arrangements funéraires.</p>
            <p className='phraseInfo'> 💬   Après avoir rempli le formulaire un email sera envoyé à la personne que vous avez désignée comme contact d'urgence.</p>
            
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-returna"    style={{
              alignContent:'center',  
              }}
            >
              <span className="rocket-icon"><AddIcon /></span> {/* Icône d'ajout */}
              Ajout de contact
            </button>
          </div>
          
        ) : isEditing ? (  
          <div className="card-form">
          <TextField
            label="Prénom"
            name="prenom"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.prenom}
            onChange={handleInputChange}
          />
          <TextField
            label="Nom"
            name="nom"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.nom}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Mot de passe"
            name="mpass"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.mpass}
            onChange={handleInputChange}
          />
          <TextField
            label="Relation avec l'utilisateur"
            name="relation"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.relation}
            onChange={handleInputChange}
          />
          
          {/* Champ de téléchargement de fichier */}
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
          />
    
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Ajouter
          </Button>
        </div>
        ) : (
          <div className="card-info">

<Avatar
                src={formData.photo} // Chemin de la photo de profil
                alt={`${formData.prenom} ${formData.nom}`}
                sx={{ width: 100, height: 100, margin: '0 auto' }}
              />
              {/* Nom et prénom en bas de la photo */}
              <h3 style={{ textAlign: 'center', marginTop: '10px' }}>
                {formData.prenom} {formData.nom}
              </h3>

           
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon style={{ marginRight: '5px' }} />
                {formData.email}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon style={{ marginRight: '5px' }} />
                {formData.mpass}
              </p>

              {/* Relation avec l'utilisateur avec icône */}
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinkIcon style={{ marginRight: '5px' }} />  
                {formData.relation}   
              </p>
          </div>
        )}
      </div>
    );
  };
  
  
  const ContactU = () => {
    const contacts = [
        { 
          title: 'Premier contact d\'urgence', 
          bgImage: '/images/bgg.webp', 
          style: {
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }    
        },
        { 
          title: 'Deuxième contact d\'urgence',    
          style: {
            color: 'white',
            fontSize: '2rem', 
          } ,    
          bgImage: '/images/bgggg.webp',   
         
        },
        { 
          title: 'Troisième contact d\'urgence', 
          bgImage: '/images/bg.webp', 
          style: {
            color: 'white', 
            fontSize: '2rem',
          }    
        }     
      ];   
  
    const handleAddContact = (data) => {
      console.log('Contact ajouté:', data);      
    };
  
    return (
      <div className="cards-container">
        {contacts.map((contact, index) => (
          <ContactCard 
            key={index} 
            title={contact.title} 
            bgImage={contact.bgImage} 
            onAdd={handleAddContact}
            // Passer les autres props nécessaires 
          />
        ))}
      </div>
    );
  };
  
  export default ContactU;