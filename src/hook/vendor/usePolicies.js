import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

// fetch warranty function
const fetchWarrantyPolicyApi = async ({page, per_page, search}) => {
  const res = await apiAuth.get("/api/vendor/warranty-policy", {
    params: {
      page,
      per_page,
      search
    },
  });
  return res.data;
};

// hook
export const fetchWarrantyPolicy = (page, per_page, search) => {
  return useQuery({
    queryKey: ["warranty-policies", page, per_page, search],
    queryFn: () => fetchWarrantyPolicyApi({ page, per_page, search }),
    keepPreviousData: true,
  });
};




const createWarrantyApi = async (payload) => {
  const res = await apiAuth.post("/api/vendor/warranty-policy/create", payload);
  return res.data;
};

export const useCreateWarranty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarrantyApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warranty-policies"] });
    },
  });
};









export const useUpdateWarranty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await apiAuth.put(`/api/vendor/warranty-policy/${id}`, formData);

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["warranty-policies"]);
    },
  });
};






export const useDeleteWarranty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiAuth.delete(`/api/vendor/warranty-policy/${id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["warranty-policies"]);
    },
  });
};










// fetch Return function
const fetchReturnPolicyApi = async ({page, per_page, search}) => {
  const res = await apiAuth.get("/api/vendor/return-policy", {
    params: {
      page,
      per_page,
      search
    },
  });
  return res.data;
};

// hook
export const fetchReturnPolicy = (page, per_page, search) => {
  return useQuery({
    queryKey: ["return-policies", page, per_page, search],
    queryFn: () => fetchReturnPolicyApi({ page, per_page, search }),
    keepPreviousData: true,
  });
};




const createReturnApi = async (payload) => {
  const res = await apiAuth.post("/api/vendor/return-policy/create", payload);
  return res.data;
};

export const useCreateReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturnApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["return-policies"] });
    },
  });
};









export const useUpdateReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await apiAuth.put(`/api/vendor/return-policy/${id}`, formData);

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["return-policies"]);
    },
  });
};






export const useDeleteReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiAuth.delete(`/api/vendor/return-policy/${id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["return-policies"]);
    },
  });
};