export type UserResponseData = {
  refreshToken: string;
  accessToken: string;
  userId: number;
  fullName: string;
  roleName: string;
};

type UserResponse = {
  code: number;
  data: UserResponseData;
  message: string;
};

export default UserResponse;
