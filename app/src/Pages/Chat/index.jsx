import { useAppStore } from '@/Store'
import  { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContectsContainer from './Components/Contects-container';
import EmptyChatContainer from './Components/empty-chat-container';
import ChatContainer from './Components/Chat-container';

const Chat = () => {
  const {userInfo}=useAppStore();
  const navigate=useNavigate();

   useEffect(()=>{
     if(!userInfo.profileSetup){
       toast("Please Setup Profile to Continue");
       navigate('/profile')
     }
   },[userInfo,navigate])

  return (
    <>
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContectsContainer/> 
      <EmptyChatContainer/>
      <ChatContainer/>
    </div>
    </>
  )
}

export default Chat
