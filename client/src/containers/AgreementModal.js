import { Modal } from "antd";

const AgreementModal = ({ visible, setVisible }) => {
    return (
        <Modal
            visible={visible}
            title="Term of privacy"
            okText="Agree"
            // cancelText="Cancel"
            // onCancel={onCancel}
            onOk={() => {
                setVisible(false);
                // form.validateFields().then((values) => {
                //     form.resetFields();
                //     onCreate(values);
                // }).catch(e => window.alert(e));
            }}
        >
        </Modal>
    )
}

export default AgreementModal;
