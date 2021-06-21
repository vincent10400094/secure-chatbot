import { Input, Checkbox } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from 'react';

import "../App.css";
import SelectFilterModal from './SelectFilterModal';

const SignIn = ({ token, setToken, me, setMe, isChatBot, setIsChatBot, setSignedIn, displayStatus, setFilters }) => {

    const [modalVisible, setModalVisible] = useState(false);

    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
        setIsChatBot(e.target.checked);
    }

    return (<>
        <div className="App-title"><h1>Join Chat Room</h1></div>
        <SelectFilterModal
            visible={modalVisible}
            setVisible={setModalVisible}
            setSignedIn={setSignedIn}
            setFilters={setFilters}>
        </SelectFilterModal>
        <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter room token"
            style={{ width: 300, marginTop: 50, marginBottom: 10 }}
        >
        </Input>
        <Input.Search
            prefix={<UserOutlined />}
            value={me}
            enterButton="Join"
            onChange={(e) => setMe(e.target.value)}
            placeholder="Enter your name"
            size="large"
            style={{ width: 300, marginTop: 10, marginBottom: 50 }}
            onSearch={(name) => {
                if (!name) {
                    displayStatus({ type: 'error', msg: 'Missing user name' });
                } else if (isChatBot) {
                    setModalVisible(true);
                } else {
                    setSignedIn(true);
                }
            }}
        ></Input.Search>
        <div>
            <Checkbox onChange={onChange}>Join as chatbot</Checkbox>
        </div>
    </>);
}

export default SignIn;
