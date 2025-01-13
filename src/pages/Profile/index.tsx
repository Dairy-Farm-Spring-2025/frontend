import GeneralInformation from "./components/GeneralInformation";
import TabsProfile from "./components/TabsProfile";

const Profile = () => {
  return (
    <div>
      <div>
        <GeneralInformation />
      </div>
      <div className="mt-5">
        <TabsProfile />
      </div>
    </div>
  );
};

export default Profile;
