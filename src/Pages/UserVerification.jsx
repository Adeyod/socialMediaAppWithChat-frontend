import { useEffect, useState } from 'react';
import axios from 'axios';
import { verificationRoute } from '../Components/ApiRoutes';
import { Link } from 'react-router-dom';
import { GoVerified } from 'react-icons/go';

const UserVerification = () => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const searchParams = new URLSearchParams(location.search);

  const verifyEmail = async () => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    try {
      const { data } = await axios.post(
        `${verificationRoute}/${userId}/${token}`
      );
      setLoading(false);

      if (data.success === true) {
        setIsVerified(true);
        return;
      } else {
        setIsVerified(false);
        return;
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);
  return (
    <div className="main-div">
      {loading ? (
        <div className="loading-div">
          <p className="loading-p">Loading...</p>
        </div>
      ) : isVerified ? (
        <div className="verification-div">
          <GoVerified className="verification-logo" />
          <p className="verification-p">
            Email Verification Successful. You can login...
          </p>
          <Link to="/">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      ) : (
        <div className="notfound-div">
          <p>404, Notfound</p>
        </div>
      )}
    </div>
  );
};

export default UserVerification;
