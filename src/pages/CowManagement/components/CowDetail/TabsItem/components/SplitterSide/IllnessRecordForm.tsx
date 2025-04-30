import { useEditToggle } from '@hooks/useEditToggle';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import DateRangeItem from '../../../../../../../components/Form/Item/DateRangeItem/DateRangeItem';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import TextTitle from '../../../../../../../components/UI/TextTitle';
import Title from '../../../../../../../components/UI/Title';
import { IllnessCow } from '../../../../../../../model/Cow/Illness';
import { SEVERITY_OPTIONS } from '../../../../../../../service/data/severity';
import { t } from 'i18next';
import TextBorder from '@components/UI/TextBorder';
import Text from '@components/UI/Text';
import { formatStatusWithCamel } from '@utils/format';
import { IllnessDetail } from '@model/Cow/IllnessDetail';
import IllnessDetailComponent from './IllnessDetailComponent';
import { Divider, Empty, Image } from 'antd';
import dayjs from 'dayjs';
import QuillRender from '@components/UI/QuillRender';
import EmptyComponent from '@components/Error/EmptyComponent';
import { getIllnessImage } from '@utils/getImage';

interface IllnessRecordFormProps {
  loading: boolean;
  data: IllnessCow;
}

const IllnessRecordForm = ({ loading, data }: IllnessRecordFormProps) => {
  const { edited, toggleEdit } = useEditToggle();
  return (
    <div>
      <Title className="!text-2xl mb-5">{t('Illness Record')}: </Title>
      <div className="grid grid-cols-3">
        <TextTitle title={t('Worker')} description={data?.userEntity?.name} />
        <TextTitle
          title={t('Veterinarian')}
          description={
            data?.veterinarian ? data?.veterinarian?.name : t('No veterinarian')
          }
        />
      </div>
      <div className="mt-5">
        <Title>{t('Illness Image')}</Title>
        <div className="flex gap-5 flex-wrap mt-2">
          {data?.mediaList.length > 0 ? (
            data?.mediaList?.map((element) => (
              <Image width={150} src={getIllnessImage(element?.url as any)} />
            ))
          ) : (
            <EmptyComponent />
          )}
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-5">
          <FormItemComponent
            rules={[{ required: true }]}
            name="severity"
            label={<LabelForm>{t('Severity')}</LabelForm>}
          >
            {!edited ? (
              <TextBorder>
                <Text>{t(formatStatusWithCamel(data?.severity))}</Text>
              </TextBorder>
            ) : (
              <SelectComponent
                options={SEVERITY_OPTIONS()}
                disabled={loading}
              />
            )}
          </FormItemComponent>
          <DateRangeItem
            disable={loading}
            edited={false}
            startDate={data?.startDate}
            endDate={data?.endDate}
          />
        </div>
        <div className="w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            name="symptoms"
            label={<LabelForm>{t('Symptoms')}</LabelForm>}
          >
            {edited ? (
              <ReactQuillComponent readOnly={!edited} />
            ) : (
              <QuillRender description={data.symptoms} />
            )}
          </FormItemComponent>
        </div>
        <div className="w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            name="prognosis"
            label={<LabelForm>{t('Prognosis')}</LabelForm>}
          >
            {edited ? (
              <ReactQuillComponent readOnly={!edited} />
            ) : (
              <QuillRender description={data.prognosis} />
            )}{' '}
          </FormItemComponent>
        </div>
        <FormItemComponent name="cowId" hidden>
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent name="illnessId" hidden>
          <InputComponent />
        </FormItemComponent>
        <div className="flex gap-5">
          <ButtonComponent
            onClick={toggleEdit}
            danger={edited}
            disabled={dayjs(new Date()).isAfter(data.startDate)}
          >
            {!edited ? t('Edit') : t('Cancel')}
          </ButtonComponent>
          {edited && (
            <ButtonComponent loading={loading} type="primary" htmlType="submit">
              {t('Save')}
            </ButtonComponent>
          )}
        </div>
      </div>
      <Divider />
      {data?.illnessDetails.length === 0 ? (
        <Empty />
      ) : (
        <>
          <IllnessDetailComponent
            data={data?.illnessDetails as IllnessDetail[]}
          />
        </>
      )}
    </div>
  );
};

export default IllnessRecordForm;
