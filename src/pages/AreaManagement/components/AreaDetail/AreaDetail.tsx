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
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import WhiteBackground from '@components/UI/WhiteBackground';
import { useEditToggle } from '@hooks/useEditToggle';
import useFetcher from '@hooks/useFetcher';
import useGetRole from '@hooks/useGetRole';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { AreaType } from '@model/Area/AreaType';
import { CowStatus } from '@model/Cow/Cow';
import { CowType } from '@model/Cow/CowType';
import { FeedPlan } from '@model/Feed/FeedArea';
import { PenStatus } from '@model/Pen';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { areaType } from '@service/data/areaType';
import { cowStatus } from '@service/data/cowStatus';
import { penStatusFilter } from '@service/data/pen';
import { formatStatusWithCamel } from '@utils/format';
import { getPenColor } from '@utils/statusRender/penStatusRender';
import { minDimensions } from '@utils/validate/minDimesionArea';
import { Divider, Form, Skeleton, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-area-[0-9]+$/;
  if (!value) {
    return Promise.reject(t('Please input the value!'));
  }
  if (!regex.test(value)) {
    return Promise.reject(
      t(
        'Input does not match the required format (A-Z)-area-(1-0), eg: ABC-area-123'
      )
    );
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
  const { trigger: triggerEditArea, isLoading: isLoadingUpdateArea } =
    useFetcher('edit-area', 'PUT');
  const areaUrl = id ? AREA_PATH.AREA_DETAIL(id) : '';
  const cowInPenUrl = id ? AREA_PATH.AREA_COW(id) : '';
  const [numberInRowSuggested, setNumberInRowSuggested] = useState<number>(0);
  const {
    data: area,
    isLoading: isLoadingArea,
    error: areaError,
    mutate,
  } = useFetcher<Area>(areaUrl, 'GET');
  const {
    data: cowInPen,
    isLoading: isLoadingCowInPen,
    error: cowInPenError,
  } = useFetcher<CowInPenArea[]>(cowInPenUrl, 'GET');
  const {
    data: cowTypeData,
    isLoading: isLoadingCowType,
    error: cowTypeError,
  } = useFetcher<any>('cow-types', 'GET');
  const {
    data: dataFeedMeals,
    isLoading: isLoadingFeedMeal,
    error: errorFeedMeals,
  } = useFetcher<FeedPlan>(AREA_PATH.AREA_FEED_MEALS(id ? id : ''), 'GET');
  const { t } = useTranslation();

  const optionsCowType = useMemo(
    () =>
      (cowTypeData || []).map((element: CowType) => ({
        label: element.name,
        value: element.cowTypeId,
      })),
    [cowTypeData]
  );

  const cowTypeArea = useMemo(
    () =>
      dataFeedMeals &&
      Object.entries((dataFeedMeals || ([] as any)).cowTypeCount)?.map(
        ([key, value]) => ({
          title: key,
          content: value,
        })
      ),
    [dataFeedMeals]
  );

  useEffect(() => {
    if (area && !edited) {
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
  }, [area, edited, form]);

  const formAreaLength = Form.useWatch(['length'], form);
  const formAreaWidth = Form.useWatch(['width'], form);
  const formAreaPenLength = Form.useWatch(['penLength'], form);
  const formAreaPenWidth = Form.useWatch(['penWidth'], form);

  useEffect(() => {
    if (
      formAreaLength > 0 &&
      formAreaPenWidth > 0 &&
      formAreaPenLength > 0 &&
      formAreaWidth > 0
    ) {
      const numberInRow = Math.floor(formAreaLength / formAreaPenLength);
      setNumberInRowSuggested(numberInRow);
    }
  }, [formAreaLength, formAreaPenLength, formAreaPenWidth, formAreaWidth]);

  useEffect(() => {
    if (areaError) {
      toast.showError(t('Failed to load area details'));
    }
    if (cowInPenError) {
      toast.showError(t('Failed to load cow in pen data'));
    }
    if (cowTypeError) {
      toast.showError(t('Failed to load cow types'));
    }
  }, [areaError, cowInPenError, cowTypeError, toast, t]);

  const onSubmitEdit = async (values: any) => {
    try {
      const { maxPen, numberInRow, ...filteredValues } = values;
      const payload = {
        ...filteredValues,
        maxPen,
        numberInRow,
        cowTypeId: area ? area.cowTypeEntity?.cowTypeId || null : null,
      };
      console.log('Submit payload:', payload);
      const response = await triggerEditArea({
        url: AREA_PATH.AREA_EDIT(id as any),
        body: payload,
      });
      toast.showSuccess(t(response.message));
      await mutate();
      toggleEdit();
    } catch (error: any) {
      toast.showError(error.message);
      console.error('Edit area error:', error);
    }
  };

  const validateDimensions = (
    areaType: AreaType,
    length: number,
    width: number
  ) => {
    const { length: minLength, width: minWidth } = minDimensions[areaType];
    return length >= minLength && width >= minWidth;
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

  const columnsFeedMeals: Column[] = [
    {
      dataIndex: 'name',
      title: t('Name'),
      key: 'name',
      searchable: true,
    },
    {
      dataIndex: 'quantityNeeded',
      title: t('Quantity needed'),
      key: 'quantityNeeded',
      sorter: (a, b) => a.quantityNeeded - b.quantityNeeded,
    },
    {
      dataIndex: 'unit',
      title: t('Unit'),
      key: 'unit',
    },
  ];

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (
      changedValues.length ||
      changedValues.width ||
      changedValues.penLength ||
      changedValues.penWidth
    ) {
      // Ví dụ: nếu bạn muốn tính toán maxPen, numberInRow tự động
      const { length, width, penLength, penWidth } = allValues;

      if (length && width && penLength && penWidth) {
        const maxPen = Math.floor(
          (width * length - 4 * length) / (penLength * penWidth)
        );
        const numberInRow = Math.floor(length / penLength);
        setNumberInRowSuggested(numberInRow);
        form.setFieldsValue({
          maxPen,
          numberInRow,
        });
      }
    }
  };

  const disabledEditedField = () =>
    (cowInPen?.length ?? 0) < 0 ||
    dayjs(area?.createdAt).isBefore(dayjs().subtract(3, 'day'));

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="p-4">
          <div className="flex flex-col">
            <div>
              <Skeleton
                loading={
                  (isLoadingUpdateArea ||
                    isLoadingArea ||
                    isLoadingCowInPen ||
                    isLoadingCowType) &&
                  !area
                }
              >
                {area && (
                  <FormComponent
                    form={form}
                    onFinish={onSubmitEdit}
                    onValuesChange={handleValuesChange}
                  >
                    <div className="w-full 2xl:w-3/5 2xl:mx-auto">
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
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <SelectComponent
                              options={areaType()}
                              disabled={true}
                              className="w-full"
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="cowTypeId"
                            label={<LabelForm>{t('Cow Type')}</LabelForm>}
                            hidden={area?.areaType === 'quarantine'}
                          >
                            <SelectComponent
                              options={optionsCowType || []}
                              className="w-full"
                              disabled={true}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="cowStatus"
                            label={<LabelForm>{t('Cow Status')}</LabelForm>}
                            hidden={area?.areaType === 'quarantine'}
                          >
                            <SelectComponent
                              options={cowStatus()}
                              disabled={true}
                              className="w-full"
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
                            rules={[
                              {
                                required: true,
                              },
                              {
                                validator: (_, value) => {
                                  if (!numberInRowSuggested) {
                                    return Promise.resolve(); // No suggestion yet, allow anything
                                  }
                                  if (
                                    value === numberInRowSuggested ||
                                    value === numberInRowSuggested - 1 ||
                                    value === numberInRowSuggested - 2
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(
                                        'Please enter a value equal to suggested number or lower by at most 2'
                                      )
                                    )
                                  );
                                },
                              },
                            ]}
                            label={
                              <LabelForm>
                                {t('Number in row')}{' '}
                                {numberInRowSuggested > 0 &&
                                  t('(Suggested: ~{{number}})', {
                                    number: numberInRowSuggested,
                                  })}
                                :
                              </LabelForm>
                            }
                          >
                            <InputComponent.Number
                              disabled={!edited || disabledEditedField()}
                            />
                          </FormItemComponent>
                        </div>
                        <div className="flex flex-col w-1/2">
                          <FormItemComponent
                            name="length"
                            label={<LabelForm>{t('Length')} (m)</LabelForm>}
                            rules={[
                              { required: true },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const areaType: AreaType =
                                    getFieldValue('areaType');
                                  const width = getFieldValue('width');
                                  if (
                                    !areaType ||
                                    !width ||
                                    validateDimensions(areaType, value, width)
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(`area_modal.minimum_length_area`, {
                                        length: minDimensions[areaType].length,
                                      })
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <InputComponent.Number
                              disabled={!edited || disabledEditedField()}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="width"
                            label={<LabelForm>{t('Width')} (m)</LabelForm>}
                            rules={[
                              { required: true },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const areaType: AreaType =
                                    getFieldValue('areaType');
                                  const length = getFieldValue('length');
                                  if (
                                    !areaType ||
                                    !length ||
                                    validateDimensions(areaType, length, value)
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(`area_modal.minimun_width_area`, {
                                        width: minDimensions[areaType].width,
                                      })
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <InputComponent.Number
                              disabled={!edited || disabledEditedField()}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="penLength"
                            label={<LabelForm>{t('Pen Length (m)')}</LabelForm>}
                            dependencies={['length']}
                            rules={[
                              { required: true },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const penWidth = getFieldValue('penWidth');
                                  if (
                                    !value ||
                                    !penWidth ||
                                    value >= penWidth
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(
                                        'Pen Length must be greater than or equal to the Pen Width'
                                      )
                                    )
                                  );
                                },
                              }),
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    value <= getFieldValue('length')
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(
                                        'Pen length must be smaller than area length'
                                      )
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <InputComponent.Number
                              disabled={!edited || disabledEditedField()}
                            />
                          </FormItemComponent>
                          <FormItemComponent
                            name="penWidth"
                            label={<LabelForm>{t('Pen Width (m)')}</LabelForm>}
                            dependencies={['width']}
                            rules={[
                              { required: true },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const penLength = getFieldValue('penLength');
                                  if (
                                    !value ||
                                    !penLength ||
                                    value <= penLength
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(
                                        'Pen Width must be smaller than or equal to the Pen Length'
                                      )
                                    )
                                  );
                                },
                              }),
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    value <= getFieldValue('width')
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      t(
                                        'Pen width must be smaller than area width'
                                      )
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <InputComponent.Number
                              disabled={!edited || disabledEditedField()}
                            />
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
          <Title className="font-semibold mb-4">
            {t('Pens & Cows in Area')}
          </Title>
          <TableComponent
            columns={columns}
            dataSource={cowInPen ? cowInPen : []}
            loading={isLoadingCowInPen}
            pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          />
          <Divider />
          <div>
            <Title className="font-semibold mb-4">
              {t('Feed meals and total cow type')}
            </Title>
            <Skeleton loading={isLoadingFeedMeal}>
              <div className="flex flex-col gap-5 mb-5">
                <div className="flex gap-10">
                  {cowTypeArea && cowTypeArea?.length > 0 ? (
                    cowTypeArea?.map((element) => (
                      <TextTitle
                        layout="horizontal"
                        title={
                          <Tooltip title={t('Cow type')}>
                            {element.title}
                          </Tooltip>
                        }
                        description={`${element.content} (${t('cows')})`}
                      />
                    ))
                  ) : (
                    <p className="text-base text-orange-500">
                      {errorFeedMeals?.message
                        ? errorFeedMeals?.message
                        : t('This area do not have feed meal for cow type')}
                    </p>
                  )}
                </div>
                <TextTitle
                  layout="horizontal"
                  title={t('Total cows')}
                  description={`${
                    dataFeedMeals?.totalCow ? dataFeedMeals?.totalCow : 0
                  } (${t('cows')})`}
                />
              </div>
              <TableComponent
                columns={columnsFeedMeals}
                dataSource={dataFeedMeals?.foodList as any}
                pagination={{ pageSize: 5, position: ['bottomCenter'] }}
              />
            </Skeleton>
          </div>
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaDetail;
