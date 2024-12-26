import ButtonComponent from "../../components/Button/ButtonComponent";
import ModalComponent from "../../components/Modal/ModalComponent";
import useModal from "../../hooks/useModal";

const DairyManagement = () => {
  // const dataSource = [
  //   {
  //     id: 1,
  //     name: "asasasa",
  //     class: "123",
  //     email: "example@gmail.com",
  //   },
  //   {
  //     id: 2,
  //     name: "asasasa",
  //     class: "123",
  //     email: "example@gmail.com",
  //   },
  //   {
  //     id: 3,
  //     name: "asasasa",
  //     class: "123",
  //     email: "example@gmail.com",
  //   },
  // ];
  // const column: Column[] = [
  //   {
  //     title: "id",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  //   {
  //     title: "name",
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: "class",
  //     dataIndex: "class",
  //     key: "class",
  //   },
  //   {
  //     title: "email",
  //     dataIndex: "email",
  //     key: "email",
  //   },
  // ];
  const { closeModal, open, openModal } = useModal();
  return (
    <div>
      <ButtonComponent onClick={openModal}>Open</ButtonComponent>
      <ModalComponent onCancel={closeModal} open={open}>
        A
      </ModalComponent>
    </div>
  );
};

export default DairyManagement;
