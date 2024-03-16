import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
// import axios from 'axios';
import { logoutRoute } from './ApiRoutes';
import useShowToast from '../hooks/useShowToast';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../hooks/axiosInstance';

const LogoutButton = () => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.post(logoutRoute);
      // const { data } = await axios.post(logoutRoute);

      if (data.success === false) {
        showToast('Error', data.message, 'error');

        return;
      }

      showToast('Success', data.message, 'success');
      localStorage.removeItem('user-threads');
      setUser(null);
      navigate('/auth');
      return;
    } catch (error) {
      console.log(error);
      showToast('Error', error.message, 'error');
    }
  };
  return (
    <Button
      onClick={handleLogout}
      position={'fixed'}
      top={'30px'}
      right={'30px'}
      size={'sm'}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
