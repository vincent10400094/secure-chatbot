import { Modal } from "antd";

const AgreementModal = ({ visible, setVisible, setSignedIn }) => {
    return (
        <Modal
            visible={visible}
            closable={false}
            destroyOnClose={true}
            title="Terms of privacy"
            okText="Agree"
            cancelText={"Not agree"}
            onCancel={ () => setSignedIn(false) }
            onOk={() => setVisible(false) }
        >
            <div>
                <p>Some text</p>
                <ul style={{marginLeft: '20px'}}>
                    <li>item 1</li>
                    <li>item 2</li>
                </ul>
            </div>
        </Modal>
    )
}

export default AgreementModal;
