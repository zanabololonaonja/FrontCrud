"use client";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarAlt, faCamera, faUsers, faShieldAlt, faBriefcase, faPen, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import Contact from './Contact';


import "./page.css";

const handleLoginClick = () => {
  window.location.href = "/crud";
};


const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
`;
const Header = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent; /* Rendre l'arrière-plan transparent pour l'image de fond */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Aligne le logo à gauche et le bouton à droite */
  padding: 10px 20px;
  z-index: 1000;
`;

const Logo = styled.img`
  height: 60px;
  align-self: flex-start; /* Aligne le logo en haut à gauche */
  margin-top:-14px;
    display: flex;      
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  display: inline-block; 
  cursor: pointer;
    display: flex;
margin-top:-60px;
  margin-left:1209PX;
  background-color: #363636;
  color:WHITE;
  border: #363636 3px solid;
 border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  position: relative; /* Important pour le z-index */
  z-index: 10; /* Assure que le bouton est au-dessus des autres éléments */

  &:hover {
 background-color: #F8394D;
     color:  #fff; 
      border: #F8394D 3px solid;
  }
`;       
const HeroSection = styled(motion.section)`
  width: 100%;
  min-height: 80vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  //   background: linear-gradient(rgba(128, 128, 128, 0.5), rgba(128, 128, 128, 0.5)), 
  //               url('https://img.freepik.com/photos-gratuite/couple-aine-poser-photo_23-2148201332.jpg?t=st=1725608533~exp=1725612133~hmac=5a2bf333457ad19fdf0b6f345a1880ef949f5a1b86fa5ccb68d612b302084d0c&w=740');
  
  background:  url('https://st2.depositphotos.com/17620692/44001/v/600/depositphotos_440016256-stock-illustration-modern-abstract-geometric-background-dynamic.jpg');
  
                background-size: cover;
    // background-position: center;
    // filter: blur(2px);
  } 
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroHeading = styled(motion.h1)`
  font-size: 5rem;
  color: #363630;
   margin-left:-620px;
  font-weight: 660;
  margin-top: 170px;
  -webkit-text-stroke: 0.2vw ;
  font-family: 'Poppins', sans-serif; /* Correction de la police */
  text-align: left; /* Aligne le titre à droite */
`;

const HeroSubheading = styled(motion.p)`
  font-size: 1.2rem;
  color:#363636;
  margin-top: 10px;
  font-weight: 660;
   font-family: 'Poppins', sans-serif; /* Correction de la police */
 margin-left:-630px;
  text-align: left; /* Aligne le sous-titre à droite */
`;

const ActionButton = styled(motion.a)`
 margin-left:-1170px;
  display: inline-block;
  margin-top: 26px;
  padding: 10px 20px;
  background-color: #363636;
  color: white;
  cursor: pointer;
  border: #363636 3px solid;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  position: relative; /* Important pour le z-index */
  z-index: 10; /* Assure que le bouton est au-dessus des autres éléments */


  &:hover {
    background-color: #363630;
  }
`;


const ActionButton2 = styled(motion.a)`
 margin-left:-870px;
  display: inline-block;
  margin-top: -49px;
  padding: 10px 20px;
  background-color: transparent;
  color:  #363630;
  border: #F8394D 3px solid;
  border-radius: 30px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  position: relative; /* Important pour le z-index */
  z-index: 10; /* Assure que le bouton est au-dessus des autres éléments */


  &:hover {
    background-color: #F8394D;
     color:  #fff;
  }
`;

// const Image2 = styled.img`
//   width: 700px; /* Ajuste la taille de l'image */
//   height: 700px;
//   margin-left: auto; /* Pousse l'image vers la droite */
//   margin-top: 100px; /* Ajuste le décalage par rapport au haut */
//   display: block; /* Assure que l'image est affichée comme un bloc */




  
// `;







const Heading = styled.h1`
  margin-top: 80px;
  text-align: center;
  font-size: 2.7em; /* Ajustez la taille du titre si nécessaire */
  font-weight: bold;
  margin-bottom: 40px;
  color: #363630;
  position: relative;
  display: inline-block;
`;

const HighlightedText = styled.span`
  position: relative;
  z-index: 1; /* Pour placer le texte au-dessus du cercle */

  /* Créer le cercle autour du texte */
  &::before {
    content: '';
    position: absolute;
    left: -70px; /* Ajuster la position horizontale du cercle */
    top: -50px; /* Ajuster la position verticale du cercle */
    width: 150px; /* Taille du cercle */
    height: 150px;
    border: 7px solid #f8394c65; /* Bordure du cercle */
    border-radius: 50%; /* Créer un cercle parfait */
    z-index: -1; /* Placer le cercle derrière le texte */
  }
`;

const ContentSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-image: url('https://img.freepik.com/vecteurs-libre/arriere-plan-abstrait-lignes-ondulees-noires_78370-2991.jpg?t=st=1725471933~exp=1725475533~hmac=d5287626aa8c6d9e2ece1038ea6effceeab2db36b8d84086c0e6160ed8ad22b6&w=740');
  background-size: cover;
  background-position: center;
  border-radius: 91px;
  margin-top: -30px;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
   display: flex;
    // border: gray 1px solid;
    // padign:-66px;
   
`;

const Image = styled(motion.img)`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
   display: flex;
     margin-left: 110px;
   
`;

const TextContainer = styled(motion.div)`
  flex: 1;
  padding: 0 22px;
   display: flex;
`;
const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: -100px;
  margin-left: -118px;
`;

const ListItem = styled.li`
  margin-bottom: 20px;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 1.2rem;
  color: #333;
  padding-left: 60px;
  padding-right: 98px;
  text-align: justify;
  line-height: 1.4;
   width: 772px;
  text-indent: 60px; /* Ajout de l'indentation */

  /* Style la première lettre du paragraphe */
  &::first-letter {
    font-size: 36px; /* Taille plus grande pour la première lettre */
    font-weight: bold;
    color:#363636 ; /* Couleur stylée pour la première lettre */
   
  }
`;









// Styles for the section
const FeaturesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 40px 0;
  padding: 20px;
  border-radius: 20px;
  //  background-color: #fff;
  cursor: pointer;
`;

// Styles for each feature card
const FeatureCard = styled(motion.div)`
  flex: 1 1 calc(25% - 40px);
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 10; /* Ajoutez un z-index plus élevé si nécessaire */

  &:hover {
    transform: translateY(-10px);
    background-color: #F8394D;

    h3, p, div {
      color: white;
    }
  }
`;

// Styles for the feature icon
const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: #363630;
  border: 4px solid #ddd;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease, color 0.3s ease;
`;

// Styles for the title
const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
  text-align: left;
`;

// Styles for the description
const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: left;
   font-family: 'Poppins', sans-serif; /* Correction de la police */
 
`;

// Variants for the slide-in animation
const cardVariants = {
  hidden: { opacity: 0, y: 50 }, // Start position: hidden and lower
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }, // Final position: visible and in place
};



const MainSection = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <ContentSection ref={ref}>
      <ImageContainer>
        <Image
          src="/images/senior.png"
          alt="Description de l'image"
          initial={{ opacity: 0, x: -50 }}
          animate={controls}
          transition={{ duration: 0.8 }}
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -50 },
          }}
        />
      </ImageContainer>
      <TextContainer
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.8, delay: 0.5 }}
        variants={{
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: 50 },
        }}
      >
        <List>
          <ListItem>
          My Life Legacy DB is an intuitive and secure web application that allows users to centralize and protect all their personal and family information.    </ListItem>
          <ListItem>
          Designed to ensure data privacy and security, "My Life Legacy DB" also enables the creation of a lasting digital legacy for future generations by documenting personal and family history in a structured and accessible way.   </ListItem>
        </List>
      </TextContainer>
    </ContentSection>
  );
};



const Features = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  // Liste des fonctionnalités avec icônes et descriptions
  const features = [
    { icon: faLock, title: 'Legal Document Management', description: 'Easily organize and access your essential legal documents.' },
{ icon: faCalendarAlt, title: 'Future Arrangements Planning', description: 'Prepare for the future by planning your wills and funeral arrangements.' },
{ icon: faCamera, title: 'Photo Album', description: 'Capture your memories by creating personal photo albums.' },
{ icon: faUsers, title: 'Family Member Management', description: 'Record your loved ones’ details and manage their information.' },
{ icon: faShieldAlt, title: 'Sensitive Data Protection', description: 'Ensure the privacy of your information with advanced security.' },
{ icon: faBriefcase, title: 'Care Providers Management', description: 'Keep track of your medical contacts and care providers.' },
{ icon: faPen, title: 'Document Your Wills', description: 'Record your last wishes to ensure they are respected.' },
{ icon: faSyncAlt, title: 'Secure Sharing', description: 'Safely share your information and documents with your loved ones.' }

];

  const handleIconClick = (index) => {
    setActiveFeature(index === activeFeature ? null : index); // Toggle the active state
  };

  return (
    <FeaturesSection>
      {features.map((feature, index) => (
        <SlideInFeature
          key={index}
          feature={feature}
          activeFeature={activeFeature}
          handleIconClick={() => handleIconClick(index)}
        />
      ))}
    </FeaturesSection>
  );
};

const SlideInFeature = ({ feature, activeFeature, handleIconClick }) => {
  // Controls and observer to trigger animation when the component is in view
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  // Utiliser useEffect pour démarrer l'animation après le montage du composant
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return (
    <FeatureCard
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
    >
      <FeatureIcon
        active={activeFeature}
        onClick={handleIconClick}
      >
        <FontAwesomeIcon icon={feature.icon} />
      </FeatureIcon>
      <FeatureTitle>{feature.title}</FeatureTitle>
      <FeatureDescription>{feature.description}</FeatureDescription>
    </FeatureCard>
  );
};






export default function Home() {
  return (
    <>
      <Head>
        <title>My Life Legacy DB</title>
        <meta name="description" content="Manage your life's legal documents with ease." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <HeroSection
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroContent>
          {/* <div style={{display: 'flex', alignItems: 'LEFT', justifyContent: 'space-between' }}>
   
    <Image2
      src="/images/PHOTO.png"
      alt="Description de l'image"
      style={{ width: '100px', height: 'auto', marginRight: '20px' }} // Ajuste la taille de l'image ici
    />
   </div> */} 
            <Logo
             src="/images/LOGO.png"
           alt="Logo"
            />
            <LoginButton onClick={handleLoginClick}>Log in</LoginButton>
  
            <HeroHeading
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}
    >
      <span style={{ display: 'block', textAlign: 'left' }}>Centralize your</span>
      <span style={{ display: 'block', textAlign: 'left',marginTop:'-2px' }}>
      Family{' '}    
        <span
          style={{
            color: '#F8394D',
            fontFamily: 'Poppins',
            fontSize: '5rem',
            fontWeight: 660,
            position: 'relative',
            paddingBottom: '10px',
            display: 'inline-block',
          }}
        >
        Information
          <span
            style={{
              content: '""',
              position: 'absolute',
              left: '0',
              bottom: '0',
              width: '100%',
              height: '4px',
              backgroundColor: '#F8394D',
              transform: 'rotate(-2deg)',
              transformOrigin: 'left',
            }}
          ></span>
        </span>
      </span>
    </HeroHeading>
            <HeroSubheading
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              // style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}
            >
              Easily manage your personal data and preserve your memories securely.
              
            </HeroSubheading>
            <ActionButton
             onClick={handleLoginClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              Learn more
             
            </ActionButton>
           
            <ActionButton2
    
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleLoginClick} // Ajoutez cette ligne pour déclencher handleLoginClick lors du clic
      >
        Log in
      </ActionButton2>
          </HeroContent>
        </HeroSection>
        {/* Ajoutez votre contenu de bas de page ici */}
        <Heading>What is My Life Legacy DB?</Heading>
        <MainSection />
        <div>
    <Heading>
      <HighlightedText>Les </HighlightedText> Fonctionnalités principales
    </Heading>
    </div>

        <Features />
        <HowItWorks />
        < WhyChooseUs />
        
        < Contact />
   
      </Container>
    </>
  );
}