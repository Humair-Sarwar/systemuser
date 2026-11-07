import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPublic } from "../../utils/apis/api-client";


// fetch site menu function
const fetchSiteMenuApi = async ({key}) => {
  const res = await apiPublic.get("/api/website/menu-json", {
    params: {
      key
    },
  });
  return res.data;
};

// hook
export const fetchSiteMenu = (key) => {
  return useQuery({
    queryKey: ["site-menu", key],
    queryFn: () => fetchSiteMenuApi({ key }),
    keepPreviousData: true,
  });
};