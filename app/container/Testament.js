import React, { useState, useRef } from 'react';
import './Testament.css';
import BookIcon from '@mui/icons-material/Book';
import Swal from 'sweetalert2';

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
  { label: 'Testator Information', icon: <PersonIcon /> },
  { label: 'Executor', icon: <AssignmentIcon /> },
  { label: 'Assets to Bequeath', icon: <HomeIcon /> },
  { label: 'Witnesses', icon: <GroupIcon /> },
  { label: 'Guardian', icon: <GavelIcon /> },
  { label: 'Gift Type', icon: <MonetizationOnIcon /> },
  { label: 'Summary', icon: <AssignmentIcon /> },
];


// const steps = [
//   { label: 'Informations Testateur', icon: <PersonIcon /> },
//   { label: 'Exécuteur', icon: <AssignmentIcon /> },
//   { label: 'Biens à Léguer', icon: <HomeIcon /> },
//   { label: ' Témoins', icon: <GroupIcon /> },
//   { label: 'Tuteur ', icon: <GavelIcon /> },
//   { label: 'Type de Cadeau', icon: <MonetizationOnIcon /> },
//   { label: 'Recapitulatif', icon: <AssignmentIcon /> },
// ];

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
      gift_charity_name: testamentData.gift_charity_name || null,// Nom de la charité (si applicable)

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
  const [signature, setSignature] = useState(null); // Pour afficher la signature enregistrée



  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

// Fonction pour enregistrer la signature
const handleSaveSignature = () => {
  if (!iduser) {
    alert('Utilisateur non connecté');
    return;
  }

  const signatureData = sigCanvas.current.toDataURL('image/png'); // Récupérer la signature comme une image PNG

  // Enregistrer la signature dans localStorage avec un ID utilisateur spécifique
  localStorage.setItem(`signature_${iduser}`, signatureData);

Swal.fire({
 
  imageUrl: '/images/icon testament.png',
  title: 'Testament signed',
  imageWidth: 100, 
  imageHeight: 100, 
  imageAlt: 'Icône de réussite', 
    confirmButtonText: 'OK',   
});
  // Afficher un message ou mettre à jour l'état pour afficher un retour
  // alert('Signature enregistrée!');
};

// Fonction pour afficher la signature enregistrée
const handleShowSignature = () => {
  if (!iduser) {
    alert('Utilisateur non connecté');
    return;
  }

  const savedSignature = localStorage.getItem(`signature_${iduser}`);

  if (savedSignature) {
    setSignature(savedSignature);
  } else {
    alert('Aucune signature enregistrée pour cet utilisateur.');
  }
};     


  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Configuration globale
    doc.setFont('Times', 'normal'); // Utilisation de la police Times pour un style officiel
    doc.setFontSize(12); // Police par défaut
  
    // Main Title
    doc.setFontSize(16);
    doc.setFont('Times', 'bold');
    doc.text('LAST WILL AND TESTAMENT', 105, 20, { align: 'center' }); // Centered title horizontally

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('Times', 'italic');
    doc.text('Document for Disposition of Property After Death', 105, 30, { align: 'center' });

    // Separator Line
    doc.setDrawColor(0, 0, 0); // Black color
    doc.line(10, 35, 200, 35);

    // Introduction
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');
    let currentY = 45; // Starting vertical point
    const lineSpacing = 8; // Line spacing

    // User Information
    doc.text(
      `I, the undersigned ${testamentData.nom_testateur || 'Not specified'}, born on ${testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : 'Not specified'} in ${testamentData.lieu_naissance_testateur || 'Not specified'},`,
      20,
      currentY
    );
    currentY += lineSpacing;
    doc.text(
      `residing at ${testamentData.adresse_testateur || 'Not specified'}, declare to be of sound mind and legally capable of managing my assets.`,
      20,
      currentY
    );
    currentY += lineSpacing * 2;

    // Inheritance Section
    doc.setFont('Times', 'bold');
    doc.text('Article I.  INHERITANCE AND BENEFICIARIES :', 20, currentY);
    doc.setFont('Times', 'normal');
    currentY += lineSpacing;

    if (testamentData.bien_legue && JSON.parse(testamentData.bien_legue).length > 0) {
      const heritages = JSON.parse(testamentData.bien_legue);

      heritages.forEach((heritage, index) => {
        doc.text(`Inheritance ${index + 1}: Bequeathed Asset - ${heritage.biensL || 'Not specified'}`, 20, currentY);
        currentY += lineSpacing;

        if (testamentData.adresse_bien_legue && JSON.parse(testamentData.adresse_bien_legue).length > 0) {
          const beneficiaries = JSON.parse(testamentData.adresse_bien_legue);

          beneficiaries.forEach((beneficiary) => {
            doc.text(
              `  - Beneficiary: ${beneficiary.nom || 'Not specified'}, born on ${beneficiary.date_naissance
                ? new Date(beneficiary.date_naissance).toLocaleDateString()
                : 'Not specified'
              }, relation: ${beneficiary.relation || 'Not specified'}.`,
              20,
              currentY
            );
            currentY += lineSpacing;
          });
        } else {
          doc.text('  No beneficiary specified.', 20, currentY);
          currentY += lineSpacing;
        }

        currentY += lineSpacing;
      });
    } else {
      doc.text('No inheritance specified.', 20, currentY);
      currentY += lineSpacing;
    }

    // Guardian Section
    doc.setFont('Times', 'bold');
    doc.text('Article II. GUARDIAN AND EXECUTOR:', 20, currentY);
    doc.setFont('Times', 'normal');
    currentY += lineSpacing;
    doc.text(
      `I have appointed ${testamentData.tuteur_nom || 'Not specified'}, residing at ${testamentData.tuteur_adresse || 'Not specified'
      }, as the legal guardian.`,
      20,
      currentY
    );
    currentY += lineSpacing;

    // Executor Section
    doc.setFont('Times', 'bold');
    doc.text('Testamentary Executor:', 20, currentY);
    doc.setFont('Times', 'normal');
    currentY += lineSpacing;
    doc.text(
      `I have appointed ${testamentData.nom_executant || 'Not specified'}, and in case of incapacity, ${testamentData.nom_executant_alternatif || 'Not specified'
      }, as the testamentary executor.`,
      20,
      currentY
    );
    currentY += lineSpacing;

    // Witness Section
    doc.setFont('Times', 'bold');
    doc.text('Witnesses:', 20, currentY);
    doc.setFont('Times', 'normal');
  
    currentY += lineSpacing;
    doc.text(
      `Witness 1: ${testamentData.temoin1_nom || 'Not specified'}, residing at ${testamentData.temoin1_adresse || 'Not specified'
      }.`,
      20,
      currentY
    );
    currentY += lineSpacing;
    doc.text(
      `Witness 2: ${testamentData.temoin2_nom || 'Not specified'}, residing at ${testamentData.temoin2_adresse || 'Not specified'
      }.`,
      20,
      currentY
    );

    currentY += lineSpacing *2 ;


    // Donations Section
    doc.setFont('Times', 'bold');
    doc.text('Aerticle III. DONATIONS:', 20, currentY);
    doc.setFont('Times', 'normal');
    currentY += lineSpacing;
    doc.text(
      ` I wish to make the following donation:`,
      20,
      currentY
    );
    currentY += lineSpacing;

    if (testamentData.gift_type) {
      switch (testamentData.gift_type) {
        case 'Cash':
          doc.text(
            `Type: Cash, Amount: ${testamentData.gift_amount || 'Not specified'} euros, Given to: ${testamentData.gift_recipient || 'Not specified'}`,
            20,
            currentY
          );
          break;
        case 'Vehicle':
          doc.text(
            `Type: Vehicle, Description: ${testamentData.gift_vehicle || 'Not specified'}, Given to: ${testamentData.gift_recipient || 'Not specified'}`,
            20,
            currentY
          );
          break;
        case 'Real Estate':
          doc.text(
            `Type: Real Estate, Description: ${testamentData.gift_property || 'Not specified'}, Given to: ${testamentData.gift_recipient || 'Not specified'}`,
            20,
            currentY
          );
          break;
        case 'Charity':
          doc.text(
            `Type: Charity, Name: ${testamentData.gift_charity || 'Not specified'}, Amount: ${testamentData.gift_amount || 'Not specified'} euros`,
            20,
            currentY
          ); 
          break;
        case 'Other':
          doc.text(
            `Type: Other, Description: ${testamentData.gift_other || 'Not specified'}, Given to: ${testamentData.gift_recipient || 'Not specified'}`,
            20,
            currentY
          );
          break;
        default:
          doc.text('Donation type not specified.', 20, currentY);
      }
    } else {
      doc.text('No additional donation specified.', 20, currentY);
    }
   
    currentY += lineSpacing *2;
    // Final Clause
    doc.setFont('Times', 'italic');
    doc.text('I acknowledge that my wishes expressed in this will must be respected.', 20, currentY);
    currentY += lineSpacing;
    doc.text('I revoke all prior wills.', 20, currentY);

    // Position element to the right
    currentY += lineSpacing * 2;
    doc.setFont('Times', 'bold');
    const dateText = `Done on ${new Date().toLocaleDateString()}, in the presence of witnesses.`;

    // Display date to the right
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), currentY); // Right-aligned text

    currentY += lineSpacing ; // Space for the next section

 // Affichage de "Signature:" à droite
doc.text('Signature:', pageWidth - 20 - doc.getTextWidth('Signature:'), currentY);

// Vérification des données de signature
const savedSignature = localStorage.getItem(`signature_${iduser}`);

if (savedSignature) {
  // Ajouter l'image de la signature avec les mêmes dimensions
  const signatureWidth = 195.79; // Largeur en mm
  const signatureHeight = 66.15; // Hauteur en mm
  const signatureX = pageWidth - 3 - signatureWidth; // Position X ajustée pour alignement à droite
  const signatureY = currentY + lineSpacing; // Position Y en bas après "Signature:"

  doc.addImage(savedSignature, 'PNG', signatureX, signatureY, signatureWidth, signatureHeight);
} else {
  // Afficher "Not provided." si aucune signature n'est fournie
  doc.text('Not provided.', pageWidth - 20 - doc.getTextWidth('Not provided.'), currentY + lineSpacing);
}
  
  // Télécharger le PDF         
  doc.save('will.pdf');              
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
              label="Amount"
              value={testamentData.gift_amount}
              onChange={(e) => handleGiftFieldsChange('gift_amount', e.target.value)}
              margin="normal"
              fullWidth
              sx={{ width: '200%' }} // Champ plus large
            />
            <TextField
              label="Beneficiary"
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
              label="Vehicle Description"
              value={testamentData.gift_vehicle}
              onChange={(e) => handleGiftFieldsChange('gift_vehicle', e.target.value)}
              margin="normal"
              fullWidth
              sx={{ width: '200%' }} // Champ plus large
            />
            <TextField
              label="Beneficiary"
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
              label="Property Description"
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
              label="Charity Name"
              value={testamentData.gift_charity}
              onChange={(e) => handleGiftFieldsChange('gift_charity', e.target.value)}
              margin="normal"
              fullWidth
              sx={{ width: '200%' }} // Champ plus large
            />
            <TextField
              label="Amount"
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
              label="Donation Description"
              value={testamentData.gift_other}
              onChange={(e) => handleGiftFieldsChange('gift_other', e.target.value)}
              margin="normal"
              fullWidth
              sx={{ width: '200%' }} // Champ plus large
            />
            <TextField
              label="Beneficiary"
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
              label="Foreign Testator"
            />
            <TextField
              label="Testator's Name"
              name="nom_testateur"
              value={testamentData.nom_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              name="date_naissance_testateur"
              type="date"
              value={testamentData.date_naissance_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Place of Birth"
              name="lieu_naissance_testateur"
              value={testamentData.lieu_naissance_testateur}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Residential Address"
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
              label="Executor's Name"
              name="nom_executant"
              value={testamentData.nom_executant}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Alternate Executor's Name"
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
                    <h3 className='heritage'>HERITAGE {heritageIndex + 1}</h3>
                    <TextField
                      label="Inherited Asset"
                      name="bien_legue"
                      value={heritage.bien_legue}
                      onChange={(e) => handleChange(e, heritageIndex)}
                      fullWidth
                      margin="normal"
                      required
                    />
                    {/* <TextField
              label="Address of the Inherited Asset"
              name="adresse_bien_legue"
              value={heritage.adresse_bien_legue}
              onChange={(e) => handleChange(e, heritageIndex)}
              fullWidth
              margin="normal"
            /> */}
                    {heritage.beneficiaires.map((benef, benefIndex) => (
                      <div key={benefIndex}>
                        <h4>Beneficiary {benefIndex + 1}</h4>
                        <TextField
                          label="Beneficiary's Name"
                          name="benef_nom"
                          value={benef.benef_nom}
                          onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Date of Birth"
                          name="benef_date_naissance"
                          type="date"
                          value={benef.benef_date_naissance}
                          onChange={(e) => handleChange(e, heritageIndex, benefIndex)}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                        {/* <TextField
                  label="Beneficiary's Address"
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
                    <Button onClick={() => addBeneficiary(heritageIndex)}>Add Beneficiary</Button>
                  </div>
                ))}
                <Button onClick={addHeritage}>Add New Asset</Button>
              </>
            )}
          </div>
        );


      case 3:
        return (
          <>
            <TextField
              label="Witness 1 Name"
              name="temoin1_nom"
              value={testamentData.temoin1_nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Witness 1 Address"
              name="temoin1_adresse"
              value={testamentData.temoin1_adresse}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Witness 2 Name"
              name="temoin2_nom"
              value={testamentData.temoin2_nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Witness 2 Address"
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
              label="Guardian's Name"
              name="tuteur_nom"
              value={testamentData.tuteur_nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Guardian's Address"
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
                marginLeft: '-350px',
              }}
            >
              Personal gifts of belongings to specific people:   <br /> <br />
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
        )
          ;

      case 6: // Recapitulatif
        return (
          <Box>
            <Typography variant="h6">Summary</Typography>

            {/* Information about the testator */}
            <Typography variant="body1"><strong>Testator:</strong></Typography>
            <Typography variant="body1">Name: {testamentData.nom_testateur || "Not specified"}</Typography>
            <Typography variant="body1">Date of birth: {testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : "Not specified"}</Typography>
            <Typography variant="body1">Place of birth: {testamentData.lieu_naissance_testateur || "Not specified"}</Typography>
            <Typography variant="body1">Address: {testamentData.adresse_testateur || "Not specified"}</Typography>
            <Typography variant="body1">Foreign testator: {testamentData.etranger ? "Yes" : "No"}</Typography>

            {/* Information about the executor */}
            <Typography variant="body1"><strong>Executor:</strong></Typography>
            <Typography variant="body1">Name: {testamentData.nom_executant || "Not specified"}</Typography>
            <Typography variant="body1">Alternate name: {testamentData.nom_executant_alternatif || "Not specified"}</Typography>

            {/* Information about the witnesses */}
            <Typography variant="body1"><strong>Witness 1:</strong></Typography>
            <Typography variant="body1">Name: {testamentData.temoin1_nom || "Not specified"}</Typography>
            <Typography variant="body1">Address: {testamentData.temoin1_adresse || "Not specified"}</Typography>

            <Typography variant="body1"><strong>Witness 2:</strong></Typography>
            <Typography variant="body1">Name: {testamentData.temoin2_nom || "Not specified"}</Typography>
            <Typography variant="body1">Address: {testamentData.temoin2_adresse || "Not specified"}</Typography>

            {/* Loop to display inheritances and beneficiaries */}
            {testamentData.heritages.map((heritage, heritageIndex) => (
              <Box key={heritageIndex} sx={{ marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>Inheritance {heritageIndex + 1}</Typography>

                {/* Display of the bequeathed property */}
                <Typography variant="body1">Bequeathed property: {heritage.bien_legue || "Not specified"}</Typography>

                {/* Display beneficiaries associated with this property */}
                {(heritage.beneficiaires || []).map((beneficiaire, benefIndex) => (
                  <Box key={benefIndex} sx={{ marginLeft: '20px', marginTop: '10px' }}>
                    <Typography variant="body2" gutterBottom><strong>Beneficiary {benefIndex + 1}:</strong></Typography>
                    <Typography variant="body2">Name: {beneficiaire.benef_nom || "Not specified"}</Typography>
                    <Typography variant="body2">Date of birth: {beneficiaire.benef_date_naissance ? new Date(beneficiaire.benef_date_naissance).toLocaleDateString() : "Not specified"}</Typography>
                    <Typography variant="body2">Relationship: {beneficiaire.benef_relation || "Not specified"}</Typography>
                  </Box>
                ))}
              </Box>
            ))}

            {/* Display of guardians */}
            <Typography variant="body1"><strong>Guardian:</strong></Typography>
            <Typography variant="body1">Name: {testamentData.tuteur_nom || "Not specified"}</Typography>
            <Typography variant="body1">Address: {testamentData.tuteur_adresse || "Not specified"}</Typography>

            {/* Display of gifts */}
            <Typography variant="body1"><strong>Gifts:</strong></Typography>

            {testamentData.gift_type === 'Cash' && (
              <Typography variant="body1">{`Amount: ${testamentData.gift_amount} euros, Given to: ${testamentData.gift_recipient}`}</Typography>
            )}

            {testamentData.gift_type === 'Vehicle' && (
              <Typography variant="body1">{`Vehicle description: ${testamentData.gift_vehicle}, Given to: ${testamentData.gift_recipient}`}</Typography>
            )}

            {testamentData.gift_type === 'Real Estate' && (
              <Typography variant="body1">{`Property description: ${testamentData.gift_property}, Given to: ${testamentData.gift_recipient}`}</Typography>
            )}

            {testamentData.gift_type === 'Charity' && (
              <Typography variant="body1">{`Charity name: ${testamentData.gift_charity}, Amount: ${testamentData.gift_amount}`}</Typography>
            )}

            {testamentData.gift_type === 'Other' && (
              <Typography variant="body1">{`Gift description: ${testamentData.gift_other}, Given to: ${testamentData.gift_recipient}`}</Typography>
            )}

            {/* Display when no gift type is specified */}
            {!testamentData.gift_type && (
              <Typography variant="body1">No additional gift specified.</Typography>
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
      <h1 style={{ fontSize: '20px', color: 'rgb(39, 39, 39)', fontWeight: 'bold', marginTop: '-26px' }}>
        MY WILL
      </h1>
      <br />  <br />
      {showTestament && (
        <div className="testament-container">
          <br />
          <h2 className='monT'>This is my will</h2>
          <br />
          <p className="testament-declaration">
            I, the undersigned <strong>{testamentData.nom_testateur || "Not specified"}</strong>, born on
            <strong>{testamentData.date_naissance_testateur ? new Date(testamentData.date_naissance_testateur).toLocaleDateString() : "Not specified"}</strong>
            in <strong>{testamentData.lieu_naissance_testateur || "Not specified"}</strong>, residing at <strong>{testamentData.adresse_testateur || "Not specified"}</strong>, declare that I am of sound mind, have the legal capacity to manage my assets, and am of legal age or a minor over 16 years old. A minor between 16 and 18 years old may bequeath half of their assets unless emancipated.
          </p>
          <br />
          {/* Inheritances and Beneficiaries */}
          {testamentData.bien_legue && JSON.parse(testamentData.bien_legue).length > 0 ? (
            JSON.parse(testamentData.bien_legue).map((bien, index) => (
              <div key={index}>
                <h3>Inheritance {index + 1}</h3>
                <p className='testament-declaration'>I bequeath the property <strong>{bien.biensL || "Not specified"}</strong> to:</p>

                {/* Check for beneficiaries for this property */}
                {testamentData.adresse_bien_legue && JSON.parse(testamentData.adresse_bien_legue).length > 0 ? (
                  <ul>
                    {/* Loop through each beneficiary */}
                    {JSON.parse(testamentData.adresse_bien_legue).map((beneficiaire, benefIndex) => (
                      <li key={benefIndex}>
                        <p className='testament-declaration'>
                          <strong>{beneficiaire.nom || "Not specified"}</strong>, born on <strong>{beneficiaire.date_naissance ? new Date(beneficiaire.date_naissance).toLocaleDateString() : "Not specified"}</strong>,
                          who is my <strong>{beneficiaire.relation || "Not specified"}</strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No beneficiaries for this inheritance.</p>
                )}
              </div>
            ))
          ) : (
            <p>No inheritance specified.</p>
          )}

          <br />
          {/* Guardian */}
          <p className='testament-declaration'>
            I have designated <strong>{testamentData.tuteur_nom || "Not specified"}</strong>, residing at <strong>{testamentData.tuteur_adresse || "Not specified"}</strong> as the legal guardian to manage and protect
            my assets in case of incapacity or disability. The guardian must ensure that my wishes are respected
            and act in the best interest of my heirs.
          </p>
          <br />
          {/* Executor */}
          <p className='testament-declaration'>
            I have designated <strong>{testamentData.nom_executant || "Not specified"}</strong> as the executor of this will, and in case of inability, <strong>{testamentData.nom_executant_alternatif || "Not specified"}</strong> to ensure
            the proper execution of my wishes.
          </p>
          <br />
          {/* Witnesses */}
          <p className='testament-declaration'>
            This will has been made in the presence of witnesses whose details are as follows: <br />
            Witness 1: <strong>{testamentData.temoin1_nom || "Not specified"}</strong>, residing at
            <strong>{testamentData.temoin1_adresse || "Not specified"}</strong>. <br />
            Witness 2: <strong>{testamentData.temoin2_nom || "Not specified"}</strong>, residing at
            <strong>{testamentData.temoin2_adresse || "Not specified"}</strong>.
          </p>



          {/* Dons */}
          <h3 className='testament-declaration'>Amount of the gift</h3>
          {testamentData.gift_type ? (
            <>
              {testamentData.gift_type === 'Cash' && (
                <p className='testament-declaration'>I bequeath an amount of <strong>{testamentData.gift_amount} euros</strong> to <strong>{testamentData.gift_recipient || "Not specified"}</strong>.</p>
              )}
              {testamentData.gift_type === 'Real Estate' && (
                <p className='testament-declaration'>I bequeath the property described as <strong>{testamentData.gift_property || "Not specified"}</strong> to <strong>{testamentData.gift_recipient || "Not specified"}</strong>.</p>
              )}
              {testamentData.gift_type === 'Vehicle' && (
                <p className='testament-declaration'>I bequeath the vehicle described as <strong>{testamentData.gift_vehicle}</strong> to <strong>{testamentData.gift_recipient}</strong>.</p>
              )}
              {testamentData.gift_type === 'Charity' && (
                <p className='testament-declaration'>I bequeath an amount of <strong>{testamentData.gift_amount} euros</strong> to the charity <strong>{testamentData.gift_charity}</strong>.</p>
              )}
              {testamentData.gift_type === 'Other' && (
                <p className='testament-declaration'>I bequeath the gift described as <strong>{testamentData.gift_other}</strong> to <strong>{testamentData.gift_recipient}</strong>.</p>
              )}
            </>
          ) : (
            <p>No additional gift specified.</p>
          )}
          <br />

          <p className="testament-declaration">
            I accept the terms of this will and acknowledge that my wishes must be respected.
          </p>

          <p className="testament-declaration">
            I hereby revoke all previous wills and codicils.
          </p>

          {/* Signature */}
          <p className="testament-signature">
            Done on <strong>{new Date().toLocaleDateString()}</strong>, in the presence of the aforementioned witnesses.
          </p>

          <br />
          {/* Executor */}
          <div>
      <p className="testament-signature">Signature</p>
      <div >
        <SignatureCanvas  
          ref={sigCanvas}
          canvasProps={{ width: 740, height: 250, className: 'sigCanvas' }}
        />
      </div>

    
 {/* Affichage des boutons uniquement si l'utilisateur est le propriétaire */}
 {userData?.typeofuser === 'owner' && (        
        <>     
          <button
            style={{ marginLeft: 435, fontWeight: 'bold' }}
            onClick={handleClearSignature}
          >
            Clear signature  /
          </button>
          <button style={{ fontWeight: 'bold' }} onClick={handleSaveSignature}>
            Save signature
          </button>
        </>  
      )} 
      {/* Bouton Show signature visible uniquement pour Emergency Contact */}
      {userData?.typeofuser !== 'owner' && (
        <>
          <button
            style={{ fontWeight: 'bold', marginLeft: '221px' }}
            onClick={handleShowSignature}
          > 
            Show signature  
          </button> 
        </>
      )}  

      {/* Si une signature est enregistrée, l'afficher */}
      {signature && (
        <div style={{ marginTop: '-260px', marginLeft: '171px' }}>
          <img
            src={signature}
            alt="Signature"
            style={{width: 770, height: 280, className: 'sigCanvas' }}
          />
        </div>
      )}   
     
    </div>    
  
      <button style={{ marginLeft: -20 ,marginTop:'-12px'}} onClick={handleCloseTestament}>< ArrowBackIcon /></button>
          <button className='btn-return' onClick={handleGeneratePDF}>  <span className="rocket-icon">⬇️</span>Download as PDF</button>
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
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleNextA : handleNext} // Appel handleNextA à la dernière étape
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>

        </>

      )}
      <Box
        sx={{
          position: 'absolute', // Permet de positionner le Box relativement à son parent
          top: '95px', // Ajustez cette valeur pour le placer plus haut
          right: '20px', // Ajustez cette valeur pour le placer à droite
          textAlign: 'right'
        }}
      >
        <Button
          variant="outlined"
          onClick={handleShowTestament}
          sx={{
            backgroundColor: 'black',  // Fond noir
            color: 'white',            // Texte blanc
            '&:hover': {
              backgroundColor: '#333', // Couleur du bouton en hover (gris foncé)
            },
          }}
        >    <BookIcon sx={{ marginRight: '8px' }} />
View my will
</Button>
      </Box>

    </Box>
  );
};

export default Testament;