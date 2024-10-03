import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Importer l'icône d'information
// import CemeteryIcon from '@mui/icons-material/AccountBalance';
// import CloseIcon from '@mui/icons-material/Close';
import { GiCoffin } from 'react-icons/gi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, IconButton } from '@mui/material';
import ArrangementsDisplay from './ArrangementsDisplay';

function ArrangementsF({ userData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [arrangements, setArrangements] = useState([]);
  const [formData, setFormData] = useState({
    typefunerailles: '',
    lieuCeremonie: '',
    typeCeremonie: '',
    lieuDeces: '',
    transportDistance:'',
    typeVehicule: '',
    typeCercueil: '',
    typeUrne: '',
    soinsPresentation: false,
    fleurs: '',
    organisation_ceremonie: '',
    lieuRepos: '',
    concessionDuree: '',
    messagePersonnel: ''
  });

  const steps = ['Type de funérailles',
     'la veillée funèbre', 
     'Cercueil ou urne', 
     'Organisation de la cérémonie',
      'Lieu de repos', 
    'Autres souhaits',
     'Récapitulatif'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const submissionData = {
      ...formData,
      soinsPresentation: formData.soinsPresentation === 'true', // Conversion en booléen
      organisation_ceremonie: formData.organisation_ceremonie === 'true', // Assurez-vous que ce champ est un booléen
      iduser: userData.iduser,
    };
  
    console.log("Soumission des données:", submissionData); // Débogage
  
    // Validation pour s'assurer que les champs obligatoires sont remplis
    if (!formData.typefunerailles || !formData.lieuDeces) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      // Vérifiez si la réponse est correcte
      if (!response.ok) {
        const errorData = await response.json(); // Récupérez les données d'erreur si disponible
        alert('Erreur lors de la soumission : ' + errorData.message);
        return; // Sortie si la réponse n'est pas OK
      }
  
      const data = await response.json(); // Attendez que la réponse soit convertie en JSON
      console.log("Réponse du serveur:", data); // Pour déboguer
  
      if (data.status === 'success') {
        alert('Estimation ajoutée avec succès');
      } 
      else {
        alert('Estimation ajoutée avec succès');
      }
      
    //   else {
    //     alert('Erreur lors de l\'ajout : ' + data.message);
    //   }
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('Une erreur s\'est produite lors de la soumission');
    }
  };


  const [showArrangements, setShowArrangements] = useState(false);


  const handleViewArrangements = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/recapitulatif/${userData.iduser}`);
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erreur lors de la récupération des arrangements : ' + errorData.message);
            return;
        }

        const data = await response.json();

        // Comme data est un tableau, prends le premier élément
        const arrangementsData = data[0]; 

        // Affiche les détails dans une alerte
        alert(`Détails des arrangements :
            Type de funérailles : ${arrangementsData.typefunerailles}
            Lieu de décès : ${arrangementsData.lieudeces}
            Distance de transport : ${arrangementsData.transportdistance} km
            Type de véhicule : ${arrangementsData.typevehicule}
            Type de cercueil : ${arrangementsData.typecercueil}
            Type d'urne : ${arrangementsData.typeurne || 'Non spécifié'}
            Fleurs : ${arrangementsData.fleurs || 'Non spécifié'}
            Organisation de la cérémonie : ${arrangementsData.organisation_ceremonie ? "Oui" : "Non"}
             ceremonie : ${arrangementsData.lieuceremonie}
         
          typeceremonie : ${arrangementsData.typeceremonie}
            Lieu de repos : ${arrangementsData.lieu_repos}
            Durée de la concession : ${arrangementsData.concession_duree} ans
            Message personnalisé : ${arrangementsData.message_personnel || 'Non spécifié'}`);

        // Met à jour l'état avec les données récupérées
        setArrangements(arrangementsData); 
        setShowArrangements(true); // Affiche l'interface des arrangements
    } catch (error) {
        console.error('Erreur lors de la récupération des arrangements :', error);
        alert('Il faut d\'abord compléter les étapes de l\'arrangement funéraire.');
    }
};

  
const handleCloseArrangements = () => {
  setShowArrangements(false); // Ferme le composant ArrangementsDisplay
};


const [open, setOpen] = useState(false); // État pour ouvrir/fermer le cadre explicatif

const handleToggle = () => {
  setOpen(!open); // Ouvrir/fermer le cadre au clic
};

  
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
            padding: '20px'
          }}
        >
          <FormControl component="fieldset" sx={{ textAlign: 'center', width: '50%' }}>
            {/* Contenu principal de la question avec explication en bas */}
            <FormLabel
              component="legend"
              style={{
            marginLeft:'220px',
                fontSize: '20px',
                border: 'none',
                color: 'rgb(39, 39, 39)',
                fontWeight: 'bold',
                marginBottom: '10px',
                display: 'block'
              }}
            >
              Type de funérailles
            </FormLabel>
            
            {/* Explication encadrée avec icône et flèche */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                width: '100%'
              }}
            >
              {/* Icône d'information */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
                <span style={{ fontSize: '14px', color: 'grey' }}>
                  Quelle est la différence entre l'inhumation et la cremation?
                </span>
              </Box>
        
              {/* Bouton pour ouvrir/fermer les explications */}
              <IconButton onClick={handleToggle}>
                <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </IconButton>
            </Box>
        
            {/* Contenu des explications dans un cadre repliable */}
            <Collapse in={open}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  // backgroundColor: '#f0f0f0',
                  padding: '15px',
                  marginTop: '10px',
                  textAlign: 'left'
                }}
              >
                <p style={{ margin: '0' }}>
                <span style={{ color:'#222222',fontWeight:'bold' }}> L’inhumation </span>  consiste à déposer le cercueil d’un défunt au cimetière en pleine terre, dans un caveau. 
                <br />
                <span style={{ color:'#222222',fontWeight:'bold'  }}>  La crémation </span>
               , elle, consiste à réduire en cendres le corps du défunt et son cercueil dans un crématorium.     </p>
              </Box>
            </Collapse>
        
            {/* Boutons radio pour les choix, placés en bas */}
            <RadioGroup
              name="typefunerailles"
              value={formData.typefunerailles}
              onChange={handleChange}
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px',fontWeight:'bold',fontSize:'19px' }}
            >
              <FormControlLabel
                value="inhumation"
                control={<Radio />}
                label="Inhumation"
                style={{ fontWeight:'bold',fontSize:'19px' }}
    
                sx={{ marginRight: '20px' }}
              />
              <FormControlLabel
                value="cremation"
                control={<Radio />}
                label="Crémation"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        );
  
      case 1:
        return (
          <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px',
      }}
    >
      {/* Première question : Lieu de la veillée funèbre */}
      <Box
        sx={{
          width: '80%',
          padding: '20px',
         
      
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Question principale */}
        <FormLabel
          component="legend"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'rgb(39, 39, 39)',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          Où souhaitez-vous que la veillée funèbre ait lieu ?
        </FormLabel>

        {/* Cadre avec icône d'information et explication */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* Icône d'information et titre */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
            <span style={{ fontSize: '14px', color: 'grey' }}>
              Explication sur le lieu de la veillée funèbre
            </span>
          </Box>

          {/* Bouton pour ouvrir/fermer les explications */}
          <IconButton onClick={handleToggle}>
            <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </IconButton>
        </Box>

        {/* Contenu des explications repliables */}
        <Collapse in={open}>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '15px',
              marginTop: '10px',
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
            }}
          >
            <p style={{ margin: '0' }}>
            Le moment où le corps du défunt est placé dans sa maison ou dans un autre lieu,
             et où les proches viennent lui rendre visite avant la cérémonie funéraire, s'appelle la veillée funèbre.
            </p>
          </Box>
        </Collapse>

        {/* Champ de texte en bas */}
        <TextField
          label="Dans ma maison ou dans un autre lieu"
          name="lieuDeces"
          value={formData.lieuDeces}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ marginTop: '20px' }}
        />
      </Box>

      {/* Deuxième section : Durée de la veillée funèbre */}
      <Box
        sx={{
          width: '80%',
          padding: '20px',
        
         
          position: 'relative',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <FormLabel
          component="legend"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'rgb(39, 39, 39)',
            textAlign: 'center',
          }}
        >
          Combien de temps souhaitez-vous que la veillée funèbre dure ?
        </FormLabel>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* Icône d'information et titre */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
            <span style={{ fontSize: '14px', color: 'grey' }}>
              Explication de temps dela veillée funèbre
            </span>
          </Box>

          {/* Bouton pour ouvrir/fermer les explications */}
          <IconButton onClick={handleToggle}>
            <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </IconButton>
        </Box>

        {/* Contenu des explications repliables */}
        <Collapse in={open}>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '15px',
              marginTop: '10px',
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
            }}
          >
            <p style={{ margin: '0' }}>
            C'est un temps de recueillement, souvent marqué par des prières, des chants ou des discours, 
            où la famille et les amis se rassemblent pour honorer le défunt et lui rendre un dernier hommage avant les obsèques.
            </p>
          </Box>
        </Collapse>

        <TextField
          label="(en heures)"
          name="transportDistance"
          value={formData.transportDistance}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ marginTop: '10px' }}
        />
      </Box>
    </Box>
        );
  
      case 2:
        return (
                
          <Box
          
          
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px',
          }}>   
 <br /> 
           <FormLabel
          component="legend"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'rgb(39, 39, 39)',
            display: 'block',
            marginBottom: '10px',
            marginTop:'33px',
          }}
        >Quelle gamme de cercueil souhaitez-vous ?

        </FormLabel>  




{/* Conteneur pour les 4 cadres */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',  // Les cadres sont espacés horizontalement
  marginTop: '20px',
}}>

  {/* Premier cadre */}
  <div style={{
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '22%',  // Chaque cadre prend environ 1/4 de la largeur
  }}>
    <img src="/images/cercueil1.jpg" alt="Cercueil économique" style={{ width: '100%', height: 'auto' }} />
    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Gamme Tradition</p>
  </div>

  {/* Deuxième cadre */}
  <div style={{
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '22%',
  }}>
    <img src="/images/CERCUEIL-SEATTLE.jpg" alt="Cercueil standard" style={{ width: '100%', height: 'auto' }} />
    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Gamme Élégance</p>
  </div>

  {/* Troisième cadre */}
  <div style={{
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '22%',
  }}>
    <img src="/images/C2.jpg" alt="Cercueil de luxe" style={{ width: '100%', height: 'auto' }} />
    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Gamme Économique</p>
  </div>

  {/* Quatrième cadre */}
  <div style={{
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '22%',
  }}>
    <img src="/images/C4.jpg" alt="Cercueil premium" style={{ width: '100%', height: 'auto' }} />
    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Gamme de capitons</p>
  </div>

</div>
<TextField
  label="Type de cercueil"
  name="typeCercueil"
  value={formData.typeCercueil}
  onChange={handleChange}
  style={{ width: '76%' }}  
  margin="normal" 
/>


      {/* Première question : Lieu de la veillée funèbre */}
      <Box
        sx={{
          width: '80%',
          padding: '20px',
         
      
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Question principale */}
        <FormLabel
          component="legend"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'rgb(39, 39, 39)',
            display: 'block',
            marginBottom: '10px',
            marginTop:'53px',
          }}
        >Quel type de véhicule funéraire préférez-vous pour transporter le cercueil 
        </FormLabel>

        {/* Cadre avec icône d'information et explication */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* Icône d'information et titre */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
            <span style={{ fontSize: '14px', color: 'grey' }}>
              Explication sur le lieu de la veillée funèbre
            </span>
          </Box>

          {/* Bouton pour ouvrir/fermer les explications */}
          <IconButton onClick={handleToggle}>
            <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </IconButton>
        </Box>

        {/* Contenu des explications repliables */}
        <Collapse in={open}>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '15px',
              marginTop: '10px',
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
            }}
          >
            <p style={{ margin: '0' }}>
            Le véhicule funéraire, souvent appelé corbillard, est spécialement conçu pour le transport
             du défunt entre les différents lieux du service funéraire. Il assure une fonction solennelle et respectueuse, transportant le cercueil depuis le domicile, l’hôpital, ou la chambre funéraire vers l’église, le cimetière ou le crématorium.
            
            </p>
          </Box>
        </Collapse>

        <TextField    
              label="le véhicule qui portera le cercueil "    
              name="typeVehicule"
              value={formData.typeVehicule}      
              onChange={handleChange}  
              fullWidth
              margin="normal"
            />
      </Box>


      

<FormLabel
          component="legend"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'rgb(39, 39, 39)',
            display: 'block',
            marginBottom: '10px',
            marginTop:'53px',
          }}
        >Quelle Type d'urne souhaitez-vous ?

        </FormLabel>  
<TextField
  label="Type d'urne (si crémation)"
  name="typeUrne"
  value={formData.typeUrne}
  onChange={handleChange}
  style={{ width: '76%' }}  
  margin="normal" 
/>



<br /> <br /> <br />
          </Box>
        );
  
      case 3:
        return (
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centre horizontalement
            justifyContent: 'center', // Centre verticalement
            width: '100%',
            padding: '20px',
          }}
        >
          <FormControl component="fieldset" sx={{ textAlign: 'center' }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'rgb(39, 39, 39)',
                marginBottom: '10px',
              }}
            >
              Souhaitez-vous organiser une cérémonie ?
            </FormLabel>
            <RadioGroup
              name="organisation_ceremonie"
              value={String(formData.organisation_ceremonie)} // Convertir en string pour les boutons radio
              onChange={handleChange}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} // Aligner les boutons radio au centre
            >
              <FormControlLabel value="true" control={<Radio />} label="Oui" />
              <FormControlLabel value="false" control={<Radio />} label="Non" />
            </RadioGroup>
          </FormControl>
        
          {formData.organisation_ceremonie && (
            <Box
              sx={{
                width: '80%',
                padding: '20px',
                textAlign: 'center', // Centrer le texte
                marginTop: '20px',
              }}
            >
              <FormLabel
                component="legend"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgb(39, 39, 39)',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                Lieu de la cérémonie ?
              </FormLabel>
              <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    width: '76%', // Ajuster la largeur pour correspondre au TextField
    margin: '0 auto', // Centrer le contenu
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
    <span style={{ fontSize: '14px', color: 'grey' }}>
      Explication lieu cérémonie
    </span>
  </Box>

  <IconButton onClick={handleToggle}>
    <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
  </IconButton>
</Box>

<Collapse in={open}>
  <Box
    sx={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      marginTop: '10px',
      textAlign: 'left',
      backgroundColor: '#f0f0f0',
      width: '76%', // Ajuster la largeur pour correspondre au TextField
      margin: '0 auto', // Centrer le contenu
    }}
  >
    <p style={{ margin: '0' }}>
    On distingue principalement les cérémonies religieuses, qui se déroulent généralement dans une église ou un lieu de culte, et les cérémonies civiles,
     qui peuvent se tenir dans une salle dédiée ou un espace en plein air.    </p>
  </Box>
</Collapse>
        
              <TextField
                label="Lieu de la cérémonie"
                name="lieuCeremonie"
                value={formData.lieuCeremonie}
                onChange={(e) => setFormData({ ...formData, lieuCeremonie: e.target.value })}
                fullWidth
                margin="normal"
                style={{ width: '76%' }} 
              />




<FormLabel
                component="legend"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgb(39, 39, 39)',
                  textAlign: 'center',
                  marginBottom: '10px',
                  marginTop:'55px',
                }}
              >
               Types de Cérémonies
              </FormLabel>
              <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    width: '76%', // Ajuster la largeur pour correspondre au TextField
    margin: '0 auto', // Centrer le contenu
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
    <span style={{ fontSize: '14px', color: 'grey' }}>
      Explication Types de Cérémonies
    </span>
  </Box>

  <IconButton onClick={handleToggle}>
    <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
  </IconButton>
</Box>

<Collapse in={open}>
  <Box
    sx={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      marginTop: '10px',
      textAlign: 'left',
      backgroundColor: '#f0f0f0',
      width: '76%', // Ajuster la largeur pour correspondre au TextField
      margin: '0 auto', // Centrer le contenu
    }}
  >
    <p style={{ margin: '0' }}>
    Les types de cérémonies funéraires varient selon les croyances religieuses, 
    les traditions culturelles et les souhaits des proches.  Certaines familles optent également pour des cérémonies personnalisées, qui reflètent la personnalité et les valeurs du défunt, avec des hommages particuliers,
     de la musique, et des discours commémoratifs.</p>
  </Box>
</Collapse>
        
              <TextField
                label="Type de cérémonie"
                name="typeCeremonie"
                value={formData.typeCeremonie}
                onChange={(e) => setFormData({ ...formData, typeCeremonie: e.target.value })}
                fullWidth
                margin="normal"
                style={{ width: '76%' }} 
              />
            </Box>
          )}
        </Box>
        
        );
  
      case 4:
        return (
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centre horizontalement
            justifyContent: 'center', // Centre verticalement
            width: '100%',
            padding: '20px',
          }}
        >
            <FormLabel
                component="legend"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgb(39, 39, 39)',
                  textAlign: 'center',
                  marginBottom: '10px',
                  marginTop:'5px',
                }}
              >
              Où souhaitez-vous que le défunt repose ?
              </FormLabel>
              <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    width: '76%', // Ajuster la largeur pour correspondre au TextField
    margin: '0 auto', // Centrer le contenu
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
    <span style={{ fontSize: '14px', color: 'grey' }}>
      Explication  Le lieu de repos
    </span>
  </Box>

  <IconButton onClick={handleToggle}>
    <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
  </IconButton>
</Box>

<Collapse in={open}>
  <Box
    sx={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      marginTop: '10px',
      textAlign: 'left',
      backgroundColor: '#f0f0f0',
      width: '76%', // Ajuster la largeur pour correspondre au TextField
      margin: '0 auto', // Centrer le contenu
    }}
  >
    <p style={{ margin: '0' }}>
    Le lieu de repos définit l’endroit où le corps du défunt sera inhumé ou où ses cendres seront déposées.
     Il peut s’agir d’un cimetière pour une inhumation, ou d’un columbarium dans le cas d'une crémation. </p>
  </Box>
</Collapse>
        
            <TextField
              label="Lieu de repos"
              name="lieuRepos"
              value={formData.lieuRepos}
              onChange={handleChange}
              fullWidth
              margin="normal"
              style={{ width: '76%' }} 
            />

























<FormLabel
                component="legend"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgb(39, 39, 39)',
                  textAlign: 'center',
                  marginBottom: '10px',
                  marginTop:'55px',
                }}
              >
          Quelle est la durée de la concession ?
              </FormLabel>
              <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    width: '76%', // Ajuster la largeur pour correspondre au TextField
    margin: '0 auto', // Centrer le contenu
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
    <span style={{ fontSize: '14px', color: 'grey' }}>
      Explication   durée de la concession ?
    </span>
  </Box>

  <IconButton onClick={handleToggle}>
    <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
  </IconButton>
</Box>

<Collapse in={open}>
  <Box
    sx={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      marginTop: '10px',
      textAlign: 'left',
      backgroundColor: '#f0f0f0',
      width: '76%', // Ajuster la largeur pour correspondre au TextField
      margin: '0 auto', // Centrer le contenu
    }} 
  >
    <p style={{ margin: '0' }}>
    La concession funéraire est un espace réservé dans un cimetière où reposent les défunts. Ce terrain est accordé pour une durée déterminée (temporaire) ou de manière perpétuelle,
     selon la législation en vigueur et les souhaits de la famille.</p>
  </Box>
</Collapse>
        
            <TextField
              label="Durée de la concession (en années)"
              name="concessionDuree"
              value={formData.concessionDuree}
              onChange={handleChange}
              fullWidth
              margin="normal"

              style={{ width: '76%' }} 
            />
          </Box>
        );  
  
      case 5: // Nouvelle étape juste avant le récapitulatif
        return (
          <Box>
            

<FormLabel
                component="legend"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgb(39, 39, 39)',
                  textAlign: 'center',
                  marginBottom: '10px',
                  marginTop:'33px',
                }}
              >
      "Autres souhaits" ou "Message personnel"
              </FormLabel>
            <TextField
              label="Message personnalisé ou autre chose"
              name="messagePersonnel"
              value={formData.messagePersonnel}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4} // Permet d'afficher un grand champ texte
              margin="normal"
              
            />
          </Box>
        );
  
      case 6: // Recap step
        return (
          <Box>
            <Typography variant="h6">Récapitulatif :</Typography>
            <Typography>Type de funérailles : {formData.typefunerailles}</Typography>
            <Typography>Lieu du décès : {formData.lieuDeces}</Typography>
            <Typography>Distance de transport : {formData.transportDistance} heures</Typography>
            <Typography>Type de véhicule : {formData.typeVehicule}</Typography>
            <Typography>Type de cercueil : {formData.typeCercueil}</Typography>
            <Typography>Type d'urne : {formData.typeUrne}</Typography>
            <Typography>Fleurs : {formData.fleurs}</Typography>
            <Typography>Organisation de la cérémonie : {formData.organisation_ceremonie ? "Oui" : "Non"}</Typography>
            <Typography>Lieu de repos : {formData.lieuRepos}</Typography>
            <Typography>Concession : {formData.concessionDuree} ans</Typography>
            <Typography>Message personnalisé : {formData.messagePersonnel}</Typography>
          </Box>
        );
  
      default:
        return 'Étape inconnue';
    }
  };
  

  return (
    
      <Box>
          {showArrangements ? (
              <ArrangementsDisplay arrangements={arrangements} onClose={handleCloseArrangements} />
          ) : (
              <>
                  {/* Titre et bouton en haut à droite */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                      <h1 style={{ fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}>
                          Estimation obsèques
                      </h1>
                      {/* Bouton Voir Arrangements avec icône */}
                      <Button
  variant="contained"
  onClick={handleViewArrangements}
  startIcon={<GiCoffin />} // Utilisation de l'icône cercueil
  sx={{
    backgroundColor: 'black',  // Fond noir
    color: 'white',            // Texte blanc
    '&:hover': {
      backgroundColor: '#333', // Couleur du bouton en hover (gris foncé)
    },
  }}
>
  Voir Arrangements
</Button>

                  </Box>
                  <Box>
                      {showArrangements ? (
                          <ArrangementsDisplay arrangements={arrangements} onClose={handleCloseArrangements} />
                      ) : null}
                  </Box>

                <br />  <br />   
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 2 }}>
                    {renderStepContent(activeStep)}
                </Box>
                <Box sx={{ mt: 2 }}>
                {activeStep === steps.length - 1 ? (
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Soumettre
                      </Button>
                    ) : (
                        <>
                           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <Button
        disabled={activeStep === 0}
        onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
        sx={{ mr: 1 }}
    >
        Retour
    </Button>  
    <Button
        variant="contained"
        color="primary"
        onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
    >
        {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
    </Button>
</div>

                        </>
                    )}
                </Box>
              
            </>
        )}
    </Box>   
);
};

export default ArrangementsF;