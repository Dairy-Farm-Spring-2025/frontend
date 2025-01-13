import api from "../../../config/axios/axios";
import UserRequest from "../../../model/Authentication/UserRequest";

const authenticationApi = {
  signIn: async (body: UserRequest) => {
    try {
      const response = await api.post("users/login", body);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
};

export default authenticationApi;
