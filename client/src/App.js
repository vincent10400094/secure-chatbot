import SignIn from './containers/SignIn';
import ChatRoom from './containers/ChatRoom';
import "./App.css";

import { useState, useEffect } from "react";
import { message } from "antd";;

const LOCALSTORAGE_KEY = "save-me";

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

  const [signedIn, setSignedIn] = useState(false);
  const [isChatBot, setIsChatBot] = useState(false);
  const [me, setMe] = useState(savedMe || "");

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn]);

  const displayStatus = (payload) => {
    if (payload.msg) {
      const {type, msg} = payload;
      const content = {
        content: msg,
        duration: 0.5
      }
      switch (type){
        case 'success':
          message.success(content);
          break;
        case 'error':
        default:
          message.error(content);
          break;
      }
    }
  }

  return (
    <div className="App">
      {signedIn ? 
      (<ChatRoom 
        me={me}
        isChatBot={isChatBot}
        displayStatus={displayStatus}
      />) : (
      <SignIn 
        me={me}
        setMe={setMe}
        isChatBot={isChatBot}
        setIsChatBot={setIsChatBot}
        setSignedIn={setSignedIn}
        displayStatus={displayStatus}
      />)}
    </div>);
};

export default App;