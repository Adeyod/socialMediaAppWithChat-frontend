import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { updateUserRoute } from '../Components/ApiRoutes';
// import axios from 'axios';
import axiosInstance from '../hooks/axiosInstance';

// axios.defaults.withCredentials = true;
const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.user.name,
    username: user.user.username,
    email: user.user.email,
    bio: user.user.bio,
    password: '',
  });

  const fileRef = useRef(null);

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  const { handleImageChange, imgUrl, fileData } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) {
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('username', inputs.username);
      formData.append('name', inputs.name);
      formData.append('email', inputs.email);
      formData.append('bio', inputs.bio);
      formData.append('password', inputs.password);

      const { data } = await axiosInstance.put(
        `${updateUserRoute}/${user.user._id}`,
        formData
      );

      // const { data } = await axios.put(
      //   `${updateUserRoute}/${user.user._id}`,
      //   formData
      // );

      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      }
      showToast('Success', data.message, 'success');
      setUser(data);
      localStorage.setItem('user-threads', JSON.stringify(data));
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={'md'}
                  src={imgUrl || user.user.profilePic.url}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              readOnly
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}
            >
              Cancel
            </Button>
            <Button
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.500',
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
