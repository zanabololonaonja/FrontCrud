import React, { useState } from 'react';
import './Testament.css';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField, Typography,  
  FormControlLabel,
  Checkbox,     
  RadioGroup,
  Radio,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { GlobalStyles } from '@mui/material';

import FiniTestament from './FiniTestament';


const steps = [
  { label: 'Informations sur le Testateur', icon: <PersonIcon /> },
  { label: 'Exécuteur du Testament', icon: <AssignmentIcon /> },
  { label: 'Biens à Léguer', icon: <HomeIcon /> },
  { label: 'Bénéficiaires', icon: <GroupIcon /> },
  { label: 'Tuteur et Témoins', icon: <GavelIcon /> },
  { label: 'Type de Cadeau', icon: <MonetizationOnIcon /> },
  { label: 'Recapitulatif', icon: <AssignmentIcon /> },
];


const styles = {
  '@global': {
    '@keyframes rotate': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  },
};

function Testament ({ userData }) {        
    
  const [activeStep, setActiveStep] = useState(0);
  const [giftType, setGiftType] = useState('');
  const [testamentData, setTestamentData] = useState({
    etranger: false,
    nom_testateur: '',
    date_naissance_testateur: '',
    lieu_naissance_testateur: '',
    adresse_testateur: '',
    nom_executant: '',
    nom_executant_alternatif: '',
    tuteur_nom: '',
    tuteur_adresse: '',
    gift_amount: '',
    gift_recipient: '',
    temoin1_nom: '',
    temoin1_adresse: '',
    temoin2_nom: '',
    temoin2_adresse: '',
    heritages: [
      {
        bien_legue: '',
        adresse_bien_legue: '',
        beneficiaires: [
          {
            benef_nom: '',
            benef_date_naissance: '',
            benef_adresse: '',
            benef_relation: ''
          }
        ]
      }
    ]
  });


  
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleChange = (e, heritageIndex, benefIndex) => {
    const { name, value, type, checked } = e.target;

    setTestamentData((prevData) => {
      const updatedData = { ...prevData };

      if (heritageIndex !== undefined) {
        const updatedHeritages = [...prevData.heritages];

        if (typeof benefIndex === 'number') {
          const updatedBeneficiaires = [...updatedHeritages[heritageIndex].beneficiaires];
          updatedBeneficiaires[benefIndex][name] = type === 'checkbox' ? checked : value;
          updatedHeritages[heritageIndex].beneficiaires = updatedBeneficiaires;
        } else {
          updatedHeritages[heritageIndex][name] = type === 'checkbox' ? checked : value;
        }

        updatedData.heritages = updatedHeritages;
      } else {
        updatedData[name] = type === 'checkbox' ? checked : value;
      }

      return updatedData;
    });
  };

  const addHeritage = () => {
    setTestamentData((prevData) => ({
      ...prevData,
      heritages: [
        ...prevData.heritages,
        {
          bien_legue: '',
          adresse_bien_legue: '',
          beneficiaires: [
            {
              benef_nom: '',
              benef_date_naissance: '',
              benef_adresse: '',
              benef_relation: ''
            }
          ]
        }
      ]
    }));
  };

  const addBeneficiary = (heritageIndex) => {
    setTestamentData((prevData) => {
      const updatedHeritages = [...prevData.heritages];
      updatedHeritages[heritageIndex].beneficiaires.push({
        benef_nom: '',
        benef_date_naissance: '',
        benef_adresse: '',
        benef_relation: ''
      });
      return { ...prevData, heritages: updatedHeritages };
    });
  };


  const [showTestament, setShowTestament] = useState(false); // Nouvel état pour afficher le testament


    // Extraire l'iduser à partir de userData
    const iduser = userData?.iduser;

    const handleViewTestament = async () => {    
    
      try {    
        const response = await fetch(`http://localhost:5000/api/testaments/${userData.iduser}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          alert('Erreur lors de la récupération du testament : ' + errorData.message);
          return;
        }
  
        const data = await response.json();
        const testament = data[0]; // Si c'est un tableau, prendre le premier élément
  
        // Stocker les données dans l'état
        setTestamentData(testament);
        setShowTestament(true); // Afficher les données du testament
  
        // Afficher une alerte
        alert(`Détails du testament :
              Nom du testateur : ${testament.nom_testateur}
              Date de naissance : ${testament.date_naissance_testateur}
              Lieu de naissance : ${testament.lieu_naissance_testateur}
              Adresse : ${testament.adresse_testateur}
              Bien légué : ${testament.bien_legue}
              Adresse du bien : ${testament.adresse_bien_legue}
              Nom du bénéficiaire : ${testament.benef_nom}
              Relation avec le bénéficiaire : ${testament.benef_relation}
              Description du don : ${testament.gift_description}
              Montant du don : ${testament.gift_amount}`);
      } catch (error) {
        console.error('Erreur lors de la récupération du testament :', error);
        alert("Erreur lors de la récupération des données du testament.");
      }
    };
  
    const handleCloseTestament = () => setShowTestament(false);
  
  const handleVoirTestament = () => {
    setShowTestament(true); // Met à jour l'état pour afficher le testament
  };


  const handleGiftTypeChange = (event) => {
    setGiftType(event.target.value);
  };




   // Fonction pour ajouter un nouveau bien à léguer
   const addBienSupplementaire = () => {
    setTestamentData((prevState) => ({
      ...prevState,
      biensSupplementaires: [...prevState.biensSupplementaires, { bien: '', adresse: '' }],
    }));
  };

  // Fonction pour gérer les changements des biens supplémentaires
  const handleSupplementaireChange = (index, field, value) => {
    const updatedBiens = [...testamentData.biensSupplementaires];
    updatedBiens[index][field] = value;
    setTestamentData({ ...testamentData, biensSupplementaires: updatedBiens });
  };


  
  const handleNextA = async () => {
    if (!userData || !userData.iduser) {
      console.error("L'utilisateur n'est pas connecté ou iduser est manquant");
      return;
    }

    const testamentDataWithUser = {
      ...testamentData,
      iduser: userData.iduser,
    };    
      
    console.log('Données du testament envoyées:', testamentDataWithUser);
  
    if (activeStep === steps.length - 1) {
      try {
        const response = await fetch('http://localhost:5000/api/testamentsadd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testamentDataWithUser),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Testament ajouté avec succès:', data);
        } else {
          console.error('Erreur lors de l\'ajout du testament:', data.error);
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  
  const renderGiftFields = () => {
    switch (giftType) {
      case 'Cash':
        return (
          <>
            <TextField
              label="Amount ($)"
              name="gift_amount"
              value={testamentData.gift_amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Give To"
              name="gift_recipient"
              value={testamentData.gift_recipient}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 'Vehicle':
        return (
          <>
            <TextField
              label="Vehicle Description"
              name="gift_vehicle"
              value={testamentData.gift_vehicle}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Give To"
              name="gift_recipient"
              value={testamentData.gift_recipient}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 'Real Estate':
        return (
          <>
            <TextField
              label="Property Description"
              name="gift_property"
              value={testamentData.gift_property}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Give To"
              name="gift_recipient"
              value={testamentData.gift_recipient}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 'Charity':
        return (
          <>
            <TextField
              label="Charity Name"
              name="gift_charity"
              value={testamentData.gift_charity}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Amount ($)"
              name="gift_amount"
              value={testamentData.gift_amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 'Other':
        return (
          <>
            <TextField
              label="Other Gift Description"
              name="gift_other"
              value={testamentData.gift_other}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Give To"
              name="gift_recipient"
              value={testamentData.gift_recipient}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={testamentData.etranger}
                  onChange={handleChange}
                  name="etranger"
                />
              }
              label="Testateur étranger"
            />
            <TextField
              label="Nom du testateur"
              name="nom_testateur"
              value={testamentData.nom_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
            /> 
            <TextField
              label="Date de naissance"
              name="date_naissance_testateur"
              type="date"        
              value={testamentData.date_naissance_testateur}
              onChange={handleChange}   
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Lieu de naissance"
              name="lieu_naissance_testateur"
              value={testamentData.lieu_naissance_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Adresse de résidence"
              name="adresse_testateur"
              value={testamentData.adresse_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        ); 
      case 1: 
        return (
          <>
            <TextField
              label="Nom de l'exécuteur"
              name="nom_executant"
              value={testamentData.nom_executant}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nom de l'exécuteur alternatif"
              name="nom_executant_alternatif"
              value={testamentData.nom_executant_alternatif}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />


          </>
        );
        case 2:
          return (
            <div>
      {activeStep === 2 && (
        <>
          {testamentData.heritages.map((heritage, heritageIndex) => (
            <div key={heritageIndex}>
              <h3>HÉRITAGE {heritageIndex + 1}</h3>
              <TextField
                label="Bien légué"
                name="bien_legue"
                value={heritage.bien_legue}
                onChange={(e) => handleChange(e, heritageIndex)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Adresse du bien légué"
                name="adresse_bien_legue"
                value={heritage.adresse_bien_legue}
                onChange={(e) => handleChange(e, heritageIndex)}
                fullWidth
                margin="normal"
              />
              {heritage.beneficiaires.map((benef, benefIndex) => (
                <div key={benefIndex}>
                  <h4>Bénéficiaire {benefIndex + 1}</h4>
                  <TextField
                    label="Nom du Bénéficiaire"
                    name="benef_nom"
                    value={benef.benef_nom}
                    onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Date de Naissance"
                    name="benef_date_naissance"
                    type="date"
                    value={benef.benef_date_naissance}
                    onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Adresse du Bénéficiaire"
                    name="benef_adresse"
                    value={benef.benef_adresse}
                    onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Relation"
                    name="benef_relation"
                    value={benef.benef_relation}
                    onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                    fullWidth
                    margin="normal"
                  />
                </div>
              ))}
              <Button onClick={() => addBeneficiary(heritageIndex)}>Ajouter un Bénéficiaire</Button>
            </div>
          ))}
          <Button onClick={addHeritage}>Ajouter un Nouveau Bien</Button>
        </>
      )}
    </div>
      );
         
     case 3:
  return ( 
    <>
<TextField
          label="Nom du témoin 1"
          name="temoin1_nom"
          value={testamentData.temoin1_nom}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Adresse du témoin 1"
          name="temoin1_adresse"
          value={testamentData.temoin1_adresse}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nom du témoin 2"
          name="temoin2_nom"
          value={testamentData.temoin2_nom}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Adresse du témoin 2"
          name="temoin2_adresse"
          value={testamentData.temoin2_adresse}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
    </>
  );

      case 4:
        return (
          <>
            <TextField
              label="Nom du tuteur"
              name="tuteur_nom"
              value={testamentData.tuteur_nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Adresse du tuteur"
              name="tuteur_adresse"
              value={testamentData.tuteur_adresse}
              onChange={handleChange}
              fullWidth
              margin="normal"
        
            />



            
          </>
        );
      case 5: // Gift Step (Cash, Vehicle, Real Estate, Charity, Other)
        return (
          <>
            <RadioGroup
              name="gift_type"
              value={giftType}
              onChange={handleGiftTypeChange}
              row
            >
              <FormControlLabel
                value="Cash"
                control={<Radio />}
                label="Cash"
              />
              <FormControlLabel
                value="Vehicle"
                control={<Radio />}
                label="Vehicle"
              />
              <FormControlLabel   
                value="Real Estate"
                control={<Radio />}
                label="Real Estate"
              />
              <FormControlLabel
                value="Charity"
                control={<Radio />}
                label="Charity"
              />
              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>

            {/* Render specific inputs based on selected gift type */}
            {renderGiftFields()}
          </>
        );
      
        case 6: // Recapitulatif
        return (
          <Box>
            <Typography variant="h6">Récapitulatif</Typography>
            {/* <Divider sx={{ marginBottom: '20px' }} /> */}
      
            <Typography variant="body1"><strong>Testateur:</strong></Typography>
            <Typography variant="body1">Nom: {testamentData.nom_testateur}</Typography>
            <Typography variant="body1">Date de naissance: {testamentData.date_naissance_testateur}</Typography>
            <Typography variant="body1">Lieu de naissance: {testamentData.lieu_naissance_testateur}</Typography>
            <Typography variant="body1">Adresse: {testamentData.adresse_testateur}</Typography>
            <Typography variant="body1">Testateur étranger: {testamentData.etranger ? "Oui" : "Non"}</Typography>
      
            <Typography variant="body1"><strong>Exécuteur:</strong></Typography>
            <Typography variant="body1">Nom: {testamentData.nom_executant}</Typography>
            <Typography variant="body1">Nom alternatif: {testamentData.nom_executant_alternatif}</Typography>
            <Typography variant="body1">Nom: {testamentData. temoin1_nom}</Typography>
            <Typography variant="body1">Nom alternatif: {testamentData. temoin1_adresse}</Typography>
            <Typography variant="body1">Nom: {testamentData.temoin2_nom}</Typography>
            <Typography variant="body1">Nom alternatif: {testamentData. temoin2_adresse}</Typography>  
           {/* Héritages et Bénéficiaires */}
    {testamentData.heritages.map((heritage, heritageIndex) => (
      <Box key={heritageIndex} sx={{ marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>Héritage {heritageIndex + 1}</Typography>
        
        {/* Bien légué */}
        <Typography variant="body1">Bien légué: {heritage.bien_legue}</Typography>

        {/* Affichage des bénéficiaires liés à ce bien */}
        {(heritage.beneficiaires || []).map((beneficiaire, benefIndex) => (
          <Box key={benefIndex} sx={{ marginLeft: '20px', marginTop: '10px' }}>
            <Typography variant="body2" gutterBottom><strong>Bénéficiaire {benefIndex + 1}:</strong></Typography>
            <Typography variant="body2">Nom: {beneficiaire.nom || "Non spécifié"}</Typography>
            <Typography variant="body2">Date de naissance: {beneficiaire.date_naissance || "Non spécifiée"}</Typography>
            <Typography variant="body2">Relation: {beneficiaire.relation || "Non spécifiée"}</Typography>
          </Box>
        ))}
      </Box>     
    ))}

    
         
      
            {/* Affichage des tuteurs */}
            <Typography variant="body1"><strong>Tuteur:</strong></Typography>
            <Typography variant="body1">Nom: {testamentData.tuteur_nom}</Typography>
            <Typography variant="body1">Adresse: {testamentData.tuteur_adresse}</Typography>
      
            {/* Affichage des dons */}
            <Typography variant="body1"><strong>Dons:</strong></Typography>
            {giftType && (
              <Typography variant="body1">{`Type: ${giftType}`}</Typography>
            )}
            {giftType === 'Cash' && (
              <Typography variant="body1">{`Montant: ${testamentData.gift_amount}, Donné à: ${testamentData.gift_recipient}`}</Typography>
            )}
            {giftType === 'Vehicle' && (
              <Typography variant="body1">{`Description du véhicule: ${testamentData.gift_vehicle}, Donné à: ${testamentData.gift_recipient}`}</Typography>
            )}
            {giftType === 'Real Estate' && (
              <Typography variant="body1">{`Description de la propriété: ${testamentData.gift_property}, Donné à: ${testamentData.gift_recipient}`}</Typography>
            )}
            {giftType === 'Charity' && (
              <Typography variant="body1">{`Nom de la charité: ${testamentData.gift_charity}, Montant: ${testamentData.gift_amount}`}</Typography>
            )}
            {giftType === 'Other' && (
              <Typography variant="body1">{`Description du don: ${testamentData.gift_other}, Donné à: ${testamentData.gift_recipient}`}</Typography>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };

  const StepIcon = ({ icon }) => (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',   
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        color: '#fff',
        marginBottom: '10px', // To create space between icon and label
      }}
    >
      {icon}
    </Box>
  );

  return (
<Box sx={{ width: '100%', padding: '20px' }}>
      <h1 style={{ fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold' }}>
        MON TESTAMENT
      </h1>
   

      {showTestament && (
  <div className="testament-container">
      <br />  
    <h2>Détails du testament</h2>
    <br />  
    <p>
      Je, soussigné(e) <strong>{testamentData.nom_testateur}</strong>, né(e) le 
      <strong>{new Date(testamentData.date_naissance_testateur).toLocaleDateString()}</strong> 
      à <strong>{testamentData.lieu_naissance_testateur}</strong>, domicilié(e) au 
      <strong>{testamentData.adresse_testateur}</strong>, déclare être sain(e) d’esprit, 
      avoir la capacité juridique à gérer mes biens, et être majeur(e) ou mineur(e) de plus 
      de 16 ans. Un mineur entre 16 et 18 ans pourra léguer la moitié de ses biens, sauf s'il 
      est mineur émancipé.
    </p>

    {JSON.parse(testamentData.bien_legue).map((bien, index) => (
      <div key={index}>
        <h3>Héritage {index + 1}</h3>
        <p>Je lègue le bien <strong>{bien.type}</strong></p>
        {JSON.parse(testamentData.adresse_bien_legue)[index] ? (
          JSON.parse(testamentData.adresse_bien_legue)[index].nom ? (
            <ul>
           
                <p>à <strong>{JSON.parse(testamentData.adresse_bien_legue)[index].nom}</strong>, né(e) le <strong>{new Date(JSON.parse(testamentData.adresse_bien_legue)[index].date_naissance).toLocaleDateString()}</strong>,
          
                   qui est mon/ma <strong>{JSON.parse(testamentData.adresse_bien_legue)[index].relation}</strong></p>
            
            </ul>
          ) : (
            <p>Pas de bénéficiaires pour cet héritage.</p>
          )
        ) : (
          <p>Pas de bénéficiaires pour cet héritage.</p>
        )}
      </div>
    ))}

    <p>
  J'ai désigné <strong>{testamentData.tuteur_nom}</strong>domicilié à  <strong>{testamentData.tuteur_adresse}</strong> comme tuteur légal pour assurer la gestion et la protection 
  de mes biens en cas d'incapacité ou d'invalidité. Le tuteur devra veiller à ce que mes volontés soient respectées 
  et agir dans le meilleur intérêt de mes héritiers. 
</p>
    <p>
  Le tuteur sera responsable de la gestion de mes affaires personnelles et financières jusqu'à ce que mes 
  héritiers atteignent la majorité légale ou jusqu'à ce qu'une autre décision judiciaire soit prise. 
  Il pourra également prendre des décisions sur la répartition des biens, en collaboration avec l'exécuteur testamentaire.
</p>

<p>
  En cas d'impossibilité pour <strong>{testamentData.tuteur_nom}</strong> d'exercer ses fonctions, un tuteur alternatif 
  pourra être désigné selon les conditions établies par la loi.
</p>

    <p>
      J’ai désigné comme exécuteur de ce testament <strong>{testamentData.nom_executant}</strong> et, 
      en cas d’empêchement, <strong>{testamentData.nom_executant_alternatif}</strong> pour garantir 
      la bonne exécution de mes volontés.
    </p>

    <p>
      Ce testament a été établi en présence de témoins dont voici les informations : <br />
      Témoin 1 : <strong>{testamentData.temoin1_nom}</strong>, domicilié à 
      <strong>{testamentData.temoin1_adresse}</strong>. <br />
      Témoin 2 : <strong>{testamentData.temoin2_nom}</strong>, domicilié à 
      <strong>{testamentData.temoin2_adresse}</strong>.
    </p>

    <h3>Montant du don</h3>
    <p>En outre, je lègue un montant de <strong>{testamentData.gift_amount} euros</strong> à 
      <strong>{testamentData.gift_recipient}</strong>.
    </p>

    <button onClick={handleCloseTestament}>Fermer</button>
  </div>
)}
    
    
       
      {/* Afficher le Stepper ou le contenu du testament en fonction de l'état */}
      <GlobalStyles styles={styles} />
      {!showTestament ? (
  <>
    <Stepper activeStep={activeStep} orientation="horizontal">
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel
            icon={
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
                  color: 'white',
                  position: 'relative', // To position the animated border
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: index === activeStep ? 'rgb(233,64,87)' : 'transparent', // Color when active
                    animation: index === activeStep ? 'rotate 1.5s linear infinite' : 'none', // Rotate when active
                  },
                }}
              >
                {step.icon}     
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // Change label color to red if this is the active step
              color: index === activeStep ? 'black' : 'inherit',
            }}
          >
            <Box
              sx={{
                marginTop: '10px',
                fontWeight: index === activeStep ? 'bold' : 'normal', // Optional: make active label bold
                color: index === activeStep ? 'black': 'inherit', // Set the label color to red if active
              }}
            >
              {step.label}
            </Box>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
     
    <Box sx={{ marginTop: '20px' }}>
      {renderStepContent(activeStep)}
    </Box>

    <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
      <Button disabled={activeStep === 0} onClick={handleBack}>
        Back
      </Button>
      <Button variant="contained" color="primary" onClick={handleNextA}>
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Box>

          {/* Le bouton pour afficher le testament */}
          <Box sx={{ marginTop: '20px', textAlign: 'right' }}> {/* Bouton positionné à droite */}
            <Button variant="outlined" onClick={ handleViewTestament}>
              Voir mon testament
            </Button>
          </Box>
        </>
      ) : (  
        // Si showTestament est vrai, afficher le contenu de finitestament.js
        <Box sx={{ marginTop: '20px' }}>
       
      </Box> 
      )}
    </Box>
    
  );
};     

export default Testament;
  