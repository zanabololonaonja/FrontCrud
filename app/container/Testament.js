import React, { useState, useRef } from 'react';
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
  Grid,       
  Radio,
} from '@mui/material';
import jsPDF from 'jspdf';
import { FormLabel } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { GlobalStyles } from '@mui/material'; 
import SignatureCanvas from 'react-signature-canvas';


const steps = [
  { label: 'Informations Testateur', icon: <PersonIcon /> },
  { label: 'Exécuteur', icon: <AssignmentIcon /> },
  { label: 'Biens à Léguer', icon: <HomeIcon /> },
  { label: ' Témoins', icon: <GroupIcon /> },
  { label: 'Tuteur ', icon: <GavelIcon /> },
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

function Testament({ userData }) {

  const [activeStep, setActiveStep] = useState(0);
  const [giftType, setGiftType] = useState('');
  const [testamentData, setTestamentData] = useState({
    nom_testateur: '',
    date_naissance_testateur: '',
    lieu_naissance_testateur: '',
    adresse_testateur: '',
    nom_executant: '',
    nom_executant_alternatif: '',
    tuteur_nom: '',
    tuteur_adresse: '',
    temoin1_nom: '',
    temoin1_adresse: '',
    temoin2_nom: '',
    temoin2_adresse: '',
    gift_type: '',
    gift_amount: '',
    gift_recipient: '',
    heritages: [
      {
        bien_legue: '',
        beneficiaires: [
          {
            benef_nom: '',
            benef_date_naissance: '',
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
  const handleShowTestament = () => {
    setShowTestament(true);
    handleViewTestament(); // Si une action supplémentaire est nécessaire
  };
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
      // alert(`Détails du testament :  
      //         Nom du testateur : ${testament.nom_testateur}
      //         Date de naissance : ${testament.date_naissance_testateur}
      //         Lieu de naissance : ${testament.lieu_naissance_testateur}
      //         Adresse : ${testament.adresse_testateur}
      //         Bien légué : ${testament.bien_legue}
      //         Adresse du bien : ${testament.adresse_bien_legue}
      //        ${testament.temoin1_adresse}
      //        ${testament.temoin1_nom}
      //        ${testament.temoin2_nom}
      //        ${testament.temoin2_adresse}
      //        ${testament.tuteur_nom}
      //        ${testament.tuteur_adresse}

      //         Description du don : ${testament.gift_type}
      //         Montant du don : ${testament.gift_amount}`);
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
    setTestamentData(prevData => ({
      ...prevData,
      gift_type: event.target.value // On enregistre le type de don sélectionné
    }));
  };
  
  // Fonction pour gérer les champs spécifiques au don (par exemple montant, bénéficiaire)
  const handleGiftFieldsChange = (field, value) => {
    setTestamentData(prevData => ({
      ...prevData,
      [field]: value
    }));
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
      gift_type: testamentData.gift_type || null, // Type de don
      gift_description: testamentData.gift_description || null, // Description du don (si applicable)
      gift_amount: testamentData.gift_amount || null, // Montant du don
      gift_recipient: testamentData.gift_recipient || null, // Bénéficiaire du don
      gift_charity_name: testamentData.gift_charity_name || null ,// Nom de la charité (si applicable)
    
      heritages: testamentData.heritages.map(heritage => ({
        bien_legue: heritage.bien_legue, // Le bien légué
        valeur: heritage.valeur || 'Non spécifié', // Optionnel : ajouter une valeur
        beneficiaires: heritage.beneficiaires.map(benef => ({
          benef_nom: benef.benef_nom,
          benef_date_naissance: benef.benef_date_naissance,
          benef_relation: benef.benef_relation
        }))
      }))
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



  const [signatureData, setSignatureData] = useState(null);
  const sigCanvas = useRef(null);

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSaveSignature = () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setSignatureData(signature);
  };

  

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Ajuster la taille de la police
    doc.setFontSize(14);
    doc.text("Ceci est mon testament", 10, 10);
  
    // Ajouter les informations du testateur avec des phrases
    doc.setFontSize(12);
    doc.text(`Je, soussigné(e) ${testamentData.nom_testateur || "Non spécifié"},  Né(e) le ${testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : "Non spécifiée"} à ${testamentData.lieu_naissance_testateur || "Non spécifié"}`, 10, 30);
    doc.text(`Domicilié(e) à ${testamentData.adresse_testateur || "Non spécifiée"}, déclare être sain(e) d’esprit,`, 10, 40);
    doc.text("avoir la capacité juridique à gérer mes biens, et être majeur(e) ou mineur(e) de plus de 16 ans.", 10, 50);
    doc.text("Un mineur entre 16 et 18 ans pourra léguer la moitié de ses biens, sauf s'il est mineur émancipé.", 10, 60);
  
    // Informations sur les héritages et bénéficiaires
    let currentY = 70;
    if (testamentData.bien_legue && JSON.parse(testamentData.bien_legue).length > 0) {
      const heritages = JSON.parse(testamentData.bien_legue);
  
      heritages.forEach((heritage, index) => {
        doc.text(`Héritage ${index + 1}: Je lègue le bien ${heritage.biensL || "Non spécifié"} à :`, 10, currentY);
        currentY += 10;
  
        if (testamentData.adresse_bien_legue && JSON.parse(testamentData.adresse_bien_legue).length > 0) {
          const beneficiaries = JSON.parse(testamentData.adresse_bien_legue);
  
          beneficiaries.forEach((beneficiaire, benefIndex) => {
            doc.text(`  - ${beneficiaire.nom || "Non spécifié"}, né(e) le ${beneficiaire.date_naissance ? new Date(beneficiaire.date_naissance).toLocaleDateString() : "Non spécifiée"}, qui est mon/ma ${beneficiaire.relation || "Non spécifiée"}.`, 10, currentY);
            currentY += 10;
          });
        } else {
          doc.text('  Aucun bénéficiaire spécifié pour cet héritage.', 10, currentY);
          currentY += 10;
        }
  
        currentY += 10;
      });
    } else {
      doc.text('Aucun héritage spécifié.', 10, currentY);   
      currentY += 10;
    }
  
    // Informations sur le tuteur 
    doc.text(`J'ai désigné ${testamentData.tuteur_nom || "Non spécifié"}, domicilié à ${testamentData.tuteur_adresse || "Non spécifiée"},`, 10, currentY);
    currentY += 10;
    doc.text("comme tuteur légal pour assurer la gestion et la protection de mes biens en cas d'incapacité .", 10, currentY);
    currentY += 10;
    doc.text("Le tuteur devra veiller à ce que mes volontés soient respectées ", 10, currentY);
  
    // Informations sur l'exécuteur
    currentY += 15;
    doc.text(`J’ai désigné comme exécuteur de ce testament ${testamentData.nom_executant || "Non spécifié"}, et en cas d’empêchement, ${testamentData.nom_executant_alternatif || "Non spécifié"},`, 10, currentY);
    currentY += 10;
    doc.text("pour garantir la bonne exécution de mes volontés.", 10, currentY);
  
    // Informations sur les témoins
    currentY += 15;
    doc.text("Ce testament a été établi en présence de témoins dont voici les informations :", 10, currentY);
    currentY += 10;
    doc.text(`Témoin 1 : ${testamentData.temoin1_nom || "Non spécifié"}, domicilié à ${testamentData.temoin1_adresse || "Non spécifiée"}.`, 10, currentY);
    currentY += 10;
    doc.text(`Témoin 2 : ${testamentData.temoin2_nom || "Non spécifié"}, domicilié à ${testamentData.temoin2_adresse || "Non spécifiée"}.`, 10, currentY);
  
    // Informations sur le don
    currentY += 10;
    doc.text(`Je lègue un montant de ${testamentData.gift_amount || "Non spécifié"} euros à ${testamentData.gift_recipient || "Non spécifié"}.`, 10, currentY);
  
    // Clause de révocation
    currentY += 15;
    doc.text("J'accepte les conditions de ce testament et je reconnais que mes volontés doivent être respectées.", 10, currentY);
    currentY += 10;
    doc.text("Je révoque par la présente tous les testaments et codicilles antérieurs.", 10, currentY);
  
    // Ajouter la date à droite
    currentY += 20;
    const dateText = `Fait le ${new Date().toLocaleDateString()}, en présence des témoins mentionnés.`;
    const dateTextWidth = doc.getTextWidth(dateText);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(dateText, pageWidth - dateTextWidth - 10, currentY);
  
    currentY += 10;
    const signatureText = "Signature";
    const signatureTextWidth = doc.getTextWidth(signatureText);
    doc.text(signatureText, pageWidth - signatureTextWidth - 10, currentY); // Signature text aligned to the right
  
    // Vérifiez si l'espace est suffisant pour la signature
    if (currentY + 30 > doc.internal.pageSize.getHeight()) {
      doc.addPage(); // Ajouter une nouvelle page si l'espace est insuffisant
      currentY = 20; // Repositionner le curseur de départ sur la nouvelle page
    }
  
    // Ajouter la signature si elle existe
    if (signatureData) {
      doc.addImage(signatureData, 'PNG', 150, currentY + 10, 50, 20); // Position et taille de la signature
    } else {
      doc.text("Signature manquante.", 10, currentY + 20);
    }
  
    // Télécharger le PDF
    doc.save('testament.pdf');
  };    
  
     
  

// Define image paths for different gift typess  
const cashImage = '/images/vola.jpg';

const vehicleImage = '/images/o.jpg';
const realEstateImage = '/images/trano.jpg';
const charityImage = '/images/coeur.jpg';
const otherImage = '/images/cc.jpg';

const renderGiftFields = () => {
  switch (giftType) {
    case 'Cash':
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Montant"
            value={testamentData.gift_amount}
            onChange={(e) => handleGiftFieldsChange('gift_amount', e.target.value)}
            margin="normal"
            fullWidth
            sx={{ width: '200%' }} // Champ plus large
          />
          <TextField
            label="Bénéficiaire"
            value={testamentData.gift_recipient}
            onChange={(e) => handleGiftFieldsChange('gift_recipient', e.target.value)}
            margin="normal"
            fullWidth
            sx={{ width: '200%' }} // Champ plus large
          />
        </Box>
      );  
    case 'Vehicle':
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Description du véhicule"
            value={testamentData.gift_vehicle}
            onChange={(e) => handleGiftFieldsChange('gift_vehicle', e.target.value)}
            margin="normal"
            fullWidth
            sx={{ width: '200%' }} // Champ plus large
          />
          <TextField
            label="Bénéficiaire"
            value={testamentData.gift_recipient}
            onChange={(e) => handleGiftFieldsChange('gift_recipient', e.target.value)}
            margin="normal"
            fullWidth 
              sx={{ width: '200%' }} // Champ plus large
          />
        </Box>
      );


      case 'Real Estate':
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <TextField
        label="Description de la propriété"
        value={testamentData.gift_property}
        onChange={(e) => handleGiftFieldsChange('gift_property', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
      <TextField
        label="Bénéficiaire"
        value={testamentData.gift_recipient}
        onChange={(e) => handleGiftFieldsChange('gift_recipient', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
    </Box>
  );
case 'Charity':
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <TextField
        label="Nom de la charité"
        value={testamentData.gift_charity}
        onChange={(e) => handleGiftFieldsChange('gift_charity', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
      <TextField
        label="Montant"
        value={testamentData.gift_amount}
        onChange={(e) => handleGiftFieldsChange('gift_amount', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
    </Box>
  );
case 'Other':
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <TextField
        label="Description du don"
        value={testamentData.gift_other}
        onChange={(e) => handleGiftFieldsChange('gift_other', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
      <TextField
        label="Bénéficiaire"
        value={testamentData.gift_recipient}
        onChange={(e) => handleGiftFieldsChange('gift_recipient', e.target.value)}
        margin="normal"
        fullWidth
        sx={{ width: '200%' }} // Champ plus large
      />
    </Box>
  );

    // Repeat similarly for other cases...
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
                    <h3 className='heritage'>HÉRITAGE {heritageIndex + 1}</h3>
                    <TextField
                      label="Bien légué"
                      name="bien_legue"
                      value={heritage.bien_legue}
                      onChange={(e) => handleChange(e, heritageIndex)}
                      fullWidth
                      margin="normal"
                      required
                    />
                    {/* <TextField
                      label="Adresse du bien légué"
                      name="adresse_bien_legue"
                      value={heritage.adresse_bien_legue}
                      onChange={(e) => handleChange(e, heritageIndex)}
                      fullWidth
                      margin="normal"
                    /> */}
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
                          InputLabelProps={{ shrink: true }}
                        />
                        {/* <TextField
                          label="Adresse du Bénéficiaire"
                          name="benef_adresse"
                          value={benef.benef_adresse}
                          onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                          fullWidth
                          margin="normal"
                        /> */}
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
          
          <Box display="flex" flexDirection="column" alignItems="center">

<FormLabel
        component="legend"
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'rgb(39, 39, 39)',
          display: 'block',
          marginBottom: '10px',
          marginTop: '33px',
       marginLeft:'-350px',
        }}
      >
       Dons de biens personnels à des personnes spécifiques :   <br /> <br />
      </FormLabel>
            <RadioGroup
              name="gift_type"
              value={giftType}
              onChange={handleGiftTypeChange}
              row


            >
              
              <Grid container justifyContent="center" spacing={4}>
                <Grid item>
                  <FormControlLabel
                    value="Cash"
                    control={<Radio />}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={cashImage} alt="Cash" style={{ width: '90px', height: '90px' }} />
                        Cash
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="Vehicle"
                    control={<Radio />}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={vehicleImage} alt="Vehicle" style={{ width: '90px', height: '90px' }} />
                        Vehicle
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="Real Estate"
                    control={<Radio />}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={realEstateImage} alt="Real Estate" style={{ width: '90px', height: '90px' }} />
                        Real Estate
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="Charity"
                    control={<Radio />}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={charityImage} alt="Charity" style={{ width: '90px', height: '90px' }} />
                        Charity
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="Other"
                    control={<Radio />}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img src={otherImage} alt="Other" style={{ width: '90px', height: '90px' }} />
                        Other
                      </Box>
                    }
                  />
                </Grid>
              </Grid>   
            </RadioGroup>
  
            {/* Render specific inputs based on selected gift type */}
            {renderGiftFields()}
          </Box>
        );

      case 6: // Recapitulatif
        return (
          <Box>
  <Typography variant="h6">Récapitulatif</Typography>

  {/* Informations sur le testateur */}
  <Typography variant="body1"><strong>Testateur:</strong></Typography>
  <Typography variant="body1">Nom: {testamentData.nom_testateur || "Non spécifié"}</Typography>
  <Typography variant="body1">Date de naissance: {testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : "Non spécifiée"}</Typography>
  <Typography variant="body1">Lieu de naissance: {testamentData.lieu_naissance_testateur || "Non spécifié"}</Typography>
  <Typography variant="body1">Adresse: {testamentData.adresse_testateur || "Non spécifiée"}</Typography>
  <Typography variant="body1">Testateur étranger: {testamentData.etranger ? "Oui" : "Non"}</Typography>

  {/* Informations sur l'exécuteur */}
  <Typography variant="body1"><strong>Exécuteur:</strong></Typography>
  <Typography variant="body1">Nom: {testamentData.nom_executant || "Non spécifié"}</Typography>
  <Typography variant="body1">Nom alternatif: {testamentData.nom_executant_alternatif || "Non spécifié"}</Typography>

  {/* Informations sur les témoins */}
  <Typography variant="body1"><strong>Témoin 1:</strong></Typography>
  <Typography variant="body1">Nom: {testamentData.temoin1_nom || "Non spécifié"}</Typography>
  <Typography variant="body1">Adresse: {testamentData.temoin1_adresse || "Non spécifiée"}</Typography>

  <Typography variant="body1"><strong>Témoin 2:</strong></Typography>
  <Typography variant="body1">Nom: {testamentData.temoin2_nom || "Non spécifié"}</Typography>
  <Typography variant="body1">Adresse: {testamentData.temoin2_adresse || "Non spécifiée"}</Typography>

  {/* Boucle pour afficher les héritages et les bénéficiaires */}
  {testamentData.heritages.map((heritage, heritageIndex) => (
    <Box key={heritageIndex} sx={{ marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>Héritage {heritageIndex + 1}</Typography>

      {/* Affichage du bien légué */}
      <Typography variant="body1">Bien légué: {heritage.bien_legue || "Non spécifié"}</Typography>

      {/* Affichage des bénéficiaires associés à ce bien */}
      {(heritage.beneficiaires || []).map((beneficiaire, benefIndex) => (
        <Box key={benefIndex} sx={{ marginLeft: '20px', marginTop: '10px' }}>  
          <Typography variant="body2" gutterBottom><strong>Bénéficiaire {benefIndex + 1}:</strong></Typography>
          <Typography variant="body2">Nom: {beneficiaire.benef_nom || "Non spécifié"}</Typography>
          <Typography variant="body2">Date de naissance: {beneficiaire.benef_date_naissance ? new Date(beneficiaire.benef_date_naissance).toLocaleDateString() : "Non spécifiée"}</Typography>
          <Typography variant="body2">Relation: {beneficiaire.benef_relation || "Non spécifiée"}</Typography>
        </Box>
      ))}
    </Box>
  ))}

  {/* Affichage des tuteurs */}
  <Typography variant="body1"><strong>Tuteur:</strong></Typography>
  <Typography variant="body1">Nom: {testamentData.tuteur_nom || "Non spécifié"}</Typography>
  <Typography variant="body1">Adresse: {testamentData.tuteur_adresse || "Non spécifiée"}</Typography>

  {/* Affichage des dons */}
  <Typography variant="body1"><strong>Dons:</strong></Typography>

  {testamentData.gift_type === 'Cash' && (
    <Typography variant="body1">{`Montant: ${testamentData.gift_amount} euros, Donné à: ${testamentData.gift_recipient}`}</Typography>
  )}

  {testamentData.gift_type === 'Vehicle' && (
    <Typography variant="body1">{`Description du véhicule: ${testamentData.gift_vehicle}, Donné à: ${testamentData.gift_recipient}`}</Typography>
  )}

  {testamentData.gift_type === 'Real Estate' && (
    <Typography variant="body1">{`Description de la propriété: ${testamentData.gift_property}, Donné à: ${testamentData.gift_recipient}`}</Typography>
  )}

  {testamentData.gift_type === 'Charity' && (
    <Typography variant="body1">{`Nom de la charité: ${testamentData.gift_charity}, Montant: ${testamentData.gift_amount}`}</Typography>
  )}

  {testamentData.gift_type === 'Other' && (
    <Typography variant="body1">{`Description du don: ${testamentData.gift_other}, Donné à: ${testamentData.gift_recipient}`}</Typography>
  )}

  {!testamentData.gift_type && (
    <Typography variant="body1">Aucun don supplémentaire spécifié.</Typography>
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
    <h1 style={{ fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold',marginTop:'-26px' }}>
      MON TESTAMENT
    </h1>
    <br />  <br />
    {showTestament && (
  <div className="testament-container">
    <br />
    <h2 className='monT'>Ceci est mon testament</h2>
    {/* <p className="testament-intro">Le testament olographe doit être</p> */}
    <br />
    <p className="testament-declaration">
      Je, soussigné(e)  <strong>{testamentData.nom_testateur || "Non spécifié"}</strong> , Né(e) le
      <strong>{testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : "Non spécifiée"}</strong>
      à <strong>{testamentData.lieu_naissance_testateur || "Non spécifié"}</strong> , Domicilié(e) au   <strong>{testamentData.adresse_testateur || "Non spécifiée"}</strong> , déclare être sain(e) d’esprit,
      avoir la capacité juridique à gérer mes biens, et être majeur(e) ou mineur(e) de plus
      de 16 ans. Un mineur entre 16 et 18 ans pourra léguer la moitié de ses biens, sauf s'il
      est mineur émancipé.
    </p>
    <br />
{/* 
   
   
    {/* Héritages et Bénéficiaires */}
    {testamentData.bien_legue && JSON.parse(testamentData.bien_legue).length > 0 ? (
      JSON.parse(testamentData.bien_legue).map((bien, index) => (
        <div key={index}>
          <h3>Héritage {index + 1}</h3>
          <p className='testament-declaration'>Je lègue le bien <strong>{bien.biensL || "Non spécifié"}</strong> à :</p>

          {/* Vérifie qu'il y a des bénéficiaires pour ce bien */}
          {testamentData.adresse_bien_legue && JSON.parse(testamentData.adresse_bien_legue).length > 0 ? (
            <ul>
              {/* Boucle pour chaque bénéficiaire */}
              {JSON.parse(testamentData.adresse_bien_legue).map((beneficiaire, benefIndex) => (
                <li key={benefIndex}>
                  <p className='testament-declaration'>
                    <strong>{beneficiaire.nom || "Non spécifié"}</strong>, né(e) le <strong>{beneficiaire.date_naissance ? new Date(beneficiaire.date_naissance).toLocaleDateString() : "Non spécifiée"}</strong>,
                    qui est mon/ma <strong>{beneficiaire.relation || "Non spécifiée"}</strong>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Pas de bénéficiaires pour cet héritage.</p>
          )}
        </div>
      ))
    ) : (
      <p>Aucun héritage spécifié.</p>
    )}

<br />
    {/* Tuteur */}
    <p className='testament-declaration'>
      J'ai désigné <strong>{testamentData.tuteur_nom || "Non spécifié"}</strong>, domicilié à <strong>{testamentData.tuteur_adresse || "Non spécifiée"}</strong> comme tuteur légal pour assurer la gestion et la protection
      de mes biens en cas d'incapacité ou d'invalidité. Le tuteur devra veiller à ce que mes volontés soient respectées
      et agir dans le meilleur intérêt de mes héritiers.
    </p>
    <br />
    {/* Exécuteur */}
    <p className='testament-declaration'>
      J’ai désigné comme exécuteur de ce testament <strong>{testamentData.nom_executant || "Non spécifié"}</strong> et,
      en cas d’empêchement, <strong>{testamentData.nom_executant_alternatif || "Non spécifié"}</strong> pour garantir
      la bonne exécution de mes volontés.
    </p>
    <br />
    {/* Témoins */}
    <p className='testament-declaration'>
      Ce testament a été établi en présence de témoins dont voici les informations : <br />
      Témoin 1 : <strong>{testamentData.temoin1_nom || "Non spécifié"}</strong>, domicilié à
      <strong>{testamentData.temoin1_adresse || "Non spécifiée"}</strong>. <br />
      Témoin 2 : <strong>{testamentData.temoin2_nom || "Non spécifié"}</strong>, domicilié à
      <strong>{testamentData.temoin2_adresse || "Non spécifiée"}</strong>.
    </p>


    {/* Dons */}
    <h3 className='testament-declaration'>Montant du don</h3> 
    {testamentData.gift_type ? (
      <>
        {testamentData.gift_type === 'Cash' && (
          <p className='testament-declaration'>Je lègue un montant de <strong>{testamentData.gift_amount} euros</strong> à <strong>{testamentData.gift_recipient || "Non spécifié"}</strong>.</p>
        )}
        {testamentData.gift_type === 'Real Estate' && (
          <p className='testament-declaration'>Je lègue la propriété décrite comme <strong>{testamentData.gift_property || "Non spécifiée"}</strong> à <strong>{testamentData.gift_recipient || "Non spécifié"}</strong>.</p>
        )}
        {testamentData.gift_type === 'Vehicle' && (
          <p className='testament-declaration'>Je lègue le véhicule décrit comme <strong>{testamentData.gift_vehicle}</strong> à <strong>{testamentData.gift_recipient}</strong>.</p>
        )}
        {testamentData.gift_type === 'Charity' && (
          <p className='testament-declaration'>Je lègue un montant de <strong>{testamentData.gift_amount} euros</strong> à la charité <strong>{testamentData.gift_charity}</strong>.</p>
        )}
        {testamentData.gift_type === 'Other' && (
          <p className='testament-declaration'>Je lègue le don décrit comme <strong>{testamentData.gift_other}</strong> à <strong>{testamentData.gift_recipient}</strong>.</p>
        )}
      </>
    ) : (
      <p>Aucun don supplémentaire spécifié.</p>
    )}
 <br />

<p className="testament-declaration">
      J'accepte les conditions de ce testament et je reconnais que mes volontés doivent être respectées.
    </p>

    <p className="testament-declaration">
      Je révoque par la présente tous les testaments et codicilles antérieurs.
    </p> 

 {/* Signature */}
 <p className="testament-signature">
      Fait le <strong>{new Date().toLocaleDateString()}</strong>, en présence des témoins susmentionnés.
    </p>


    <br />
    {/* Exécuteur */}
    <p className='testament-signature'>
    Signature    
    </p>
    
    <div style={{ width: 660, height: 200 }}>
        <SignatureCanvas  
          ref={sigCanvas}  
          canvasProps={{ width: 660, height: 200, className: 'sigCanvas' }}
        />
      </div>   
      <button  style={{ marginLeft: 369}} onClick={handleClearSignature}>Effacer la signature </button>
      <button   onClick={handleSaveSignature}> Sauvegarder la signature</button>
  

    <button  style={{ marginLeft: -630 }} onClick={handleCloseTestament}>< ArrowBackIcon  /></button>
    <button className='btn-return' onClick={handleGeneratePDF}>  <span className="rocket-icon">⬇️</span>Télécharger en PDF</button>
     
  </div>           
)}  
  
       

      {/* Afficher le Stepper ou le contenu du testament en fonction de l'état */}
      <GlobalStyles styles={styles} />
      {/* {!showTestament ? ( */}
      {/* Si l'utilisateur est le propriétaire, afficher le stepper */}
      {userData?.typeofuser === 'owner' && !showTestament && (
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
                      color: index === activeStep ? 'black' : 'inherit', // Set the label color to red if active
                    }}
                  >
                    {step.label}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ marginTop: '20px' }}>
            {/* Contenu du stepper */}
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
        
      )}
       <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
          <Button variant="outlined" onClick={handleShowTestament} 
           sx={{
            backgroundColor: 'black',  // Fond noir
            color: 'white',            // Texte blanc
            '&:hover': {
              backgroundColor: '#333', // Couleur du bouton en hover (gris foncé)
            },
          }}>   
            Voir mon testament  
          </Button>         
        </Box>          
    </Box>    
  );    
};   

export default Testament;