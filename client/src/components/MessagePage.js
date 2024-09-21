import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./MessagePage.css";
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';


export default function MessagePage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);


  const getfriends = useCallback(async () => {
    const token = localStorage.getItem("token");
    const finaltoken = `Bearer ${token}`;

    socket.emit("getfriends", finaltoken);

    const handleFriends = (data) => {
      setFriends(data);
    };

    socket.on("friends", handleFriends);

    return () => {
      socket.off("friends", handleFriends);
    };
  }, []);

  useEffect(() => {
    getfriends();
  });

  const activeChat = friends?.find(friend => friend._id === activeChatId);

  //get messages
  const handleOnGetMessages = (id) => {
    const token = localStorage.getItem("token")
    const finaltoken = "Bearer " + token
    socket.emit("startchat", id, finaltoken)
    socket.emit("getmessages", finaltoken, id)
    socket.on("messageshistory", (messages) => {
      const allmessages = []
      messages.forEach((message) => {
        if (message.sender === id) {
          const finalmessage = message.messages
          finalmessage.forEach((text) => {
            allmessages.push({
              type: 'received',
              text: text.text,
              time: text.createdAt
            })
          })
        } else if (message.receiver === id) {
          const finalmessage = message.messages
          finalmessage.forEach((text) => {
            allmessages.push({
              type: 'sent',
              text: text.text,
              time: text.createdAt
            })
          })
        }
      })
      allmessages.sort((a, b) => new Date(a.time) - new Date(b.time));
      setMessages(allmessages)
      console.log(allmessages)
    })
  }


  return (
    <div className='messagingpage'>
      <PeopleList setActiveChatId={setActiveChatId} friends={friends} handleOnGetMessages={handleOnGetMessages} />
      <Messages activeChat={activeChat} setActiveChatId={setActiveChatId} Messages={messages} handleOnGetMessages={handleOnGetMessages} setMessages={setMessages} />
    </div>
  );
}

function PeopleList({ setActiveChatId, friends, handleOnGetMessages }) {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    profile_pic: ''
  });
  const navigate = useNavigate()

  const getuser = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/userdetails`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setUserDetails({
      name: response.data.user.name,
      email: response.data.user.email,
      profile_pic: response.data.user.profile_pic
    });
  }, []);

  useEffect(() => {
    getuser();
  }, [getuser]);

  const handleOnLogout = () => {
    const token = localStorage.getItem("token")
    const finaltoken = `Bearer ${token}`
    socket.emit("logout", finaltoken)
    localStorage.clear();
    navigate("/login")
  };

  const [searchState, setSearchState] = useState({ search: "", people: [] });

  const handleOnSearch = (event) => {
    const currentSearch = event.target.value;
    setSearchState((prevState) => ({ ...prevState, search: currentSearch }));
    socket.emit("searchpeople", currentSearch);
  };

  useEffect(() => {
    const handleSearchResult = (people) => {
      setSearchState((prevState) => ({ ...prevState, people: people || [] }));
    };

    socket.on("searchresult", handleSearchResult);

    return () => {
      socket.off("searchresult", handleSearchResult);
    };
  }, []);


  //select and start chat
  const handleOnChat = (id) => {
    setActiveChatId(id)
    handleOnGetMessages(id)
  }

  return (
    <div className='PeopleList'>
      <div className='ProfileBox'>
        <div className="Profile">
          <img src={userDetails.profile_pic} alt={userDetails.name} />
          <button onClick={handleOnLogout} className='Logout'>Logout</button>
        </div>
        <div className='Search'>
          <input type='text' placeholder="Search" onChange={handleOnSearch} />
          {searchState.search && <div className='searchresults'>
            {searchState.people.map((friend) => (
              <button key={friend._id} className='Friend' onClick={() => { handleOnChat(friend._id); window.location.reload() }}>
                <img src={friend.profile_pic} alt="profile pic" />
                <label>{friend.name}</label>
              </button>
            ))}
            <label className='endoflist'>*****End of List*****</label>
          </div>}
        </div>
      </div>
      <div className='AllChats'>
        {friends.map((friend) => (
          <button key={friend._id} className='Friend' onClick={() => handleOnChat(friend._id)}>
            <img src={friend.profile_pic} style={friend.socketId ? { borderStyle: 'solid', borderColor: 'yellowgreen' } : { borderStyle: 'solid', borderColor: 'transparent' }} alt="profile pic" />
            <label>{friend.name}</label>
          </button>
        ))}
      </div>
    </div>
  );
}

function Messages({ activeChat, setActiveChatId, Messages, handleOnGetMessages, setMessages }) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  useEffect(() => {
    socket.on("receivedmessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "received",
          text: message,
        },
      ]);
    });

    return () => {
      socket.off("receivedmessage");     
    };
  }, [setMessages]);

  if (!activeChat) {
    return <div className='noactiveselected'><h1>No active chat selected</h1></div>;
  }

  const handleOnClose = () => {
    setActiveChatId(null)
  }

  const handleOnMessageInput = (event) => {
    setMessageInput(event.target.value);
  }

  const handleOnSendMessage = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token")
    const chatId = activeChat._id
    const finaltoken = `Bearer ${token}`
    socket.emit("sendmessage", finaltoken, chatId, messageInput)
    setMessageInput("")
    setMessages((prev) => [...prev, { type: "sent", text: messageInput}])
  }




  return (
    <div className="Messages-box">
      <div className="Name">
        <img src={activeChat.profile_pic} alt={activeChat.name} />
        <label>{activeChat.name}</label>
        <button onClick={handleOnClose}><h1>x</h1></button>
      </div>
      <div className="Messages">
        {Messages.map((message, index) => (
          <div key={index} className={`MessageItem ${message.type}`}>
            <label>{message.text}</label>
          </div>
        ))}
      </div>
      <form className='MessageInputBox' >
        <input type="text" style={activeChat.socketId ? {} : { borderRadius: "15px", textAlign: 'center', fontSize: '20px' }} placeholder={activeChat.socketId ? "Type a message..." : "User is Offline"} value={messageInput} onChange={handleOnMessageInput} disabled={activeChat.socketId ? false : true} />
        {activeChat.socketId && <button type="submit" className='SendMessage' onClick={handleOnSendMessage}>Send</button>}
      </form>
      <div ref={messagesEndRef} />
    </div>
  );
}
