import ButtonComponent from '@components/Button/ButtonComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import TagComponents from '@components/UI/TagComponents';
import TextBorder from '@components/UI/TextBorder';
import Title from '@components/UI/Title';
import { useEditToggle } from '@hooks/useEditToggle';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { UseEquipmentType } from '@model/UseEquipment/UseEquipment';
import { EquipmentStatus } from '@model/Warehouse/equipment';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { formatStatusWithCamel } from '@utils/format';
import { getEquipmentStatusTag } from '@utils/statusRender/equipmentStatusRender';
import { getColorByRole } from '@utils/statusRender/roleRender';
import { Form } from 'antd';
import { t } from 'i18next';

interface ModalViewDetailEquipmentRequiredProps {
  modal: ModalActionProps;
  taskTypeId: number;
  equipmentId: number;
  mutate: any;
}

const ModalViewDetailEquipmentRequired = ({
  modal,
  taskTypeId,
  equipmentId,
  mutate,
}: ModalViewDetailEquipmentRequiredProps) => {
  const { edited, toggleEdit } = useEditToggle();
  const [form] = Form.useForm();
  const toast = useToast();
  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    mutate: mutateDetail,
  } = useFetcher<UseEquipmentType>(
    TASK_TYPE_PATH.DETAIL_USE_EQUIPMENT(equipmentId, taskTypeId),
    'GET',
    'application/json',
    modal.open
  );
  const { trigger: triggerUpdate, isLoading: isLoadingUpdate } = useFetcher(
    TASK_TYPE_PATH.UPDATE_USE_EQUIPMENT(equipmentId, taskTypeId),
    'PUT',
    'application/json',
    modal.open
  );
  const handleEdit = () => {
    toggleEdit();
    form.setFieldsValue({
      requiredQuantity: dataDetail?.requiredQuantity,
      note: dataDetail?.note,
    });
  };

  const handleCancelEdit = () => {
    toggleEdit();
    form.setFieldsValue({
      requiredQuantity: undefined,
      note: undefined,
    });
  };
  const validateRequiredQuantity = (maxQuantity: number | null) => {
    return (_: any, value: number) => {
      if (maxQuantity === null) return Promise.resolve(); // chưa chọn equipment
      if (value === undefined || value === null) return Promise.resolve();
      if (value > maxQuantity) {
        return Promise.reject(
          new Error(
            t(
              'Required quantity must not exceed available quantity ({{quantity}})',
              {
                quantity: maxQuantity,
              }
            )
          )
        );
      }
      return Promise.resolve();
    };
  };

  const handleCloseModal = () => {
    form.resetFields();
    modal.closeModal();
  };

  const handleFinish = async (values: {
    requiredQuantity: number;
    note: string;
  }) => {
    try {
      const response = await triggerUpdate({ body: values });
      toast.showSuccess(response.message);
      handleCancelEdit();
      mutateDetail();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  return (
    <ModalComponent
      open={modal.open}
      onCancel={handleCloseModal}
      loading={isLoadingDetail}
      title={`${t(
        'Detail required equipment {{equipment}} for task type {{taskType}}',
        {
          equipment: dataDetail?.equipment?.name,
          taskType: dataDetail?.taskType?.name,
        }
      )} `}
      width={1000}
      footer={[
        edited && [
          <ButtonComponent
            type="primary"
            buttonType="volcano"
            onClick={handleCancelEdit}
            loading={isLoadingUpdate}
          >
            {t('Cancel')}
          </ButtonComponent>,
          <ButtonComponent
            type="primary"
            onClick={form.submit}
            loading={isLoadingUpdate}
          >
            {t('Confirm')}
          </ButtonComponent>,
        ],
        !edited && (
          <ButtonComponent
            type="primary"
            buttonType="warning"
            onClick={handleEdit}
          >
            {t('Edit')}
          </ButtonComponent>
        ),
      ]}
    >
      <div className="flex gap-5">
        <div className="flex flex-col gap-3 !w-1/2">
          <Title className="!text-lg">{t('Equipment')}</Title>
          <DescriptionComponent
            layout="horizontal"
            items={[
              {
                children: dataDetail?.equipment?.name,
                label: t('Name'),
                span: 3,
              },
              {
                children: (
                  <TagComponents
                    color={getEquipmentStatusTag(
                      dataDetail?.equipment?.status as EquipmentStatus
                    )}
                  >
                    {t(
                      formatStatusWithCamel(
                        dataDetail?.equipment?.status as EquipmentStatus
                      )
                    )}
                  </TagComponents>
                ),
                label: t('Status'),
                span: 3,
              },
              {
                children: t(
                  formatStatusWithCamel(dataDetail?.equipment?.type as string)
                ),
                label: t('Type'),
                span: 3,
              },
              {
                children: dataDetail?.equipment?.quantity,
                label: t('Quantity'),
                span: 3,
              },
            ]}
          />
        </div>
        <div className="flex flex-col gap-3 !w-1/2">
          <Title className="!text-lg">{t('Task type')}</Title>
          <DescriptionComponent
            layout="horizontal"
            items={[
              {
                children: dataDetail?.taskType?.name,
                label: t('Name'),
                span: 3,
              },
              {
                children: (
                  <TagComponents
                    color={getColorByRole(
                      dataDetail?.taskType?.roleId?.name as any
                    )}
                  >
                    {t(
                      formatStatusWithCamel(
                        dataDetail?.taskType?.roleId?.name as string
                      )
                    )}
                  </TagComponents>
                ),
                label: t('Role'),
                span: 3,
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-5">
        <FormComponent form={form} onFinish={handleFinish}>
          <FormItemComponent
            label={<LabelForm>{t('Required quantity')}</LabelForm>}
            name="requiredQuantity"
            rules={[
              {
                required: true,
                validator: validateRequiredQuantity(
                  dataDetail?.equipment?.quantity as number
                ),
              },
            ]}
          >
            {edited ? (
              <InputComponent.Number />
            ) : (
              <TextBorder>{dataDetail?.requiredQuantity}</TextBorder>
            )}
          </FormItemComponent>
          <FormItemComponent
            label={<LabelForm>{t('Note')}</LabelForm>}
            name="note"
            rules={[{ required: true }]}
          >
            {edited ? (
              <InputComponent.TextArea />
            ) : (
              <TextBorder>{dataDetail?.note}</TextBorder>
            )}
          </FormItemComponent>
        </FormComponent>
      </div>
    </ModalComponent>
  );
};

export default ModalViewDetailEquipmentRequired;
