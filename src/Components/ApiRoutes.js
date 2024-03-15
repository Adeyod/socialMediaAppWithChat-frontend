// const host = 'http://localhost:5000/api';
const host = 'https://socialmediaappwithchat-backend.onrender.com/api';

const verificationRoute = `${host}/user/user-verification`;
const signUpRoute = `${host}/user/register`;
const logoutRoute = `${host}/user/logout`;
const loginRoute = `${host}/user/login`;
const updateUserRoute = `${host}/user/update`;
const getUserRoute = `${host}/user/profile`;
const followUnFollowRoute = `${host}/user/follow`;
const CreatePostRoute = `${host}/post/create`;
const getFeedPostsRoute = `${host}/post/feeds`;
const handleLikeAndUnlikePostRoute = `${host}/post/likes`;
const handleReplyRoute = `${host}/post/reply`;
const getPostsRoute = `${host}/post/user`;
const deletePostRoute = `${host}/post/`;
const getPostRoute = `${host}/post/`;

export {
  getPostRoute,
  deletePostRoute,
  getPostsRoute,
  handleReplyRoute,
  handleLikeAndUnlikePostRoute,
  getFeedPostsRoute,
  verificationRoute,
  updateUserRoute,
  signUpRoute,
  loginRoute,
  logoutRoute,
  getUserRoute,
  followUnFollowRoute,
  CreatePostRoute,
};
