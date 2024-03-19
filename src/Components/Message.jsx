import { Avatar, Flex, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  // console.log('user in message component:', user.user.profilePic.url);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={'flex-end'}>
          <Text maxW={'350px'} bg={'blue.400'} p={1} borderRadius={'md'}>
            {message.text}
          </Text>
          <Avatar src={user?.user?.profilePic?.url} w={'7'} h={'7'} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w={'7'} h={'7'} />

          <Text
            maxW={'350px'}
            bg={'gray.400'}
            p={1}
            borderRadius={'md'}
            color={'black'}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
