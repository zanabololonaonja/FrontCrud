"use client"; // Assurez-vous que c'est présent pour le rendu côté client
import React, { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        // Vous pouvez également ajouter du stockage local ici si nécessaire
    };

    const logout = () => {
        setUser(null);
        // Effacer le stockage local ici si nécessaire
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
