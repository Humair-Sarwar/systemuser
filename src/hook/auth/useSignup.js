import { useMutation } from "@tanstack/react-query";
import { apiPublic } from "../../utils/apis/api-client";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data) =>
      apiPublic.post("/api/website/register", data).then(res => res.data),
  });
};