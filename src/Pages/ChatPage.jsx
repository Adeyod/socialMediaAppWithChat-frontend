import { SearchIcon } from '@chakra-ui/icons';
import { GiConversation } from 'react-icons/gi';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Conversation from '../Components/Conversation';
import MessageContainer from '../Components/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import axios from 'axios';
import {
  getConversationsRoute,
  searchUserRoute,
} from '../Components/ApiRoutes';
import { useEffect, useState } from 'react';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

axios.defaults.withCredentials = true;
const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);

  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await axios.get(getConversationsRoute);

        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        }
        console.log(data);
        const dataToPush = data.conversations;
        console.log('dataToPush:', dataToPush);
        setConversations(dataToPush);
      } catch (error) {
        showToast('Error', error.message, 'error');
        return;
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const { data } = await axios.get(`${searchUserRoute}/${searchText}`);
      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      }

      const messagingYourself = data.user._id === currentUser.user._id;
      if (messagingYourself) {
        showToast('Error', 'You can not message yourself', 'error');

        return;
      }

      const conversationAlreadyExist = conversations.find(
        (conversation) => conversation.participants[0]._id === data.user._id
      );

      if (conversationAlreadyExist) {
        showToast(
          'Error',
          'You are already in a conversation with this user',
          'error'
        );
        setSelectedConversation({
          _id: conversationAlreadyExist._id,
          userId: data.user._id,
          username: data.user.username,
          userProfilePic: data.user.profilePic.url,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: '',
          sender: '',
        },
        _id: Date.now(),
        participants: [
          {
            _id: data.user._id,
            username: data.user.username,
            profilePic: data.user.profilePic.url,
          },
        ],
      };

      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast('Error', error.message, 'error');
      return;
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={'absolute'}
      left={'50%'}
      width={{ base: '100%', lg: '750px', md: '80%' }}
      transform={'translateX(-50%)'}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        maxW={{
          sm: '400px',
          md: 'full',
        }}
        mx={'auto'}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={'column'}
          maxW={{
            sm: '400px',
            md: 'full',
          }}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            Your conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={'center'} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={'sm'}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={'center'}
                p={'1'}
                borderRadius={'md'}
              >
                <Box>
                  <SkeletonCircle size={'10'} />
                </Box>

                <Flex w={'full'} flexDirection={'column'} gap={3}>
                  <Skeleton h={'10px'} w={'80px'} />
                  <Skeleton h={'8px'} w={'90px'} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={'md'}
            p={2}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'400px'}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
