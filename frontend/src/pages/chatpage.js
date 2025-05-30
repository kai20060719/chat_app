/*import React, { useEffect } from 'react'
import axios from 'axios'

const [chats, setchats] = useState([])

const Chatpage = () => {
    const getchats = async () => {
        const data = await axios.get('/api/chat');
        setchats(data);
    }
 
    useEffect(() =>{
        getchats();
    }, [])
  
    return (
    <div>{chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
    ))}</div>
  )
}

export default chatpage
*/