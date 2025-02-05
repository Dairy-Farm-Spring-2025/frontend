import { Form } from 'antd';
import { useState } from 'react';
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
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const { trigger } = useFetcher(`dailymilks`, 'DELETE');
  const { trigger: triggerEdit, isLoading: isLoadingEdit } = useFetcher(
    'dailymilks/volume',
    'PUT'
  );
  const toast = useToast();

  const toogleEdit = (id: string, volume: number) => {
    setEdit(!edit);
    if (edit === false) {
      form.setFieldsValue({
        newVolume: volume,
        id: id,
      });
    } else {
      form.resetFields();
    }
  };

  const onFinish = async (values: any) => {
    const data = {
      id: values.id,
      volume: values.newVolume,
    };
    try {
      await triggerEdit({
        url: `dailymilks/volume/${data.id}?newVolume=${data.volume}`,
      });
      toast.showSuccess('Edit Success');
      handleCloseModal();
      mutateDaily();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    modal.closeModal();
    setEdit(false);
  };

  const onConfirm = async (id: string) => {
    console.log(1);
    try {
      await trigger({ url: `dailymilks/${id}` });
      toast.showSuccess('Delete success');
      mutateDaily();
      handleCloseModal();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      title={dailyMilk.title + ' Daily Milk'}
      open={modal.open}
      onCancel={handleCloseModal}
      footer={[]}
      loading={isLoadingEdit}
    >
      <div className="relative w-full text-xs lg:text-base text-wrap !h-fit cursor-default flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="mt-3">
            <strong>{dailyMilk.title}</strong>
          </p>
          <PopconfirmComponent
            title="Delete?"
            onConfirm={() => onConfirm(dailyMilk.id)}
          >
            <ButtonComponent type="primary" danger>
              Delete
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
        <DescriptionComponent
          className="!bg-white overflow-auto w-full"
          items={[
            {
              label: <p>Worker</p>,
              children: (
                <div>
                  <p className="font-bold">
                    {dailyMilk?.extendedProps?.worker.name}
                  </p>
                  <p className="text-gray-400">
                    ID: {dailyMilk.extendedProps?.worker.employeeId}
                  </p>
                </div>
              ),
              className: classNameStyle,
              span: 3,
            },
            {
              label: <p>Shift</p>,
              children: dailyMilk.extendedProps?.shift,
              className: classNameStyle,
              span: 3,
            },
            {
              label: (
                <div className="flex gap-2 justify-center items-center">
                  <p>
                    Volume <span className="text-orange-500">(lit)</span>
                  </p>
                  <PiPencil
                    size={20}
                    className="cursor-pointer hover:opacity-50 duration-100"
                    onClick={() =>
                      toogleEdit(dailyMilk?.id, dailyMilk?.extendedProps.volume)
                    }
                  />
                </div>
              ),
              children: !edit ? (
                <p>{dailyMilk?.extendedProps?.volume}</p>
              ) : (
                <FormComponent form={form} onFinish={onFinish}>
                  <FormItemComponent name="id" hidden>
                    <InputComponent />
                  </FormItemComponent>
                  <FormItemComponent
                    name="newVolume"
                    rules={[{ required: true }]}
                  >
                    <InputComponent />
                  </FormItemComponent>
                  <ButtonComponent
                    loading={isLoadingEdit}
                    htmlType="submit"
                    type="primary"
                    className="!text-sm"
                  >
                    Submit
                  </ButtonComponent>
                </FormComponent>
              ),
              className: classNameStyle,
            },
          ]}
        />
      </div>
    </ModalComponent>
  );
};

export default ModalDetailDailyMilk;
