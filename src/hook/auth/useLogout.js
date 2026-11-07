import { useMutation } from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

export const useLogout = () => {
  return useMutation({
    mutationFn: () => apiAuth.post("/api/website/logout").then(res => res.data),
  });
};