import DescriptionComponent, {
  DescriptionPropsItem,
} from "../../../../components/Description/DescriptionComponent";

const ProfileInformation = () => {
  const items: DescriptionPropsItem["items"] = [
    {
      key: "email",
      label: "Email",
      children: "Email",
    },
    {
      key: "dob",
      label: "Date of birth",
      children: "01/01/2020",
    },
    {
      key: "startedDate",
      label: "Started Date",
      children: "01/01/2020",
    },
    {
      key: "gender",
      label: "Gender",
      children: "Male",
    },
    {
      key: "status",
      label: "Status",
      children: "Active",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      children: "0123456789",
    },
    {
      key: "address",
      label: "Address",
      children: "Binh Duong",
      span: 3,
    },
  ];
  return <DescriptionComponent items={items} />;
};

export default ProfileInformation;
