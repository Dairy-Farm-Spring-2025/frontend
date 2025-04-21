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
import TagComponents from '@components/UI/TagComponents';
import WhiteBackground from '@components/UI/WhiteBackground';
import { useEditToggle } from '@hooks/useEditToggle';
import useFetcher from '@hooks/useFetcher';
import useGetRole from '@hooks/useGetRole';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { CowStatus } from '@model/Cow/Cow';
import { CowType } from '@model/Cow/CowType';
import { PenStatus } from '@model/Pen';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { areaType } from '@service/data/areaType';
import { cowStatus } from '@service/data/cowStatus';
import { penStatusFilter } from '@service/data/pen';
import { formatStatusWithCamel } from '@utils/format';
import { getPenColor } from '@utils/statusRender/penStatusRender';
import { Divider, Form, Skeleton } from 'antd';
import { SelectProps } from 'antd/lib';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-area-[0-9]+$/;
  if (!value) {
    return Promise.reject(t('Please input the value!'));
  }
  if (!regex.test(value)) {
    return Promise.reject(t(
      'Input does not match the required format (A-Z)-area-(1-0), eg: ABC-area-123'
    ));
  }
  return Promise.resolve();
};

interface CowInPenArea {
  cowId: number | null;
  name: string | null;
  cowStatus: CowStatus | null;
  cowType: string | null;
  penId: number;
  penName: string;
  penStatus: PenStatus;
}

const AreaDetail = () => {
  const role = useGetRole();
  const { id } = useParams();
  const toast = useToast();
  const [form] = Form.useForm();
  const { edited, toggleEdit } = useEditToggle();
  const { trigger: triggerEditArea, isLoading: isLoadingUpdateArea } = useFetcher('edit-area', 'PUT');

  const areaUrl = id ? AREA_PATH.AREA_DETAIL(id) : '';
  const cowInPenUrl = id ? AREA_PATH.AREA_COW(id) : '';

  const {
    data: area,
    isLoading: isLoadingArea,
    error: areaError,
    mutate,
  } = useFetcher<Area>(areaUrl, 'GET');
  const { data: cowInPen, isLoading: isLoadingCowInPen, error: cowInPenError } = useFetcher<
    CowInPenArea[]
  >(cowInPenUrl, 'GET');
  const { data: cowTypeData, isLoading: isLoadingCowType, error: cowTypeError } = useFetcher<any>(
    'cow-types',
    'GET'
  );

  const { t } = useTranslation();

  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>([]);

  useEffect(() => {
    if (cowTypeData) {
      const options = cowTypeData.map((element: CowType) => ({
        label: element.name,
        value: element.cowTypeId,
      }));
      setOptionsCowType(options);
    }
  }, [cowTypeData]);

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
        cowTypeId: area.cowTypeEntity?.cowTypeId || undefined,
        cowStatus: area.cowStatus,
      });
    }
  }, [area, form]);

  useEffect(() => {
    if (areaError) {
      toast.showError(t('Failed to load area details'));
      console.error('Area fetch error:', areaError);
    }
    if (cowInPenError) {
      toast.showError(t('Failed to load cow in pen data'));
      console.error('CowInPen fetch error:', cowInPenError);
    }
    if (cowTypeError) {
      toast.showError(t('Failed to load cow types'));
      console.error('CowType fetch error:', cowTypeError);
    }
  }, [areaError, cowInPenError, cowTypeError, toast, t]);

  const onSubmitEdit = async (values: any) => {
    try {
      const { maxPen, numberInRow, cowTypeId, ...filteredValues } = values;
      const payload = {
        ...filteredValues,
        cowTypeId: area ? area.cowTypeEntity?.cowTypeId || null : null,
      };
      console.log('Submit payload:', payload);
      const response = await triggerEditArea({
        url: AREA_PATH.AREA_EDIT(id as any),
        body: payload,
      });
      toast.showSuccess(t(response.message));
      toggleEdit();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
      console.error('Edit area error:', error);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Cow name'),
      render: (name) => (name ? <p>{name}</p> : '-'),
      searchable: true,
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow status'),
      render: (element: string) =>
        element ? (
          <TagComponents>{t(formatStatusWithCamel(element))}</TagComponents>
        ) : (
          '-'
        ),
      searchable: true,
    },
    {
      dataIndex: 'cowType',
      key: 'cowType',
      title: t('Cow type'),
      render: (typeValue: string) => (typeValue ? typeValue : '-'),
      searchable: true,
    },
    {
      dataIndex: 'penName',
      key: 'penName',
      title: t('Pen Name'),
      render: (pen) => pen,
    },
    {
      dataIndex: 'penStatus',
      key: 'penStatus',
      title: t('Status'),
      render: (statusValue: PenStatus) => (
        <TagComponents color={getPenColor(statusValue)}>
          {t(formatStatusWithCamel(statusValue))}
        </TagComponents>
      ),
      filterable: true,
      filterOptions: penStatusFilter,
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="p-4">
          <div className="flex flex-col">
            <div>
              <Skeleton
                loading={
                  (isLoadingUpdateArea || isLoadingArea || isLoadingCowInPen || isLoadingCowType) &&
                  !area
                }
              >
                {area && (
                  <FormComponent form={form} onFinish={onSubmitEdit}>
                    <div className="max-w-4/5 w-3/5 mx-auto">
                      <div className="flex w-full justify-center gap-5">
                        <div className="flex flex-col w-1/2">
                          <FormItemComponent
                            name="name"
                            label={<LabelForm>{t('Name')}</LabelForm>}
                            rules={[
                              { required: true },
                              { validator: validateInput },
                            ]}
                          >
                            <InputComponent
                              className="w-full"
                              disabled={!edited}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="areaType"
                            label={<LabelForm>{t('Area Type')}</LabelForm>}
                            rules={[{ required: true, message: t('Please select an area type') }]}
                          >
                            <SelectComponent
                              options={areaType()}
                              disabled={true}
                              className="w-full"
                              placeholder={t('Select Area Type')}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="cowTypeId"
                            label={<LabelForm>{t('Cow Type')}</LabelForm>}
                          >
                            <SelectComponent
                              options={optionsCowType}
                              className="w-full"
                              disabled={true}
                              placeholder={t('No cow type assigned')}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="cowStatus"
                            label={<LabelForm>{t('Cow Status')}</LabelForm>}
                            rules={[{ required: true, message: t('Please select a cow status') }]}
                          >
                            <SelectComponent
                              options={cowStatus()}
                              disabled={true}
                              className="w-full"
                              placeholder={t('Select Cow Status')}
                              allowClear
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="maxPen"
                            rules={[{ required: true }]}
                            label={<LabelForm>{t('Max pen')}</LabelForm>}
                          >
                            <InputComponent.Number disabled={true} />
                          </FormItemComponent>
                          <FormItemComponent
                            name="numberInRow"
                            rules={[{ required: true }]}
                            label={<LabelForm>{t('Number in row')}</LabelForm>}
                          >
                            <InputComponent.Number disabled={true} />
                          </FormItemComponent>
                        </div>
                        <div className="flex flex-col w-1/2">
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
                      <div className="w-full mx-auto">
                        <FormItemComponent
                          name="description"
                          label={<LabelForm>{t('Description')}</LabelForm>}
                          rules={[{ required: true }]}
                        >
                          {!edited ? (
                            <QuillRender
                              description={area ? area.description : ''}
                            />
                          ) : (
                            <ReactQuillComponent />
                          )}
                        </FormItemComponent>
                      </div>
                    </div>
                    {role !== 'Veterinarians' && (
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
                            {t('Save')}
                          </ButtonComponent>
                        )}
                      </div>
                    )}
                  </FormComponent>
                )}
                {!area && <div>{t('No area data available')}</div>}
              </Skeleton>
            </div>
          </div>
          <Divider />
          <h2 className="text-lg font-semibold mb-4">{t('Pens & Cows in Area')}</h2>
          <TableComponent
            columns={columns}
            dataSource={cowInPen ? cowInPen : []}
            loading={isLoadingCowInPen}
            pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaDetail;