import React from "react";
import { Button, message } from "antd";
import { userApi } from "../../../../service/api/User/userApi";

interface BanUnbanUserProps {
    userId: number;
    isActive: boolean;
    onStatusChange?: () => void;
}

const BanUnbanUser: React.FC<BanUnbanUserProps> = ({ userId, isActive, onStatusChange }) => {
    const handleAction = async () => {
        try {
            if (isActive) {
                await userApi.banUser(userId);
                message.success("User has been banned successfully.");
            } else {
                await userApi.unBanUser(userId);
                message.success("User has been unbanned successfully.");
            }
            onStatusChange && onStatusChange();
        } catch (error: any) {
            console.error(error);
            message.error(`Failed to ${isActive ? "ban" : "unban"} user.`);
        }
    };

    return (
        <Button type={isActive ? "primary" : "default"} danger={isActive} onClick={handleAction}>
            {isActive ? "Ban" : "Unban"}
        </Button>
    );
};

export default BanUnbanUser;
