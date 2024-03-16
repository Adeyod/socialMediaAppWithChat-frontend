import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import axios from 'axios';
import { CreatePostRoute } from './ApiRoutes';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';
// import axiosInstance from '../hooks/axiosInstance';

const MAX_CHAR = 500;

axios.defaults.withCredentials = true;
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const { handleImageChange, imgUrl, setImgUrl, fileData } = usePreviewImg();
  const [postText, setPostText] = useState('');
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const postedBy = user.user._id;
  const { username } = useParams();
  console.log(user);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleClose = () => {
    setPostText(''), setImgUrl('');
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('postedBy', postedBy);
    formData.append('text', postText);
    if (imgUrl) {
      formData.append('file', fileData);
    }
    try {
      setLoading(true);
      // const { data } = await axiosInstance.post(`${CreatePostRoute}`, formData);
      const { data } = await axios.post(`${CreatePostRoute}`, formData);

      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      } else {
        showToast('Success', data.message, 'success');
        const postObject = data.post;
        if (username === user.user.username) {
          setPosts([postObject, ...posts]);
        }
        onClose();
        setPostText('');
        setImgUrl('');
        return;
      }
    } catch (error) {
      showToast('Error', error, 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        position={'fixed'}
        bottom={10}
        right={5}
        size={{ base: 'sm', sm: 'md' }}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton
            onClick={handleClose} // i added this
          />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={'right'}
                m={'1'}
                color={'gray.800'}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                accept="image/*"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl('');
                  }}
                  bg={'gray.800'}
                  position={'absolute'}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
