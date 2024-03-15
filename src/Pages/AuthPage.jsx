import { useRecoilValue } from 'recoil';
import SignupCard from '../Components/SignupCard';
import authScreenAtom from '../atoms/authAtom';
import LoginCard from '../Components/LoginCard';

// import LoginCard from '../Components/LoginCard';

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);

  return <>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
