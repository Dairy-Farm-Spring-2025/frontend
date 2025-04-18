import { Form } from 'antd';
import React, { useState, useCallback, useMemo } from 'react';
import { PiPencil } from 'react-icons/pi';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import DescriptionComponent from '../../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import PopconfirmComponent from '../../../../../../components/Popconfirm/PopconfirmComponent';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';
import { t } from 'i18next';
import { DAILY_MILK_PATH } from '@service/api/DailyMilk/dailyMilkApi';
import useGetRole from '@hooks/useGetRole';

const classNameStyle = '!text-xs lg:!text-sm !text-center !p-2';

interface ModalDetailDailyMilkProps {
  modal: any;
  dailyMilk: any;
  mutateDaily: any;
}

const ModalDetailDailyMilk = ({
  modal,
  dailyMilk,
  mutateDaily,
}: ModalDetailDailyMilkProps) => {
  const role = useGetRole();
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const { trigger } = useFetcher('dailymilks', 'DELETE');
  const { trigger: triggerEdit, isLoading: isLoadingEdit } = useFetcher(
    'dailymilks/volume',
    'PUT'
  );
  const toast = useToast();

  const toggleEdit = useCallback(
    (id: string, volume: number) => {
      setEdit((prev) => {
        if (!prev) {
          form.setFieldsValue({ newVolume: volume, id });
        } else {
          form.resetFields();
        }
        return !prev;
      });
    },
    [form]
  );

  const onFinish = useCallback(
    async (values: any) => {
      try {
        const response = await triggerEdit({
          url: DAILY_MILK_PATH.DAILY_MILK_UPDATE_VOLUME(
            values.id,
            values.newVolume
          ),
        });
        toast.showSuccess(response?.message);
        handleCloseModal();
        mutateDaily();
      } catch (error: any) {
        toast.showError(error.message);
      }
    },
    [triggerEdit, toast, mutateDaily]
  );

  const handleCloseModal = useCallback(() => {
    form.resetFields();
    modal.closeModal();
    setEdit(false);
  }, [form, modal]);

  const onConfirm = useCallback(
    async (id: string) => {
      try {
        const response = await trigger({
          url: DAILY_MILK_PATH.DAILY_MILK_DELETE(id),
        });
        toast.showSuccess(response?.message);
        mutateDaily();
        handleCloseModal();
      } catch (error: any) {
        toast.showError(error.message);
      }
    },
    [trigger, toast, mutateDaily, handleCloseModal]
  );

  const descriptionItems = useMemo(
    () => [
      {
        label: <p>{t('Worker')}</p>,
        children: (
          <div>
            <p className="font-bold">
              {dailyMilk?.extendedProps?.worker?.name}
            </p>
            <p className="text-gray-400">
              ID: {dailyMilk?.extendedProps?.worker?.employeeId}
            </p>
          </div>
        ),
        className: classNameStyle,
        span: 3,
      },
      {
        label: <p>{t('Shift')}</p>,
        children: dailyMilk?.extendedProps?.shift,
        className: classNameStyle,
        span: 3,
      },
      {
        label: (
          <div className="flex gap-2 justify-center items-center">
            <p>
              {t('Volume')} <span className="text-orange-500">(lit)</span>
            </p>
            {role !== 'Veterinarians' && (
              <PiPencil
                size={20}
                className="cursor-pointer hover:opacity-50 duration-100"
                onClick={() =>
                  toggleEdit(dailyMilk?.id, dailyMilk?.extendedProps?.volume)
                }
              />
            )}
          </div>
        ),
        children: !edit ? (
          <p>{dailyMilk?.extendedProps?.volume}</p>
        ) : (
          <FormComponent form={form} onFinish={onFinish}>
            <FormItemComponent name="id" hidden>
              <InputComponent />
            </FormItemComponent>
            <FormItemComponent name="newVolume" rules={[{ required: true }]}>
              <InputComponent />
            </FormItemComponent>
            <ButtonComponent
              loading={isLoadingEdit}
              htmlType="submit"
              type="primary"
              className="!text-sm"
            >
              {t('Submit')}
            </ButtonComponent>
          </FormComponent>
        ),
        className: classNameStyle,
      },
    ],
    [dailyMilk, edit, form, isLoadingEdit, onFinish, toggleEdit]
  );

  return (
    <ModalComponent
      title={`${dailyMilk?.title} Daily Milk`}
      open={modal.open}
      onCancel={handleCloseModal}
      footer={[]}
      loading={isLoadingEdit}
    >
      <div className="relative w-full text-xs lg:text-base text-wrap !h-fit cursor-default flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="mt-3">
            <strong>{dailyMilk?.title}</strong>
          </p>
          <PopconfirmComponent
            title={undefined}
            onConfirm={() => onConfirm(dailyMilk?.id)}
          >
            {role !== 'Veterinarians' && (
              <ButtonComponent type="primary" danger>
                {t('Delete')}
              </ButtonComponent>
            )}
          </PopconfirmComponent>
        </div>
        <DescriptionComponent
          className="!bg-white overflow-auto w-full"
          items={descriptionItems}
        />
      </div>
    </ModalComponent>
  );
};

export default React.memo(ModalDetailDailyMilk);
