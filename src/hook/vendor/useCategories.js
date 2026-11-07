import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

// ================== FETCH CATEGORIES ==================
const fetchCategoriesApi = async ({ signal } = {}) => {
  const res = await apiAuth.get("/api/vendor/categories", { signal });
  return res.data;
};

// hook
export const fetchCategories = (page, per_page, search, options = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCategoriesApi({ signal }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    ...options,
  });
};

// ================== FETCH POS CATEGORIES ==================
const fetchPOSCategoriesApi = async ({ signal } = {}) => {
  const res = await apiAuth.get("/api/vendor/pos/categories", { signal });
  return res.data;
};

export const useFetchPOSCategories = (options = {}) => {
  return useQuery({
    queryKey: ["pos-categories"],
    queryFn: ({ signal }) => fetchPOSCategoriesApi({ signal }),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

// ================== CREATE CATEGORY ==================
const createCategoryApi = async (payload) => {
  const res = await apiAuth.post("/api/vendor/category", payload);
  return res.data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-panel"] });
      queryClient.invalidateQueries({ queryKey: ["pos-categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiAuth.delete(`/api/vendor/category/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-panel"] });
      queryClient.invalidateQueries({ queryKey: ["pos-categories"] });
    },
  });
};

const fetchCategoriesPanelApi = async ({ search, signal }) => {
  const res = await apiAuth.get("/api/vendor/categories/panel", {
    params: {
      ...(search ? { search } : {}),
    },
    signal,
  });

  return res.data;
};

export const fetchCategoriesPanel = (search = "", options = {}) => {
  return useQuery({
    queryKey: ["categories-panel", search || ""],
    queryFn: ({ signal }) => fetchCategoriesPanelApi({ search, signal }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put("/api/vendor/category", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-panel"] });
      queryClient.invalidateQueries({ queryKey: ["pos-categories"] });
    },
  });
};
