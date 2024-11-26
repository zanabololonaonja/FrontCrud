"use client";
import React, { useState, useEffect, useContext } from 'react';
import { IoIosUnlock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'
import 'react-toastify/dist/ReactToastify.css';
import './crud.css';
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from '../crud/UserContext'; // Vérifiez que ce chemin est correct
import emailjs from 'emailjs-com';
import EmergencyContactAuth from './EmergencyContactAuth'; // Assure-toi que le chemin est correct


const FormPage = () => {
  const { setUserData } = useContext(UserContext);
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [contactAuthVisible, setContactAuthVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nom, setNom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    emailjs.init("Etba5J10R84bbHQR2");
    console.log('EmailJS initialized');
  }, []);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name === '' || middleName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
      toast.info('Tous les champs sont obligatoires');
      return;
    } else if (password !== confirmPassword) {
      toast.error('The passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useremailaddress: email,
          userpassword: password,
          username: name,
          usermiddlename: middleName,
          userlastname: lastName,
        }),
      });
      const responseText = await res.text();
      if (res.ok) {
        const jsonData = JSON.parse(responseText);
        toast.success('Compte créé avec succès!');

        const templateParams = {
          to_name: `${name} ${lastName}`,
          to_email: email,
          from_name: 'My Life Legacy DB',
          reply_to: email,
        };

        emailjs.send('service_k58if4k', 'template_i1w40wi', templateParams, 'Etba5J10R84bbHQR2')
          .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            toast.success('Email envoyé avec succès à ' + email);
          }, (error) => {
            console.error('FAILED...', error);
            toast.error('Échec de l\'envoi de l\'email.');
          });

        setName('');
        setMiddleName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        toggleForm();
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.message || 'Échec de la création du compte');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue est survenue.');
    }
  };



  // Authentification pour le propriétaire de compte
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setEmailError(false);
    setPasswordError(false);
    setErrorMessage('');
  
    if (email === '' || password === '') {
      // Vérifier si les champs sont vides
      setEmailError(email === '');
      setPasswordError(password === '');
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok && data.user) {
        // Mettre à jour les données utilisateur
        setUserData({
          iduser: data.user.id,
          username: data.user.username,
          userlastname: data.user.userlastname,
          usermiddlename: data.user.usermiddlename,
          useremailaddress: data.user.useremailaddress,
          userphoto: data.user.userphoto,
          typeofuser: 'owner', // Définir explicitement comme propriétaire
        });
  
        // Stocker les données utilisateur dans localStorage
        localStorage.setItem('userData', JSON.stringify({ ...data.user, typeofuser: 'owner' }));
  
        console.log('L’utilisateur connecté est le propriétaire du compte.');
  
        // Afficher le Swal en attendant la redirection et le chargement de la page
        Swal.fire({
          title: 'Ouverture de la page...',
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
  
      } else {
        // Marquer les champs comme invalides
        setEmailError(true);
        setPasswordError(true);
        setErrorMessage('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('');
    }
  };
  

  // Fonction pour ouvrir le formulaire d'authentification
  const openAuthForm = () => {
    setIsAuthFormOpen(true);
  };

  // Fonction pour fermer le formulaire d'authentification
  const closeAuthForm = () => {
    setIsAuthFormOpen(false);
    setEmail('');
    setNom('');
    setErrorMessage('');
  };

  // Authentification pour le contact d'urgence
  // Authentification pour le contact d'urgence
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setContactAuthVisible(false); // Masquer le formulaire de contact d'urgence
  };

  const handleContactAuthClick = () => {
    setContactAuthVisible(true); // Afficher le formulaire de contact d'urgence
  };

  // Fonction pour fermer le formulaire de contact d'urgence
  const handleEmergencyContactClose = () => {
    setContactAuthVisible(false);
  };

  return (
    <div className='full-screen'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="body d-md-flex align-items-center justify-content-between">
        <div className="box-1">
          <img
            src="/images/autent.jpg"
            alt="Decorative"
            className="img-fluid"
          />
        </div>
        <div className="box-2">
          <div className="form-container">
            {loading && (
              <div className="spinner-overlay">
                <ClipLoader color="#000000" loading={loading} size={50} />
              </div>
            )}
            {!contactAuthVisible ? (
              isSignUp ? (
                <>
                  <br />
                  <img src="/images/LOGO.png" alt="Decorative" className="img-logo" />
                  <br />
                  <p className='titre1'>Create an account</p>
                  <hr />
                  <form className="d-flex flex-column" onSubmit={handleSignUpSubmit}>

                    <input
                      type="text"
                      className="form-field"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-field"
                      placeholder="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-field"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      className="form-field"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-field"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </div>
                    </div>
                    <div className="password-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-field"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Sign up</button>
                  </form>
                  {error && <div className="error">{error}</div>}
                  <div className="mt-3">
                    <p className="mb-0 text-muted d-inline">Already have an account?</p>
                    <button className="btn btn-secondary d-inline" onClick={toggleForm}>Sign in</button>
                  </div>
                  <div className="mt-3">

                    <button className="btn btn-secondary d-inline" onClick={handleContactAuthClick}>Emergency contact</button> {/* Bouton pour afficher le contact d'urgence */}
                  </div>
                </>
              ) : (
                <>
                  <br />
                  <img src="/images/LOGO.png" alt="Decorative" className="img-logo" />
                  <br />
                  <p className='titre1'>Log in to your Account</p>
                  <hr />
                  <form className="d-flex flex-column" onSubmit={handleSignInSubmit}>
                    <input
                      type="email"
                      className={`form-field ${emailError ? 'input-error' : ''}`}
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {/* {emailError && <p className="error-message">Veuillez entrer un email valide.</p>} */}

                    <div className="password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-field ${passwordError ? 'input-error' : ''}`}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </div>
                    </div>
                    {/* {passwordError && <p className="error-message">Veuillez entrer un mot de passe valide.</p>} */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className="text-danger">{error}</p>
                    <button className="btn btn-primary" type="submit">Sign In</button>
                  </form>
                  <div className="mt-3">
                    <p className="mb-0 text-muted d-inline">Don't have an account?</p>
                    <button className="btn btn-secondary d-inline" onClick={toggleForm}>Sign up</button>
                  </div>
                  <div className="mt-3">

                    <button className="btn btn-secondary d-inline" onClick={handleContactAuthClick}>Emergency contact</button> {/* Bouton pour afficher le contact d'urgence */}
                  </div>
                </>
              )
            ) : (
              <EmergencyContactAuth onClose={handleEmergencyContactClose} />
            )}
          </div>  
        </div>
      </div>
    </div>
  );
};

export default FormPage;