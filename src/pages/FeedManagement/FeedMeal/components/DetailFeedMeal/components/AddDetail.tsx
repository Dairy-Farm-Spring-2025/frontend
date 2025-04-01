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
    category: string; // This prop is now optional since we'll select the category in the modal
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
    const [selectedCategory, setSelectedCategory] = useState<string>(category || '');

    // Validate feedMealId before making the API call
    if (!feedMealId || isNaN(feedMealId)) {
        console.error('Invalid feedMealId:', feedMealId);
        return null; // Or render an error message
    }

    const { trigger: addDetail, isLoading: isAdding } = useFetcher(
        FEED_PATH.ADD_DETAIL(String(feedMealId)),
        'POST'
    );

    // Define category options
    const categoryOptions = [
        { label: 'Cỏ Khô', value: 'Cỏ Khô' },
        { label: 'Thức ăn tinh', value: 'Thức ăn tinh' },
        { label: 'Thức ăn ủ chua', value: 'Thức ăn ủ chua' },
        { label: 'Khoáng chất', value: 'Khoáng chất' },
    ];

    // Filter items based on the selected category
    const itemOptions = items?.map((item: Item) => ({
        label: item.name,
        value: item.itemId,
        category: item.categoryEntity?.name,
    })) || [];

    const filteredItemOptions = selectedCategory
        ? itemOptions.filter((item: any) => item.category === selectedCategory)
        : itemOptions;

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
            setSelectedCategory(''); // Reset category selection
            mutate();
        } catch (error: any) {
            toast.showError(error.message || t('Failed to add detail'));
        }
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedCategory(''); // Reset category selection
    };

    return (
        <>
            <ButtonComponent
                type="primary"
                onClick={handleAddClick}
                className="mt-2"
            >
                {t('Add')}
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
                        name="category"
                        label={t('Category')}
                        rules={[{ required: true, message: t('Please select a category') }]}
                    >
                        <Select
                            placeholder={t('Select a category')}
                            options={categoryOptions}
                            onChange={(value) => {
                                setSelectedCategory(value);
                                form.setFieldsValue({ itemId: undefined }); // Reset item selection when category changes
                            }}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item
                        name="itemId"
                        label={t('Item')}
                        rules={[{ required: true, message: t('Please select an item') }]}
                    >
                        <Select
                            placeholder={t('Select an item')}
                            options={filteredItemOptions}
                            loading={isLoadingItems}
                            showSearch
                            optionFilterProp="label"
                            disabled={!selectedCategory} // Disable until a category is selected
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