import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import axios from 'axios';
import { getUserRoute } from '../Components/ApiRoutes';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const encodedUsername = encodeURIComponent(username);
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${getUserRoute}/${encodedUsername}`);
        console.log(data);

        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        }
        setUser(data);
      } catch (error) {
        showToast('Error', error, 'error');
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast, encodedUsername]);

  return { loading, user };
};

export default useGetUserProfile;
