import React from "react";
import { Button, message } from "antd";
import { userApi } from "../../../../service/api/User/userApi";

interface BanUnbanUserProps {
    userId: number; // ID của người dùng
    isActive: boolean; // Trạng thái kích hoạt hiện tại của người dùng
    onStatusChange?: () => void; // Hàm callback để thông báo làm mới dữ liệu
}

const BanUnbanUser: React.FC<BanUnbanUserProps> = ({ userId, isActive, onStatusChange }) => {
    const handleAction = async () => {
        try {
            if (isActive) {
                await userApi.banUser(userId); // Gọi API ban user
                message.success("User has been banned successfully.");
            } else {
                await userApi.unBanUser(userId); // Gọi API unban user
                message.success("User has been unbanned successfully.");
            }
            onStatusChange && onStatusChange(); // Thông báo làm mới dữ liệu nếu có
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
