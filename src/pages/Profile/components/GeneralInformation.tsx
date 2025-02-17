import { SiTicktick } from 'react-icons/si';
import { UserProfileData } from '../../../model/User';
import AvatarProfile from './AvatarProfile';
import { useTranslation } from 'react-i18next';

interface GeneralInformationProps {
  profile: UserProfileData;
  mutate: any;
}

const GeneralInformation = ({ profile, mutate }: GeneralInformationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-5">
      <div className="w-fit ">
        <AvatarProfile avatar={profile?.profilePhoto} mutate={mutate} />
      </div>
      <div className="flex flex-col gap-3 justify-start py-2">
        <p className="text-xl font-bold">
          {profile?.name}{' '}
          <span className="font-normal text-gray-500">
            ({t(profile?.roleId?.name)})
          </span>
        </p>
        <p className="text-base">
          <strong>{t('Employee Number')}: </strong> {profile?.employeeNumber}
        </p>
        <div>
          <SiTicktick size={20} className="text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
