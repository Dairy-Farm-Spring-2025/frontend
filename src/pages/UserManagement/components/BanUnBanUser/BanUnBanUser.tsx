import React from "react";
import { Button, message } from "antd";
import { userApi } from "../../../../service/api/User/userApi";
import { useTranslation } from "react-i18next";

interface BanUnbanUserProps {

    userId: number;
    isActive: boolean;
    onStatusChange?: () => void;
}

const BanUnbanUser: React.FC<BanUnbanUserProps> = ({ userId, isActive, onStatusChange }) => {
    const { t } = useTranslation();
    const handleAction = async () => {
        try {
            if (isActive) {


                await userApi.banUser(userId);
                message.success(t("User has been banned successfully."));
            } else {
                await userApi.unBanUser(userId);
                message.success(t("User has been unbanned successfully."));
            }
            onStatusChange && onStatusChange();
        } catch (error: any) {
            console.error(error);
            message.error(`Failed to ${isActive ? t("Ban") : t("UnBan")} user.`);
        }
    };

    return (
        <Button type={isActive ? "primary" : "default"} danger={isActive} onClick={handleAction}>
            {isActive ? t("Ban") : t("UnBan")}
        </Button>
    );
};

export default BanUnbanUser;
