import searchBar from '../../public/images/search.png';
import notificationIcon from '../../public/images/bell.png';
import messageIcon from '../../public/images/message.png';
import profilePicture from '../../public/images/profile-pics.jpeg';
import { FaSun, FaMoon } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { Button, Flex, Image, Link, useColorMode } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout';
import authScreenAtom from '../atoms/authAtom';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={'space-between'} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={'/auth'}
          onClick={() => setAuthScreen('login')}
        >
          Login
        </Link>
      )}
      <Image
        alt="logo"
        src={
          colorMode === 'dark'
            ? '/images/light-logo.svg'
            : '/images/dark-logo.svg'
        }
        width={6}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={'center'} gap={4}>
          <Link as={RouterLink} to={`/${user.user.username}`}>
            <RxAvatar size={24} />
          </Link>

          <Button size={'xs'} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={'/auth'}
          onClick={() => setAuthScreen('signup')}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Navbar;
