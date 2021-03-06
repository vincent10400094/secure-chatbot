import "../App.css";

import { useEffect, useState, useRef } from "react";
import { Input, Popconfirm } from "antd";
import allRegex from '../helpers/guardHelper';

import AgreementModal from './AgreementModal';

const ChatRoom = ({ token, me, isChatBot, displayStatus, setSignedIn, filters }) => {
    const [messageInput, setMessageInput] = useState("");
    const [agreementModalVisible, setAgreementModalVisible] = useState(false);
    const [messages, _setMessages] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [filterWhitelist, setFilterWhitelist] = useState([]);

    const messagesRef = useRef(messages);
    const server = useRef();
    const buttonRef = useRef(null);
    const inputRef = useRef(null);
    const dummyRef = useRef(null);

    const setMessages = (msgs) => {
        messagesRef.current = msgs;
        _setMessages(msgs);
    }

    const messageHandler = (msg) => {
        msg = JSON.parse(msg.data);
        console.log(msg);
        if (msg.type === 'CHAT' && !isChatBot) {
            setAgreementModalVisible(true);
            setFilterWhitelist(msg.data.filters);
            // setMessages(msg.data.messages);
        } else if (msg.type === 'MESSAGE') {
            setMessages([...messagesRef.current, msg.data.message]);
            dummyRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (msg.type === 'ERROR') {
            displayStatus({ type: 'error', msg: msg.data.msg });
            setSignedIn(false);
        }
    }

    const sendMessage = () => {
        server.current.sendEvent({
            type: 'MESSAGE',
            data: {
                name: me,
                body: messageInput,
                token: token,
            },
        });
        setMessageInput("");
    }

    useEffect(() => {
        server.current = new WebSocket('ws://140.112.30.35:4000');
        server.current.onopen = () => {
            console.log('Server connected.');
            server.current.sendEvent({
                type: 'CHAT', 
                data: { 
                    name: me, 
                    isChatBot: isChatBot,
                    filters: filters,
                    token: token,
                },
            });
        }
        server.current.onmessage = messageHandler;
        server.current.sendEvent = (msg) => server.current.send(JSON.stringify(msg));
    }, []);

    return (
        <>
            <AgreementModal
                visible={agreementModalVisible}
                setVisible={setAgreementModalVisible}
                setSignedIn={setSignedIn}
                filterWhitelist={filterWhitelist}>
            </AgreementModal>
            <div className="App-title">
                <h2>Chat Token: <code>{token}</code></h2>
            </div>
            <div className="App-messages" style={{overflow: 'scroll'}}>
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
                <div ref={dummyRef}></div>
            </div>
            <Popconfirm
                title={alertMessage}
                placement="topLeft"
                onConfirm={ () => sendMessage() }
                okText="Send"
                cancelText="Cancel"
            >
                <a href="#" ref={buttonRef} id={'fuck'}></a>
            </Popconfirm>
            <Input.Search
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                enterButton="Send"
                placeholder="Enter message here..."
                ref={inputRef}
                onSearch={(msg) => {
                    if (!msg) {
                        displayStatus({
                            type: "error",
                            msg: "Please enter message.",
                        });
                        return;
                    }
                    /* Check whether the message contains sensitive info */
                    let matches = [];
                    for (let regex of allRegex) {
                        let result = regex.exec(msg);
                        if (result)
                            matches.push(result[0]);
                    }
                    /* there's sensitive information */
                    if (matches.length) {
                        setAlertMessage(`Sensitive information detected: ${matches.join()}`);
                        buttonRef.current.click();
                        return;
                    }
                    sendMessage();
                }}
            ></Input.Search>
        </>);
};

export default ChatRoom;
