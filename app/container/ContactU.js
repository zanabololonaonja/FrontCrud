
import { Avatar, TextField, Button } from '@mui/material'; // Importer Material-UI

import './ContactU.css';

import React, { useEffect, useState,useRef} from 'react';
import emailjs from 'emailjs-com';
import { HiUser } from "react-icons/hi2";
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';

import AddIcon from '@mui/icons-material/Add';


function ContactCard({ onAdd, title, bgImage, userData }) {  
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mpass: '',
    relation: '',
    photo: null,
  });


  const [pin, setPin] = useState({
    digit1: '',
    digit2: '',
    digit3: '',
    digit4: '',
  });
  // Références pour les champs
  const digitRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("Etba5J10R84bbHQR2");
    console.log('EmailJS initialized');
  }, []);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Load contacts from localStorage on component mount
    const storedContacts = JSON.parse(localStorage.getItem(`contacts_${userData.iduser}`)) || [];
    setContacts(storedContacts);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('digit')) {
      // Vérifie si la valeur est un chiffre (0-9) ou vide
      if (/^\d?$/.test(value)) {
        setPin((prevPin) => {
          const newPin = {
            ...prevPin,
            [name]: value,
          };

          // Combine les chiffres du PIN après la mise à jour de l'état
          const combinedPin = `${newPin.digit1}${newPin.digit2}${newPin.digit3}${newPin.digit4}`;

          // Mettez à jour formData avec le PIN combiné
          setFormData((prevData) => ({
            ...prevData,
            nom: combinedPin, // Met à jour formData.nom avec le PIN combiné
          }));

          // Retourne le nouvel état
          return newPin;
        });

        // Si un chiffre est entré, déplacer le focus vers le champ suivant
        const currentDigitIndex = parseInt(name.charAt(name.length - 1)) - 1; // Récupère l'index actuel (0-3)
        if (value && currentDigitIndex < digitRefs.length - 1) {
          digitRefs[currentDigitIndex + 1].current.focus(); // Focus sur le champ suivant
        }
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const sendEmail = (contact) => {
    if (!userData.useremailaddress) {
      console.error("L'email de l'utilisateur n'a pas été trouvé.");
      return;
    }

    const templateParams = {
      to_name: contact.prenom,  // Prénom du destinataire
      from_name: userData.useremailaddress,  // Email de l'utilisateur
      to_email: contact.email,  // Email du destinataire
      message: ``
      // Vous pouvez laisser `message` vide, car tout est géré dans le modèle HTML ci-dessus
      ,
      relation: contact.relation,  // Relation du contact
      contact_name: contact.nom  // Nom du contact
    };
    
    

    emailjs.send('service_k58if4k', 'template_0trv6km', templateParams)
      .then((response) => {
        console.log('Email envoyé avec succès !', response.status, response.text);
      })
      .catch((err) => {
        console.error('Erreur lors de l’envoi de l’email:', err);
      });
  };

  const handleSubmit = async () => {
    if (!userData || !userData.iduser) {
      console.error('userData is undefined');
      alert("L'utilisateur n'est pas connecté.");
      return;
    }

    if (!formData.prenom || !formData.nom || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const data = new FormData();
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('email', formData.email);
    data.append('mpass', formData.mpass);
    data.append('relation', formData.relation);
    data.append('photo', formData.photo);
    data.append('iduser', userData.iduser);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        console.log('Utilisateur ajouté avec succès');
        const newContact = {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          mpass: formData.mpass,
          relation: formData.relation,
          photo: URL.createObjectURL(formData.photo),
        };
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        localStorage.setItem(`contacts_${userData.iduser}`, JSON.stringify(updatedContacts));
        setFormData({
          prenom: '',
          nom: '',
          email: '',
          mpass: '',
          relation: '',
          photo: null,
        });
        setIsAdding(false);
        setIsAdded(true);

        // Envoyer l'email après ajout
        sendEmail(newContact);
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l’ajout de l’utilisateur:", errorData.message);
        alert("Erreur lors de l’ajout de l’utilisateur: " + errorData.message);
      }
    } catch (err) {
      console.error('Erreur de communication avec le serveur:', err);
      alert('Une erreur s\'est produite lors de la communication avec le serveur.');
    }
  };

  return (
    <div
      className={`card ${isAdding ? 'slide-in' : 'slide-out'}`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '5',
        position: 'relative',
      }}
    >
      {!isAdding && !isAdded ? (
        <div
          className="card-start"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '42px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <h2 className="title">{title}</h2>
          <p className="phrase">
            C'est la personne la plus proche à qui vous pouvez confier tous vos testaments et arrangements funéraires.
          </p>
          <p className="phraseInfo">
            💬 Après avoir rempli le formulaire, un email sera envoyé à la personne que vous avez désignée comme contact d'urgence.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-returna"
            style={{
              alignContent: 'center',
            }}
          >
            <span className="rocket-icon">
              <AddIcon />
            </span>
            Ajout de contact
          </button>
        </div>
      ) : isAdding ? (
        <div className="card-form">
         <TextField
        label="Nom complet"
        name="prenom"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.prenom}
        onChange={handleInputChange}
        InputProps={{
          style: {
            fontWeight:  'bold' ,
          },
        }}
      />
      <p style={{
      
        paddingTop: '9px',
        marginBottom: '-18px',
        marginLeft: '-211px',
        color: '#555', 
      }}>
        Code
      </p>

      <div className="pin-container">
        {['digit1', 'digit2', 'digit3', 'digit4'].map((digit, index) => (
          <TextField
            key={digit}
            name={digit}
            variant="outlined"
            className="pin-input"
            value={pin[digit]}
            onChange={handleInputChange}
            inputProps={{ maxLength: 1 }}
            inputRef={digitRefs[index]}
            InputProps={{
              style: {
                fontWeight: 'bold' , // Met en gras si la case est remplie
              },
            }}
          />
        ))}
      </div>

      <TextField
        label="Email"
        name="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleInputChange}
        InputProps={{
          style: {
            fontWeight: 'bold' , // Met en gras si le champ est rempli
          },
        }}
      />
      <TextField
        label="Relation avec l'utilisateur"
        name="relation"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.relation}
        onChange={handleInputChange}
        InputProps={{
          style: {
            fontWeight:  'bold', // Met en gras si le champ est rempli
          },
        }}
      />
          <input
            type="file"  
            name="photo"   
            onChange={handleFileChange}
            accept="image/*"
          />

          <Button style={{marginTop:'22px'}}   variant="contained" color="secondary" onClick={handleSubmit}>
            Ajouter
          </Button>
        </div>
      ) : isAdded ? (
        <div className="contact-display" style={styles.contactDisplay}>
          {contacts.length > 0 ? (
            <div className="contact-item" style={styles.contactItem}>
              {contacts[contacts.length - 1].photo ? (
                <img
                  src={contacts[contacts.length - 1].photo}
                  alt={`${contacts[contacts.length - 1].prenom} ${contacts[contacts.length - 1].nom}`}
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.avatarPlaceholder}><HiUser /></div>
              )}
              <div style={styles.contactInfo}>
                <h3 style={styles.contactName}>
                  {contacts[contacts.length - 1].prenom}
                </h3>
                <br />
                <div style={styles.contactDetail}>
                  <div>
                    <p style={styles.label}>  <MailIcon style={styles.icon} /> Email:</p>
                    <p className="phraseContact">{contacts[contacts.length - 1].email || 'Non spécifié'}</p>
                  </div>
                </div>

                <div style={styles.contactDetail}>
                  <div>
                    <p style={styles.label}>  <LockIcon style={styles.icon} />
                      Code:</p>
                    <p className="phraseContact">{contacts[contacts.length - 1].nom || 'Non spécifié'}</p>
                  </div>
                </div>

                <div style={styles.contactDetail}>
                  <div>  
                    <p style={styles.label}> <PeopleIcon style={styles.icon} />
                      Relation:</p>
                    <p className="phraseContact">{contacts[contacts.length - 1].relation || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>   
          ) : (
            <p>Aucun contact trouvé.</p>
          )}
        </div>

      ) : null}
    </div>
  )
};


const styles = {

  contactItem: {
    display: 'flex',
    flexDirection: 'column', // Affiche les éléments en colonne
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: '150px', // Taille de l'image    
    height: '150px',
    borderRadius: '50%', // Arrondi l'image  
    marginBottom: '15px', // Espacement en bas de l'image
    border: '2px solid #f9f9f9', // Bordure autour de l'image
  },
  avatarPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '15px',
    border: '2px solid #f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'black',
    backgroundColor: '#f9f9f9',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    margin: '0',
    fontSize: '22px', // Augmenter la taille de la police pour le nom
    fontWeight: 'bold',
  },

  contactDetail: {

    alignItems: 'left',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  icon: {

    alignItems: 'left',
    color: ' #525253', // Couleur personnalisée pour l'icône
  },
  label: {
    fontWeight: 'bold',
    fontSize: '18px',

  },
};


// Main component ContactU
const ContactU = ({ userData }) => {  
  const contacts = [
    {
      title: 'Premier contact d\'urgence',
      // bgImage: '/images/bgg.webp',
    },  
    {
      title: 'Deuxième contact d\'urgence',
      // bgImage: '/images/bgggg.webp',
    },
    {
      title: 'Troisième contact d\'urgence',
      // bgImage: '/images/bg.webp',
    },
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
          userData={userData}
        />
      ))}
    </div>
  );
};

export default ContactU;
