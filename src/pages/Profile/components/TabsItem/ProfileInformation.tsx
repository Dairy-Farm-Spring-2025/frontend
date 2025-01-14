import DescriptionComponent, {
  DescriptionPropsItem,
} from "../../../../components/Description/DescriptionComponent";
import { UserProfileData } from "../../../../model/User";
import { formatDateHour } from "../../../../utils/format";

interface ProfileInformationProps {
  profile: UserProfileData;
}

const ProfileInformation = ({ profile }: ProfileInformationProps) => {
  const items: DescriptionPropsItem["items"] = [
    {
      key: "email",
      label: "Email",
      children: profile?.email,
    },
    {
      key: "dob",
      label: "Date of birth",
      children: profile?.dob,
    },
    {
      key: "startedDate",
      label: "Started Date",
      children: formatDateHour(profile?.createdAt),
    },
    {
      key: "gender",
      label: "Gender",
      children: profile?.gender,
    },
    {
      key: "status",
      label: "Status",
      children: "Active",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      children: profile?.phoneNumber,
    },
    {
      key: "address",
      label: "Address",
      children: profile?.address,
      span: 3,
    },
  ];
  return <DescriptionComponent items={items} />;
};

export default ProfileInformation;
