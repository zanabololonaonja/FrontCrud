import { Pool } from 'pg';
import multer from 'multer';
import nextConnect from 'next-connect';

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mlr1',
  password: 'onja',
  port: 5432,
});

// Configuration de multer pour gérer le téléchargement des fichiers
const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('userphoto'));

apiRoute.post(async (req, res) => {
  console.log('Received request:', req.body);
  const {
    iduser,
    idphone,
    useremailaddress,
    userpassword,
    username,
    usermiddlename,
    userlastname,
    typeofuser,
    besttimeforcall,
  } = req.body;

  const userphoto = req.file ? req.file.buffer : null;

  try {
    const query = `
      INSERT INTO users (
        iduser,
        idphone,
        useremailaddress,
        userpassword,
        username,
        usermiddlename,
        userlastname,
        typeofuser,
        userphoto,
        besttimeforcall
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      iduser,
      idphone,
      useremailaddress,
      userpassword,
      username,
      usermiddlename,
      userlastname,
      typeofuser,
      userphoto,
      besttimeforcall,
    ];

    console.log('Executing query with values:', values);
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Désactive le parser par défaut de Next.js
  },
};
