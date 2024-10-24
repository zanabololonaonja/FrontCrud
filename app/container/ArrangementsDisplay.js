import React from 'react';
import { useState } from 'react';
import { Box, Button, Typography, Modal, TextField, Grid } from '@mui/material';
import { toast } from 'react-toastify'; // Importer Toastify
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






const ArrangementsDisplay = ({ arrangements, onClose , userData}) => {
  
    // State pour la gestion de la modale de modification    
    const [openModal, setOpenModal] = useState(false);  
    const [formValues, setFormValues] = useState(arrangements);

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

        // Définir la taille et le style de police pour le titre
        doc.setFontSize(22);
        doc.text('Estimation obsèques', 14, 22);


        // Définir la taille de police pour le texte
        doc.setFontSize(12);
        // Première section
        // Ajouter l'image en haut à droite du titre
        const imgWidth = 30; // Largeur de l'image
        const imgHeight = 30; // Hauteur de l'image
        doc.addImage("/images/OIP.jpg", "JPEG", doc.internal.pageSize.getWidth() - imgWidth - 14, 10, imgWidth, imgHeight); // Ajustez la position de l'image

        doc.text("J'ai choisi que les funérailles de type ", 14, 40);
        doc.setFont("Helvetica", "bold");
        doc.text(arrangements.typefunerailles || 'Non spécifié', 90, 40);
        doc.setFont("Helvetica", "normal");
        doc.text("Cela signifie que j'ai opté pour une cérémonie adaptée à mes souhaits et à mes traditions.", 14, 50);

        // Deuxième section
        // Ajustez la taille et la position selon vos besoins
        doc.text(`La veillée funèbre se tiendra à ${arrangements.lieudeces || 'Non spécifié'} pour une durée de ${arrangements.transportdistance || 'Non spécifiée'} heures.`, 14, 60);
        doc.text(`Le défunt sera transporté avec un ${arrangements.typevehicule || 'Non spécifié'}.`, 14, 80);
        doc.text("Cette veillée me permettra de rassembler mes proches pour rendre hommage avant les funérailles.", 14, 100);

        // Troisième section
        const organisationText = arrangements.organisation_ceremonie ?
            `J'ai confirmé l'organisation de la cérémonie. Elle se tiendra à ${arrangements.lieuceremonie || 'Non spécifié'},
             et ce sera une cérémonie ${arrangements.typeceremonie || 'Non spécifié'}.` :
            "J'ai refusé l'organisation de la cérémonie.";
        doc.text(organisationText, 14, 130);
        doc.text("Cela me permet de m'assurer que mes souhaits sont respectés pour cette occasion importante.", 14, 140);

        // Quatrième section
        doc.text(`Concernant le type de cercueil, j'ai opté pour un ${arrangements.typecercueil || 'Non spécifié'}.`, 14, 150);
        doc.text("Je souhaite que le cercueil soit en adéquation avec le type de cérémonie choisie.", 14, 160);

        // Cinquième section
        doc.text(`Le lieu de repos sera au ${arrangements.lieu_repos || 'Non spécifié'} avec une concession prévue pour une durée de ${arrangements.concession_duree || 'Non spécifiée'} ans.`, 14, 170);
        const messageText = arrangements.message_personnel ?
            `Le message personnalisé pour la cérémonie est : "${arrangements.message_personnel}".` :
            "Aucun message personnalisé n'a été ajouté.";
        doc.text(messageText, 14, 180);

        // Sauvegarder le PDF
        doc.save('estimation_obseques.pdf');
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
            alert("Album ajouté avec succès!");


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
                        J'ai choisi que les funérailles soient de type <strong>{arrangements.typefunerailles || 'Non spécifié'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            Cela signifie que j'ai opté pour une cérémonie adaptée à mes souhaits et à mes traditions.
                        </span>
                    </Typography>
                    <img src="/images/OIP.jpg" alt="Image" style={styles.image1} />
                </Box>
                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        La veillée funèbre se tiendra à <strong>{arrangements.lieudeces || 'Non spécifié'}</strong> pour une durée de <strong>{arrangements.transportdistance || 'Non spécifiée'} heures</strong>.
                        Le défunt sera transporté avec un <strong>{arrangements.typevehicule || 'Non spécifié'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            Cette veillée me permettra de rassembler mes proches pour rendre hommage avant les funérailles.
                        </span>
                    </Typography>
                </Box>
                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        J'ai {arrangements.organisation_ceremonie ? "confirmé" : "refusé"} l'organisation de la cérémonie.
                        {arrangements.organisation_ceremonie && (
                            <>
                                {' '}Elle se tiendra à <strong>{arrangements.lieuceremonie || 'Non spécifié'}</strong>, et ce sera une cérémonie <strong>{arrangements.typeceremonie || 'Non spécifié'}</strong>.
                            </>
                        )}
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            Cela me permet de m'assurer que mes souhaits sont respectés pour cette occasion importante.
                        </span>
                    </Typography>
                </Box>



                <Box style={styles.textWithImages}>
                    <Typography style={styles.text}>
                        Concernant le type de cercueil, j'ai opté pour un <strong>{arrangements.typecercueil || 'Non spécifié'}</strong>.
                        <span style={{ display: 'block', marginTop: '8px' }}>
                            Ce choix reflète mes valeurs et mes croyances, et je souhaite que le cercueil soit en adéquation avec le type de cérémonie choisie.
                        </span>
                    </Typography>
                </Box>
                <Box style={styles.textWithI}>
                    {/* <img src="/images/ENTR.png" alt="Image" style={styles.image} /> */}
                    <Typography style={styles.textbg}>
                        Le lieu de repos sera au <strong>{arrangements.lieu_repos || 'Non spécifié'}</strong> avec une concession prévue pour une durée de <strong>{arrangements.concession_duree || 'Non spécifiée'} ans</strong>.
                        <br />
                        {arrangements.message_personnel ? ` Le message personnalisé pour la cérémonie est : "${arrangements.message_personnel}".` : " Aucun message personnalisé n'a été ajouté."}
                    </Typography>
                </Box>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="default" onClick={onClose} style={styles.button}>
                    Fermer
                </Button>


                {/* {userData?.typeofuser === 'owner' && !handleOpenModal && (
        <> */}

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#f0f0f0',
                        
                    // Fond noir
                        color: 'black',
                        marginTop:'9px',
                       height:'38px',
                        width: '120px', // Ajustez cette valeur pour modifier la largeur
                        '&:hover': {
                            backgroundColor: '#333',
                            color: 'white', 
                             // Couleur du bouton en hover (gris foncé)
                        },
                    }}
                    onClick={handleOpenModal}
                >
                    Modifier
                </Button>
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
                    Télécharger PDF
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
                    <Typography variant="h6">Modifier les arrangements</Typography>

                    {/* Disposition en deux colonnes */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type de funérailles"
                                name="typefunerailles"
                                value={formValues.typefunerailles}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Lieu de décès"
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
                                label="Type de véhicule"
                                name="typevehicule"
                                value={formValues.typevehicule}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type de cercueil"
                                name="typecercueil"
                                value={formValues.typecercueil}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type d'urne"
                                name="typeurne"
                                value={formValues.typeurne}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Fleurs"
                                name="fleurs"
                                value={formValues.fleurs}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Lieu de la cérémonie"
                                name="lieuceremonie"
                                value={formValues.lieuceremonie}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Type de cérémonie"
                                name="typeceremonie"
                                value={formValues.typeceremonie}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Lieu de repos"
                                name="lieu_repos"
                                value={formValues.lieu_repos}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Durée de la concession (ans)"
                                name="concession_duree"
                                value={formValues.concession_duree}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message personnalisé"
                                name="message_personnel"
                                value={formValues.message_personnel}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Enregistrer
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ArrangementsDisplay;