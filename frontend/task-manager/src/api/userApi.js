import axiosClient from "./AxiosClient";
const userApi = {
  verifyToken: () => axiosClient.get("auth/verify-token"),
};

export default userApi;