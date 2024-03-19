import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Message from './Message';
import MessageInput from './MessageInput';
import useShowToast from '../hooks/useShowToast';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getMessagesRoute } from './ApiRoutes';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const setConversations = useSetRecoilState(conversationsAtom);

  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message?.text,
                sender: message?.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) {
          return;
        }
        const { data } = await axios.get(
          `${getMessagesRoute}/${selectedConversation.userId}`
        );

        if (data.success === false) {
          showToast('Error', data.message, 'error');
          return;
        } else {
          showToast('Success', data.message, 'success');

          const dataToAdd = data.messages;

          setMessages(dataToAdd);
          return;
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
        return;
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId]);
  return (
    <Flex
      flex="70"
      bg={useColorModeValue('gray.200', 'gray.dark')}
      borderRadius={'md'}
      p={2}
      flexDirection={'column'}
    >
      {/* Message header */}
      <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
        <Text display={'flex'} alignItems={'center'}>
          {selectedConversation.username}{' '}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={'column'}
        gap={4}
        my={4}
        p={2}
        height={'400px'}
        overflowY={'auto'}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={'center'}
              p={1}
              borderRadius={'md'}
              alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}

              <Flex flexDir={'column'} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={'column'}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser.user._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
