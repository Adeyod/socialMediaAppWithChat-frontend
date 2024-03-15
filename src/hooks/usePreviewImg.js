import { useState } from 'react';
import useShowToast from './useShowToast';

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [fileData, setFileData] = useState(null);
  const toast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFileData(file);
    } else {
      toast('Invalid file type', 'Please select an image file', 'error');
      setImgUrl(null);
    }
  };
  return { handleImageChange, imgUrl, fileData, setImgUrl };
};

export default usePreviewImg;
