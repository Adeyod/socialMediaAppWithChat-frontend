import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { Box, Container } from '@chakra-ui/react';
import UserPage from './Pages/UserPage';
import HomePage from './Pages/HomePage';
import PostPage from './Pages/PostPage';
import UserVerification from './Pages/UserVerification';
import AuthPage from './Pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import UpdateProfilePage from './Pages/UpdateProfilePage';
import CreatePost from './Components/CreatePost';
import ChatPage from './Pages/ChatPage';

const App = () => {
  const user = useRecoilValue(userAtom);
  return (
    <Box position={'relative'} w={'full'}>
      <Container maxW="620px">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage /> <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/user-verification" element={<UserVerification />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={'/auth'} />}
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
