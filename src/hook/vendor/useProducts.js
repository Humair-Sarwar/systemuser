import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiAuth } from "../../utils/apis/api-client";

export const useFetchProducts = (
  {
    page = 1,
    per_page = 10,
    search_by_title = "",
    search_by_sku = "",
    search_product_type = "",
    search_product_purpose = "",
    search_product_stock_status = "",
    search_product_status = "",
    search_active_for = "",
    search_by_brand = "",
  } = {},
  options = {},
) => {
  // Normalize params so empty values produce a consistent cache key & clean query string
  const params = {
    page,
    per_page,
    ...(search_by_title ? { search_by_title } : {}),
    ...(search_by_sku ? { search_by_sku } : {}),
    ...(search_product_type !== "" && search_product_type !== undefined
      ? { search_product_type }
      : {}),
    ...(search_product_purpose !== "" && search_product_purpose !== undefined
      ? { search_product_purpose }
      : {}),
    ...(search_product_stock_status !== "" &&
    search_product_stock_status !== undefined
      ? { search_product_stock_status }
      : {}),
    ...(search_product_status !== "" && search_product_status !== undefined
      ? { search_product_status }
      : {}),
    ...(search_active_for !== "" && search_active_for !== undefined
      ? { search_active_for }
      : {}),
    ...(search_by_brand !== "" && search_by_brand !== undefined
      ? { search_by_brand }
      : {}),
  };

  return useQuery({
    queryKey: ["products", params],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get("/api/vendor/products", {
        params,
        signal,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // 30s cache to avoid duplicate refetches
    gcTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useFetchPOSProducts = (
  { hot_list = "", category = "", category_id = "", search = "" } = {},
  options = {},
) => {
  const params = {
    ...(hot_list !== "" && hot_list !== undefined && hot_list !== null
      ? { hot_list }
      : {}),
    ...(category !== "" && category !== undefined && category !== null
      ? { category }
      : {}),
    ...(category_id !== "" && category_id !== undefined && category_id !== null
      ? { category_id }
      : {}),
    ...(search ? { search } : {}),
  };

  return useQuery({
    queryKey: ["pos-products", params],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get("/api/vendor/pos/products", {
        params,
        signal,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useCreateProductStep1 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post("/api/vendor/product/step1", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put("/api/vendor/product/type/update", payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["product-type", variables.product_id],
        });
      }
    },
  });
};

export const useFetchProductTypeById = (productId, options = {}) => {
  return useQuery({
    queryKey: ["product-type", productId],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/product/type/get/${productId}`,
        { signal },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useFetchProductSimpleStep2 = (productId, options = {}) => {
  return useQuery({
    queryKey: ["product-step2-simple", productId],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/product/edit/step2/simple/${productId}`,
        { signal },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useCreateProductStep2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put(
        "/api/vendor/product/create-step2",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      const prodId = variables?.product_id || variables?.id;
      if (prodId) {
        queryClient.invalidateQueries({
          queryKey: ["product-step2-simple", prodId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useFetchProductStep1 = (productId, options = {}) => {
  return useQuery({
    queryKey: ["product-step1", productId],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/product/edit/step1/${productId}`,
        { signal },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useUpdateProductStep1 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put(
        "/api/vendor/product/update/step1",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      const prodId = variables?.product_id || variables?.id;
      if (prodId) {
        queryClient.invalidateQueries({
          queryKey: ["product-step1", prodId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const res = await apiAuth.delete(
        `/api/vendor/product/delete/${productId}`,
      );
      return res.data;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["products"],
      });

      queryClient.setQueriesData({ queryKey: ["products"] }, (old) => {
        if (!old || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.filter((item) => item.id !== productId),
          pagination: old.pagination
            ? {
                ...old.pagination,
                total: Math.max(0, (old.pagination.total || 1) - 1),
              }
            : old.pagination,
        };
      });

      return { previousQueries };
    },
    onError: (_err, _productId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useUpdateProductPublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.put(
        "/api/vendor/product/publish/update",
        payload,
      );
      return res.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["products"],
      });

      queryClient.setQueriesData({ queryKey: ["products"] }, (old) => {
        if (!old || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.map((item) =>
            item.id === variables?.id
              ? { ...item, is_published: variables.is_published }
              : item,
          ),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: (_, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });

      const prodId = variables?.product_id || variables?.id;
      if (prodId) {
        queryClient.invalidateQueries({
          queryKey: ["product-step1", prodId],
        });
      }
    },
  });
};

export const useFetchProductAttributesById = (productId, options = {}) => {
  return useQuery({
    queryKey: ["product-attributes", productId],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/product/attributes/get/${productId}`,
        { signal },
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useFetchProductTerms = (id, options = {}) => {
  return useQuery({
    queryKey: ["product-terms", id],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(`/api/vendor/product/terms/get/${id}`, {
        signal,
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(id) && Boolean(options.enabled)
        : Boolean(id),
  });
};

export const useSaveProductAttributeTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post(
        "/api/vendor/product/attribute/terms/save",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
      queryClient.invalidateQueries({ queryKey: ["product-attributes"] });
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", variables.product_id],
        });
      }
    },
  });
};

export const useFetchSelectedProductAttributes = (productId, options = {}) => {
  return useQuery({
    queryKey: ["selected-product-attributes", productId],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/products/${productId}/attributes`,
        { signal },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useDeleteProductAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.delete(
        "/api/vendor/products/attributes/delete",
        {
          data: payload,
        },
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", variables.product_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["product-attributes"] });
    },
  });
};

export const useDeleteProductTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.delete("/api/vendor/products/terms/delete", {
        data: payload,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", variables.product_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
    },
  });
};

export const useUpdateAttributeSortOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.patch(
        "/api/vendor/products/attributes/update-sort-order",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", variables.product_id],
        });
      }
    },
  });
};

export const useFetchProductVariations = (productId, page, options = {}) => {
  return useQuery({
    queryKey: ["product-variations", productId, page],
    queryFn: async ({ signal }) => {
      const res = await apiAuth.get(
        `/api/vendor/products/${productId}/variations`,
        {
          params: {
            page,
          },
          signal,
        },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    ...options,
    enabled:
      options.enabled !== undefined
        ? Boolean(productId) && Boolean(options.enabled)
        : Boolean(productId),
  });
};

export const useGenerateVariations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post(
        "/api/vendor/products/generate-variations",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variations"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useRemoveTermAndVariations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.delete(
        "/api/vendor/products/remove-term-variations",
        {
          data: payload,
        },
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      const productId = variables?.product_id;

      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["product-variations", productId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
};

export const useUpdateVariation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await apiAuth.put(
        `/api/vendor/products/variations/${id}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["pos-products"],
      });
    },
  });
};

export const useSaveTermImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post(
        "/api/vendor/product/term/save-image",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
      if (variables?.product_id) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", variables.product_id],
        });
      }
    },
  });
};

export const useClearTermImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post("/api/vendor/clear-term-image", payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      const productId = variables?.product_id;

      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", productId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
    },
  });
};

export const useSyncTermImageToVariations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiAuth.post(
        "/api/vendor/sync-term-image-to-variations",
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      const productId = variables?.product_id;

      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["product-variations", productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["selected-product-attributes", productId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["product-terms"] });
    },
  });
};

const fetchWarrantiesPanelApi = async ({ search, signal }) => {
  const res = await apiAuth.get("/api/vendor/warranties/panel", {
    params: {
      ...(search ? { search } : {}),
    },
    signal,
  });

  return res.data;
};

export const fetchWarrantiesPanel = (search = "", options = {}) => {
  return useQuery({
    queryKey: ["returns-panel", search],
    queryFn: ({ signal }) => fetchWarrantiesPanelApi({ search, signal }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
