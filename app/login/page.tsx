// app/login/page.tsx
"use client";

import React from "react"
import "./login.css"; // Assurez-vous que le chemin est correct

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify p-24">
      <h1 className="pconnex">Page de connexion</h1>
      <form>
        <label><br />
          Nom d'utilisateur :
          <input type="text" name="username" />
        </label>
        <br /><br />
        <label>
          Mot de passe :
          <input type="password" name="password" />
        </label><br />
        <br /><br />
        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
