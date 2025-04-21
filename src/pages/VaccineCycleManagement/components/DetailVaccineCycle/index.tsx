import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import EmptyComponent from '@components/Error/EmptyComponent';
import FloatButtonComponent from '@components/FloatButton/FloatButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import TimelineComponent from '@components/Timeline/TimelineComponent';
import QuillRender from '@components/UI/QuillRender';
import TagComponents from '@components/UI/TagComponents';
import { useEditToggle } from '@hooks/useEditToggle';
import useToast from '@hooks/useToast';
import { VACCINE_CYCLE_PATH } from '@service/api/VaccineCycle/vaccineCycleApi';
import { formatStatusWithCamel } from '@utils/format';
import { Divider, Form, Spin } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import Title from '../../../../components/UI/Title';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import {
  VaccineCycle,
  VaccineCycleDetails,
} from '../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import DetailInformationVaccineCycle from './components/DetailInformationVaccineCycle';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import EditVaccineCycle from './components/EditVaccineCycle';
import useModal from '@hooks/useModal';

const DetailVaccineCycle = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [idDetail, setIdDetail] = useState(null);
  const [previousInjectionMonth, setPreviousInjectionMonth] =
    useState<number>(0);
  const [nextInjectionMonth, setNextInjectionMonth] = useState<number | null>(
    null
  );
  const modal = useModal();
  const toast = useToast();
  const {
    data: vaccineCycleDetailData,
    isLoading: isLoadingDetailCycle,
    mutate,
  } = useFetcher<VaccineCycle>(
    VACCINE_CYCLE_PATH.GET_VACCINE_CYCLE(id as any),
    'GET'
  );
  const { trigger: triggerVaccineCycle, isLoading: isLoadingVaccineCycle } =
    useFetcher(VACCINE_CYCLE_PATH.UPDATE_VACCINE_CYCLE(id as any), 'PUT');
  const { trigger: triggerDelete, isLoading: isLoadingDelete } = useFetcher(
    'delete',
    'DELETE'
  );
  const { edited, toggleEdit } = useEditToggle();
  useEffect(() => {
    if (edited) {
      form.setFieldsValue({
        name: vaccineCycleDetailData?.name,
        description: vaccineCycleDetailData?.description,
      });
    }
  }, [
    edited,
    form,
    vaccineCycleDetailData?.description,
    vaccineCycleDetailData?.name,
  ]);

  const onFinishUpdate = async (values: any) => {
    try {
      const response = await triggerVaccineCycle({ body: values });
      toast.showSuccess(response.message);
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };

  const handleConfirmEdit = () => {
    toggleEdit();
    mutate();
  };

  const handleOpenEdit = (id?: number) => {
    const details = vaccineCycleDetailData?.vaccineCycleDetails || [];
    const sortedDetails = [...details].sort(
      (a, b) => a.firstInjectionMonth - b.firstInjectionMonth
    );

    if (id) {
      // === Edit mode ===
      const currentIndex = sortedDetails.findIndex(
        (item) => item.vaccineCycleDetailId === id
      );

      if (currentIndex !== -1) {
        const prev = sortedDetails[currentIndex - 1];
        const next = sortedDetails[currentIndex + 1];
        setPreviousInjectionMonth(prev?.firstInjectionMonth || 0);
        setNextInjectionMonth(next?.firstInjectionMonth || null);
      }

      setIdDetail(id as any);
    } else {
      const last = sortedDetails[sortedDetails.length - 1];
      console.log(last);
      setPreviousInjectionMonth(last?.firstInjectionMonth || 0);
    }

    modal.openModal();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await triggerDelete({
        url: VACCINE_CYCLE_PATH.DELETE_VACCINE_CYCLE_DETAIL(id),
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  if (isLoadingDetailCycle) return <Spin />;
  return (
    <AnimationAppear>
      <WhiteBackground>
        {vaccineCycleDetailData === undefined ||
        vaccineCycleDetailData === null ? (
          <EmptyComponent />
        ) : (
          <>
            <div className="flex flex-col gap-5">
              <Title>{t('Vaccine cycle detail')}</Title>
              <FormComponent form={form} onFinish={onFinishUpdate}>
                <DescriptionComponent
                  layout="horizontal"
                  labelStyle={{
                    width: '15%',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                  items={[
                    {
                      label: t('Name'),
                      children: !edited ? (
                        <Title className="!text-base">
                          {vaccineCycleDetailData?.name}
                        </Title>
                      ) : (
                        <FormItemComponent name="name" className="!mb-0">
                          <InputComponent />
                        </FormItemComponent>
                      ),
                      span: 3,
                    },
                    {
                      label: t('For cow type'),
                      span: 3,
                      children: (
                        <div className="flex items-center gap-3 !text-base">
                          <p>
                            {vaccineCycleDetailData?.cowTypeEntity?.name} -{' '}
                            {vaccineCycleDetailData?.cowTypeEntity?.maxWeight}{' '}
                            (killogram)
                          </p>
                          <TagComponents
                            color={
                              vaccineCycleDetailData?.cowTypeEntity?.status ===
                              'exist'
                                ? 'green-inverse'
                                : 'red-inverse'
                            }
                          >
                            {t(
                              formatStatusWithCamel(
                                vaccineCycleDetailData?.cowTypeEntity
                                  ?.status as string
                              )
                            )}
                          </TagComponents>
                        </div>
                      ),
                    },
                    {
                      label: t('Description'),
                      children: !edited ? (
                        <QuillRender
                          description={
                            vaccineCycleDetailData?.description as string
                          }
                        />
                      ) : (
                        <FormItemComponent name="description" className="!mb-0">
                          <ReactQuillComponent />
                        </FormItemComponent>
                      ),
                    },
                  ]}
                />
                {edited && (
                  <div className="flex justify-end">
                    <ButtonComponent
                      htmlType="submit"
                      className="mt-5"
                      type="primary"
                      loading={isLoadingVaccineCycle}
                    >
                      {t('Confirm')}
                    </ButtonComponent>
                  </div>
                )}
              </FormComponent>
            </div>
            <Divider />
            <div className="flex flex-col gap-10">
              <div>
                <Title className="!text-xl">
                  {t('Vaccine cycle informations list of {{name}}', {
                    name: vaccineCycleDetailData?.name,
                  })}
                </Title>
                <Divider />
                <div className="pr-10">
                  <TimelineComponent
                    mode="right"
                    items={
                      vaccineCycleDetailData?.vaccineCycleDetails
                        ?.sort(
                          (a, b) =>
                            a.firstInjectionMonth - b.firstInjectionMonth
                        )
                        .map((element: VaccineCycleDetails, index: number) => {
                          return {
                            children: (
                              <div key={index}>
                                <DetailInformationVaccineCycle data={element} />
                              </div>
                            ),
                            label: (
                              <div className="flex flex-col gap-2">
                                <Title>{element.name}</Title>
                                <QuillRender
                                  description={
                                    element?.description || 'No Description'
                                  }
                                  className="prose max-w-full p-4 bg-gray-50 rounded-lg"
                                />
                                {edited && (
                                  <div className="flex gap-5 mt-2">
                                    <ButtonComponent
                                      type="primary"
                                      buttonType="warning"
                                      icon={<EditOutlined />}
                                      onClick={() =>
                                        handleOpenEdit(
                                          element.vaccineCycleDetailId
                                        )
                                      }
                                    >
                                      {t('Edit')}
                                    </ButtonComponent>
                                    <PopconfirmComponent
                                      title={undefined}
                                      onConfirm={() =>
                                        handleDelete(
                                          element?.vaccineCycleDetailId
                                        )
                                      }
                                    >
                                      <ButtonComponent
                                        type="primary"
                                        buttonType="warning"
                                        loading={isLoadingDelete}
                                        danger
                                        icon={<DeleteOutlined />}
                                      >
                                        {t('Delete')}
                                      </ButtonComponent>
                                    </PopconfirmComponent>
                                  </div>
                                )}
                              </div>
                            ),
                          };
                        }) || []
                    }
                  />
                </div>
              </div>
            </div>
            <FloatButtonComponent.Group>
              {!edited && (
                <FloatButtonComponent
                  children={undefined}
                  tooltip={t('Edit vaccine cycle')}
                  type="primary"
                  buttonType="amber"
                  icon={<EditOutlined />}
                  onClick={toggleEdit}
                />
              )}
              {edited && (
                <>
                  <FloatButtonComponent
                    children={undefined}
                    tooltip={t('Add new details')}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenEdit()}
                  />
                  <FloatButtonComponent
                    children={undefined}
                    tooltip={t('Complete update vaccine cycle')}
                    type="primary"
                    buttonType="geekblue"
                    icon={<CheckOutlined />}
                    onClick={handleConfirmEdit}
                  />
                </>
              )}
              <FloatButtonComponent.BackTop />
            </FloatButtonComponent.Group>
          </>
        )}
        <EditVaccineCycle
          setId={setIdDetail}
          id={idDetail as any}
          modal={modal}
          previousInjectionMonth={previousInjectionMonth}
          nextInjectionMonth={nextInjectionMonth as any}
          setNextInjectionMonth={setNextInjectionMonth}
          setPreviousInjectionMonth={setPreviousInjectionMonth}
          vaccineCycleId={id as string}
          mutate={mutate}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailVaccineCycle;
