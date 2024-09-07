"use client";
import React, { useState, useEffect } from 'react';
import { IoIosUnlock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './crud.css'; // Ensure your spinner styles are included here
import ClipLoader from "react-spinners/ClipLoader"; // Assuming you use this spinner component
// Importez EmailJS
import emailjs from 'emailjs-com';

const FormPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for spinner visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    emailjs.init("Etba5J10R84bbHQR2"); // Remplacez par votre clé publique EmailJS
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

        // Envoyer l'email de bienvenue
      
    // Configurez les paramètres pour l'email à envoyer
      // Envoyer l'email de bienvenue
      // Envoyer l'email de bienvenue
      const templateParams = {
        to_name: `${name} ${lastName}`, // Nom complet de l'utilisateur
        to_email: email, // Email saisi par l'utilisateur dans le formulaire
        from_name: 'My Life Legacy DB', // Nom de l'application ou un nom générique
        reply_to: email // Utilisé pour définir l'adresse de retour
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

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show the spinner

    // Validate form fields
    if (!email || !password) {
      toast.error('Tous les champs doivent être remplis!');
      setLoading(false);
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

      const responseText = await res.text();
      if (res.ok) {
        const jsonData = JSON.parse(responseText);
        toast.success('Connexion réussie!');
        setEmail('');
        setPassword('');
        setLoading(false);
        window.location.href = "/login"; // Redirect after hiding spinner
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.message || 'Échec de la connexion');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue est survenue.');
      setLoading(false);
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
                <img
                  src="https://s3-alpha-sig.figma.com/img/a602/660f/a6b06dcc6d9cc369ee73988f7ed6658e?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Nds68SDPMwdwIQJoIwL1~tgDBvdqtkZijJbwmVfzwDgz8NNvbn2Q8s7kmmMLOb9BrmbeHq85WhkLqO3DT~ni0LNvbN86FMfI27IikZzc77TvZfNUV8rBWD7hmXTReBG4l93U8mB3nDZj34sc4lqSKtMii0nH6UlYDBGZHInrgnB96-u2yjqXkxo1o~8s3XD3VJ01drObbf9w2~MvrfsSBKBJBcpVVNS~VmjmDL0bP2aKVxb0EA0F6EEsnHh3eS9WJD7nzD2o4k74ODphDfeHvrmEclsgy84~iDKsdvOMu3wVp1l4vQsAdoIfHpC~UtFkJpZdCq4n2Mv4akx0GRE5sA__"
                  alt="Decorative"
                  className="img-logo"
                />
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
                      type={showPassword ? "text" : "password"}  // Bascule entre le type text et password
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
                  <div className="password-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}  // Bascule entre le type text et password
                      className="form-field"
                      placeholder="Confirmer le mot de passe"
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
                  <button className="btn btn-secondary d-inline" onClick={toggleForm}>Sign in </button>
                </div>
              </>
                 
            ) : (
              <>
                <br />
                <img
                  src="https://s3-alpha-sig.figma.com/img/a602/660f/a6b06dcc6d9cc369ee73988f7ed6658e?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Nds68SDPMwdwIQJoIwL1~tgDBvdqtkZijJbwmVfzwDgz8NNvbn2Q8s7kmmMLOb9BrmbeHq85WhkLqO3DT~ni0LNvbN86FMfI27IikZzc77TvZfNUV8rBWD7hmXTReBG4l93U8mB3nDZj34sc4lqSKtMii0nH6UlYDBGZHInrgnB96-u2yjqXkxo1o~8s3XD3VJ01drObbf9w2~MvrfsSBKBJBcpVVNS~VmjmDL0bP2aKVxb0EA0F6EEsnHh3eS9WJD7nzD2o4k74ODphDfeHvrmEclsgy84~iDKsdvOMu3wVp1l4vQsAdoIfHpC~UtFkJpZdCq4n2Mv4akx0GRE5sA__"
                  alt="Decorative"
                  className="img-logo"
                />
                <br />
                <p className='titre1'>Sign in</p>
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
                      type={showPassword ? "text" : "password"}  // Bascule entre le type text et password
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
                  <p className="mb-0 text-muted d-inline">Don't have an account ?</p>
                  <button className="btn btn-secondary d-inline" onClick={toggleForm}>Sign up</button>
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
