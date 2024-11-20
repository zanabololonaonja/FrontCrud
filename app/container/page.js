
"use client";
import React, { useState, useEffect, useContext } from "react";
import Swal from 'sweetalert2';
import './container.css';
import { FaUser, FaEnvelope } from 'react-icons/fa'; // Importer les icônes

import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FiLogOut } from 'react-icons/fi';      

import {
  AppstoreOutlined,    
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  IdcardOutlined,
  MenuOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Switch, Avatar, Button, Modal } from "antd";
import { UserContext } from '../crud/UserContext';
import AlbumFamille from './AlbumFamille';
import ArrangementsF from './ArrangementsF';
import ContactU from './ContactU';
import Testament from './Testament'; 
import { color } from "framer-motion";
// import Swal from 'sweetalert2';


const App = () => {
 // Récupérez `userData` depuis le contexte
 const { userData, setUserData } = useContext(UserContext);
 const [selectedMenu, setSelectedMenu] = useState("0");

const verticalMenuItems = [
  
  
    // Assurez-vous que `userData` est défini avant d'essayer de vérifier `userData?.typeofuser`
    ...(userData && userData.typeofuser === 'owner' ? [{
      key: "0",    
    icon: <UserOutlined />,   
    label: "User Profil",
    }] : []),
    
 
  
  
  // Si l'utilisateur n'est pas propriétaire, on ne montre pas ce menu
  {
    key: "2",
    icon: <CalendarOutlined />,
    label: "Testament",
  },
  {
    key: "4",
    label: "Album",
    icon: <AppstoreOutlined />,
  },
  {
    key: "5",
    icon: <BankOutlined />,
    label: "Arrangements Funéraires",
  },
  
   // Assurez-vous que `userData` est défini avant d'essayer de vérifier `userData?.typeofuser`
   ...(userData && userData.typeofuser === 'owner' ? [{
    key: "1",
    icon: <IdcardOutlined />,
    label: "Emergency contact",
  }] : []),
  
];

  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    idphone: "",
    typeofuser: "",
    besttimeforcall: "",
    userphoto: "",
  });
   const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    iduser: '',
    userphoto: '',
    username: '',
    usermiddlename: '',
    userlastname: '',
    useremailaddress: '',
    idphone: '',
    typeofuser: '',
    besttimeforcall: ''
  });
  
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("vertical");
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  
    if (userData) {
      // Mise à jour du profil utilisateur
      setUserProfile({
        firstName: userData.username || '', // Ajout de valeur par défaut
        middleName: userData.usermiddlename || '', // Ajout de valeur par défaut
        lastName: userData.userlastname || '', // Ajout de valeur par défaut
        phone: userData.idphone || '', // Ajout de valeur par défaut
        email: userData.useremailaddress || '', // Ajout de valeur par défaut
        typeofuser: userData.typeofuser || '', // Ajout de valeur par défaut
        besttimeforcall: userData.besttimeforcall || null, // Pas besoin de valeur par défaut ici si null est acceptable
        userphoto: userData.userphoto || "" // Assurez-vous que ceci est bien inclus
      });
  
      // Vérification et conversion de userphoto
      if (userData.userphoto && Buffer.isBuffer(userData.userphoto)) {
        // Convertir en base64 si c'est un Buffer
        userData.userphoto = `data:image/png;base64,${userData.userphoto.toString('base64')}`;
      }
  
      // Mise à jour de l'état du formulaire
      setFormData({
        iduser: userData.iduser || '',
        username: userData.username || '', // Ajout de valeur par défaut
        userlastname: userData.userlastname || '', // Ajout de valeur par défaut
        usermiddlename: userData.usermiddlename || '', // Ajout de valeur par défaut
        useremailaddress: userData.useremailaddress || '', // Ajout de valeur par défaut
        idphone: userData.idphone || '',
        typeofuser: userData.typeofuser || '', // Ajout de valeur par défaut
        besttimeforcall: userData.besttimeforcall || null,
        userphoto: userData.userphoto || '' // Assurez-vous que c'est null si pas défini
      });
    }
  }, [userData]);


  
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Récupérer l'image du localStorage au chargement du composant
    const storedImage = localStorage.getItem('userphoto');
    if (storedImage) {
      setImagePreview(storedImage);
      setFormData(prevState => ({
        ...prevState,
        userphoto: storedImage, // Met à jour userphoto avec l'image stockée
      }));
    }
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Met à jour l'aperçu
        setFormData(prevState => ({
          ...prevState,
          userphoto: reader.result, // Assigne l'URL de l'image à userphoto
        }));
        // Enregistrer l'image dans le localStorage
        localStorage.setItem('userphoto', reader.result);
      };
      reader.readAsDataURL(file); // Lit le fichier et obtient une URL de données
    }
  };


  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        console.log('Données mises à jour:', updatedUser);

        // Vérification et conversion de userphoto après mise à jour
        if (updatedUser.userphoto && Buffer.isBuffer(updatedUser.userphoto)) {
          updatedUser.userphoto = `data:image/png;base64,${updatedUser.userphoto.toString('base64')}`;
        }

        setUserData(updatedUser); // Mise à jour du contexte
        setUserProfile(updatedUser); // Mise à jour du profil pour inclure la nouvelle image
        setIsModalVisible(false);

        // Alerte Toastify
        toast.success('Données mises à jour avec succès!', {
          position: "top-right",
          autoClose: 3000, // La notification disparaît après 3 secondes
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      } else {
        toast.error('Erreur lors de la mise à jour des données', {
          position: "top-right"
        });
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Une erreur est survenue lors de la mise à jour', {
        position: "top-right"
      });
    }
  };


  

  const changeTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const changeMode = (checked) => {
    setMode(checked ? "vertical" : "horizontal");
  };

  const handleLogout = () => {
    Swal.fire({
      title: ' déconnexion ?',
      text: "Souhaitez-vous vraiment vous deconnecter?",
      // icon: 'warning',
      showCancelButton: true,  
      confirmButtonColor: '#F8394DE5',
      cancelButtonColor: '#3D3D3D',
      confirmButtonText: 'Oui !',
      cancelButtonText: 'Non'
    }).then((result) => { 
      if (result.isConfirmed) {
        localStorage.removeItem("userName");
        window.location.href = "/crud"; // Redirige vers la page de CRUD
      } else {
        console.log("Déconnexion annulée.");
      }
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
      
  const handleOk = () => {
    handleSave();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };




  
  const renderContent = () => {
    switch (selectedMenu) {
      case "0":
       if (userData?.typeofuser === 'owner') {  
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
  {/* Sidebar gauche */}
  <div style={{ flex: "1", marginRight: "20px", textAlign: "left" }}>
    <h2 style={{ marginBottom: "20px", color: "#000000", fontWeight: "bold",marginLeft:"20px",fontSize:"22px" }}>User Profile</h2>
    
    {/* Cadre pour l'image du profil et nom complet */}
    {imagePreview && (
      <div style={{   
          padding: "15px",  
          display: "inline-block", 
          marginBottom: "20px", 
          borderRadius: "10px",
          textAlign: "center" // Centrer le texte pour l'image et le nom
        }}>
        
        {/* Image du profil */}
        <img
          src={imagePreview}
          alt="Aperçu"
          style={{ width: "280px", height: "280px", borderRadius: "10px" }}
        />
        
        {/* Nom complet sous l'image */}
        <p style={{ fontSize: "21px", marginTop: "10px", fontWeight: "bold" }}>
          {userProfile.firstName}  <br /> {userProfile.middleName} {userProfile.lastName}
        </p>
        <br /><br /> 
        <div style={{ marginTop: "20px", textAlign: "left" }}>
        <Button 
  type="primary" 
  onClick={showModal} 
  className="custom-button"
  style={{ backgroundColor: "#007bff", border: "none", padding: "10px 20px", fontSize: "16px" }}
>
  Ajouter autre informations
</Button>
   </div>
      </div>
    )}
  </div>
  
  {/* Ligne de séparation verticale */}
  <div style={{ width: "1px", backgroundColor: "#ccc", height: "530px", margin: "0 20px" }}></div>
  
  {/* Section droite */}
  <div style={{ flex: "2", textAlign: "left" }}>
  {/* Informations personnelles */}
<div style={{ backgroundColor: "#fff", padding: "15px", marginBottom: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
<div className="title-container">
        <FaUser className="animated-icon" /> {/* Icône animée */}
        <h3>Informations Personnelles</h3>
      </div>
  {/* Section pour le nom et le prénom */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px", flex: "1" }}>
      <span style={{ fontWeight: "bold", display: "block" }}>Prénom </span>
      {userProfile.firstName}
    </p>
    
    <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px", flex: "1" }}>
      <span style={{ fontWeight: "bold", display: "block" }}>Nom </span>
      {userProfile.lastName}
    </p>
  </div>

  {/* Section pour le deuxième prénom et le type d'utilisateur */}
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
    <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px", flex: "1" }}>
      <span style={{ fontWeight: "bold", display: "block" }}>Deuxième prénom </span>
      {userProfile.middleName}
    </p>
    
    <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px", flex: "1" }}>
      <span style={{ fontWeight: "bold", display: "block" }}>Type d'utilisateur </span>
      {userProfile.typeofuser}
    </p>
  </div>
</div>

    {/* Section Contact */}
    <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}>
    <div className="title-container">
        <FaEnvelope className="animated-icon" /> {/* Icône animée */}
        <h3>Contact</h3>
      </div>
      <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px" }}>
        <span style={{ fontWeight: "bold" }}>Email </span>
        <br />
        {userProfile.email}
      </p>
      <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px" }}>
        <span style={{ fontWeight: "bold" }}>Téléphone </span>
        <br />
        {userProfile.phone}
      </p>
      
      <p style={{ margin: "5px 0", fontSize: "16px", backgroundColor: "#f0f8ff", padding: "5px", borderRadius: "5px" }}>
        <span style={{ fontWeight: "bold" }}>Meilleur moment pour appeler </span>
        <br />
        {userProfile.besttimeforcall}
      </p>
      <br />
      {/* Icônes de réseaux sociaux */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#3b5998" }}>
          <FaFacebook size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#00acee" }}>
          <FaTwitter size={24} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0e76a8" }}>
          <FaLinkedin size={24} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#e1306c" }}>
          <FaInstagram size={24} />
        </a>    
      </div>    
    </div>
    
    {/* Bouton d'action */}
  
  </div>
</div>
)
 } else {
            return <div  className="infoCU">En tant que contact d'urgence,<br /> Vous ne pouvez pas apporter de modifications,<br /> mais seulement consulter les contenus</div>;  // Message d'erreur si non-propriétaire

            

          }

         case "1":
          if (userData?.typeofuser === 'owner') {  
            return <ContactU userData={userData} />;  
          } else {
            return <div>Accès refusé. Vous n'êtes pas autorisé à voir cette section.</div>;  // Message d'erreur si non-propriétaire

            
          } case "2":  return <Testament userData={userData} />; 
    
 case "4":
  return <AlbumFamille userData={userData} />; 

  case "5":
    return <ArrangementsF userData={userData} />; 
  
  
    }
  };

    
  const userMenu = (
    <Menu>
      <Menu.Item key="theme">
        <span>Change Theme</span>
        <Switch checked={theme === "dark"} onChange={changeTheme} style={{ marginLeft: "10px" }} />
      </Menu.Item>
      <Menu.Item key="mode">
        <span>Change Mode</span>
        <Switch checked={mode === "vertical"} onChange={changeMode} style={{ marginLeft: "10px" }} />
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FiLogOut style={{ marginRight: '8px' }} /> {/* Ajouter l'icône avec un espace à droite */}
          <span>Logout</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const toggleMenu = () => {  
    setIsCollapsed(!isCollapsed);
  };

  return (
    
    <div style={{ display: "flex", height: "100vh" }}>
      
     <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: isCollapsed ? "80px" : "256px",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#444", // Couleur change en fonction du thème
          color: theme === "light" ? "black" : "white", // Texte change en fonction du thème
          transition: "width 0.3s, background-color 0.3s", // Ajout de la transition de fond
          fontWeight: "bold",
          paddingTop: "20px",
          zIndex: 1,
        }}
      >      <img
        src="/images/LOGO.png"
        alt="Decorative"
        className="img-logo"
        style={{ width: "120px", height: "auto", marginBottom: "8px", display: "block", margin: "1px auto" }}
      />
      <hr style={{ color: "red" }} />
      <br /><br />
      <Menu
       mode={mode}
        items={verticalMenuItems}
         onClick={(e) => setSelectedMenu(e.key)} 
         style={{
          flexGrow: 1,
          backgroundColor: theme === "light" ? "#f0f0f0" : "#444", // Couleur de fond selon le thème
          color: theme === "light" ? "black" : "white", // Couleur de texte selon le thème
          borderRight: "none",
        }}
        theme={theme === "light" ? "light" : "dark"} // Appliquer le thème clair ou sombre au menu
      />
    </div>

    <div style={{ marginLeft: isCollapsed ? "80px" : "256px", flexGrow: 1 }}>
     
      <Menu
        mode="horizontal"
        style={{  
          display: "flex",
          marginBottom: "18px",
          padding: "8px 20px",
          backgroundColor: theme === "light" ? "#F8394D" : "#444",
          color: theme === "light" ? "white" : "white" // Texte en blanc pour les deux thèmes
 
        }}  
      >
        <Menu.Item
          key="hamburger"
          style={{
            marginRight: "auto",
            color: "white",
            border: "none"
          }}
          onClick={toggleMenu}
        >
          <MenuOutlined />
        </Menu.Item>
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Menu.Item
            key="user"
            style={{
              color: "black",
              display: "flex",
              alignItems: "center",
              fontSize: "19px",
              padding: 0,
              border: "none"
            }}
          >
            <Avatar
              src={imagePreview}
              icon={<UserOutlined />}
              style={{ width: '50px', height: '50px', marginRight: "10px" }}
            />
            <span   style={{ fontSize: "14px",
             fontWeight:"bold"
            }}>{userProfile.firstName || ""}</span>
          </Menu.Item>
        </Dropdown>
      </Menu>
  <div style={{ padding: "20px" }}>{renderContent()}</div>
</div>

<ToastContainer />

<Modal
  title={<h2 style={{ color: 'black', fontWeight: 'bold', fontSize: '19px' }}>Modifier le Profil</h2>}
  visible={isModalVisible}
  onOk={handleOk}
  onCancel={handleCancel}
  width={700}
  okText="Enregistrer "
>
  <div className="container rounded bg-white mt-3 mb-3">
    <div className="image-container" style={{ position: "relative", textAlign: "center", marginBottom: "20px" }}>
   

    <div style={{ textAlign: "center", marginBottom: "20px", position: "relative", display: "inline-block" }}>
  {imagePreview ? (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        src={imagePreview} 
        alt="Aperçu" 
        style={{ 
          width: "120px", 
          height: "120px", 
          borderRadius: "50%", 
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" 
        }} 
      />
      
      {/* Bouton d'édition sur l'image */}
      <label 
        htmlFor="imageUpload" 
        style={{
          position: "absolute",
          bottom: "5px",  // Position en bas
          right: "5px",   // Position à droite
          backgroundColor: "#fff",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"  // Ombre pour bien voir l'icône
        }}
      >
          <EditOutlined /> 
      </label>
      
      {/* Input file caché */}
      <input 
        id="imageUpload" 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        style={{ display: "none" }} 
      />
    </div>
  ) : (
    <div>
      {/* Affichage par défaut si aucune image sélectionnée */}
      <img 
        src={formData.userphoto || ""} 
        alt="User Photo" 
        style={{ 
          width: "120px", 
          height: "120px", 
          borderRadius: "50%", 
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" 
        }} 
      />
    </div>
  )}
  </div>

  {/* Ligne de séparation verticale */}
  <div className="separator-vertical"></div>


</div>
    {/* Rest of the form inputs */}
    <div className="form-container">
      <div className="row">
        <div className="col-md-6">
          <label className="labels">Prénom</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} placeholder="Prénom" required />
        </div>
        <div className="col-md-6">
          <label className="labels">Deuxième Prénom</label>
          <input type="text" className="form-control" name="usermiddlename" value={formData.usermiddlename} onChange={handleInputChange} placeholder="Deuxième Prénom" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label className="labels">Nom</label>
          <input type="text" className="form-control" name="userlastname" value={formData.userlastname} onChange={handleInputChange} placeholder="Nom" required />
        </div>
        <div className="col-md-6">
          <label className="labels">Téléphone</label>
          <input type="text" className="form-control" name="idphone" value={formData.idphone} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label className="labels">Type d'utilisateur</label>
          <input type="text" className="form-control" name="typeofuser" value={formData.typeofuser} onChange={handleInputChange} required />
        </div>
        <div className="col-md-6">
          <label className="labels">Moment pour appeler</label>
          <input type="text" className="form-control" name="besttimeforcall" value={formData.besttimeforcall} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <label className="labels">Email</label>
          <input type="email" className="form-control email-field" name="useremailaddress" value={formData.useremailaddress} onChange={handleInputChange} placeholder="Email" required />
        </div>
      </div>
    </div>
  </div> 
</Modal>

    </div>
  );
};
export default App;


