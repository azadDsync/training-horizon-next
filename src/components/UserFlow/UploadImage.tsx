import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';

interface Prop {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
}

const UploadImage: React.FC<Prop> = ({ imageUrl, setImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImageUrl(response.data.imageUrl);
      const response2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-temp?imageUrl=${response.data.imageUrl}`);
      if (!response2.ok) throw new Error('Failed to fetch signed URL');
      const data = await response2.json();
      setSignedUrl(data.signedUrl);
      console.log(signedUrl)
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start p-3 rounded-md border border-gray-300 shadow-sm bg-white w-full">
      <p className='text-lg font-bold'>Upload Image</p>
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
      {signedUrl && (
        <div className="mt-3 w-full flex justify-center">
          <Image src={signedUrl} alt="Uploaded" height={100} width={150} className="rounded-md shadow-sm" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
