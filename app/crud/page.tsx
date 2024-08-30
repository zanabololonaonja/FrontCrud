
"use client";
import React, { useState } from 'react';
import { IoIosUnlock } from "react-icons/io";
import './crud.css';

const FormPage = () => {
  // State to toggle between Sign Up and Sign In
  const [isSignUp, setIsSignUp] = useState(true);

  // Function to toggle the form state
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (

          // inscription
          
    <div className='full-screen'>
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
                <form className="d-flex flex-column">
                  <input type="text" className="form-field" placeholder="Name" name="name" required />
                  <input type="text" className="form-field" placeholder="Middle Name" name="middleName" />
                  <input type="text" className="form-field" placeholder="Last Name" name="lastName" required />
                  <input type="email" className="form-field" placeholder="Email" name="email" required />
                  <input type="password" className="form-field" placeholder="Password" name="password" required />
                  <input type="password" className="form-field" placeholder="Confirm Password" name="confirmPassword" required />
                  <button type="submit" className="btn btn-primary mt-3">Sign up</button>
                </form>
                <div className="mt-3">
                  <p className="mb-0 text-muted d-inline"> Already have an account ? </p>
                  <button className="btn btn-secondary d-inline" onClick={toggleForm}>  Sign   in</button>
                </div>
              </>


             // Authentification

            ) : (
              <>
                <img
                  src="https://s3-alpha-sig.figma.com/img/a602/660f/a6b06dcc6d9cc369ee73988f7ed6658e?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Nds68SDPMwdwIQJoIwL1~tgDBvdqtkZijJbwmVfzwDgz8NNvbn2Q8s7kmmMLOb9BrmbeHq85WhkLqO3DT~ni0LNvbN86FMfI27IikZzc77TvZfNUV8rBWD7hmXTReBG4l93U8mB3nDZj34sc4lqSKtMii0nH6UlYDBGZHInrgnB96-u2yjqXkxo1o~8s3XD3VJ01drObbf9w2~MvrfsSBKBJBcpVVNS~VmjmDL0bP2aKVxb0EA0F6EEsnHh3eS9WJD7nzD2o4k74ODphDfeHvrmEclsgy84~iDKsdvOMu3wVp1l4vQsAdoIfHpC~UtFkJpZdCq4n2Mv4akx0GRE5sA__"
                  alt="Decorative"
                  className="img-logo"
                />
                <br />

                <p className='titre1'>Log in to your Account</p>
                <hr />
                <form className="d-flex flex-column">
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
