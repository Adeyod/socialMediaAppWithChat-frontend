import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import axios from 'axios';
import { followUnFollowRoute } from './ApiRoutes';

const UserHeader = ({ user }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user?.user?.followers?.includes(currentUser?.user._id)
  );
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  if (!user && user === null) {
    navigate('/');
    return null;
  }

  const copyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: 'Link copied',
        description: 'Profile link copied to clipboard',
        status: 'success',
        duration: '3000',
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast('Error', 'Please login to follow', 'error');
      return;
    }

    if (updating) {
      return;
    }

    setUpdating(true);
    try {
      const { data } = await axios.post(
        `${followUnFollowRoute}/${user.user._id}`
      );
      console.log(data);
      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      }
      if (following) {
        showToast('Success', data.message, 'success');
        user.user.followers.pop(); //simulate removing from followers
      } else {
        showToast('Success', data.message, 'success');
        user.user.followers.push(currentUser.user._id); //simulate adding from followers
      }
      setFollowing(!following);
      return;
    } catch (error) {
      showToast('Error', error, 'error');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user.user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>{user.user.username}</Text>

            <Text
              fontSize={'xl'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={'full'}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.user.profilePic.url && (
            <Avatar
              name={user.user.name}
              src={user.user.profilePic.url}
              size={{
                base: 'md',
                md: 'xl',
              }}
            />
          )}
          {!user.user.profilePic.url && (
            <Avatar
              name={user.user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: 'md',
                md: 'xl',
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.user.bio}</Text>

      {currentUser?.user._id === user.user._id && (
        <Link as={RouterLink} to="/update">
          <Button>Update Profile</Button>
        </Link>
      )}

      {currentUser?.user._id !== user.user._id && (
        <Button onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>
            {user.user.followers.length} followers
          </Text>
          <Box w="1" h="1" bg={'gray.light'} borderRadius={'full'}></Box>
          <Link color={'gray.light'}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={'pointer'} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem bg={'gray.dark'} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid white'}
          justifyContent={'center'}
          pb="3"
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid gray'}
          justifyContent={'center'}
          pb="3"
          color={'gray.light'}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
