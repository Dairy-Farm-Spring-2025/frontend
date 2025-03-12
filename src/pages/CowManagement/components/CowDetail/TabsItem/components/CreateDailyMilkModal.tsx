import { Form } from 'antd';
import FormComponent from '../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../../components/Select/SelectComponent';
import { shiftData } from '../../../../../../service/data/shiftData';
import { DailyMilkRequest } from '../../../../../../model/DailyMilk/DailyMilkRequest';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';
import { t } from 'i18next';
import React, { useCallback, useMemo } from 'react';
import { DAILY_MILK_PATH } from '@service/api/DailyMilk/dailyMilkApi';

interface DailMilkModalProps {
  id: string;
  modal: any;
  mutate: any;
}

const CreateDailyMilkModal: React.FC<DailMilkModalProps> = React.memo(
  ({ modal, id, mutate }) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher<any>(
      DAILY_MILK_PATH.DAILY_MILK_CREATE,
      'POST'
    );

    const handleClose = useCallback(() => {
      form.resetFields();
      modal.closeModal();
    }, [form, modal]);

    const getCurrentShift = useCallback(() => {
      const currentHour = new Date().getHours();
      const currentMinutes = new Date().getMinutes();
      return shiftData.map((shift) => ({
        ...shift,
        disabled: shift.end <= currentHour,
        title: `The shift is passed (${currentHour}:${currentMinutes})`,
      }));
    }, []);

    const shiftOptions = useMemo(() => getCurrentShift(), [getCurrentShift]);

    const handleFinish = useCallback(
      async (values: DailyMilkRequest) => {
        const data: DailyMilkRequest = {
          shift: values.shift,
          volume: values.volume,
          cowId: id,
        };
        try {
          const response = await trigger({ body: data });
          toast.showSuccess(response.message);
          handleClose();
          mutate();
        } catch (error: any) {
          toast.showError(error.message);
        }
      },
      [handleClose, id, mutate, toast, trigger] // Include all dependencies
    );

    return (
      <ModalComponent
        loading={isLoading}
        onOk={() => form.submit()}
        onCancel={handleClose}
        open={modal.open}
        title={t('Create daily milk')}
      >
        <FormComponent form={form} onFinish={handleFinish}>
          <FormItemComponent
            label={<LabelForm>{t('Shift')}</LabelForm>}
            name="shift"
            rules={[{ required: true }]}
          >
            <SelectComponent options={shiftOptions} />
          </FormItemComponent>
          <FormItemComponent
            name="volume"
            rules={[{ required: true }]}
            label={
              <LabelForm>
                {t('Volume')} <span className="text-orange-500">(lit)</span>
              </LabelForm>
            }
          >
            <InputComponent.Number />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.id === nextProps.id &&
      prevProps.modal.open === nextProps.modal.open &&
      prevProps.mutate === nextProps.mutate
    );
  }
);

export default CreateDailyMilkModal;
