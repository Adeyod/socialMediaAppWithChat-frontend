import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import { sendMessageRoute } from './ApiRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);

  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) {
      return;
    }

    try {
      const { data } = await axios.post(sendMessageRoute, {
        message: messageText,
        recipientId: selectedConversation.userId,
      });

      if (data.success === false) {
        showToast('Error', data.message, 'error');
        return;
      }

      const userThatSend = data.newMessage;

      setMessages((messages) => [...messages, userThatSend]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText('');
      showToast('Success', data.message, 'success');
      return;
    } catch (error) {
      showToast('Error', error.message, 'error');
      return;
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={'full'}
          placeholder="Type a message"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />

        <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
