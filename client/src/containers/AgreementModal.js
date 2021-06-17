import { Modal } from "antd";

const AgreementModal = ({ visible, setVisible, setSignedIn, filterWhitelist }) => {
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
                <p>All PII will be filtered out by our server, except for the following:</p>
                <ul style={{marginLeft: '20px'}}>
                    {filterWhitelist.map(filter => (
                        <li>{filter}</li>
                    ))}
                </ul>
            </div>
        </Modal>
    )
}

export default AgreementModal;
