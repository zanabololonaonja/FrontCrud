import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

const EmergencyContactAuth = ({ toggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nom }),  // Utilisation de l'email et du nom pour l'authentification
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Vérifier ce que l'API retourne
        console.log('Données de réponse:', data); // Affiche les données complètes de l'API
  
        const { contact, owner } = data;
  
        if (owner) {
          // Stocker les données du contact d'urgence et celles du propriétaire
          localStorage.setItem('userData', JSON.stringify({
            ...data.contact,
            typeofuser: 'emergency_contact',
            ownerId: owner.iduser,  // Ajoutez l'ID du propriétaire ici
            ownerData: owner,  // Stockez les autres données du propriétaire
          }));
  
          // Affichage du iduser du propriétaire dans la console
          console.log('ID du propriétaire:', owner.iduser);
          console.log('Informations du propriétaire:', owner);
          Swal.fire({
            title: 'Loading in progress...',
            // html: 'Chargement en cours. Veuillez patienter.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
              // Redirection manuelle
              window.location.href = "/container";
            }
          });
    
          // Garder Swal ouvert jusqu'à ce que la page cible soit complètement chargée
          window.onload = () => {
            Swal.close(); // Fermer l'alerte une fois la page chargée
          };
    
  
          // setTimeout(() => {
          //   window.location.href = "/container";  // Redirection vers la page principale
          // });
        } else {
          console.error('Les informations du propriétaire ne sont pas disponibles.');
        }
  
        closeAuthForm();  // Ferme le formulaire d'authentification
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);  // Affiche le message d'erreur de l'API
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setErrorMessage('');
    }
  };
  
    

  return (
    <div className="form-container">
      <img src="/images/LOGO.png" alt="Decorative" className="img-logo" />
      <br />
      <p className='titre1'>Emergency contact</p>
      <hr />
      <form onSubmit={handleAuthSubmit}>
        <div>
        
          <input
            type="email"
            className="form-field"
              placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
         
          <input
            type="text"
               placeholder="code"
            value={nom}
            className="form-field"
            onChange={(e) => setNom(e.target.value)}
            required
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" className="btn btn-primary" >
          Se connecter
        </button>
      </form>
      <div className="mt-3">
        <p className="mb-0 text-muted d-inline">Already have an account?</p>
        <button className="btn btn-secondary d-inline" onClick={onClose}>
        Sign in
        </button>
      </div>
      <div className="mt-3">
        <p className="mb-0 text-muted d-inline">Don't have an account?</p>
        <button className="btn btn-secondary d-inline" onClick={onClose}>
        Sign up
        </button>
      </div>
    </div>
  );
};

export default EmergencyContactAuth;