"use client"; 
import React, { useState, useEffect, useContext } from 'react';
import { IoIosUnlock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './crud.css'; 
import ClipLoader from "react-spinners/ClipLoader"; 
import { UserContext } from '../crud/UserContext'; // Vérifiez que ce chemin est correct
import emailjs from 'emailjs-com';

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

  const [nom, setNom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    emailjs.init("Etba5J10R84bbHQR2");
    console.log('EmailJS initialized');
  }, []);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };
  
  const handleSignUpSubmit = async (e) => {  
    e.preventDefault();  
    setError(''); 

    if (name === '' || middleName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
      toast.info('Tous les champs sont obligatoires'); 
      return;  
    } else if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas!');
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
      setUserData({
        iduser: data.user.id,
        username: data.user.username,
        userlastname: data.user.userlastname,
        usermiddlename: data.user.usermiddlename,
        useremailaddress: data.user.useremailaddress,
        userphoto: data.user.userphoto,
        typeofuser: 'owner',  // Définir explicitement comme propriétaire
      });

      localStorage.setItem('userData', JSON.stringify({ ...data.user, typeofuser: 'owner' }));

      console.log('L’utilisateur connecté est le propriétaire du compte.');

      setTimeout(() => {
        window.location.href = "/container";
      }, 1000);
    } else {
      alert('Erreur de connexion');
    }
  } catch (err) {
    console.error(err);
    alert('Une erreur est survenue');
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
// Authentification pour le contact d'urgence
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

        setTimeout(() => {
          window.location.href = "/container";  // Redirection vers la page principale
        }, 9000);
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
    setErrorMessage('Erreur lors de la connexion.');
  }
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
              src="https://s3-alpha-sig.figma.com/img/1a38/535c/3f9702934d3faeb1b8055c1bb981f014?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IL1PmGHEVdtcfuJiCDsnl2t~lYv76BQKvAauoS7egs1GFxDwKantHiwuFsdI5ibLOsNe0f7wt~YeYUax5TrxGaU5aG79X-nUDcMdqr~38waNjJOymh9Np00mPF5Rf-KSCFGsxVhtnA8~IRzULGYF0hi1WCnD-gFKP6CdVKzfB-igXPoxnZ0gj7-vj6oPklwDbzf~hAj0RRECgqWD3wKJg5ONoYtDjeqTXecaXWdM0~Pcs2dy0a2gZRxYlztqYLYUWRm-S6ow4s~HbczQE0j41gbUm4Zq3xWStW1ZFi4g74gXeQuKauOqsBAEx~5SLVi64U4QTU3hc-e-TRejZL2auQ__"
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
              {isSignUp ? (
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
                    <p className="mb-0 text-muted d-inline">Already have an account ?</p>
                    <button className="btn btn-secondary d-inline" onClick={toggleForm}>Sign in</button>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-secondary d-inline" onClick={openAuthForm}>
                      Contact d'urgence  
                    </button>   
                  </div>  
                  {/* Nouveau bouton pour l'authentification du contact d'urgence */}
                 
  
                  {/* Affichage conditionnel du formulaire d'authentification */}
                  {isAuthFormOpen && (  
                    <div style={{
                      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h2>Authentification Contact d'urgence</h2>
                      <form onSubmit={handleAuthSubmit}>
                        <div>
                          <label>Email :</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                          />
                        </div>
                        <div>
                          <label>Mot de passe (PIN) :</label>
                          <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                          />
                        </div>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>
                          Se connecter
                        </button>
                        <button onClick={closeAuthForm} style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '10px' }}>
                          Annuler
                        </button>
                      </form>
                    </div>
                  )}
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
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      </div>
                    </div>
                    <p className="text-danger">{error}</p>
                    <button className="btn btn-primary" type="submit">Sign In</button>
                  </form>
                  <div className="mt-3">
                    <p className="mb-0 text-muted d-inline">Don't have an account ? </p>
                    <button className="btn btn-secondary d-inline" onClick={toggleForm}> Sign up</button>
                  </div>
                 
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FormPage;