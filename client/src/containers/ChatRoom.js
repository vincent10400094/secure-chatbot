import "../App.css";

import { useEffect, useState, useRef } from "react";
import { Input } from "antd";

import AgreementModal from './AgreementModal';

const ChatRoom = ({ me, isChatBot, displayStatus }) => {
    const [messageInput, setMessageInput] = useState("");
    const [agreementModalVisible, setAgreementModalVisible] = useState(true);
    const [messages, _setMessages] = useState([]);

    const messagesRef = useRef(messages);
    const server = useRef();

    const setMessages = (msgs) => {
        messagesRef.current = msgs;
        _setMessages(msgs);
    }

    const messageHandler = (msg) => {
        msg = JSON.parse(msg.data);
        if (msg.type === 'CHAT') {
            setMessages(msg.data.messages);
        } else if (msg.type === 'MESSAGE') {
            setMessages([...messagesRef.current, msg.data.message]);
        }
    }

    useEffect(() => {
        server.current = new WebSocket('ws://140.112.30.34:4000');
        server.current.onopen = () => {
            console.log('Server connected.');
            server.current.sendEvent({ type: 'CHAT', data: { name: me, isChatBot: isChatBot } });
        }
        server.current.onmessage = messageHandler;
        server.current.sendEvent = (msg) => server.current.send(JSON.stringify(msg));
    }, []);

    return (
        <>
            <AgreementModal 
                visible={agreementModalVisible}
                setVisible={setAgreementModalVisible}>
            </AgreementModal>
            <div className="App-title">
                <h1>{me}'s Chat Room</h1>
            </div>
            <div className="App-messages">
                {
                    messages.map((msg, i) => (
                        msg.name === me ?
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} key={i}>
                                <p className="App-message">{msg.body}</p>
                                <p>{msg.name}</p>
                            </div> :
                            <div style={{ display: 'flex', alignItems: 'flex-start' }} key={i}>
                                <p>{msg.name}</p>
                                <p className="App-message">{msg.body}</p>
                            </div>
                    ))
                }
            </div>
            <Input.Search
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                enterButton="Send"
                placeholder="Enter message here..."
                onSearch={(msg) => {
                    if (!msg) {
                        displayStatus({
                            type: "error",
                            msg: "Please enter message.",
                        });
                        return;
                    }
                    server.current.sendEvent({
                        type: 'MESSAGE',
                        data: {
                            name: me,
                            body: msg,
                        },
                    });
                    setMessageInput("");
                }}
            ></Input.Search>
        </>);
};

export default ChatRoom;
