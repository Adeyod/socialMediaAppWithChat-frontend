const host = 'https://socialmediaappwithchat-backend.onrender.com/api';
const socketRoute = 'https://socialmediaappwithchat-backend.onrender.com';

// const host = 'http://localhost:5000/api';
// const socketRoute = 'http://localhost:5000';

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
const getConversationsRoute = `${host}/messages/conversations`;
const getMessagesRoute = `${host}/messages`;
const sendMessageRoute = `${host}/messages`;
const searchUserRoute = `${host}/user/profile`;

export {
  searchUserRoute,
  sendMessageRoute,
  getMessagesRoute,
  getConversationsRoute,
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
  socketRoute,
};
