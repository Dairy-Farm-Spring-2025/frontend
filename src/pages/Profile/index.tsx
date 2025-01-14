import { Spin } from "antd";
import ButtonComponent from "../../components/Button/ButtonComponent";
import useFetcher from "../../hooks/useFetcher";
import useModal from "../../hooks/useModal";
import GeneralInformation from "./components/GeneralInformation";
import ModalEditProfile from "./components/ModalEditProfile";
import TabsProfile from "./components/TabsProfile";

const Profile = () => {
  const { data, isLoading, mutate } = useFetcher<any>("users/profile", "GET");
  const modal = useModal();
  return !isLoading ? (
    <>
      <div>
        <div>
          <GeneralInformation profile={data} />
        </div>
        <div className="mt-5">
          <TabsProfile profile={data} />
        </div>
        <ButtonComponent
          onClick={modal.openModal}
          className="bg-orange-500 mt-5 text-white hover:!border-orange-500
         hover:!text-orange-500 hover:!bg-orange-500 hover:!bg-opacity-20"
        >
          Edit
        </ButtonComponent>
        <ModalEditProfile modal={modal} profile={data} mutate={mutate} />
      </div>
    </>
  ) : (
    <Spin />
  );
};

export default Profile;
