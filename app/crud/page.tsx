"use client"; 

import React, { useState } from 'react';
import { PlusOutlined, CarryOutOutlined } from '@ant-design/icons';
import { Image, Upload, Space, Switch, TreeSelect } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import './crud.css';

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    icon: <CarryOutOutlined />,
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        icon: <CarryOutOutlined />,
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
            icon: <CarryOutOutlined />,
          },
          {
            value: 'leaf2',
            title: 'leaf2',
            icon: <CarryOutOutlined />,
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        icon: <CarryOutOutlined />,
        children: [
          {
            value: 'sss',
            title: 'sss',
            icon: <CarryOutOutlined />,
          },
        ],
      },
    ],
  },
];

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FormPage: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  // Add these state variables inside the FormPage component
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="body-with-form">
      <Space direction="vertical">
        <Switch
          checkedChildren="showIcon"
          unCheckedChildren="showIcon"
          checked={showIcon}
          onChange={() => setShowIcon(!showIcon)}
        />
        <Switch
          checkedChildren="treeLine"
          unCheckedChildren="treeLine"
          checked={treeLine}
          onChange={() => setTreeLine(!treeLine)}
        />
        <Switch
          disabled={!treeLine}
          checkedChildren="showLeafIcon"    
          unCheckedChildren="showLeafIcon"
          checked={showLeafIcon}
          onChange={() => setShowLeafIcon(!showLeafIcon)}
        />
        <TreeSelect
          treeLine={treeLine && { showLeafIcon }}
          style={{ width: 300 }}
          treeData={treeData}
          treeIcon={showIcon}
        />
      </Space>
      <form>
        <div className="form__group">
          <input type="text" className="form__field" placeholder="Nom" name="nom" id="nom" required />
          <label htmlFor="nom" className="form__label">Nom</label>
        </div>
      
      </form><br />
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default FormPage;
