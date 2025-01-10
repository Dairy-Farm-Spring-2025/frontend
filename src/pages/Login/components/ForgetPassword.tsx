import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/Button/ButtonComponent";
const ForgetPassword = () => {
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate("/login");
  };
  return (
    <div>
      ForgetPassword
      <ButtonComponent onClick={handleBackToLogin}>
        Back to login
      </ButtonComponent>
    </div>
  );
};

export default ForgetPassword;
