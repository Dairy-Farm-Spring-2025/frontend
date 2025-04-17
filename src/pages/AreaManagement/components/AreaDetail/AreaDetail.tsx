import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import QuillRender from '@components/UI/QuillRender';
import WhiteBackground from '@components/UI/WhiteBackground';
import { useEditToggle } from '@hooks/useEditToggle';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { Area } from '@model/Area';
import { Pen } from '@model/Pen';
import { CowType } from '@model/Cow/CowType'; // Import CowType
import { AREA_PATH } from '@service/api/Area/areaApi';
import { PEN_PATH } from '@service/api/Pen/penApi';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType'; // Import COW_TYPE_PATH
import { areaType } from '@service/data/areaType';
import { penFilter, penStatus, penStatusFilter, penType } from '@service/data/pen';
import { formatDateHour, formatStatusWithCamel, formatSTT } from '@utils/format';
import { Divider, Form, Skeleton, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ModalCreatePen from '../ModalCreatePen';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { getLabelByValue } from '@utils/getLabel';
import { COW_STATUS_FILTER, cowStatus } from '@service/data/cowStatus';

const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-area-[0-9]+$/;
  if (!value) {
    return Promise.reject('Please input the value!');
  }
  if (!regex.test(value)) {
    return Promise.reject(
      'Input does not match the required format (A-Z)-area-(1-0), eg: ABC-area-123'
    );
  }
  return Promise.resolve();
};

const AreaDetail = () => {
  const { id } = useParams();
  const modal = useModal();
  const toast = useToast();
  const [form] = Form.useForm();
  const { edited, toggleEdit } = useEditToggle();
  const { trigger: triggerEditArea, isLoading: isLoadingUpdateArea } = useFetcher('edit-area', 'PUT');
  const { data: area, isLoading: isLoadingArea, mutate } = useFetcher<Area>(AREA_PATH.AREA_DETAIL(id ? id : ''));
  const { data: pens, isLoading: isLoadingPens, mutate: mutatePen } = useFetcher<Pen[]>(PEN_PATH.PEN_AREA(id ? id : ''));
  const { data: cowInArea, isLoading: isLoadingcowInArea } = useFetcher<Cow[]>(COW_PATH.COW_IN_AREA(id ? id : ''));
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET'); // Fetch CowType data

  const { t } = useTranslation();

  // Map CowType data to Select options
  const cowTypeOptions = cowTypesData?.map((cowType) => ({
    label: cowType.name,
    value: String(cowType.cowTypeId), // Convert to string to match Area.cowTypeId
  })) || [];

  // Map cowStatus to Select options
  const cowStatusOptions = cowStatus().map((status) => ({
    label: status.label,
    value: status.value,
  }));

  useEffect(() => {
    if (area) {
      form.setFieldsValue({
        name: area.name,
        length: area.length,
        width: area.width,
        penLength: area.penLength,
        penWidth: area.penWidth,
        areaType: area.areaType,
        maxPen: area.maxPen,
        numberInRow: area.numberInRow,
        description: area.description,
        cowStatus: area.cowStatus || '', // Initialize cowStatus
        cowTypeId: area.cowTypeId || '', // Initialize cowTypeId
      });
    }
  }, [area, form]);

  const onSubmitEdit = async (values: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { maxPen, numberInRow, ...filteredValues } = values;
      const payload = { ...filteredValues };
      const response = await triggerEditArea({
        url: AREA_PATH.AREA_EDIT(id as any),
        body: payload,
      });
      toast.showSuccess(response.message);
      toggleEdit();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Pen Name'),
      render: (element: string) => (
        <p className="text-blue-600 underline underline-offset-1 cursor-pointer">{element}</p>
      ),
      searchable: true,
    },
    {
      dataIndex: 'penType',
      key: 'penType',
      title: t('Pen Type'),
      render: (typeValue: string) => {
        const type = penType.find((type) => type.value === typeValue);
        return type ? <Tag color="blue">{type.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penFilter,
    },
    {
      dataIndex: 'length',
      key: 'length',
      title: t('Dimensions'),
      render: (_: any, data) => (
        <Tooltip
          className="tooltip-content"
          placement="top"
          title={
            <div className="dimensions flex flex-col">
              <p><strong>{t('Length')}: </strong> {data?.areaBelongto?.penLength} m</p>
              <p><strong>{t('Width')}: </strong> {data?.areaBelongto?.penWidth} m</p>
            </div>
          }
        >
          <span>{data?.areaBelongto?.penLength} m x {data?.areaBelongto?.penWidth} m</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'penStatus',
      key: 'penStatus',
      title: t('Status'),
      render: (statusValue: string) => {
        const status = penStatus.find((status) => status.value === statusValue);
        return status ? <Tag color="green">{status.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penStatusFilter,
    },
  ];

  const cowColumns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Cow Name'),
      render: (name: string) => (
        <p className="text-blue-600 underline underline-offset-1 cursor-pointer">{name}</p>
      ),
      searchable: true,
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow Status'),
      render: (data) => getLabelByValue(data, cowStatus()),
      filterable: true,
      filterOptions: COW_STATUS_FILTER(),
    },
    {
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      title: t('Date of Birth'),
      render: (date: string) => formatDateHour(date),
      filteredDate: true,
    },
    {
      dataIndex: 'dateOfEnter',
      key: 'dateOfEnter',
      title: t('Date of Entry'),
      render: (date: string) => formatDateHour(date),
      filteredDate: true,
    },
    {
      dataIndex: 'dateOfOut',
      key: 'dateOfOut',
      title: t('Date of Exit'),
      render: (date: string | null) => (date ? formatDateHour(date) : 'N/A'),
    },
    {
      dataIndex: 'cowTypeEntity',
      key: 'cowType',
      title: t('Cow Type'),
      render: (cowTypeEntity: { name: string }) => (
        <Tag color="blue">{cowTypeEntity?.name || 'N/A'}</Tag>
      ),
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: t('Gender'),
      render: (gender: string) => <span>{formatStatusWithCamel(gender)}</span>,
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      render: (origin: string) => <span>{formatStatusWithCamel(origin)}</span>,
    },
  ];

  if (isLoadingArea || isLoadingPens) return <p>Loading...</p>;
  if (!area) return <p>Area not found!</p>;

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="p-4">
          <div className="flex flex-col">
            <div>
              <Skeleton loading={isLoadingUpdateArea}>
                <FormComponent form={form} onFinish={onSubmitEdit}>
                  <div className="!max-w-4/5 w-3/5 mx-auto">
                    <div className="flex w-full justify-center gap-5">
                      <div className="flex flex-col !w-1/2">
                        <FormItemComponent
                          name="name"
                          label={<LabelForm>{t('Name')}</LabelForm>}
                          rules={[{ required: true }, { validator: validateInput }]}
                        >
                          <InputComponent className="!w-full" disabled={!edited} />
                        </FormItemComponent>
                        <FormItemComponent
                          name="areaType"
                          label={<LabelForm>{t('Area Type')}</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          <SelectComponent
                            options={areaType()}
                            disabled={!edited}
                            className="!w-full"
                          />
                        </FormItemComponent>
                        {/* Add Cow Status */}
                        <FormItemComponent
                          name="cowStatus"
                          label={<LabelForm>{t('Cow Status')}</LabelForm>}
                          rules={[{ required: true, message: t('Cow Status is required') }]}
                        >
                          <SelectComponent
                            options={cowStatusOptions}
                            disabled={!edited}
                            className="!w-full"
                            placeholder={t('Select Cow Status')}
                          />
                        </FormItemComponent>
                        {/* Add Cow Type */}
                        <FormItemComponent
                          name="cowTypeId"
                          label={<LabelForm>{t('Cow Type')}</LabelForm>}
                          rules={[{ required: true, message: t('Cow Type is required') }]}
                        >
                          <SelectComponent
                            options={cowTypeOptions}
                            disabled={!edited}
                            className="!w-full"
                            placeholder={t('Select Cow Type')}
                          />
                        </FormItemComponent>
                        <FormItemComponent
                          name="maxPen"
                          rules={[{ required: true }]}
                          label={<LabelForm>{t('Max pen')}:</LabelForm>}
                        >
                          <InputComponent.Number disabled={true} />
                        </FormItemComponent>
                        <FormItemComponent
                          name="numberInRow"
                          rules={[{ required: true }]}
                          label={<LabelForm>{t('Number in row')}:</LabelForm>}
                        >
                          <InputComponent.Number disabled={true} />
                        </FormItemComponent>
                      </div>
                      <div className="flex flex-col !w-1/2">
                        <FormItemComponent
                          name="length"
                          label={<LabelForm>{t('Length')} (m)</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          <InputComponent.Number disabled={!edited} />
                        </FormItemComponent>
                        <FormItemComponent
                          name="width"
                          label={<LabelForm>{t('Width')} (m)</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          <InputComponent.Number disabled={!edited} />
                        </FormItemComponent>
                        <FormItemComponent
                          name="penLength"
                          label={<LabelForm>{t('Pen Length (m)')}</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          <InputComponent.Number disabled={!edited} />
                        </FormItemComponent>
                        <FormItemComponent
                          name="penWidth"
                          label={<LabelForm>{t('Pen Width (m)')}</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          <InputComponent.Number disabled={!edited} />
                        </FormItemComponent>
                      </div>
                    </div>
                    <div className="!w-full mx-auto">
                      <FormItemComponent
                        name="description"
                        label={<LabelForm>{t('Description')}</LabelForm>}
                        rules={[{ required: true }]}
                      >
                        {!edited ? (
                          <QuillRender description={area.description} />
                        ) : (
                          <ReactQuillComponent />
                        )}
                      </FormItemComponent>
                    </div>
                  </div>
                  <div className="w-full flex justify-end gap-5">
                    <ButtonComponent
                      type="primary"
                      buttonType={!edited ? 'gold' : 'volcano'}
                      onClick={toggleEdit}
                    >
                      {!edited ? t('Edit') : t('Cancel')}
                    </ButtonComponent>
                    {edited && (
                      <ButtonComponent
                        type="primary"
                        buttonType="secondary"
                        htmlType="submit"
                      >
                        {t('Edit')}
                      </ButtonComponent>
                    )}
                  </div>
                </FormComponent>
              </Skeleton>
            </div>
          </div>
          <Divider />
          <h2 className="text-lg font-semibold mb-4">{t('Pens in Area')}</h2>
          <TableComponent
            columns={columns}
            dataSource={pens ? formatSTT(pens) : []}
            loading={isLoadingPens}
            pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          />
          <Divider />
          <h2 className="text-lg font-semibold mb-4">{t('Cows in Area')}</h2>
          <TableComponent
            columns={cowColumns}
            dataSource={cowInArea ? formatSTT(cowInArea) : []}
            loading={isLoadingcowInArea}
            pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          />
          <ModalCreatePen
            mutatePen={mutatePen}
            areaId={id}
            modal={modal}
            mutate={mutate}
          />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaDetail;