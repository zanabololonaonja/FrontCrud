import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir axios installé pour les requêtes HTTP

const FiniTestament = ({ iduser }) => {
  const [testaments, setTestaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour récupérer les testaments de l'utilisateur
  const fetchTestaments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/testaments/${iduser}`); // Appel à l'API pour récupérer les testaments
      setTestaments(response.data); // Stocker les testaments dans l'état
      setLoading(false); // Arrêter le chargement
    } catch (err) {
      setError('Erreur lors de la récupération des testaments.');
      setLoading(false);
    }
  };

  // useEffect pour lancer la récupération lors du montage du composant
  useEffect(() => {
    if (iduser) {
      fetchTestaments(); // Appeler la fonction pour récupérer les testaments
    }
  }, [iduser]);

  if (loading) {
    return <div>Chargement des testaments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>MON TESTAMENT</h1>
      {testaments.length > 0 ? (
        testaments.map((testament) => (
          <div key={testament.idtestament} style={{ marginBottom: '20px' }}>
            <h2>Testament de {testament.nom_testateur}</h2>
            SSS
            {/* Affiche d'autres informations du testament selon les besoins */}
          </div>
        ))
      ) : (
        <p>Aucun testament trouvé pour cet utilisateur.</p>
      )}
    </div>
  );
};

export default FiniTestament;
