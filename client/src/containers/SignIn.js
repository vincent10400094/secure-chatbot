import { Input, Checkbox } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "../App.css";

const SignIn = ({ me, setMe, setIsChatBot, setSignedIn, displayStatus }) => {

    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
        setIsChatBot(e.target.checked);
    }

    return (<>
        <div className="App-title"><h1>My Chat Room</h1></div>
        <Input.Search
            prefix={<UserOutlined />}
            value={me}
            enterButton="Sign In"
            onChange={(e) => setMe(e.target.value)}
            placeholder="Enter your name"
            size="large"
            style={{ width: 300, margin: 50 }}
            onSearch={(name) => {
                if (!name)
                    displayStatus({ type: 'error', msg: 'Missing user name' });
                else
                    setSignedIn(true);
            }}
        ></Input.Search>
        <div>
            <Checkbox onChange={onChange}>Join as chatbot</Checkbox>
        </div>
    </>);
}

export default SignIn;
