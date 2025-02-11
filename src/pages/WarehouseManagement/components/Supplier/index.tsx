import { useState } from 'react';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import TableComponent, {
    Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import useModal from '../../../../hooks/useModal';
import useToast from '../../../../hooks/useToast';
import ModalAddSupplier from './components/ModalAddSupplier';
import ModalDetailSupplier from './components/ModalDetailSupplier';




const Supplier = () => {
    const { data, isLoading, mutate } = useFetcher('suppliers', 'GET');
    const [id, setId] = useState('');
    const toast = useToast();
    const { trigger, isLoading: loadingDelete } = useFetcher(
        'suppliers',
        'DELETE'
    );
    const modal = useModal();
    const modalDetail = useModal();

    const onConfirm = async (id: string) => {
        try {
            await trigger({ url: `suppliers/${id}` });
            toast.showSuccess('Delete success');
            mutate();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };

    const handleOpenModalAdd = () => {
        modal.openModal();
    };

    const handleOpenModalDetail = (id: string) => {
        setId(id);
        modalDetail.openModal();
    };

    const column: Column[] = [
        {
            dataIndex: 'supplierId',
            key: 'supplierId',
            title: '#',
            render: (_, __, index) => index + 1,
        },
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
            // render: (data) => <p className="text-base font-bold">{data}</p>,
        },
        {
            dataIndex: 'address',
            key: 'address',
            title: 'Address',
            // render: (data) => <p className="text-base font-bold">{data}</p>,
        },
        {
            dataIndex: 'phone',
            key: 'phone',
            title: 'Phone',
            // render: (data) => <p className="text-base font-bold">{data}</p>,
        },
        {
            dataIndex: 'email',
            key: 'email',
            title: 'Email',
            // render: (data) => <p className="text-base font-bold">{data}</p>,
        },



        {
            dataIndex: 'supplierId',
            key: 'action',
            title: 'Action',
            render: (data) => (
                <div className="flex gap-5">
                    <PopconfirmComponent
                        title={'Delete?'}
                        onConfirm={() => onConfirm(data)}
                    >
                        <ButtonComponent type="primary" danger>
                            Delete
                        </ButtonComponent>
                    </PopconfirmComponent>
                    <ButtonComponent
                        type="primary"
                        onClick={() => handleOpenModalDetail(data)}
                    >
                        View detail
                    </ButtonComponent>
                </div>
            ),
        },
    ];

    return (
        <AnimationAppear>
            <WhiteBackground>
                <div className="flex flex-col gap-5">
                    <ButtonComponent
                        loading={loadingDelete}
                        type="primary"
                        onClick={handleOpenModalAdd}
                    >
                        Add Supplier
                    </ButtonComponent>
                    <TableComponent
                        dataSource={data}
                        columns={column}
                        loading={isLoading}
                    />
                </div>
                <ModalAddSupplier modal={modal} mutate={mutate} />
                {id !== '' && (
                    <ModalDetailSupplier id={id} modal={modalDetail} mutate={mutate} />
                )}
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default Supplier;
