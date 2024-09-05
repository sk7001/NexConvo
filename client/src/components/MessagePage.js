import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import "./MessagePage.css";
import { socket } from '../socket';

export default function MessagePage() {
  const [ActiveChat, setActiveChat] = useState("");
  const [friends, setFriends] = useState([]);

  const getfriends = useCallback(async () => {
    const token = localStorage.getItem("token");
    const finaltoken = `Bearer ${token}`;

    socket.emit("getfriends", finaltoken);

    const handleFriends = (data) => {
      setFriends(data);
    };

    socket.on("friends", handleFriends);

    // Cleanup listener on unmount
    return () => {
      socket.off("friends", handleFriends);
    };
  }, []);

  useEffect(() => {
    getfriends();
  }, [getfriends]);

  return (
    <div className='messagingpage'>
      <PeopleList setActiveChat={setActiveChat} friends={friends} />
      <Messages activeChat={friends[ActiveChat]} setActiveChat={setActiveChat} />
    </div>
  );
}

function PeopleList({ setActiveChat, friends }) {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    profile_pic: ''
  });

  const getuser = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:8000/api/userdetails', {
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
  }, [getuser]); // Removed 'friends' dependency

  const handleOnLogout = () => {
    localStorage.clear();
    window.location.reload();
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
            {searchState.people.map((friend, index) => (
              <button key={index} className='Friend' onClick={() => setActiveChat(index)}>
                <img src={friend.profile_pic} alt="profile pic" />
                <label>{friend.name}</label>
              </button>
            ))}
            <label className='endoflist'>*****End of List*****</label>
          </div>}
        </div>
      </div>
      <div className='AllChats'>
        {friends.map((friend, index) => (
          <button key={index} className='Friend' onClick={() => setActiveChat(index)}>
            <img src={friend.profile_pic} alt="profile pic" />
            <label>{friend.name}</label>
          </button>
        ))}
      </div>
    </div>
  );
}

function Messages({ activeChat, setActiveChat }) {
  if (!activeChat) {
    return <div className='noactiveselected'><h1>No active chat selected</h1></div>;
  }
  const sampleMessages = [
    { type: 'received', text: 'Hey there! How are you?' },
    { type: 'sent', text: 'I am good, how about you?' },
    { type: 'received', text: 'I am doing well, thanks!' },
    { type: 'sent', text: 'What have you been up to lately?' },
    { type: 'received', text: 'Just working on some projects. You?' },
    { type: 'sent', text: 'Same here, busy with coding and work.' },
    { type: 'received', text: 'Nice! Keep up the good work.' },
    { type: 'sent', text: 'Thanks! Will do.' }
  ]

  const handleOnClose = () => {
    setActiveChat(null)
  }

  return (
    <div className="Messages-box">
      <div className="Name">
        <img src={activeChat.profile_pic} alt={activeChat.name} />
        <label>{activeChat.name}</label>
        <button onClick={handleOnClose}><h1>x</h1></button>
      </div>
      <div className="Messages">
        {sampleMessages.map((message, index) => (
          <div key={index} className={`MessageItem ${message.type}`}>
            <label>{message.text}</label>
          </div>
        ))}
      </div>
      <div className='MessageInputBox'>
        <input type="text" placeholder="Type a message..." />
        <button className='SendMessage'>Send</button>
      </div>
    </div>
  );
}
