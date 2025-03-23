import { Divider } from 'antd';
import TableComponent, {
    Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import { VaccineCycle } from '../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatDateHour } from '../../../../utils/format';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import useModal from '../../../../hooks/useModal';

import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import useToast from '../../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ListVaccineInjection = () => {
    const navigate = useNavigate();
    const {
        data: vaccineCycle,
        isLoading: isLoadingVaccine,
        mutate,
    } = useFetcher<VaccineCycle[]>('vaccine-injections', 'GET');
    const { isLoading: isLoadingDelete, trigger } = useFetcher(
        'vaccinecycles/delete',
        'DELETE'
    );
    const modal = useModal();
    const toast = useToast();
    const { t } = useTranslation();
    const handleDelete = async (id: number) => {
        try {
            const response = await trigger({ url: `vaccine-injections/${id}` });
            toast.showSuccess(response.message);
            mutate();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };

    const columns: Column[] = [
        {
            dataIndex: 'injectionDate',
            key: 'injectionDate',
            title: t('Injection Date'),
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: t('Status'),
        },
        {
            dataIndex: 'id',
            key: 'action',
            title: t('Action'),
            render: (data) => (
                <div className="flex gap-5">
                    <ButtonComponent
                        type="primary"
                        onClick={() => navigate(`../${data}`)}
                    >
                        {t('View Detail')}
                    </ButtonComponent>
                    <PopconfirmComponent
                        onConfirm={() => handleDelete(data)}
                        title={t('Are you sure to delete this?')}
                    >
                        <ButtonComponent loading={isLoadingDelete} danger type="primary">
                            {t('Delete')}
                        </ButtonComponent>
                    </PopconfirmComponent>
                </div>
            ),
        },
    ];
    return (
        <AnimationAppear>
            <WhiteBackground>
                <ButtonComponent type="primary" onClick={() => modal.openModal()}>
                    {t('Create Vaccine Cycle')}
                </ButtonComponent>
                <Divider />
                <TableComponent
                    columns={columns}
                    loading={isLoadingVaccine}
                    dataSource={vaccineCycle as VaccineCycle[]}
                />

            </WhiteBackground>
        </AnimationAppear>
    );
};

export default ListVaccineInjection;
