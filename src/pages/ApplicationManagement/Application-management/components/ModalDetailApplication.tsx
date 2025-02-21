// import { DatePicker, Form, Space, Card, Tag } from 'antd';
// import { useEffect, useState } from 'react';
// import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';
// import useToast from '../../../../hooks/useToast';
// import useFetcher from '../../../../hooks/useFetcher';
// import { Application } from '../../../../model/ApplicationType/application';
// import DescriptionComponent, { DescriptionPropsItem } from '../../../../components/Description/DescriptionComponent';
// import ModalComponent from '../../../../components/Modal/ModalComponent';
// import ButtonComponent from '../../../../components/Button/ButtonComponent';
// import FormComponent from '../../../../components/Form/FormComponent';
// import { formatDateHour } from '../../../../utils/format';

// interface ModalDetailApplicationProps {
//     modal: any;
//     mutate: any;
//     id: string;
// }

// const ModalDetailApplication = ({
//     modal,
//     mutate,
//     id,
// }: ModalDetailApplicationProps) => {
//     const { t } = useTranslation();
//     const [form] = Form.useForm();
//     const toast = useToast();
//     const { trigger: approvalRequest, isLoading } = useFetcher(`application/approval-request/${id}`, 'PUT');
//     const { trigger: cancelRequest } = useFetcher(`application/cancel-request/${id}`, 'PUT');
//     const {
//         data,
//         isLoading: isLoadingDetail,
//         mutate: mutateEdit,
//     } = useFetcher<Application>(`application/${id}`, 'GET');

//     useEffect(() => {
//         if (data) {
//             form.setFieldsValue({
//                 title: data.title,
//                 content: data.content,
//                 fromDate: data.fromDate,
//                 toDate: data.toDate,
//                 type: data.type,
//                 status: data.status,
//                 requestBy: data.requestBy?.name,
//                 approveBy: data.approveBy?.name
//             });
//         }
//         if (modal.open) {
//             form.resetFields();
//         }
//     }, [modal.open, data, form]);

//     const handleApprove = async () => {
//         try {
//             await approvalRequest({});
//             toast.showSuccess(t('Approve success'));
//             mutate();
//             mutateEdit();
//             handleClose();
//         } catch (error: any) {
//             toast.showError(error.message);
//         }
//     };

//     const handleCancel = async () => {
//         try {
//             await cancelRequest({});
//             toast.showSuccess(t('Cancel success'));
//             mutate();
//             mutateEdit();
//             handleClose();
//         } catch (error: any) {
//             toast.showError(error.message);
//         }
//     };

//     const handleClose = () => {
//         form.resetFields();
//         modal.closeModal();
//     };

//     // Thêm màu cho trạng thái
//     const statusColor = {
//         pending: 'orange',
//         approved: 'green',
//         rejected: 'red'
//     };
//     const items: DescriptionPropsItem['items'] = [
//         {
//             key: 'title',
//             label: t('Title'),
//             children: <strong>{data?.title || 'N/A'}</strong>,
//             span: 1,
//         },
//         {
//             key: 'fromDate',
//             label: t('From Date'),
//             children: data?.fromDate ? formatDateHour(data.fromDate) : 'N/A',
//             span: 1,
//         },
//         {
//             key: 'content',
//             label: t('Content'),
//             children: <div className="content-display" dangerouslySetInnerHTML={{ __html: data?.content || '' }} />,
//             span: 2, // Chiếm nguyên hàng vì nội dung dài
//         },
//         {
//             key: 'toDate',
//             label: t('To Date'),
//             children: data?.toDate ? formatDateHour(data.toDate) : 'N/A',
//             span: 1,
//         },
//         {
//             key: 'status',
//             label: t('Status'),
//             children: <Tag color={statusColor[data?.status as keyof typeof statusColor] || 'blue'}>{data?.status || ''}</Tag>,
//             span: 1,
//         },
//         {
//             key: 'type',
//             label: t('Application Type'),
//             children: data?.type?.name || 'N/A',
//             span: 1,
//         },
//         {
//             key: 'requestBy',
//             label: t('Requested By'),
//             children: data?.requestBy?.name || 'N/A',
//             span: 1,
//         },
//         {
//             key: 'approveBy',
//             label: t('Approved By'),
//             children: data?.approveBy?.name || 'N/A',
//             span: 1,
//         },
//     ];
//     return (
//         <ModalComponent
//             title={t("Application Details")}
//             open={modal.open}
//             onCancel={handleClose}
//             loading={isLoadingDetail}
//             width={900}
//             footer={[
//                 <Space key="footer-buttons">
//                     <ButtonComponent key="cancel" danger onClick={handleCancel} icon={<CloseOutlined />}>
//                         {t("Cancel")}
//                     </ButtonComponent>
//                     <ButtonComponent key="approve" type="primary" loading={isLoading} onClick={handleApprove} icon={<CheckOutlined />}>
//                         {t("Approve")}
//                     </ButtonComponent>
//                 </Space>
//             ]}
//         >
//             <Card>
//                 <FormComponent form={form}>
//                     {/* Đặt column={2} để hiển thị dữ liệu theo cặp */}
//                     <DescriptionComponent items={items} column={2} />
//                 </FormComponent>
//             </Card>
//         </ModalComponent>
//     );
// };

// export default ModalDetailApplication;
// import { DatePicker, Form, Space, Card, Tag } from 'antd';
// import { useEffect, useState } from 'react';
// import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';
// import useToast from '../../../../hooks/useToast';
// import useFetcher from '../../../../hooks/useFetcher';
// import { Application } from '../../../../model/ApplicationType/application';
// import DescriptionComponent, { DescriptionPropsItem } from '../../../../components/Description/DescriptionComponent';
// import ModalComponent from '../../../../components/Modal/ModalComponent';
// import ButtonComponent from '../../../../components/Button/ButtonComponent';
// import FormComponent from '../../../../components/Form/FormComponent';
// import { formatDateHour } from '../../../../utils/format';

// interface ModalDetailApplicationProps {
//     modal: any;
//     mutate: any;
//     id: string;
// }

// const ModalDetailApplication = ({ modal, mutate, id }: ModalDetailApplicationProps) => {
//     const { t } = useTranslation();
//     const [form] = Form.useForm();
//     const toast = useToast();

//     const { trigger: approvalRequest, isLoading } = useFetcher(`application/approval-request/${id}`, 'PUT');
//     const { trigger: cancelRequest } = useFetcher(`application/cancel-request/${id}`, 'PUT');
//     const { data, isLoading: isLoadingDetail, mutate: mutateEdit } = useFetcher<Application>(`application/${id}`, 'GET');

//     useEffect(() => {
//         if (data) {
//             form.setFieldsValue({
//                 title: data.title,
//                 content: data.content,
//                 fromDate: data.fromDate,
//                 toDate: data.toDate,
//                 type: data.type,
//                 status: data.status,
//                 requestBy: data.requestBy?.name,
//                 approveBy: data.approveBy?.name
//             });
//         }
//         if (modal.open) {
//             form.resetFields();
//         }
//     }, [modal.open, data, form]);

//     const handleApprove = async () => {
//         try {
//             await approvalRequest({});
//             toast.showSuccess(t('Approve success'));
//             mutate();
//             mutateEdit();
//             handleClose();
//         } catch (error: any) {
//             toast.showError(error.message);
//         }
//     };

//     const handleCancel = async () => {
//         try {
//             await cancelRequest({});
//             toast.showSuccess(t('Cancel success'));
//             mutate();
//             mutateEdit();
//             handleClose();
//         } catch (error: any) {
//             toast.showError(error.message);
//         }
//     };

//     const handleClose = () => {
//         form.resetFields();
//         modal.closeModal();
//     };

//     const statusColor = {
//         pending: 'orange',
//         approved: 'green',
//         rejected: 'red'
//     };

//     const items: DescriptionPropsItem['items'] = [
//         { key: 'type', label: t('Application Type'), children: <strong> {data?.type?.name || 'N/A'}</strong>, span: 2 },
//         { key: 'title', label: t('Title'), children: <strong>{data?.title || 'N/A'}</strong>, span: 2 },
//         { key: 'content', label: t('Content'), children: <div className="content-display" dangerouslySetInnerHTML={{ __html: data?.content || '' }} />, span: 2 },

//         { key: 'fromDate', label: t('From Date'), children: data?.fromDate ? formatDateHour(data.fromDate) : 'N/A', span: 1 },
//         { key: 'toDate', label: t('To Date'), children: data?.toDate ? formatDateHour(data.toDate) : 'N/A', span: 1 },
//         { key: 'requestBy', label: t('Requested By'), children: data?.requestBy?.name || 'N/A', span: 1 },
//         { key: 'approveBy', label: t('Approved By'), children: data?.approveBy?.name || 'N/A', span: 1 },
//         { key: 'status', label: t('Status'), children: <Tag color={statusColor[data?.status as keyof typeof statusColor] || 'blue'}>{data?.status || ''}</Tag>, span: 2 },
//     ];

//     return (
//         <ModalComponent
//             title={t("Application Details")}
//             open={modal.open}
//             onCancel={handleClose}
//             loading={isLoadingDetail}
//             width={900}
//             footer={[
//                 <Space key="footer-buttons">
//                     <ButtonComponent key="cancel" danger onClick={handleCancel} icon={<CloseOutlined />}>
//                         {t("Cancel")}
//                     </ButtonComponent>
//                     <ButtonComponent key="approve" type="primary" loading={isLoading} onClick={handleApprove} icon={<CheckOutlined />}>
//                         {t("Approve")}
//                     </ButtonComponent>
//                 </Space>
//             ]}
//         >
//             <Card>
//                 <FormComponent form={form}>
//                     <DescriptionComponent items={items} column={2} />
//                 </FormComponent>
//             </Card>
//         </ModalComponent>
//     );

// };

// export default ModalDetailApplication;
import { Form, Space, Card, Badge, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useToast from '../../../../hooks/useToast';
import useFetcher from '../../../../hooks/useFetcher';
import { Application } from '../../../../model/ApplicationType/application';
import DescriptionComponent, { DescriptionPropsItem } from '../../../../components/Description/DescriptionComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import { formatDateHour } from '../../../../utils/format';

interface ModalDetailApplicationProps {
    modal: any;
    mutate: any;
    id: string;
}

const ModalDetailApplication = ({ modal, mutate, id }: ModalDetailApplicationProps) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const toast = useToast();

    const { trigger: approvalRequest, isLoading } = useFetcher(`application/approval-request/${id}`, 'PUT');
    const { trigger: cancelRequest } = useFetcher(`application/cancel-request/${id}`, 'PUT');
    const { data, isLoading: isLoadingDetail, mutate: mutateEdit } = useFetcher<Application>(`application/${id}`, 'GET');

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                title: data.title,
                content: data.content,
                fromDate: data.fromDate,
                toDate: data.toDate,
                type: data.type,
                status: data.status,
                requestBy: data.requestBy?.name,
                approveBy: data.approveBy?.name
            });
        }
        if (modal.open) {
            form.resetFields();
        }
    }, [modal.open, data, form]);

    const handleApprove = async () => {
        try {
            await approvalRequest({});
            toast.showSuccess(t('Approve success'));
            mutate();
            mutateEdit();
            handleClose();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };
    const statusColor = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red'
    };
    const handleCancel = async () => {
        try {
            await cancelRequest({});
            toast.showSuccess(t('Cancel success'));
            mutate();
            mutateEdit();
            handleClose();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };

    const handleClose = () => {
        form.resetFields();
        modal.closeModal();
    };

    const statusBadge = {
        pending: <Badge status="warning" text={t("Pending")} />,
        approved: <Badge status="success" text={t("Approved")} />,
        rejected: <Badge status="error" text={t("Rejected")} />
    };

    const items: DescriptionPropsItem['items'] = [
        { key: 'type', label: t('Application Type'), children: <strong>{data?.type?.name || 'N/A'}</strong>, span: 2 },
        { key: 'title', label: t('Title'), children: <strong>{data?.title || 'N/A'}</strong>, span: 2 },
        { key: 'content', label: t('Content'), children: <div className="content-display">{data?.content || 'N/A'}</div>, span: 2 },

        { key: 'fromDate', label: t('From Date'), children: data?.fromDate ? formatDateHour(data.fromDate) : 'N/A', span: 1 },
        { key: 'toDate', label: t('To Date'), children: data?.toDate ? formatDateHour(data.toDate) : 'N/A', span: 1 },
        { key: 'requestBy', label: t('Requested By'), children: <strong>{data?.requestBy?.name || 'N/A'}</strong>, span: 1 },
        { key: 'approveBy', label: t('Approved By'), children: <strong>{data?.approveBy?.name || ''}</strong>, span: 1 },
        { key: 'status', label: t('Status'), children: <Tag color={statusColor[data?.status as keyof typeof statusColor] || 'blue'}>{data?.status || ''}</Tag>, span: 2 },
    ];

    return (
        <ModalComponent
            title={t("Application Details")}
            open={modal.open}
            onCancel={handleClose}
            loading={isLoadingDetail}
            width={800}
            footer={[
                <Space key="footer-buttons">
                    <ButtonComponent key="cancel" danger onClick={handleCancel} icon={<CloseOutlined />} size="large">
                        {t("Cancel")}
                    </ButtonComponent>
                    <ButtonComponent key="approve" type="primary" loading={isLoading} onClick={handleApprove} icon={<CheckOutlined />} size="large">
                        {t("Approve")}
                    </ButtonComponent>
                </Space>
            ]}
        >
            <Card>
                <FormComponent form={form}>
                    <DescriptionComponent items={items} column={2} />
                </FormComponent>
            </Card>
        </ModalComponent>
    );
};

export default ModalDetailApplication;
