import ButtonComponent from '../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../components/Description/DescriptionComponent';
import { EditOutlined } from '@ant-design/icons';
import useModal from '../../../../hooks/useModal';
import { UserProfileData } from '../../../../model/User';
import { formatDateHour } from '../../../../utils/format';
import ModalEditProfile from '../ModalEditProfile';
import { useTranslation } from 'react-i18next';

interface ProfileInformationProps {
  profile: UserProfileData;
  mutate: any;
}

const ProfileInformation = ({ profile, mutate }: ProfileInformationProps) => {
  const modal = useModal();
  const { t } = useTranslation(); // Use the translation hook

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'email',
      label: t('email'), // Translation for 'Email'
      children: profile?.email,
    },
    {
      key: 'dob',
      label: t('date_of_birth'), // Translation for 'Date of Birth'
      children: profile?.dob,
    },
    {
      key: 'startedDate',
      label: t('started_date'), // Translation for 'Started Date'
      children: formatDateHour(profile?.createdAt),
    },
    {
      key: 'gender',
      label: t('gender'), // Translation for 'Gender'
      children: profile?.gender,
    },
    {
      key: 'status',
      label: t('status'), // Translation for 'Status'
      children: t('active'), // Translation for 'Active'
    },
    {
      key: 'phoneNumber',
      label: t('phone_number'), // Translation for 'Phone Number'
      children: profile?.phoneNumber,
    },
    {
      key: 'address',
      label: t('address'), // Translation for 'Address'
      children: profile?.address,
      span: 3,
    },
  ];

  return (
    <div>
      <DescriptionComponent items={items} />
      <div className="flex justify-end">
        <ButtonComponent
          icon={<EditOutlined />}
          onClick={modal.openModal}
          className="bg-orange-500 mt-5 text-white hover:!border-orange-500
           hover:!text-orange-500 hover:!bg-orange-500 hover:!bg-opacity-20 duration-150"
        >
          {t('edit_information')} {/* Translation for 'Edit Information' */}
        </ButtonComponent>
      </div>
      <ModalEditProfile modal={modal} profile={profile} mutate={mutate} />
    </div>
  );
};

export default ProfileInformation;
