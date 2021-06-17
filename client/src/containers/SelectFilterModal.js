import { Modal, Select } from "antd";
const { Option, OptGroup } = Select;

const SelectFilterModal = ({ visible, setVisible, setSignedIn, setFilters }) => {

    const filters = {
        "Financial": [
            "BANK_ACCOUNT_NUMBER",
            "BANK_ROUTING",
            "CREDIT_DEBIT_NUMBER",
            "CREDIT_DEBIT_CVV",
            "CREDIT_DEBIT_EXPIRY",
            "PIN",
        ],
        "Personal": [
            "NAME",
            "ADDRESS",
            "PHONE",
            "EMAIL",
            "AGE",
        ],
        "Technical Security": [
            "USERNAME",
            "PASSWORD",
            "URL",
            "AWS_ACCESS_KEY",
            "AWS_SECRET_KEY",
            "IP_ADDRESS",
            "MAC_ADDRESS",
        ],
        "National": [
            "SSN",
            "PASSPORT_NUMBER",
            "DRIVER_ID",
        ],
        "Other": [
            "DATE_TIME",
        ]
    };

    const handleChange = (value) => {
        setFilters(value);
    }

    return (
        <Modal
            visible={visible}
            closable={false}
            destroyOnClose={true}
            title="Select filtering whitelist"
            okText="Select"
            cancelText={"Cancel"}
            onCancel={() => setVisible(false)}
            onOk={() => {
                setVisible(false);
                setSignedIn(true);
            }}
        >
            <div>
                <p>By default, all entities listed below will be filtered out by our agent. You can select specific entities not to be filtered out:</p>
                
            </div>
            <Select
                mode="multiple"
                allowClear
                placeholder="Please select filters to allow"
                style={{ width: '100%' }} 
                onChange={handleChange}
            >
                {Object.keys(filters).map(category => (
                    <OptGroup label={category}>
                        {filters[category].map(filter => (
                            <Option value={filter}>
                                {filter}
                            </Option>
                        ))}
                    </OptGroup>
                ))}
            </Select>
        </Modal>
    )
}

export default SelectFilterModal;
