import ButtonComponent from '@components/Button/ButtonComponent';
import useModal from '@hooks/useModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import useFetcher from '../../../hooks/useFetcher';
import ModalDetailTaskType from './components/ViewDetailTaskType';

import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import useToast from '@hooks/useToast';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { Divider } from 'antd';
import CreateTaskType from './components/CreateTaskType';
import TagComponents from '@components/UI/TagComponents';
import { getColorByRole } from '@utils/statusRender/roleRender';

const TaskType = () => {
  const { data, isLoading, mutate } = useFetcher<any>('task_types', 'GET');
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'task_types',
    'DELETE'
  );
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const modalDetail = useModal();
  const modalCreate = useModal();
  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modalDetail.openModal();
  };

  const toast = useToast();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: TASK_TYPE_PATH.DELETE_TASK_TYPE(id) });
      toast.showSuccess(t('Delete success'));
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
    {
      dataIndex: 'roleId',
      key: 'roleId',
      title: t('Role'),
      render: (data) => (
        <TagComponents color={getColorByRole(data?.name)}>
          {t(data?.name)}
        </TagComponents>
      ),
    },
    {
      dataIndex: 'taskTypeId',
      key: 'taskTypeId',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title={undefined}
            onConfirm={() => onConfirm(data)}
          >
            <ButtonComponent type="primary" danger>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];

  return (
    <WhiteBackground>
      <CreateTaskType modal={modalCreate} mutate={mutate} />
      <Divider className="my-4" />
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading || loadingDelete}
      />

      {id !== '' && (
        <ModalDetailTaskType id={id} modal={modalDetail} mutate={mutate} />
      )}
    </WhiteBackground>
  );
};

export default TaskType;
