import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

// fetch json menu function
const fetchJsonMenuApi = async ({key}) => {
  const res = await apiAuth.get("/api/vendor/menu-json", {
    params: {
      key
    },
  });
  return res.data;
};

// hook
export const fetchJsonMenu = (key) => {
  return useQuery({
    queryKey: ["json-menu", key],
    queryFn: () => fetchJsonMenuApi({ key }),
    keepPreviousData: true,
  });
};


// ================== SAVE MENU ==================
export const useSaveMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.patch("/api/vendor/menu-json", payload);
      return res;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["json-menu", variables.key],
      });
    },
  });
};