import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import "./MessagePage.css"
import { socket } from '../socket';


const friends = [
  {
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    "name": "Bob Smith",
    "email": "bob.smith@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    "name": "Catherine Brown",
    "email": "catherine.brown@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    "name": "David Williams",
    "email": "david.williams@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    "name": "Eva Miller",
    "email": "eva.miller@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    "name": "Frank Thomas",
    "email": "frank.thomas@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    "name": "Grace Lee",
    "email": "grace.lee@example.com",
    "profile_pic": "https://randomuser.me/api/portraits/women/7.jpg"
  }
]


export default function MessagePage() {
  const [ActiveChat, setActiveChat] = useState(0);

  return (
    <div className='messagingpage'>
      <PeopleList setActiveChat={setActiveChat} />
      <Messages activeFriend={friends[ActiveChat]} />
    </div>
  );
}

function PeopleList({ setActiveChat }) {
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
  }, [getuser]);

  const handleOnLogout = () => {
    localStorage.clear();
    window.location.reload();
  };


  //search bar
  const [search, setsearch] = useState("");
  const [people, setpeople] = useState([]);
  const handleOnSearch = (event) => {
    const currentSearch = event.target.value;
    setsearch(currentSearch);
    socket.emit("searchpeople", currentSearch)
    socket.on("searchresult", (people) => {
      if(people){
        setpeople(people)
        return () => {
          socket.off("searchresult");
        };
      }
      else{
        setpeople([])
      }
    })
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
          {search && <div className='searchresults'>
            {people.map((friend, index) => (
              <div key={index} className='Friend' onClick={() => setActiveChat(index)}>
                <img src={friend.profile_pic} alt="profile pic" />
                <label>{friend.name}</label>
              </div>
            ))}
            <label className='endoflist'>*****End of List*****</label>
          </div>}
        </div>
      </div>
      <div className='AllChats'>
        {friends.map((friend, index) => (
          <div key={index} className='Friend' onClick={() => setActiveChat(index)}>
            <img src={friend.profile_pic} alt="profile pic" />
            <label>{friend.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messages({ activeFriend }) {
  const sampleMessages = [
    { type: 'received', text: 'Hey there! How are you?' },
    { type: 'sent', text: 'I am good, how about you?' },
    { type: 'received', text: 'I am doing well, thanks!' },
    { type: 'sent', text: 'What have you been up to lately?' },
    { type: 'received', text: 'Just working on some projects. You?' },
    { type: 'sent', text: 'Same here, busy with coding and work.' },
    { type: 'received', text: 'Nice! Keep up the good work.' },
    { type: 'sent', text: 'Thanks! Will do.' },
    { type: 'received', text: 'Hey there! How are you?' },
    { type: 'sent', text: 'I am good, how about you?' },
    { type: 'received', text: 'I am doing well, thanks!' },
    { type: 'sent', text: 'What have you been up to lately?' },
    { type: 'received', text: 'Just working on some projects. You?' },
    { type: 'sent', text: 'Same here, busy with coding and work.' },
    { type: 'received', text: 'Nice! Keep up the good work.' },
    { type: 'sent', text: 'Thanks! Will do.' },
    { type: 'received', text: 'Hey there! How are you?' },
    { type: 'sent', text: 'I am good, how about you?' },
    { type: 'received', text: 'I am doing well, thanks!' },
    { type: 'sent', text: 'What have you been up to lately?' },
    { type: 'received', text: 'Just working on some projects. You?' },
    { type: 'sent', text: 'Same here, busy with coding and work.' },
    { type: 'received', text: 'Nice! Keep up the good work.' },
    { type: 'sent', text: 'Thanks! Will do.' }
  ];

  return (
    <div className="Messages-box">
      <div className="Name">
        <img src={activeFriend.profile_pic} alt={activeFriend.name} />
        <label>{activeFriend.name}</label>
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