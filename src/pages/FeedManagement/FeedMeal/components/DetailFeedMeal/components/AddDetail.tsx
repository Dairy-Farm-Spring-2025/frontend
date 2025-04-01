// AddDetail.tsx
import { Modal, Form, InputNumber, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Item } from '@model/Warehouse/items';
import { useState } from 'react';
import { FEED_PATH } from '@service/api/Feed/feedApi';
import ButtonComponent from '@components/Button/ButtonComponent';
import ModalComponent from '@components/Modal/ModalComponent';

interface AddDetailProps {
    feedMealId: number;
    category: string;
    items: Item[];
    isLoadingItems: boolean;
    mutate: () => void;
    onAddClick: () => void;
}

const AddDetail = ({
    feedMealId,
    category,
    items,
    isLoadingItems,
    mutate,
    onAddClick,
}: AddDetailProps) => {
    const { t } = useTranslation();
    const toast = useToast();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Validate feedMealId before making the API call
    if (!feedMealId || isNaN(feedMealId)) {
        console.error('Invalid feedMealId:', feedMealId);
        return null; // Or render an error message
    }

    const { trigger: addDetail, isLoading: isAdding } = useFetcher(
        FEED_PATH.ADD_DETAIL(String(feedMealId)),
        'POST'
    );

    const itemOptions = items?.map((item: Item) => ({
        label: item.name,
        value: item.itemId,
    })) || [];

    const filterItemsByCategory = (category: string) => {
        return itemOptions.filter((item: any) => {
            const itemData = items?.find((i: Item) => i.itemId === item.value);
            return itemData?.categoryEntity?.name === category;
        });
    };

    const handleAddClick = () => {
        setIsModalVisible(true);
        onAddClick();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                quantity: values.quantity,
                itemId: values.itemId,
            };

            await addDetail({ body: payload });
            toast.showSuccess(t('Detail added successfully'));
            form.resetFields();
            setIsModalVisible(false);
            mutate();
        } catch (error: any) {
            toast.showError(error.message || t('Failed to add detail'));
        }
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    return (
        <>
            <ButtonComponent
                type="primary"
                onClick={handleAddClick}
                className="mt-2 w-full"
            >
                {t('Add more')}
            </ButtonComponent>

            <ModalComponent
                title={t('Add new detail')}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={t('Add')}
                cancelText={t('Cancel')}
                confirmLoading={isAdding}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="itemId"
                        label={t('Item')}
                        rules={[{ required: true, message: t('Please select an item') }]}
                    >
                        <Select
                            placeholder={t('Select an item')}
                            options={filterItemsByCategory(category)}
                            loading={isLoadingItems}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label={t('Quantity (kilogram)')}
                        rules={[
                            { required: true, message: t('Please enter quantity') },
                            { type: 'number', min: 0, message: t('Quantity must be non-negative') },
                        ]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>
                </Form>
            </ModalComponent>
        </>
    );
};

export default AddDetail;