import React, { useState } from "react";
import { Modal, Select, Button } from "antd";
import useFetcher from "../../../hooks/useFetcher";

const { Option } = Select;

interface EditRoleUserProps {
    modal: any;
    mutate: any;
    id: string;
    roleId: string;

}
const EditRoleUser = ({ modal, mutate, id, roleId }: EditRoleUserProps) => {
    const { trigger, isLoading } = useFetcher(`users/changerole/${id}/${roleId}`, "PUT");

    const [newRoleId, setNewRoleId] = useState(roleId);

    const handleChangeRole = async () => {
        await trigger();
        mutate();
        modal.closeModal();
    };
    return (

        <Modal
            title="Edit User Role"
            open={modal.isOpen}
            onCancel={modal.closeModal}
            footer={[
                <Button key="cancel" onClick={modal.closeModal}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={isLoading} onClick={handleChangeRole}>
                    Save
                </Button>,
            ]}
        >
            <Select
                value={newRoleId}
                style={{ width: "100%" }}
                onChange={(value) => setNewRoleId(value)}
            >
                <Option value="1">Admin</Option>
                <Option value="2">Manager</Option>
                <Option value="3">Staff</Option>
            </Select>
        </Modal>
    );
};

export default EditRoleUser;
