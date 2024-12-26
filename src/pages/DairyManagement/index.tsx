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
  const handleModalVisible = useModal();
  return (
    <div>
      <ButtonComponent type="primary" onClick={handleModalVisible.openModal}>
        Add new
      </ButtonComponent>
      <ModalComponent
        open={handleModalVisible.open}
        onCancel={handleModalVisible.closeModal}
        title="Add"
      >
        asa
      </ModalComponent>
    </div>
  );
};

export default DairyManagement;
