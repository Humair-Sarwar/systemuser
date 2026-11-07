import { useMutation } from "@tanstack/react-query";
import { apiPublic } from "../../utils/apis/api-client";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) =>
      apiPublic.post("/api/website/login", data).then(res => res.data),
  });
};