"use client";
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    console.log('Données utilisateur reçues pour la connexion :', userData); // Vérification des données
    setUser(userData); // Enregistrer l'utilisateur dans le state
    localStorage.setItem('user', JSON.stringify(userData)); // Sauvegarder dans localStorage

    // Vérifier si l'utilisateur est bien sauvegardé
    console.log('Utilisateur enregistré dans localStorage :', localStorage.getItem('user'));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
