import { Form } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
    DescriptionPropsItem,
} from '../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';

import { Supplier } from '../../../../../model/Warehouse/supplier';


interface ModalDetailSupplierProps {
    modal: any;
    mutate: any;
    id: string;
}

const ModalDetailSupplier = ({
    modal,
    mutate,
    id,
}: ModalDetailSupplierProps) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher(`suppliers/${id}`, 'PUT');
    const [edit, setEdit] = useState(false);
    const {
        data,
        isLoading: isLoadingDetail,
        mutate: mutateEdit,
    } = useFetcher<Supplier>(`suppliers/${id}`, 'GET');

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email
            });
        }
    }, [data, form]);

    const handleFinish = async (values: any) => {
        try {
            await trigger({ body: values });
            toast.showSuccess('Update success');
            mutate();
            mutateEdit();
            setEdit(false);
        } catch (error: any) {
            toast.showSuccess(error.message);
        }
    };

    const handleClose = () => {
        modal.closeModal();
        form.resetFields();
    };

    const items: DescriptionPropsItem['items'] = [
        {
            key: 'name',
            label: 'Name',
            children: !edit ? (
                data ? (
                    data?.name
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="name" rules={[{ required: true }]}>
                    <InputComponent />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'address',
            label: 'Address',
            children: !edit ? (
                data ? (
                    data?.address
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="address" rules={[{ required: true }]}>
                    <InputComponent.TextArea />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'phone',
            label: 'Phone',
            children: !edit ? (
                data ? (
                    data?.phone
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="phone" rules={[{ required: true }]}>
                    <InputComponent.TextArea />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'email',
            label: 'Email',
            children: !edit ? (
                data ? (
                    data?.email
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="email" rules={[{ required: true }]}>
                    <InputComponent.TextArea />
                </FormItemComponent>
            ),
            span: 3,
        },

    ];

    return (
        <ModalComponent
            title="Edit Supplier"
            open={modal.open}
            onCancel={handleClose}
            loading={isLoadingDetail}
            footer={[
                !edit && (
                    <ButtonComponent type="primary" onClick={() => setEdit(true)}>
                        Edit
                    </ButtonComponent>
                ),
                edit && (
                    <div className="flex gap-5 justify-end">
                        <ButtonComponent onClick={() => setEdit(false)}>
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            loading={isLoading}
                            type="primary"
                            onClick={() => form.submit()}
                        >
                            Save
                        </ButtonComponent>
                    </div>
                ),
            ]}
        >
            <FormComponent form={form} onFinish={handleFinish}>
                <DescriptionComponent items={items} />
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalDetailSupplier;
