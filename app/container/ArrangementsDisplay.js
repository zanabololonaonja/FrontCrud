import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';


const styles = {
    container: {
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif', // Ajoutez une police par défaut
    },
    title: {
        marginBottom: '20px',
        textAlign: 'left',
        fontFamily: 'Georgia, serif', // Police différente pour le titre
    },
    content: {
        marginBottom: '20px',
    },
    text: {
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '19px', // Taille de police plus grande
        lineHeight: '1.9',
        fontFamily: 'Georgia, serif', // Hauteur de ligne pour un meilleur espacement
    },
    button: {
        display: 'block',
        margin: '10px auto',
    },
    image: {
        maxWidth: '220px', // Ajustez la taille de l'image
        margin: '10px',
        zIndex: 0, // Met l'image derrière le texte
    },
    image1: {
        maxWidth: '110px', // Ajustez la taille de l'image
        margin: '10px',
        marginTop: '-66px',
        zIndex: 0, // Met l'image derrière le texte
    },
    textWithImages: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },


    textWithI: {
        display: 'flex',
        flexDirection: 'column', // Assurez-vous que l'image est au-dessus du texte
        alignItems: 'left',
        justifyContent: 'flex-start', // Alignez le contenu vers le haut
        paddingTop: '22px',
        position: 'relative', // Ajouté pour gérer le z-index


    },



    textbg: {

        position: 'relative', // Ajouté pour s'assurer que le texte est au-dessus de l'image
        zIndex: 1, // Assurez-vous que le texte est au-dessus
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Ajout d'un fond semi-transparent pour améliorer la lisibilité
        padding: '10px', // Ajout de padding pour un meilleur aspect
        borderRadius: '5px', // Arrondir les coins
        fontSize: '19px', // Taille de police plus grande
        lineHeight: '1.9',
        fontFamily: 'Georgia, serif', // Hauteur de ligne pour un meilleur espacement
    },


};






const ArrangementsDisplay = ({ arrangements, onClose, userData }) => {

    // State pour la gestion de la modale de modification    
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState(arrangements);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // Vérifiez dans localStorage si l'utilisateur est propriétaire
        const userData = JSON.parse(localStorage.getItem('userData')); // Récupérer les données de l'utilisateur
        if (userData && userData.typeofuser === 'owner') {
            setIsOwner(true); // Si c'est un propriétaire, définir `isOwner` sur true
        }
    }, []);


    // Gestion de la modale
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Gestion des changements dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };





    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Global Configuration
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 14; // Horizontal margin
        const marginY = 20; // Vertical margin
        const lineSpacing = 8; // Line spacing
        let currentY = marginY; // Starting Y position
    
        // Main Title
        doc.setFont('Times', 'bold');
        doc.setFontSize(24);
        doc.text('Funeral Estimate', marginX, currentY);
    
        // Add Logo in the top-right corner
        const imgWidth = 30;
        const imgHeight = 30;
        doc.addImage('/images/OIP.jpg', 'JPEG', pageWidth - imgWidth - marginX, marginY + 5, imgWidth, imgHeight);
    
        currentY += lineSpacing * 2;
    
        // General Text
        doc.setFont('Times', 'normal');
        doc.setFontSize(12);
    
        // Funeral Type
        currentY += lineSpacing;
        doc.text("I have chosen funeral arrangements of type:", marginX, currentY);
        doc.setFont('Times', 'bold');
        doc.text(arrangements.typefunerailles || 'Not specified', marginX + 77, currentY);
        doc.setFont('Times', 'normal');
    
        currentY += lineSpacing;
        doc.text(
            "This means I opted for a ceremony tailored to my wishes and traditions,",
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
        currentY += lineSpacing;
        doc.text(
            " allowing my loved ones to pay their respects in the most meaningful way.",
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        // Funeral Vigil Section
        currentY += lineSpacing * 2;
        doc.setFont('Times', 'bold');
        doc.text('1. Funeral Vigil:', marginX, currentY);
    
        currentY += lineSpacing;
        doc.setFont('Times', 'normal');
        doc.text(
            `The funeral vigil will take place at ${arrangements.lieudeces || 'Not specified'} for a duration of ${arrangements.transportdistance || 'Not specified'} hours.`,
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        currentY += lineSpacing;
        doc.text(
            `The deceased will be transported using a ${arrangements.typevehicule || 'Not specified'}.`,
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        currentY += lineSpacing;
        doc.text(
            "This vigil will provide an opportunity for my loved ones to gather and pay their respects before the funeral, offering them a moment of reflection and togetherness.",
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        // Ceremony Organization Section
        currentY += lineSpacing * 2;
        doc.setFont('Times', 'bold');
        doc.text('2. Ceremony Organization:', marginX, currentY);
    
        currentY += lineSpacing;
        doc.setFont('Times', 'normal');
        const organisationText = arrangements.organisation_ceremonie
            ? `I have confirmed the organization of the ceremony. It will be held at ${arrangements.lieuceremonie || 'Not specified'}, and it will be a ${arrangements.typeceremonie || 'Not specified'} ceremony.`
            : "I have declined the organization of the ceremony.";
        doc.text(organisationText, marginX, currentY, { maxWidth: pageWidth - 2 * marginX });
    
        currentY += lineSpacing  * 2;    
        doc.text(    
            "This ensures that my wishes are respected for this significant occasion, providing a solemn setting for my loved ones.",
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        // Coffin Type Section
        currentY += lineSpacing * 2;
        doc.setFont('Times', 'bold');
        doc.text('3. Coffin Type:', marginX, currentY);
    
        currentY += lineSpacing;
        doc.setFont('Times', 'normal');
        doc.text(
            `Regarding the coffin type, I have chosen a ${arrangements.typecercueil || 'Not specified'}.`,
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        currentY += lineSpacing;
        doc.text(
            "I want the coffin to align with the chosen type of ceremony, ensuring dignity and respect for the occasion.",
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        // Resting Place Section
        currentY += lineSpacing * 2;
        doc.setFont('Times', 'bold');
        doc.text('4. Resting Place:', marginX, currentY);
    
        currentY += lineSpacing;
        doc.setFont('Times', 'normal');
        doc.text(
            `The resting place will be at ${arrangements.lieu_repos || 'Not specified'}, with a concession planned for a duration of ${arrangements.concession_duree || 'Not specified'} years.`,
            marginX,
            currentY,
            { maxWidth: pageWidth - 2 * marginX }
        );
    
        // Personal Message Section
        currentY += lineSpacing * 2;
        doc.setFont('Times', 'bold');
        doc.text('5. Personal Message:', marginX, currentY);
    
        currentY += lineSpacing;
        doc.setFont('Times', 'normal');
        const messageText = arrangements.message_personnel
            ? `The personalized message for the ceremony is: "${arrangements.message_personnel}".`
            : "No personalized message has been added.";
        doc.text(messageText, marginX, currentY, { maxWidth: pageWidth - 2 * marginX });
    
        // Check if a new page is needed
        if (currentY + 30 > doc.internal.pageSize.getHeight()) {
            doc.addPage();
            currentY = marginY;
        }
    
        // Save the PDF
        doc.save('funeral_estimate.pdf');
    };
    
     

    // Fonction pour soumettre les changements
    const handleSubmit = async () => {
        try {
            // Appel de l'API pour mettre à jour les arrangements
            const res = await fetch('http://localhost:5000/api/updatearrangements', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });

            if (!res.ok) {
                throw new Error('Erreur lors de la mise à jour');

            }

            const data = await res.json();
            console.log('Mise à jour réussie:', data);

            toast.success('Arangement  avec succès ');

            setOpenModal(false); // Fermer la modale après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast.error('Erreur lors de la mise à jour !'); // Notification d'erreur
        }
    };

    if (!arrangements) {
        return (
            <Box style={styles.container}>
                <Typography variant="h4" style={styles.title}>Estimation obsèques</Typography>
                <Typography style={styles.text}>Aucun arrangement trouvé.</Typography>
                <Button variant="contained" color="secondary" onClick={onClose} style={styles.button}>
                    Fermer
                </Button>
            </Box>
        );
    }
    console.log(arrangements);  // Assurez-vous que les données sont complètes

    return (
        <Box style={styles.container}>
            <Typography variant="h4" style={styles.title}>Estimation obsèques</Typography>
            <Box style={styles.content}>
                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        I have chosen funeral arrangements of type <strong>{arrangements.typefunerailles || 'Not specified'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            This means I opted for a ceremony tailored to my wishes and traditions.
                        </span>
                    </Typography>
                    <img src="/images/OIP.jpg" alt="Image" style={styles.image1} />
                </Box>
                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        The funeral vigil will take place at <strong>{arrangements.lieudeces || 'Not specified'}</strong> for a duration of <strong>{arrangements.transportdistance || 'Not specified'} hours</strong>.
                        The deceased will be transported using a <strong>{arrangements.typevehicule || 'Not specified'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            This vigil will allow my loved ones to gather and pay their respects before the funeral.
                        </span>
                    </Typography>  
                </Box>  
                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        I have {arrangements.organisation_ceremonie ? "confirmed" : "declined"} the organization of the ceremony.
                        {arrangements.organisation_ceremonie && (
                            <>
                                {' '}It will be held at <strong>{arrangements.lieuceremonie || 'Not specified'}</strong>, and it will be a <strong>{arrangements.typeceremonie || 'Not specified'}</strong> ceremony.
                            </>
                        )}
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            This ensures that my wishes are respected for this important occasion.
                        </span>
                    </Typography>
                </Box>

                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        Regarding the type of coffin, I have chosen a <strong>{arrangements.typecercueil || 'Not specified'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            This choice reflects my values and beliefs, and I want the coffin to align with the type of ceremony chosen.
                        </span>
                    </Typography>
                </Box>
                <Box style={styles.textWithI}>
                    {/* <img src="/images/ENTR.png" alt="Image" style={styles.image} /> */}
                    <Typography style={styles.textbg}>
                        The resting place will be at <strong>{arrangements.lieu_repos || 'Not specified'}</strong> with a concession planned for a duration of <strong>{arrangements.concession_duree || 'Not specified'} years</strong>.
                        <br />
                        {arrangements.message_personnel
                            ? ` The personalized message for the ceremony is: "${arrangements.message_personnel}".`
                            : " No personalized message has been added."}
                    </Typography>

                </Box>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="text" // Utilisez "text" pour un bouton sans fond
                    onClick={onClose}
                    style={{
                        minWidth: 'auto', // Assurez-vous que la largeur du bouton est adaptée à la flèche
                        padding: 0, // Retirez tout padding inutile
                        color: 'black', // Flèche noire
                    }}
                >
                    <ArrowBackIcon style={{ color: 'black' }} /> {/* Flèche noire */}
                </Button>



                {/* {userData?.typeofuser === 'owner' && ! (
        <>           */}
                <>
                    {isOwner && ( // Affiche le bouton uniquement si l'utilisateur est le propriétaire
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#f0f0f0',
                                marginLeft: '200px',
                                color: 'black',
                                marginTop: '9px',
                                height: '38px',
                                width: '120px',
                                '&:hover': {
                                    backgroundColor: '#333',
                                    color: 'white',
                                },
                            }}
                            onClick={handleOpenModal}
                        >
                            Modify

                        </Button>
                    )}
                </>
                {/* </>     
        
    )} */}
                <Button variant="contained" sx={{
                    backgroundColor: 'black',  // Fond noir
                    color: 'white',            // Texte blanc
                    '&:hover': {
                        backgroundColor: '#333', // Couleur du bouton en hover (gris foncé)
                    },
                }}
                    onClick={generatePDF} style={styles.button}>
Download PDF
</Button>
            </Box>
            {/* Modale de modification */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
<Typography variant="h6">Edit Arrangements</Typography>

                    {/* Disposition en deux colonnes */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type of Funeral"
                                name="typefunerailles"
                                value={formValues.typefunerailles}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Place of Death"
                                name="lieudeces"
                                value={formValues.lieudeces}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Distance de transport (km)"
                                name="transportdistance"
                                value={formValues.transportdistance}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type of Vehicle"
                                name="typevehicule"
                                value={formValues.typevehicule}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type of Coffin"
                                name="typecercueil"
                                value={formValues.typecercueil}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type of Urn"
                                name="typeurne"
                                value={formValues.typeurne}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Fleurs"
                                name="fleurs"
                                value={formValues.fleurs}
                                onChange={handleChange}
                                margin="normal"  
                            />
                        </Grid> */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Ceremony Location"
                                name="lieuceremonie"
                                value={formValues.lieuceremonie}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type of Ceremony"
                                name="typeceremonie"
                                value={formValues.typeceremonie}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth 
                             label="Place of Rest"
                                name="lieu_repos"
                                value={formValues.lieu_repos}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Duration of the concession (years)"
                                name="concession_duree"
                                value={formValues.concession_duree}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Personalized Message"
                                                                name="message_personnel"
                                value={formValues.message_personnel}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                        Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ArrangementsDisplay;