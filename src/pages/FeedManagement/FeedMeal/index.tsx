import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import TableComponent from "../../../components/Table/TableComponent";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import AnimationAppear from "../../../components/UI/AnimationAppear";

interface FeedMeal {
    feedMealID: number;
    name: string;
    description: string;
    createdAt: string;
    cow: string;
}

const FeedMealManagement: React.FC = () => {
    const [feedMeals, setFeedMeals] = useState<FeedMeal[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<FeedMeal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fake dữ liệu ban đầu
        setFeedMeals([
            { feedMealID: 1, name: "Meal A", description: "High protein", createdAt: "2024-02-10", cow: "Cow 101" },
            { feedMealID: 2, name: "Meal B", description: "Rich in fiber", createdAt: "2024-02-12", cow: "Cow 102" },
            { feedMealID: 3, name: "Meal C", description: "Balanced diet", createdAt: "2024-02-14", cow: "Cow 103" },
        ]);
    }, []);

    const handleAddMeal = () => {
        setSelectedMeal(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditMeal = (record: FeedMeal) => {
        setSelectedMeal(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            createdAt: dayjs(record.createdAt),
            cow: record.cow
        });
        setIsModalOpen(true);
    };

    const handleDeleteMeal = (id: number) => {
        setFeedMeals(feedMeals.filter((meal) => meal.feedMealID !== id));
        message.success("Deleted successfully");
    };

    const handleSaveMeal = () => {
        form.validateFields().then((values) => {
            const newMeal: FeedMeal = {
                feedMealID: selectedMeal ? selectedMeal.feedMealID : feedMeals.length + 1,
                name: values.name,
                description: values.description,
                createdAt: values.createdAt.format("YYYY-MM-DD"),
                cow: values.cow
            };

            if (selectedMeal) {
                setFeedMeals(feedMeals.map((meal) => (meal.feedMealID === selectedMeal.feedMealID ? newMeal : meal)));
                message.success("Updated successfully");
            } else {
                setFeedMeals([...feedMeals, newMeal]);
                message.success("Added successfully");
            }

            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<FeedMeal> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
        { title: "Cow", dataIndex: "cow", key: "cow" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEditMeal(record)} style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteMeal(record.feedMealID)} danger>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <AnimationAppear duration={0.5}>
                <Button type="primary" onClick={handleAddMeal} style={{ marginBottom: 16 }}>
                    Add Feed Meal
                </Button>
                <WhiteBackground>
                    <Divider className="my-4" />
                    <TableComponent columns={columns} dataSource={feedMeals} rowKey="feedMealID" />
                </WhiteBackground>
            </AnimationAppear>

            {/* Modal thêm/sửa Feed Meal */}
            <Modal
                title={selectedMeal ? "Edit Feed Meal" : "Add Feed Meal"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSaveMeal}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter meal name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter description!" }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Cow" name="cow" rules={[{ required: true, message: "Please select cow!" }]}>
                        <Input placeholder="Enter Cow ID or Name" />
                    </Form.Item>
                    <Form.Item label="Created At" name="createdAt" rules={[{ required: true, message: "Please select date!" }]}>
                        <DatePicker />
                    </Form.Item>
                </Form>
            </Modal>
            =
        </div>
    );
};

export default FeedMealManagement;
