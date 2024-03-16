import { Link } from 'react-router-dom';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import { getFeedPostsRoute } from '../Components/ApiRoutes';
import Post from '../Components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import axiosInstance from '../hooks/axiosInstance';
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const { data } = await axiosInstance.get(getFeedPostsRoute);
        // const { data } = await axios.get(getFeedPostsRoute);

        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        } else {
          setPosts(data.feedPosts);
          return;
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
        return;
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed post</h1>
      )}

      {loading && (
        <Flex justify={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default Home;
