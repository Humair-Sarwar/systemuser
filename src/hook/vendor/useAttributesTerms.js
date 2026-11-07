import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

export const useFetchAttributes = (page = 1, per_page = 10, search = "") => {
  return useQuery({
    queryKey: ["attributes", page, per_page, search],

    queryFn: async () => {
      const res = await apiAuth.get("/api/vendor/attributes", {
        params: {
          page,
          per_page,
          search,
        },
      });

      return res.data;
    },

    keepPreviousData: true,
  });
};












export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post("/api/vendor/attribute", payload);
      return res.data;
    },

    onSuccess: () => {
      // 🔥 refresh attributes list
      queryClient.invalidateQueries(["attributes"]);
    },
  });
};









export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put("/api/vendor/attribute/update", payload);
      return res.data;
    },

    onSuccess: () => {
      // 🔥 refresh attributes list
      queryClient.invalidateQueries(["attributes"]);
    },
  });
};






export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiAuth.delete(`/api/vendor/attribute/${id}`);
      return res.data;
    },

    onSuccess: () => {
      // 🔥 refresh attributes list
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
};







export const useFetchTerms = (attributeId, page = 1, per_page = 10, search = "") => {
  return useQuery({
    queryKey: ["terms", attributeId, page, per_page, search],

    queryFn: async () => {
      const res = await apiAuth.get(`/api/vendor/terms/${attributeId}`, {
        params: {
          page,
          per_page,
          search,
        },
      });

      return res.data;
    },

    enabled: !!attributeId,
    keepPreviousData: true, // 👈 smooth pagination UX
  });
};




export const useDeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiAuth.delete(`/api/vendor/term/${id}`);
      return res.data;
    },

    onSuccess: (_, id, context) => {
      // 🔥 refresh terms list (all pages / filters)
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
};









export const useCreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post("/api/vendor/term", payload);
      return res.data;
    },

    onSuccess: (_, variables) => {
      // 🔥 refresh terms list (specific attribute)
      if (variables?.attribute_id) {
        queryClient.invalidateQueries(["terms", variables.attribute_id]);
      } else {
        queryClient.invalidateQueries(["terms"]);
      }
    },
  });
};







export const useUpdateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put("/api/vendor/term/update", payload);
      return res.data;
    },

    onSuccess: (_, variables) => {
      // 🔥 refresh terms list (specific attribute)
      if (variables?.attribute_id) {
        queryClient.invalidateQueries(["terms", variables.attribute_id]);
      } else {
        queryClient.invalidateQueries(["terms"]);
      }
    },
  });
};