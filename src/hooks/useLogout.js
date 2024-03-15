import axios from 'axios';
import { logoutRoute } from '../Components/ApiRoutes';
import useShowToast from './useShowToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await axios.post(logoutRoute);

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
  return logout;
};

export default useLogout;
