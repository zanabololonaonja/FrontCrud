"use client";
import React, { createContext, useState, useEffect } from 'react';

// Créez un contexte pour l'utilisateur
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    iduser: '',
    username: '',
    usermiddlename: '',
    userlastname: '',
    useremailaddress: ''
  });

  // Au démarrage, récupérez les données depuis localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  // Mettez à jour localStorage dès que userData change
  useEffect(() => {
    if (userData.iduser) {
      // Assurez-vous que userphoto est une chaîne de caractères
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        userphoto: typeof userData.userphoto === 'string' ? userData.userphoto : ''
      }));
    }
  }, [userData]);
  

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
