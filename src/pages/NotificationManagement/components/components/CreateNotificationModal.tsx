import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import SelectComponent from '@components/Select/SelectComponent';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { UserProfileData } from '@model/User';
import { NOTIFICATION_PATH } from '@service/api/Notification/notificationApi';
import { getCategoryNotification } from '@service/data/categoryNotification';
import { getAvatar } from '@utils/getImage';
import { Avatar, Form } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface CreateNotificationModalProps {
  modal: ModalActionProps;
  mutate: any;
}

const CreateNotificationModal = ({
  modal,
  mutate,
}: CreateNotificationModalProps) => {
  const [form] = Form.useForm();
  const [optionsCategory, setOptionCategory] = useState<any[]>([]);
  const toast = useToast();
  const [user, setUser] = useState<any[]>([]);
  const [changeRole, setChangeRole] = useState<string>('');
  const [selectCategory, setSelectCategory] = useState('');
  const { data: dataWorker } = useFetcher<UserProfileData[]>(
    'users/workers',
    'GET'
  );
  const { data: dataVeterinarians } = useFetcher<UserProfileData[]>(
    'users/veterinarians',
    'GET'
  );
  const { isLoading, trigger } = useFetcher(
    NOTIFICATION_PATH.CREATE_NOTIFICATION,
    'POST'
  );
  useEffect(() => {
    if (modal.open) {
      setOptionCategory(getCategoryNotification());
    }
  }, [modal.open]);

  useEffect(() => {
    if (changeRole === 'worker' && dataWorker) {
      setUser(
        dataWorker?.map((element) => ({
          value: element.id,
          label: element.name,
          desc: (
            <div className="flex gap-2  items-center">
              <Avatar
                size={30}
                shape="circle"
                src={getAvatar(element.profilePhoto)}
              />
              <p>{element.name}</p>
            </div>
          ),
          searchLabel: `${element.name}`,
        }))
      );
    } else if (changeRole === 'veterinarians' && dataVeterinarians) {
      setUser(
        dataVeterinarians?.map((element) => ({
          value: element.id,
          label: element.name,
          desc: (
            <div className="flex gap-2 items-center">
              <Avatar
                size={30}
                shape="circle"
                src={getAvatar(element.profilePhoto)}
              />
              <p>{element.name}</p>
            </div>
          ),
          searchLabel: `${element.name}`,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRole]);

  const handleCancel = () => {
    form.resetFields();
    setSelectCategory('');
    setChangeRole('');
    modal.closeModal();
  };

  const onFinish = async (values: any) => {
    try {
      const payload = {
        category: selectCategory,
        title: values.title,
        userIds: values.userId,
        link: values.link,
        description: values.description,
      };
      const response = await trigger({ body: payload });
      toast.showSuccess(response.message);
      mutate();
      handleCancel();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  return (
    <ModalComponent
      title={t('Create notification')}
      open={modal.open}
      onCancel={handleCancel}
      width={700}
      onOk={form.submit}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={onFinish}>
        <FormItemComponent
          name="category"
          label={<LabelForm>{t('Category Notification')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            value={selectCategory}
            onChange={(e) => setSelectCategory(e)}
            options={optionsCategory}
          />
        </FormItemComponent>
        {selectCategory !== '' && (
          <>
            <FormItemComponent
              name="title"
              label={<LabelForm>{t('Title')}:</LabelForm>}
              rules={[{ required: true }]}
            >
              <InputComponent />
            </FormItemComponent>
            <div className="flex justify-between gap-5">
              <FormItemComponent
                name="role"
                label={<LabelForm>{t('Role')}</LabelForm>}
                rules={[{ required: true }]}
                className="!w-1/2"
              >
                <SelectComponent
                  value={changeRole}
                  onChange={(e) => setChangeRole(e)}
                  options={[
                    {
                      label: t('Worker'),
                      value: 'worker',
                    },
                    {
                      label: t('Veterinarians'),
                      value: 'veterinarians',
                    },
                  ]}
                />
              </FormItemComponent>
              <div className="!w-1/2">
                {changeRole !== '' && (
                  <FormItemComponent
                    name="userId"
                    label={<LabelForm>{t('Notify')}</LabelForm>}
                    rules={[{ required: true }]}
                  >
                    <SelectComponent
                      options={user}
                      mode="multiple"
                      optionRender={(items) => items.data.desc}
                      allowClear
                    />
                  </FormItemComponent>
                )}
              </div>
            </div>
            <FormItemComponent
              name="link"
              label={<LabelForm>{t('Link')}:</LabelForm>}
              rules={[{ required: true }]}
            >
              <InputComponent.Link />
            </FormItemComponent>
            <FormItemComponent
              name="description"
              label={<LabelForm>{t('Description')}:</LabelForm>}
              rules={[{ required: true }]}
            >
              <InputComponent.TextArea />
            </FormItemComponent>
          </>
        )}
      </FormComponent>
    </ModalComponent>
  );
};

export default CreateNotificationModal;
