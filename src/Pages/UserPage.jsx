import { useEffect, useState } from 'react';
import UserHeader from '../Components/UserHeader';
import UserPost from '../Components/UserPost';
import { useParams } from 'react-router-dom';
import { getPostsRoute, getUserRoute } from '../Components/ApiRoutes';
import axios from 'axios';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../Components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
// import axiosInstance from '../hooks/axiosInstance';

axios.defaults.withCredentials = true;
const UserPage = () => {
  // const [user, setUser] = useState(null);
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const encodedUsername = encodeURIComponent(username);
  const showToast = useShowToast();
  // const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  console.log(posts);

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        // const { data } = await axiosInstance.get(
        //   `${getPostsRoute}/${encodedUsername}`
        // );
        const { data } = await axios.get(`${getPostsRoute}/${encodedUsername}`);
        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        } else {
          showToast('Success', data.message, 'success');
          const postToUse = data.posts;

          setPosts(postToUse);
          return;
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
        setPosts([]);
        return;
      } finally {
        setFetchingPosts(false);
      }
    };

    // getUser();
    getPosts();
  }, [username, showToast, encodedUsername, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }
  return (
    <>
      <UserHeader user={user} loading={loading} />
      {/* <UserHeader user={user} loading={loading} setLoading={setLoading} /> */}
      {!fetchingPosts && posts?.length === 0 && <h1>{posts?.message}</h1>}
      {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {posts?.map((post) => (
        <Post
          key={post._id}
          post={post}
          postedBy={post.postedBy}
          // setPosts={setPosts}
        />
      ))}
    </>
  );
};

export default UserPage;
