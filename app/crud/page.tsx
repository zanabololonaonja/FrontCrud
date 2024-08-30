"use client";
import React, { useState } from 'react';
import { IoIosUnlock } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './crud.css';

const FormPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas!');
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
          userlastname: lastName
        }),
      });

      const responseText = await res.text();
      if (res.ok) {
        const jsonData = JSON.parse(responseText);
        toast.success('Compte créé avec succès!');
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
        // Redirection ou action après connexion réussie
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.message || 'Échec de la connexion');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue est survenue.');
    }
  };

  return (
    <div className='full-screen'>
      <ToastContainer />
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
                    placeholder="Middle name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-field"
                    placeholder="Last name"
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
                  <input
                    type="password"
                    className="form-field"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="form-field"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
              <p className='titre1'>Log in to your Account</p>
                <hr />
                <form className="d-flex flex-column" onSubmit={handleSignInSubmit}>
                  <input type="email" className="form-field" placeholder="Email" name="email" required />
                  <input type="password" className="form-field" placeholder="Password" name="password" required />
                  <button type="submit" className="btn btn-primary mt-3">Log in</button>
                </form>
                <div className="mt-3">
                  <p className="mb-0 text-muted d-inline">
                    <IoIosUnlock style={{ display: 'inline', width: '27px', height: '22px' }} />
                    Forgot your password ?
                  </p>
                  <br /><br />
                  <p className="mb-0 text-muted d-inline">Don’t have an account ? </p>
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
