"use client";

import React, { useState, useEffect } from "react";
import { Switch, Table, Tooltip, Button, Modal, Form, Input, Select, Upload } from "antd";
import type { TableColumnsType } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./photo.css";

interface PhotoType {
  idphoto: string;
  idalbum: string;
  namephoto: string;
  attachedfile: string;
}

const AddPhoto: React.FC = () => {
  const [idphoto, setIdphoto] = useState('');
  const [idalbum, setIdalbum] = useState('');
  const [namephoto, setNamephoto] = useState('');
  const [attachedfile, setAttachedfile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [albums, setAlbums] = useState([]);
  const [showNames, setShowNames] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoType | null>(null);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/photos');
      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('An error occurred while fetching photos.');
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/albums');
      if (!res.ok) throw new Error('Failed to fetch albums');
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError('An error occurred while fetching albums.');
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('idphoto', idphoto);
    formData.append('idalbum', idalbum);
    formData.append('namephoto', namephoto);
    if (attachedfile) {
      formData.append('attachedfile', attachedfile);
    }

    try {
      const res = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        body: formData,
      });

      const responseText = await res.text();
      console.log('Response from server:', responseText);

      if (res.ok) {
        alert('Photo added successfully!');
        setIdphoto('');
        setIdalbum('');
        setNamephoto('');
        setAttachedfile(null);
        fetchPhotos();
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.message || 'Failed to add photo');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    }
  };


  // Supprimer
  const handleDelete = async (photoId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Photo deleted successfully!');
        fetchPhotos(); // Refresh the list after deletion
      } else {
        setError('Failed to delete photo.');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('An error occurred while deleting the photo.');
    }
  };


  // modifier avec modal
  const handleEdit = (photo: PhotoType) => {
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!editingPhoto) return;

    const formData = new FormData();
    formData.append('idphoto', editingPhoto.idphoto);
    formData.append('idalbum', editingPhoto.idalbum);
    formData.append('namephoto', editingPhoto.namephoto);
    if (attachedfile) {
      formData.append('attachedfile', attachedfile);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/photos/${editingPhoto.idphoto}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('Photo updated successfully!');
        fetchPhotos();
        setIsModalOpen(false);
        setEditingPhoto(null);
      } else {
        setError('Failed to update photo.');
      }
    } catch (err) {
      console.error('Error updating photo:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
  };


  //  Design Tableau
  const columns: TableColumnsType<PhotoType> = [
    {
      title: 'N°Photo',
      dataIndex: 'idphoto',
      key: 'idphoto',
    },
    {
      title: 'N°Album',
      dataIndex: 'idalbum',
      key: 'idalbum',
    },
    {
      title: 'Nom Photo',
      dataIndex: 'namephoto',
      key: 'namephoto',
    },
    {
      title: 'PHOTO',
      dataIndex: 'attachedfile',
      key: 'attachedfile',
      render: (attachedfile: string, record: PhotoType) => (
        attachedfile ? (
          <img
            src={`data:image/jpeg;base64,${attachedfile}`}
            alt={record.namephoto}
            style={{ width: '100px', height: '100px' }}
          />
        ) : null
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Modifier</Button>
          <Button onClick={() => handleDelete(record.idphoto)}>Supprimer</Button>
        </>
      ),
    }
  ];

  return (
    <div>
      <h1>Add Photo</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form__group">
          <input
            type="text"
            className="form__field"
            placeholder="Photo ID"
            id="idphoto"
            value={idphoto}
            onChange={(e) => setIdphoto(e.target.value)}
            required
          />
          <label htmlFor="idphoto" className="form__label">Photo ID</label>
        </div>
        <div>
          <br /><br />
          <label htmlFor="idalbum">Album ID:</label>
          <br /><br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={idalbum}
              onChange={(e) => setIdalbum(e.target.value)}
              placeholder="Select an album"
              style={{ flex: 1 }}
            >
              <option value="">Select an album</option>
              {albums.map((album) => (
                <option key={album.idalbum} value={album.idalbum}>
                  {album.idalbum} {showNames ? `- ${album.namealbum}` : ''}
                </option>
              ))}
            </select>
            <Switch
              checked={showNames}
              onChange={(checked) => setShowNames(checked)}
              style={{ marginLeft: 8 }}
              checkedChildren="avec nom album"
              unCheckedChildren=" num album"
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Photo Name"
              id="namephoto"
              value={namephoto}
              onChange={(e) => setNamephoto(e.target.value)}
              required
            />
            <label htmlFor="namephoto" className="form__label">Photo Name</label>
          </div>
        </div>
        <div>
          <br /><br />
          <label htmlFor="attachedfile">Attach File:</label>
          <br /><br />
          <input
            type="file"
            id="attachedfile"
            onChange={(e) => setAttachedfile(e.target.files[0])}
            required
          />
        </div>
        <br /><br />
        <button className="AJOUTER" type="submit">Add Photo</button>
        
      </form>
      {error && <div className="error">{error}</div>}

      {/* affichage Design Tableau */}
      <div className="photo-table">
        <h2>Photos:</h2>
        <Table columns={columns} dataSource={photos} rowKey="idphoto" />
      </div>

      {/* Modal for editing photo */}
      <Modal
        title="Edit Photo"
        visible={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {editingPhoto && (
          <Form>
            <Form.Item label="Photo ID">
              <Input
                value={editingPhoto.idphoto}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, idphoto: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Album ID">
              <Select
                value={editingPhoto.idalbum}
                onChange={(value) => setEditingPhoto({ ...editingPhoto, idalbum: value })}
              >
                {albums.map((album) => (
                  <Select.Option key={album.idalbum} value={album.idalbum}>
                    {album.idalbum} {showNames ? `- ${album.namealbum}` : ''}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
                  return false; // Prevent upload
                }}
                listType="text"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AddPhoto;
