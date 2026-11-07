import axios from "axios";

let token = localStorage.getItem("token")

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: false,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

api.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
});



export const signupApi = async (data)=>{
    let response;
    try {
        response = await api.post('/auth/signup', data);
    } catch (error) {
        return error;
    }
    return response;
}






export const systemUserLoginApi = async (data) => {
    let response;
    try {
        response = await api.post('/api/systemuser/auth/login', data);
    } catch (error) {
        return error;
    }
    return response;
};

export const systemUserLogoutApi = async () => {
    let response;
    try {
        response = await api.post('/api/systemuser/auth/logout');
    } catch (error) {
        return error;
    }
    return response;
};

export const vendorLoginApi = async (data) => {
    let response;
    try {
        response = await api.post('/api/vendor/auth/login', data);
    } catch (error) {
        return error;
    }
    return response;
};

export const vendorLogoutApi = async () => {
    let response;
    try {
        response = await api.post('/api/vendor/auth/logout');
    } catch (error) {
        return error;
    }
    return response;
};

export const loginApi = async (data)=>{
    let response;
    try {
        response = await api.post('/auth/login', data);
    } catch (error) {
        return error;
    }
    return response;
}


export const createUpdateMenuApi = async (data)=>{
    let response;
    try {
        response = await api.patch('/api/vendor/menu-json', data);
    } catch (error) {
        return error;
    }
    return response;
}


export const getMenuApi = async (data)=>{
    let response;
    try {
         response = await api.get('/api/vendor/menu-json', {
      params: {
        business_id: data.business_id,
        key: data.key
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}



export const getSiteMenuApi = async ({key})=>{
    let response;
    try {
         response = await api.get('/api/website/menu-json', {
      params: {
        key
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}





export const createCategoryApi = async (data)=>{
    let response;
    try {
        response = await api.post('/api/vendor/categories', data);
    } catch (error) {
        return error;
    }
    return response;
}


export const getCategoriesApi = async ({business_id})=>{
    let response;
    try {
         response = await api.get('/api/vendor/categories', {
      params: {
        business_id
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}



export const getWebsiteCategoriesApi = async ()=>{
    let response;
    try {
         response = await api.get('/api/website/categories');
    } catch (error) {
        return error;
    }
    return response;
}


export const getCategoriesFilterBaseApi = async ({category})=>{
    let response;
    try {
         response = await api.get('/api/website/products/filter', {
      params: {
        category
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}


export const getWebsiteCategoryProductsApi = async ({category, page, per_page})=>{
    let response;
    try {
         response = await api.get('/api/website/category/products', {
      params: {
        category,
        page,
        per_page
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}


export const addImageApi = async (data)=>{
   
    let response;
    try {
        response = await api.post('/api/add/image', data);
    } catch (error) {
        return error;
    }
    return response;
}



// ------------------- Brands --------------------


export const createBrandApi = async (data)=>{
    let response;
    try {
        response = await api.post('/api/vendor/brands', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const getBrandsApi = async ({business_id, search, page,
          pageSize})=>{
    let response;
    try {
         response = await api.get('/api/vendor/brands', {
      params: {
        business_id,
        search, 
        page,
          pageSize
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}

export const deleteSelectedBrandsApi = async (body)=>{
    let response;
    try {
         response = await api.delete('/api/vendor/brands', {
      data: body,
    });
    } catch (error) {
        return error;
    }
    return response;
}

export const deleteBrandApi = async (body)=>{
    let response;
    try {
         response = await api.delete('/api/vendor/brand', {
      data: body,
    });
    } catch (error) {
        return error;
    }
    return response;
}

export const updateBrandActiveApi = async (data) => {

    let response;
    try {
         response = await api.put('/api/vendor/brands/is-active', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const updateBrandApi = async (data) => {

    let response;
    try {
         response = await api.put('/api/vendor/brand', data);
    } catch (error) {
        return error;
    }
    return response;
}


export const getBrandsForProductsApi = async ({business_id, is_active})=>{
    let response;
    try {
         response = await api.get('/api/vendor/brands/others', {
      params: {
        business_id, is_active
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}


export const getMediaApi = async ({business_id})=>{
    let response;
    try {
         response = await api.get('/api/vendor/media', {
      params: {
        business_id
      }
    });
    } catch (error) {
        return error;
    }
    return response;
}

// ==================== SYSTEM USER ROLES APIS ====================
export const getRolesApi = async ({ search = '', page = 1, per_page = 10 } = {}) => {
    try {
        const response = await api.get('/api/systemuser/roles', {
            params: { search, page, per_page }
        });
        return response;
    } catch (error) {
        return error;
    }
};

export const createRoleApi = async (data) => {
    try {
        const response = await api.post('/api/systemuser/roles', data);
        return response;
    } catch (error) {
        return error;
    }
};

export const getRoleByIdApi = async (id) => {
    try {
        const response = await api.get(`/api/systemuser/roles/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateRoleApi = async (id, data) => {
    try {
        const response = await api.put(`/api/systemuser/roles/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const deleteRoleApi = async (id) => {
    try {
        const response = await api.delete(`/api/systemuser/roles/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const toggleRoleStatusApi = async (id) => {
    try {
        const response = await api.patch(`/api/systemuser/roles/${id}/toggle-status`);
        return response;
    } catch (error) {
        return error;
    }
};


export const syncRoleApi = async (id) => {
    try {
        const response = await api.post(`/api/systemuser/roles/${id}/sync`);
        return response;
    } catch (error) {
        return error;
    }
};

// ==================== LOCATIONS: COUNTRIES APIs ====================
export const getCountriesApi = async (params) => {
    try {
        const response = await api.get('/api/systemuser/countries', { params });
        return response;
    } catch (error) {
        return error;
    }
};

export const getAllCountriesApi = async () => {
    try {
        const response = await api.get('/api/systemuser/countries/all');
        return response;
    } catch (error) {
        return error;
    }
};

export const createCountryApi = async (data) => {
    try {
        const response = await api.post('/api/systemuser/countries', data);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateCountryApi = async (id, data) => {
    try {
        const response = await api.put(`/api/systemuser/countries/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const deleteCountryApi = async (id) => {
    try {
        const response = await api.delete(`/api/systemuser/countries/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const toggleCountryStatusApi = async (id) => {
    try {
        const response = await api.patch(`/api/systemuser/countries/${id}/toggle-status`);
        return response;
    } catch (error) {
        return error;
    }
};

// ==================== LOCATIONS: CITIES APIs ====================
export const getCitiesApi = async (params) => {
    try {
        const response = await api.get('/api/systemuser/cities', { params });
        return response;
    } catch (error) {
        return error;
    }
};

export const createCityApi = async (data) => {
    try {
        const response = await api.post('/api/systemuser/cities', data);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateCityApi = async (id, data) => {
    try {
        const response = await api.put(`/api/systemuser/cities/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const deleteCityApi = async (id) => {
    try {
        const response = await api.delete(`/api/systemuser/cities/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const toggleCityStatusApi = async (id) => {
    try {
        const response = await api.patch(`/api/systemuser/cities/${id}/toggle-status`);
        return response;
    } catch (error) {
        return error;
    }
};

// ==================== SYSTEM USERS APIs ====================
export const getSystemUsersApi = async (params) => {
    try {
        const response = await api.get('/api/systemuser/users', { params });
        return response;
    } catch (error) {
        return error;
    }
};

export const getSystemUserDetailApi = async (id) => {
    try {
        const response = await api.get(`/api/systemuser/users/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const toggleSystemUserStatusApi = async (id) => {
    try {
        const response = await api.patch(`/api/systemuser/users/${id}/toggle-status`);
        return response;
    } catch (error) {
        return error;
    }
};

export const exportSystemUsersCsvApi = async (params) => {
    try {
        const response = await api.get('/api/systemuser/users/export-csv', {
            params,
            responseType: 'blob',
        });
        return response;
    } catch (error) {
        return error;
    }
};


// ==================== SYSTEM BUSINESSES APIs ====================
export const getSystemBusinessesApi = async (params) => {
    try {
        const response = await api.get('/api/systemuser/businesses', { params });
        return response;
    } catch (error) {
        return error;
    }
};

export const getBusinessFormOptionsApi = async () => {
    try {
        const response = await api.get('/api/systemuser/businesses/form-options');
        return response;
    } catch (error) {
        return error;
    }
};

export const getSystemBusinessDetailApi = async (id) => {
    try {
        const response = await api.get(`/api/systemuser/businesses/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const createSystemBusinessApi = async (data) => {
    try {
        const response = await api.post('/api/systemuser/businesses', data);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateSystemBusinessApi = async (id, data) => {
    try {
        const response = await api.put(`/api/systemuser/businesses/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const toggleBlockBusinessApi = async (id) => {
    try {
        const response = await api.patch(`/api/systemuser/businesses/${id}/toggle-block`);
        return response;
    } catch (error) {
        return error;
    }
};

export const deleteSystemBusinessApi = async (id) => {
    try {
        const response = await api.delete(`/api/systemuser/businesses/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getSystemDashboardStatsApi = async () => {
    try {
        const response = await api.get('/api/systemuser/dashboard/stats');
        return response;
    } catch (error) {
        return error;
    }
};
