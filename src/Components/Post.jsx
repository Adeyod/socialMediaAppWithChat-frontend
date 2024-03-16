import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Portal,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons';
import { deletePostRoute, getUserRoute } from './ApiRoutes';
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
// import axiosInstance from '../hooks/axiosInstance';

axios.defaults.withCredentials = true;
const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  // const toast = useToast();
  const showToast = useShowToast();

  // const copyUrl = () => {
  //   const URLToCopy = window.location.href;
  //   navigator.clipboard.writeText(URLToCopy).then(() => {
  //     toast({
  //       title: 'Link copied',
  //       description: 'Post link copied to clipboard',
  //       status: 'success',
  //       duration: '3000',
  //       isClosable: true,
  //     });
  //   });
  // };

  useEffect(() => {
    const getUser = async () => {
      try {
        // const { data } = await axiosInstance.get(`${getUserRoute}/${postedBy}`);
        const { data } = await axios.get(`${getUserRoute}/${postedBy}`);
        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        } else {
          // showToast('Success', data.message, 'success');
          setUser(data);
          return;
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
        setUser(null);
        return;
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm('Are you sure you want to delete this post?')) {
        return;
      }

      // const { data } = await axiosInstance.delete(
      //   `${deletePostRoute}/${post._id}`
      // );

      const { data } = await axios.delete(`${deletePostRoute}/${post._id}`);

      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      } else {
        showToast('Success', data.message, 'success');
        setPosts(posts.filter((p) => p._id !== post._id));
        return;
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
      return;
    }
  };

  if (!user) {
    return null;
  }
  return (
    <Link to={`/${user?.user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar
            size="md"
            name={user?.user.name}
            src={user?.user.profilePic.url}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.user.username}`);
            }}
          />
          <Box w="1px" h={'full'} bg="gray.light" my={2}></Box>
          <Box position={'relative'} w={'full'}>
            {post.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John Doe"
                src={post.replies[0].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left="15px"
                padding={'2px'}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John Doe"
                src={post.replies[1].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left="15px"
                padding={'2px'}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John Doe"
                src={post.replies[2].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left="15px"
                padding={'2px'}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text
                fontSize={'sm'}
                fontWeight={'bold'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user?.user.username}`);
                }}
              >
                {user?.user.username}
              </Text>
              <Image src="/images/verified.png" w={4} h={4} ml={1} />
            </Flex>

            <Flex gap={4} alignItems={'center'}>
              <Text
                fontSize={'xs'}
                width={36}
                textAlign={'right'}
                color={'gray.light'}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?.user._id === user?.user._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={'sm'}>{post.text}</Text>
          {post.img.url && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid'}
              borderColor={'gray.light'}
            >
              <Image src={post.img.url} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
