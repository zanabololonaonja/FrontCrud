import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Importer l'icône d'information
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, IconButton } from '@mui/material';

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
    'Autre chose',
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


  const handleViewArrangements = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/recapitulatif/${userData.iduser}`);
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erreur lors de la récupération des arrangements : ' + errorData.message);
            return;
        }

        const data = await response.json();
        setArrangements(data); // Met à jour l'état avec les données récupérées
        alert(JSON.stringify(data, null, 2)); // Affiche les détails des arrangements
    } catch (error) {
        console.error('Erreur lors de la récupération des arrangements :', error);
        alert('Une erreur s\'est produite lors de la récupération des arrangements');
    }
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
            <TextField
              label="Type de cercueil"
              name="typeCercueil"
              value={formData.typeCercueil}
              onChange={handleChange}
              fullWidth
              margin="normal" 
            />
           
            <TextField
              label="Type d'urne (si crémation)"
              name="typeUrne"
              value={formData.typeUrne}
              onChange={handleChange}
              fullWidth
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
            Le moment où le corps du défunt est placé dans sa maison ou dans un autre lieu,
             et où les proches viennent lui rendre visite avant la cérémonie funéraire, s'appelle la veillée funèbre.
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
          </Box>
        );
  
      case 3:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Souhaitez-vous organiser une cérémonie ?</FormLabel>
              <RadioGroup
                name="organisation_ceremonie"
                value={String(formData.organisation_ceremonie)} // Convertir en string pour les boutons radio
                onChange={handleChange}
              >
                <FormControlLabel value="true" control={<Radio />} label="Oui" />
                <FormControlLabel value="false" control={<Radio />} label="Non" />
              </RadioGroup>
            </FormControl>
  
            {/* Affichage conditionnel des champs supplémentaires */}
            {formData.organisation_ceremonie && (
              <Box>
                <TextField
                  label="Lieu de la cérémonie"
                  name="lieuCeremonie"         
                  value={formData.lieuCeremonie}
                  onChange={(e) => setFormData({ ...formData, lieuCeremonie: e.target.value })}
                  fullWidth 
                  margin="normal"
                />
                <TextField
                  label="Type de cérémonie"
                  name="typeCeremonie"
                  value={formData.typeCeremonie}
                  onChange={(e) => setFormData({ ...formData, typeCeremonie: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Box>
            )}
          </Box>
        );
  
      case 4:
        return (
          <Box>
            <TextField
              label="Lieu de repos"
              name="lieuRepos"
              value={formData.lieuRepos}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Durée de la concession (en années)"
              name="concessionDuree"
              value={formData.concessionDuree}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
        );  
  
      case 5: // Nouvelle étape juste avant le récapitulatif
        return (
          <Box>
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
    <Box sx={{ width: '100%' }}>
      <h1 style={{ fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}>
        Estimation obsèques
      </h1><br />
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
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleViewArrangements}>
                    Voir Arrangements
                </Button>
          
      </Box>
    </Box>
  );
}

export default ArrangementsF;
