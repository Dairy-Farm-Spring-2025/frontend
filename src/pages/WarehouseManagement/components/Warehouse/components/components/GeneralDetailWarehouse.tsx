import ButtonComponent from '@components/Button/ButtonComponent';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '@components/Description/DescriptionComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import { useEditToggle } from '@hooks/useEditToggle';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { WarehouseType } from '@model/Warehouse/warehouse';
import { CATEGORY_PATH } from '@service/api/Storage/categoryApi';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import { STORAGE_PATH } from '@service/api/Storage/storageApi';
import { EquipmentStatus, equipmentTypeSelect } from '@service/data/equipment';
import { statusOptions, unitOptions } from '@service/data/item';
import { warehouseType } from '@service/data/warehouse';
import { formatStatusWithCamel } from '@utils/format';
import { Divider, Form, Skeleton } from 'antd';
import { t } from 'i18next';
import { useMemo, useState } from 'react';

interface GeneralDetailWarehouseProps {
  data: WarehouseType;
  mutate: any;
  mutateItem: any;
  mutateEquipment: any;
}

const GeneralDetailWarehouse = ({
  data,
  mutate,
  mutateItem,
  mutateEquipment,
}: GeneralDetailWarehouseProps) => {
  const [form] = Form.useForm();
  const [formItem] = Form.useForm();
  const [formEquipment] = Form.useForm();
  const { data: categoryData } = useFetcher<any[]>(
    CATEGORY_PATH.CATEGORIES,
    'GET'
  );
  const { edited, toggleEdit } = useEditToggle();
  const [createItemStatus, setCreateItemStatus] = useState(false);
  const { trigger, isLoading } = useFetcher(
    STORAGE_PATH.UPDATE_STORAGE(
      data ? Number(data.warehouseLocationId).toString() : '0'
    ),
    'PUT'
  );
  const { isLoading: loadingFinish, trigger: triggerFinish } = useFetcher(
    ITEMS_PATH.ITEMS_CREATE,
    'POST'
  );

  const {
    trigger: triggerCreateEquipment,
    isLoading: isLoadingCreateEquipment,
  } = useFetcher('equipment', 'POST');

  const toast = useToast();
  const items: DescriptionPropsItem['items'] = [
    {
      key: 'name',
      label: t('Name'),
      children: !edited ? (
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
      key: 'type',
      label: t('Type'),
      children: !edited ? (
        data ? (
          t(formatStatusWithCamel(data.type))
        ) : (
          'N/A'
        )
      ) : (
        <FormItemComponent name="type" rules={[{ required: true }]}>
          <SelectComponent options={warehouseType()} className="!w-full" />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'description',
      label: t('Description'),
      children: !edited ? (
        data ? (
          data?.description
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="description" rules={[{ required: true }]}>
          <InputComponent.TextArea />
        </FormItemComponent>
      ),
    },
  ];
  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message || t('Update success'));
      mutate();
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };
  const handleToggleEdit = () => {
    if (!edited) {
      if (data) {
        form.setFieldsValue({
          name: data?.name,
          type: data?.type,
          description: data?.description,
        });
        toggleEdit();
      }
    } else {
      form.resetFields();
      toggleEdit();
    }
  };

  const optionCategory = useMemo(() => {
    if (!categoryData) return [];

    let filtered = categoryData;

    if (data?.type === 'food') {
      filtered = categoryData.filter((element) =>
        ['Cỏ Khô', 'Khoáng chất', 'Thức ăn tinh', 'Thức ăn ủ chua'].includes(
          element.name
        )
      );
    }

    if (data?.type === 'vaccine') {
      filtered = categoryData.filter((element) =>
        ['Vắc-xin', 'Thuốc'].includes(element.name)
      );
    }

    return filtered.map((element) => ({
      value: element.categoryId,
      label: element.name,
    }));
  }, [categoryData, data?.type]);

  const handleFinishCreateItems = async (values: any) => {
    try {
      const response = await triggerFinish({ body: values });
      toast.showSuccess(response?.message);
      formItem.resetFields();
      mutateItem();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleFinishCreateEquipment = async (values: any) => {
    try {
      const response = await triggerCreateEquipment({ body: values });
      toast.showSuccess(response?.message);
      formEquipment.resetFields();
      mutateEquipment();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <>
      <Skeleton loading={isLoading}>
        <FormComponent form={form} onFinish={handleFinish}>
          <DescriptionComponent layout="horizontal" items={items} />
          <div className="flex justify-end mt-5 gap-2">
            <ButtonComponent
              type="primary"
              buttonType={!edited ? 'warning' : 'volcano'}
              onClick={handleToggleEdit}
            >
              {edited ? t('Cancel') : t('Edit')}
            </ButtonComponent>
            {edited && (
              <ButtonComponent type="primary" htmlType="submit">
                {t('Confirm')}
              </ButtonComponent>
            )}
          </div>
        </FormComponent>
      </Skeleton>
      <Divider className="!my-3" />
      {!createItemStatus ? (
        <ButtonComponent
          className="!w-full"
          type="dashed"
          buttonType="geekblue"
          onClick={() => setCreateItemStatus(true)}
        >
          {t('Create Item')}
        </ButtonComponent>
      ) : (
        <Skeleton loading={loadingFinish || isLoadingCreateEquipment}>
          {data.type !== 'equipment' && (
            <FormComponent
              form={formItem}
              onFinish={handleFinishCreateItems}
              initialValues={{ locationId: data?.warehouseLocationId }}
            >
              <FormItemComponent
                rules={[{ required: true }]}
                name="name"
                label={<LabelForm>{t('Name')}</LabelForm>}
              >
                <InputComponent />
              </FormItemComponent>
              <FormItemComponent
                rules={[{ required: true }]}
                name="unit"
                label={<LabelForm>{t('Unit')}</LabelForm>}
              >
                <SelectComponent options={unitOptions()} />
              </FormItemComponent>
              <FormItemComponent
                name="categoryId"
                rules={[{ required: true }]}
                label={<LabelForm>{t('Category')}</LabelForm>}
              >
                <SelectComponent options={optionCategory} />
              </FormItemComponent>
              <FormItemComponent
                name="status"
                rules={[{ required: true }]}
                label={<LabelForm>{t('Status')}</LabelForm>}
              >
                <SelectComponent options={statusOptions()} />
              </FormItemComponent>
              <FormItemComponent name="locationId" hidden>
                <InputComponent />
              </FormItemComponent>
              <div className="flex gap-2 justify-end">
                <ButtonComponent
                  type="primary"
                  buttonType="volcano"
                  onClick={() => setCreateItemStatus(false)}
                >
                  {t('Cancel')}
                </ButtonComponent>
                <ButtonComponent type="primary" htmlType="submit">
                  {t('Confirm')}
                </ButtonComponent>
              </div>
            </FormComponent>
          )}
          {data.type === 'equipment' && (
            <FormComponent
              form={formEquipment}
              initialValues={{ locationId: data?.warehouseLocationId }}
              onFinish={handleFinishCreateEquipment}
            >
              <FormItemComponent
                name="locationId"
                label={<LabelForm>{t('Location')}</LabelForm>}
                hidden
              >
                <InputComponent />
              </FormItemComponent>
              <FormItemComponent
                name="name"
                label={<LabelForm>{t('Name')}</LabelForm>}
                rules={[{ required: true }]}
              >
                <InputComponent />
              </FormItemComponent>
              <div className="grid grid-cols-2 gap-5">
                <FormItemComponent
                  name="type"
                  label={<LabelForm>{t('Type')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <SelectComponent options={equipmentTypeSelect()} />
                </FormItemComponent>
                <FormItemComponent
                  name="status"
                  label={<LabelForm>{t('Status')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <SelectComponent options={EquipmentStatus()} />
                </FormItemComponent>
              </div>
              <FormItemComponent
                name="quantity"
                label={<LabelForm>{t('Quantity')}</LabelForm>}
                rules={[{ required: true }]}
              >
                <InputComponent />
              </FormItemComponent>
              <FormItemComponent
                name="description"
                label={<LabelForm>{t('Description')}</LabelForm>}
                rules={[{ required: true }]}
              >
                <InputComponent.TextArea />
              </FormItemComponent>
              <div className="flex gap-2 justify-end">
                <ButtonComponent
                  type="primary"
                  buttonType="volcano"
                  onClick={() => setCreateItemStatus(false)}
                >
                  {t('Cancel')}
                </ButtonComponent>
                <ButtonComponent type="primary" htmlType="submit">
                  {t('Confirm')}
                </ButtonComponent>
              </div>
            </FormComponent>
          )}
        </Skeleton>
      )}
    </>
  );
};

export default GeneralDetailWarehouse;
