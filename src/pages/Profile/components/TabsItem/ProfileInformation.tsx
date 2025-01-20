import ButtonComponent from '../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../components/Description/DescriptionComponent';
import { EditOutlined } from '@ant-design/icons';
import useModal from '../../../../hooks/useModal';
import { UserProfileData } from '../../../../model/User';
import { formatDateHour } from '../../../../utils/format';
import ModalEditProfile from '../ModalEditProfile';

interface ProfileInformationProps {
  profile: UserProfileData;
  mutate: any;
}

const ProfileInformation = ({ profile, mutate }: ProfileInformationProps) => {
  const modal = useModal();
  const items: DescriptionPropsItem['items'] = [
    {
      key: 'email',
      label: 'Email',
      children: profile?.email,
    },
    {
      key: 'dob',
      label: 'Date of birth',
      children: profile?.dob,
    },
    {
      key: 'startedDate',
      label: 'Started Date',
      children: formatDateHour(profile?.createdAt),
    },
    {
      key: 'gender',
      label: 'Gender',
      children: profile?.gender,
    },
    {
      key: 'status',
      label: 'Status',
      children: 'Active',
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      children: profile?.phoneNumber,
    },
    {
      key: 'address',
      label: 'Address',
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
          Edit Information
        </ButtonComponent>
      </div>
      <ModalEditProfile modal={modal} profile={profile} mutate={mutate} />
    </div>
  );
};

export default ProfileInformation;
