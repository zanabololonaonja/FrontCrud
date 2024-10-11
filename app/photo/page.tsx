"use client";

import React, { useState, useEffect } from "react";
import { Dropdown, Button, Modal, Form, Input, Upload, Menu } from "antd";
import { UploadOutlined, MoreOutlined ,InboxOutlined} from "@ant-design/icons";
import axios from "axios";
import './photo.css';

interface PhotoType {
  idphoto: string;
  idalbum: string;
  namephoto: string;
  attachedfile: string;
}
const { Dragger } = Upload;

const AddPhoto: React.FC<{ currentAlbum: { idalbum: string; namealbum: string } }> = ({ currentAlbum }) => {
  const [idphoto, setIdphoto] = useState("");
  const [idalbum, setIdalbum] = useState('');

  const [attachedfile, setAttachedfile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoType | null>(null);
  const [showForm, setShowForm] = useState(false); 
  const [hoveredPhotoId, setHoveredPhotoId] = useState(null);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Fetch photos from the API based on the album ID
  const fetchPhotos = async (idalbum: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/photos?idalbum=${idalbum}`);
      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();
      setPhotos(data.filter((photo: PhotoType) => photo.idalbum.trim() === idalbum.trim()));
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("An error occurred while fetching photos.");
    }
  };

  // Fetch photos whenever the current album changes
  useEffect(() => {
    if (currentAlbum) {
      fetchPhotos(currentAlbum.idalbum);
    }
  }, [currentAlbum]);

  // Handle form submission for adding a new photo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("idphoto", idphoto);
    formData.append("idalbum", currentAlbum.idalbum);
    
    if (attachedfile) {
      formData.append("attachedfile", attachedfile);
    }

    try {
      await axios.post("http://localhost:5000/api/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Photo added successfully!");
      setIdphoto("");
     
      setAttachedfile(null);
      setShowForm(false); // Masquer le formulaire après l'ajout
      fetchPhotos(currentAlbum.idalbum);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Failed to add photo");
    }
  };

  // Handle file change for the file input
  // Handle file change for both the file input and Dragger component
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedfile(e.target.files[0]);
    } else if (e.fileList && e.fileList.length > 0) {
      setAttachedfile(e.fileList[0].originFileObj);
    }
  };

  

  // Handle opening the modal for editing a photo
  const handleEdit = (photo: PhotoType) => {
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  // Handle deleting a photo by its ID
  const handleDelete = async (idphoto: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/photos/${idphoto}`);
      alert("Photo deleted successfully!");
      fetchPhotos(currentAlbum.idalbum);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo");
    }
  };

  // Handle the save action inside the modal
  const handleModalOk = async () => {
    if (!editingPhoto) return;

    const formData = new FormData();
    formData.append("namephoto", editingPhoto.namephoto);
    if (attachedfile) {
      formData.append("attachedfile", attachedfile);
    }

    try {
      await axios.put(`http://localhost:5000/api/photos/${editingPhoto.idphoto}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Photo updated successfully!");
      setIsModalOpen(false);
      setAttachedfile(null);
      fetchPhotos(currentAlbum.idalbum);
    } catch (error) {
      console.error("Error updating photo:", error);
      setError("Failed to update photo");
    }
  };

   

  // Handle closing the modal
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };
  // Render the menu for the three-dot options (edit and delete)
  const menu = (idphoto: string) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(photos.find((photo) => photo.idphoto === idphoto)!)}>
        Modifier
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(idphoto)}>
        Supprimer
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Bouton pour afficher le formulaire d'ajout */}
      {!showForm && (
      <Button className="btn-wave" type="primary" onClick={() => setShowForm(true)}>
      <span className="icon">📷</span> {/* Utilisation d'une icône photo */}
      Ajouter Photo
    </Button>
    
     
      )}

      {/* Formulaire d'ajout de photo, affiché uniquement si showForm est true */}
      {showForm && (
  <form onSubmit={handleSubmit} className="photo-upload-form">
    <div className="form-group">
      <label>ID Photo:</label>
      <input
        type="text"
        value={idphoto}
        onChange={(e) => setIdphoto(e.target.value)}
        required
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label>ID Album:</label>
      <input
        type="text"
        value={idalbum}
        onChange={(e) => setIdalbum(e.target.value)}
        required
        className="form-input"
      />
    </div>

    <div className="form-group">
            <label>Attach File:</label>
            <Dragger
              name="file"
              multiple={false}
              onChange={handleFileChange}
              onDrop={(e) => console.log('Dropped files', e.dataTransfer.files)}
              beforeUpload={(file) => {
                setAttachedfile(file);
                return false; // Prevent automatic upload
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
              Faites glisser une image ici ou importez un fichier   </p>
            </Dragger>
          </div>
    <div className="form-actions">
      <button type="submit" className="upload-button">Upload Photo</button>
      <Button type="default" onClick={() => setShowForm(false)} className="cancel-button">
        Annuler
      </Button>
    </div>
    {error && <div className="error">{error}</div>}
  </form>
)}

      {/* Affichage des photos */}
      {!showForm && (
        <div className="photo-table" style={{ marginTop: '20px' }}>
          {/* <h2>{currentAlbum.namealbum} </h2>
          <h2>Photos:</h2> */}

          {photos.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {photos.map((photo) => (
                <div
                key={photo.idphoto}
                style={{
                  position: 'relative',
                  width: '200px',
                  height: '150px',
                  overflow: 'hidden',
                  borderRadius: '8px',   
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredPhotoId(photo.idphoto)}
                onMouseLeave={() => setHoveredPhotoId(null)}
                onClick={() => handlePhotoClick(photo)} // Cette action ne sera pas appelée si l'icône est cliquée
              >     
              
                  <img
                    src={`data:image/jpeg;base64,${photo.attachedfile}`}
                    alt={photo.namephoto}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />


{hoveredPhotoId === photo.idphoto && (
  <Dropdown overlay={menu(photo.idphoto)} trigger={['click']}>
    <Button
      type="text"
      icon={<MoreOutlined />}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        borderRadius: '50%',
      }}
      onClick={(e) => {
        e.stopPropagation(); // Empêche la propagation de l'événement
      }}
    />
  </Dropdown>
)}

                </div>
              ))}
            </div>
          ) : (
            <p className="albumVide">Album Vide</p>
          )}
        </div>
      )}




         {/* Modal pour la modification de la photo */}
         <Modal title="Edit Photo" open={isModalOpen} onCancel={handleModalCancel} footer={null}>
        {editingPhoto && (
          <Form>
            <Form.Item label="Photo Name">
              <Input
                value={editingPhoto.namephoto}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, namephoto: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Attach File">
              <Upload
                beforeUpload={(file) => {
                  setAttachedfile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" onClick={handleModalOk}>
              Save Changes
            </Button>
            <Button type="default" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form>
        )}
      </Modal>


      {/* Modal pour afficher la photo en taille réelle */}
      <Modal open={isModalOpen} onCancel={handleModalClose} footer={null}>
        {selectedPhoto && (
          <img
            src={`data:image/jpeg;base64,${selectedPhoto.attachedfile}`}
            alt={selectedPhoto.namephoto}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AddPhoto;
