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
    transportDistance: '',
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

  const steps = ['Type of funeral',
    'funeral vigil',
    'Coffin or urn',
    'Ceremony organization',
    'Resting place',
    'Other wishes',
    'Summary'];


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
      // alert(`Détails des arrangements :
      //       Type de funérailles : ${arrangementsData.typefunerailles}
      //       Lieu de décès : ${arrangementsData.lieudeces}
      //       Distance de transport : ${arrangementsData.transportdistance} km
      //       Type de véhicule : ${arrangementsData.typevehicule}
      //       Type de cercueil : ${arrangementsData.typecercueil}
      //       Type d'urne : ${arrangementsData.typeurne || 'Non spécifié'}
      //       Fleurs : ${arrangementsData.fleurs || 'Non spécifié'}
      //       Organisation de la cérémonie : ${arrangementsData.organisation_ceremonie ? "Oui" : "Non"}
      //        ceremonie : ${arrangementsData.lieuceremonie}

      //     typeceremonie : ${arrangementsData.typeceremonie}
      //       Lieu de repos : ${arrangementsData.lieu_repos}
      //       Durée de la concession : ${arrangementsData.concession_duree} ans
      //       Message personnalisé : ${arrangementsData.message_personnel || 'Non spécifié'}`);

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
              {/* Main content of the question with explanation below */}
              <FormLabel
                component="legend"
                style={{
                  marginLeft: '220px',
                  fontSize: '20px',
                  border: 'none',
                  color: 'rgb(39, 39, 39)',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  display: 'block'
                }}
              >
                Type of funeral
              </FormLabel>

              {/* Explanation box with icon and arrow */}
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
                {/* Information icon */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ color: 'blue', marginRight: '8px' }} />
                  <span style={{ fontSize: '14px', color: 'grey' }}>
                    What is the difference between burial and cremation?
                  </span>
                </Box>

                {/* Button to open/close the explanation */}
                <IconButton onClick={handleToggle}>
                  <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </IconButton>
              </Box>

              {/* Explanation content in a collapsible box */}
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
                    <span style={{ color: '#222222', fontWeight: 'bold' }}>Burial</span> involves placing the deceased's coffin in the ground at a cemetery, in a vault.
                    <br />
                    <span style={{ color: '#222222', fontWeight: 'bold' }}>Cremation</span> involves reducing the body and coffin of the deceased to ashes in a crematorium.
                  </p>
                </Box>
              </Collapse>

              {/* Radio buttons for choices, placed at the bottom */}
              <RadioGroup
                name="typefunerailles"
                value={formData.typefunerailles}
                onChange={handleChange}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '19px' }}
              >
                <FormControlLabel
                  value="inhumation"
                  control={<Radio />}
                  label="Burial"
                  style={{ fontWeight: 'bold', fontSize: '19px' }}
                  sx={{ marginRight: '20px' }}
                />
                <FormControlLabel
                  value="cremation"
                  control={<Radio />}
                  label="Cremation"
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
                Where would you like the wake to take place?
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
                    Explanation about the location of the wake
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
                    The moment when the body of the deceased is placed in their home or another location,
                    and where loved ones come to pay their respects before the funeral ceremony, is called the wake.
                  </p>
                </Box>
              </Collapse>

              {/* Champ de texte en bas */}
              <TextField
                label="In my house or another location"
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
                How long would you like the wake to last?

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
                    Explanation of the duration of the wake</span>
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
                    It is a time of reflection, often marked by prayers,
                    songs, or speeches, where family and friends gather to honor the deceased and pay their last respects before the funeral.
                  </p>
                </Box>
              </Collapse>

              <TextField
                label="(in hours)"
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
                marginTop: '33px',
              }}
            >What type of coffin would you like?

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
                cursor: 'pointer',
              }}>
                <img src="/images/cercueil1.jpg" alt="Cercueil économique" style={{ width: '100%', height: 'auto' }} />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Tradition range</p>
              </div>

              {/* Deuxième cadre */}
              <div style={{
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                width: '22%',
                cursor: 'pointer',
              }}>
                <img src="/images/CERCUEIL-SEATTLE.jpg" alt="Cercueil standard" style={{ width: '100%', height: 'auto' }} />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Elegance range</p>
              </div>

              {/* Troisième cadre */}
              <div style={{
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                width: '22%',
                cursor: 'pointer',
              }}>
                <img src="/images/C2.jpg" alt="Cercueil de luxe" style={{ width: '100%', height: 'auto' }} />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Economy range</p>
              </div>

              {/* Quatrième cadre */}
              <div style={{
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                width: '22%',
                cursor: 'pointer',
              }}>
                <img src="/images/C4.jpg" alt="Cercueil premium" style={{ width: '100%', height: 'auto' }} />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Upholstered range</p>
              </div>

            </div>
            <TextField
              label="Type of coffin"
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
                  marginTop: '53px',
                }}
              >What type of funeral vehicle do you prefer to transport the coffin?
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
                    Explanation about the funeral vehicle
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
                    The funeral vehicle, often referred to as a hearse, is specially designed for transporting the deceased between
                    different locations of the funeral service. It serves a solemn and respectful function, transporting the coffin from the home, hospital, or funeral home to the church, cemetery, or crematorium.

                  </p>
                </Box>
              </Collapse>

              <TextField
                label="The vehicle that will carry the coffin"
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
                marginTop: '53px',
              }}
            >What type of urn would you prefer?

            </FormLabel>
            <TextField
              label="Type of urn (if cremation)"
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
                Would you like to organize a ceremony?

              </FormLabel>
              <RadioGroup
                name="organisation_ceremonie"
                value={String(formData.organisation_ceremonie)} // Convertir en string pour les boutons radio
                onChange={handleChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} // Aligner les boutons radio au centre
              >
                <FormControlLabel value="true" control={<Radio />} label="yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
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
                  Location of the ceremony?

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
                      Explanation of the ceremony location
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
                    <p style={{ margin: '0' }}>There are mainly two types of ceremonies: religious ceremonies, which are usually
                      held in a church or place of worship, and civil ceremonies, which can take place in a dedicated hall or an outdoor space.


                    </p>
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
                    marginTop: '55px',
                  }}
                >
                  Types of Ceremonies

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
                      Explanation of Types of Ceremonies

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
                      Funeral ceremony types vary based on religious beliefs, cultural traditions, and the wishes of the deceased’s
                      loved ones. Some families also choose personalized ceremonies that reflect the personality and values of the
                      deceased, with special tributes, music, and commemorative speeches.

                    </p>
                  </Box>
                </Collapse>

                <TextField
                  label="Type of ceremony"
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
                marginTop: '5px',
              }}
            >
              Where would you like the deceased to rest?

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
                  Explanation of the resting place

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
                  The resting place defines the location where the deceased's body will be buried or where their ashes will be
                  placed. It can be a cemetery for a burial or a columbarium in the case of cremation.
                </p>
              </Box>
            </Collapse>

            <TextField
              label="Resting place"
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
                marginTop: '55px',
              }}
            >
              What is the duration of the concession?

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
                  Explanation of the duration of the concession:

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
                <p style={{ margin: '0' }}>A funeral concession is a reserved space in a cemetery where the deceased rest.
                  This land is granted for a specified period (temporary) or in perpetuity, depending on the current legislation
                  and the wishes of the family.

                </p>
              </Box>
            </Collapse>

            <TextField
              label="Duration of the concession (in years)"
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
                marginTop: '33px',
              }}
            >
              "Other wishes" or "Personal message"

            </FormLabel>
            <TextField
              label="Personal message or other"
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
<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
  {/* Colonne de gauche */}
  <Box>
    <Typography variant="h6">Summary:</Typography>
    <br /> 
    <Typography>Funeral type: {formData.typefunerailles}</Typography>
    <Typography>Place of death: {formData.lieuDeces}</Typography>
    <Typography>Transport distance: {formData.transportDistance} hours</Typography>
    <Typography>Vehicle type: {formData.typeVehicule}</Typography>
    <Typography>Coffin type: {formData.typeCercueil}</Typography>
  </Box>

  {/* Colonne de droite */}
  <Box>
  <br />             <br /> 
    <Typography>Urn type: {formData.typeUrne}</Typography>
    <Typography>Ceremony organization: {formData.organisation_ceremonie ? "Yes" : "No"}</Typography>
    <Typography>Resting place: {formData.lieuRepos}</Typography>
    <Typography>Concession: {formData.concessionDuree} years</Typography>
    <Typography>Personal message: {formData.messagePersonnel}</Typography>
    <Typography>Flowers: {formData.fleurs}</Typography>
  </Box>
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
            Funeral Estimate 
            </h1>
            {/* Bouton Voir Arrangements avec icône */}


          </Box>
          <Box>

            {showArrangements ? (
              <ArrangementsDisplay arrangements={arrangements} onClose={handleCloseArrangements} />
            ) : null}
          </Box>

          <br />  <br />
          {userData?.typeofuser === 'owner' && !showArrangements && (
            <>


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
                    Submit                  </Button>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
                      >
                        {activeStep === steps.length - 1 ? ' Finish' : 'Next'}
                      </Button>
                    </div>


                  </>
                )}
              </Box>
            </>

          )}
          <Box sx={{
            position: 'absolute', // Permet de positionner le Box relativement à son parent
            top: '95px', // Ajustez cette valeur pour le placer plus haut
            right: '20px', // Ajustez cette valeur pour le placer à droite
            textAlign: 'right'
          }}>
            <Button
              variant="contained"
              onClick={handleViewArrangements}
              startIcon={<GiCoffin />} // Utilisation de l'icône cercueil
              sx={{
                backgroundColor: 'black',  // Fond noir  
                color: 'white',
                fontWeight: '700',
                // Texte blanc  
                '&:hover': {
                  backgroundColor: '#333', // Couleur du bouton en hover (gris foncé)
                },
              }}
            >
              View Arrangements
            </Button>
          </Box>


        </>

      )}
    </Box>

  );
};

export default ArrangementsF;