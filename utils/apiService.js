/**
 * Comprehensive API Service Layer
 * Covers all 640+ backend routes from the three specification files
 */

const BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error);
        throw error;
    }
};

const apiService = {
    // ==================== AUTHENTICATION & SECURITY (Routes 1-20) ====================
    auth: {
        register: (data) => makeRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data) => makeRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => makeRequest('/auth/logout', { method: 'POST' }),
        refreshToken: () => makeRequest('/auth/refresh-token', { method: 'POST' }),
        verifyEmail: (data) => makeRequest('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) }),
        resendVerification: (data) => makeRequest('/auth/resend-verification', { method: 'POST', body: JSON.stringify(data) }),
        forgotPassword: (data) => makeRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
        resetPassword: (data) => makeRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
        enable2FA: () => makeRequest('/auth/2fa/enable', { method: 'POST' }),
        verify2FA: (data) => makeRequest('/auth/2fa/verify', { method: 'POST', body: JSON.stringify(data) }),
        disable2FA: () => makeRequest('/auth/2fa/disable', { method: 'POST' }),
        getSessions: () => makeRequest('/auth/sessions', { method: 'POST' }),
        revokeSession: (id) => makeRequest(`/auth/sessions/${id}`, { method: 'DELETE' }),
        googleOAuth: (data) => makeRequest('/auth/oauth/google', { method: 'POST', body: JSON.stringify(data) }),
        facebookOAuth: (data) => makeRequest('/auth/oauth/facebook', { method: 'POST', body: JSON.stringify(data) }),
        appleOAuth: (data) => makeRequest('/auth/oauth/apple', { method: 'POST', body: JSON.stringify(data) }),
        createApiKey: (data) => makeRequest('/auth/api-keys', { method: 'POST', body: JSON.stringify(data) }),
        getApiKeys: () => makeRequest('/auth/api-keys'),
        revokeApiKey: (id) => makeRequest(`/auth/api-keys/${id}`, { method: 'DELETE' }),
        impersonate: (data) => makeRequest('/auth/impersonate', { method: 'POST', body: JSON.stringify(data) }),
    },

    // ==================== USERS, ROLES, PERMISSIONS (Routes 21-50) ====================
    users: {
        getProfile: () => makeRequest('/users/me'),
        updateProfile: (data) => makeRequest('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
        changePassword: (data) => makeRequest('/users/me/password', { method: 'PUT', body: JSON.stringify(data) }),
        list: (params) => makeRequest(`/users?${new URLSearchParams(params)}`),
        listUsers: (params) => makeRequest(`/users?${new URLSearchParams(params)}`),
        getUser: (id) => makeRequest(`/users/${id}`),
        updateUser: (id, data) => makeRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteUser: (id) => makeRequest(`/users/${id}`, { method: 'DELETE' }),
        banUser: (id) => makeRequest(`/users/${id}/ban`, { method: 'PUT' }),
        unbanUser: (id) => makeRequest(`/users/${id}/unban`, { method: 'PUT' }),
        getUserActivity: (id) => makeRequest(`/users/${id}/activity`),
        getUserSessions: (id) => makeRequest(`/users/${id}/sessions`),
        adminResetPassword: (id, data) => makeRequest(`/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify(data) }),
        getRoles: () => makeRequest('/roles'),
        createRole: (data) => makeRequest('/roles', { method: 'POST', body: JSON.stringify(data) }),
        updateRole: (id, data) => makeRequest(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteRole: (id) => makeRequest(`/roles/${id}`, { method: 'DELETE' }),
        getPermissions: () => makeRequest('/permissions'),
        assignPermissions: (roleId, data) => makeRequest(`/roles/${roleId}/permissions`, { method: 'POST', body: JSON.stringify(data) }),
        removePermission: (roleId, permId) => makeRequest(`/roles/${roleId}/permissions/${permId}`, { method: 'DELETE' }),
        assignRole: (userId, data) => makeRequest(`/users/${userId}/roles`, { method: 'POST', body: JSON.stringify(data) }),
        removeRole: (userId, roleId) => makeRequest(`/users/${userId}/roles/${roleId}`, { method: 'DELETE' }),
        getUserAuditLog: (id) => makeRequest(`/users/${id}/audit-log`),
        bulkImportUsers: (data) => makeRequest('/users/bulk-import', { method: 'POST', body: JSON.stringify(data) }),
        bulkExportUsers: () => makeRequest('/users/bulk-export', { method: 'POST' }),
        searchUsers: (query) => makeRequest(`/users/search?q=${query}`),
        verifyUser: (id) => makeRequest(`/users/${id}/verify`, { method: 'PUT' }),
        getKYC: (id) => makeRequest(`/users/${id}/kyc`),
        submitKYC: (id, data) => makeRequest(`/users/${id}/kyc`, { method: 'POST', body: JSON.stringify(data) }),
        approveKYC: (id) => makeRequest(`/users/${id}/kyc/approve`, { method: 'PUT' }),
        rejectKYC: (id) => makeRequest(`/users/${id}/kyc/reject`, { method: 'PUT' }),
    },

    // ==================== ADDRESSES, PREFERENCES, WISHLIST (Routes 51-70) ====================
    userProfile: {
        getAddresses: () => makeRequest('/users/me/addresses'),
        createAddress: (data) => makeRequest('/users/me/addresses', { method: 'POST', body: JSON.stringify(data) }),
        updateAddress: (id, data) => makeRequest(`/users/me/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteAddress: (id) => makeRequest(`/users/me/addresses/${id}`, { method: 'DELETE' }),
        setDefaultAddress: (id) => makeRequest(`/users/me/addresses/${id}/default`, { method: 'PUT' }),
        getPreferences: () => makeRequest('/users/me/preferences'),
        updatePreferences: (data) => makeRequest('/users/me/preferences', { method: 'PUT', body: JSON.stringify(data) }),
        getWishlist: () => makeRequest('/users/me/wishlist'),
        addToWishlist: (data) => makeRequest('/users/me/wishlist', { method: 'POST', body: JSON.stringify(data) }),
        removeFromWishlist: (productId) => makeRequest(`/users/me/wishlist/${productId}`, { method: 'DELETE' }),
        getNotifications: () => makeRequest('/users/me/notifications'),
        markAllNotificationsRead: () => makeRequest('/users/me/notifications/read-all', { method: 'PUT' }),
        markNotificationRead: (id) => makeRequest(`/users/me/notifications/${id}/read`, { method: 'PUT' }),
        getDevices: () => makeRequest('/users/me/devices'),
        removeDevice: (id) => makeRequest(`/users/me/devices/${id}`, { method: 'DELETE' }),
        uploadAvatar: (data) => makeRequest('/users/me/avatar', { method: 'POST', body: JSON.stringify(data) }),
        deleteAvatar: () => makeRequest('/users/me/avatar', { method: 'DELETE' }),
        getSecurityLog: () => makeRequest('/users/me/security-log'),
        requestDataExport: () => makeRequest('/users/me/data-export', { method: 'POST' }),
        requestDataDelete: () => makeRequest('/users/me/data-delete', { method: 'POST' }),
    },

    // ==================== PRODUCTS & CATALOG (Routes 71-120) ====================
    products: {
        list: (params) => makeRequest(`/products?${new URLSearchParams(params)}`),
        getAll: (params) => makeRequest(`/products?${new URLSearchParams(params)}`),
        get: (id) => makeRequest(`/products/${id}`),
        getBySlug: (slug) => makeRequest(`/products/slug/${slug}`),
        create: (data) => makeRequest('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/admin/products/${id}`, { method: 'DELETE' }),
        getVariants: (id) => makeRequest(`/products/${id}/variants`),
        createVariant: (id, data) => makeRequest(`/admin/products/${id}/variants`, { method: 'POST', body: JSON.stringify(data) }),
        updateVariant: (id, varId, data) => makeRequest(`/admin/products/variants/${varId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteVariant: (id, varId) => makeRequest(`/admin/products/variants/${varId}`, { method: 'DELETE' }),
        uploadImage: (id, data) => makeRequest(`/admin/products/${id}/images`, { method: 'POST', body: data }), // Assuming FormData
        deleteImage: (id, imgId) => makeRequest(`/admin/products/${id}/images/${imgId}`, { method: 'DELETE' }),
        getCategories: () => makeRequest('/products/categories'),
        getBrands: () => makeRequest('/products/brands'),
        search: (query) => makeRequest(`/products/search?q=${query}`),
        getFeatured: () => makeRequest('/products/featured'),
        getRelated: (id) => makeRequest(`/products/${id}/related`),
        import: (data) => makeRequest('/admin/products/bulk-import', { method: 'POST', body: JSON.stringify(data) }),
        export: () => makeRequest('/admin/products/bulk-export', { method: 'POST' }), // Check if exists
        bulkUpdate: (data) => makeRequest('/admin/products/bulk-update', { method: 'POST', body: JSON.stringify(data) }),
        bulkDelete: (data) => makeRequest('/admin/products/bulk-delete', { method: 'POST', body: JSON.stringify(data) }),
    },

    // ==================== VARIANTS, INVENTORY, WAREHOUSES (Routes 121-160) ====================
    variants: {
        list: (productId) => makeRequest(`/products/${productId}/variants`),
        create: (productId, data) => makeRequest(`/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(data) }),
        update: (productId, variantId, data) => makeRequest(`/products/${productId}/variants/${variantId}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (productId, variantId) => makeRequest(`/products/${productId}/variants/${variantId}`, { method: 'DELETE' }),
        updateSKU: (id, data) => makeRequest(`/variants/${id}/sku`, { method: 'PUT', body: JSON.stringify(data) }),
        updateBarcode: (id, data) => makeRequest(`/variants/${id}/barcode`, { method: 'PUT', body: JSON.stringify(data) }),
        updatePrice: (id, data) => makeRequest(`/variants/${id}/price`, { method: 'PUT', body: JSON.stringify(data) }),
        updateCost: (id, data) => makeRequest(`/variants/${id}/cost`, { method: 'PUT', body: JSON.stringify(data) }),
        updateWeight: (id, data) => makeRequest(`/variants/${id}/weight`, { method: 'PUT', body: JSON.stringify(data) }),
        updateDimensions: (id, data) => makeRequest(`/variants/${id}/dimensions`, { method: 'PUT', body: JSON.stringify(data) }),
    },

    inventory: {
        getOverview: () => makeRequest('/admin/inventory'),
        getVariantInventory: (variantId) => makeRequest(`/admin/inventory/${variantId}`),
        adjustStock: (variantId, data) => makeRequest(`/admin/inventory/${variantId}/adjust`, { method: 'PUT', body: JSON.stringify(data) }),
        transferStock: (data) => makeRequest('/admin/inventory/transfer', { method: 'POST', body: JSON.stringify(data) }),
        getHistory: () => makeRequest('/admin/inventory/history'),
        getReservations: () => makeRequest('/admin/inventory/reservations'),
        reserveStock: (data) => makeRequest('/admin/inventory/reserve', { method: 'POST', body: JSON.stringify(data) }),
        releaseStock: (data) => makeRequest('/admin/inventory/release', { method: 'POST', body: JSON.stringify(data) }),
        getForecast: () => makeRequest('/admin/inventory/forecast'),
        getReorderSuggestions: () => makeRequest('/admin/inventory/reorder'),
        createReorder: (data) => makeRequest('/admin/inventory/reorder', { method: 'POST', body: JSON.stringify(data) }),
        getAging: () => makeRequest('/admin/inventory/aging'),
        getShrinkage: () => makeRequest('/admin/inventory/shrinkage'),
        startStockCount: (data) => makeRequest('/admin/inventory/count/start', { method: 'POST', body: JSON.stringify(data) }),
        submitStockCount: (data) => makeRequest('/admin/inventory/count/submit', { method: 'POST', body: JSON.stringify(data) }),
        getStockCountHistory: () => makeRequest('/admin/inventory/count/history'),
        lockStock: (variantId) => makeRequest(`/admin/inventory/${variantId}/lock`, { method: 'PUT' }),
        unlockStock: (variantId) => makeRequest(`/admin/inventory/${variantId}/unlock`, { method: 'PUT' }),
    },

    warehouses: {
        list: () => makeRequest('/warehouses'),
        create: (data) => makeRequest('/warehouses', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/warehouses/${id}`, { method: 'DELETE' }),
        getStock: (id) => makeRequest(`/warehouses/${id}/stock`),
        adjustStock: (id, data) => makeRequest(`/warehouses/${id}/stock-adjust`, { method: 'POST', body: JSON.stringify(data) }),
        getPicklists: (id) => makeRequest(`/warehouses/${id}/picklists`),
        createPicklist: (id, data) => makeRequest(`/warehouses/${id}/picklists`, { method: 'POST', body: JSON.stringify(data) }),
        updatePicklist: (id, pickId, data) => makeRequest(`/warehouses/${id}/picklists/${pickId}`, { method: 'PUT', body: JSON.stringify(data) }),
        packOrder: (id, data) => makeRequest(`/warehouses/${id}/pack`, { method: 'POST', body: JSON.stringify(data) }),
        shipOrder: (id, data) => makeRequest(`/warehouses/${id}/ship`, { method: 'POST', body: JSON.stringify(data) }),
        getMetrics: (id) => makeRequest(`/warehouses/${id}/metrics`),
    },

    // ==================== CATEGORIES, BRANDS, COLLECTIONS (Routes 161-185) ====================
    categories: {
        list: () => makeRequest('/categories'),
        create: (data) => makeRequest('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/categories/${id}`, { method: 'DELETE' }),
        reorder: (id, data) => makeRequest(`/categories/${id}/reorder`, { method: 'PUT', body: JSON.stringify(data) }),
        getProducts: (id) => makeRequest(`/categories/${id}/products`),
    },

    brands: {
        list: () => makeRequest('/brands'),
        create: (data) => makeRequest('/brands', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/brands/${id}`, { method: 'DELETE' }),
        getProducts: (id) => makeRequest(`/brands/${id}/products`),
    },

    collections: {
        list: () => makeRequest('/collections'),
        create: (data) => makeRequest('/collections', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/collections/${id}`, { method: 'DELETE' }),
        getProducts: (id) => makeRequest(`/collections/${id}/products`),
        addProduct: (id, data) => makeRequest(`/collections/${id}/products`, { method: 'POST', body: JSON.stringify(data) }),
        removeProduct: (id, productId) => makeRequest(`/collections/${id}/products/${productId}`, { method: 'DELETE' }),
        publish: (id) => makeRequest(`/collections/${id}/publish`, { method: 'PUT' }),
        unpublish: (id) => makeRequest(`/collections/${id}/unpublish`, { method: 'PUT' }),
    },

    tags: {
        list: () => makeRequest('/tags'),
        create: (data) => makeRequest('/tags', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/tags/${id}`, { method: 'DELETE' }),
    },

    attributes: {
        list: () => makeRequest('/attributes'),
        create: (data) => makeRequest('/attributes', { method: 'POST', body: JSON.stringify(data) }),
    },

    // ==================== CART, CHECKOUT, ORDERS (Routes 186-225) ====================
    cart: {
        get: () => makeRequest('/cart'),
        addItem: (data) => makeRequest('/cart/items', { method: 'POST', body: JSON.stringify(data) }),
        updateItem: (id, data) => makeRequest(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        removeItem: (id) => makeRequest(`/cart/items/${id}`, { method: 'DELETE' }),
        applyCoupon: (data) => makeRequest('/cart/apply-coupon', { method: 'POST', body: JSON.stringify(data) }),
        removeCoupon: () => makeRequest('/cart/remove-coupon', { method: 'DELETE' }),
        estimateShipping: (data) => makeRequest('/cart/estimate-shipping', { method: 'POST', body: JSON.stringify(data) }),
        validate: () => makeRequest('/cart/validate', { method: 'POST' }),
        clear: () => makeRequest('/cart/clear', { method: 'DELETE' }),
    },

    checkout: {
        start: (data) => makeRequest('/checkout/start', { method: 'POST', body: JSON.stringify(data) }),
        selectShipping: (data) => makeRequest('/checkout/shipping-method', { method: 'POST', body: JSON.stringify(data) }),
        createPaymentIntent: (data) => makeRequest('/checkout/payment-intent', { method: 'POST', body: JSON.stringify(data) }),
        confirm: (data) => makeRequest('/checkout/confirm', { method: 'POST', body: JSON.stringify(data) }),
    },

    orders: {
        list: (params) => makeRequest(`/orders?${new URLSearchParams(params)}`),
        get: (id) => makeRequest(`/orders/${id}`),
        create: (data) => makeRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
        cancel: (id) => makeRequest(`/orders/${id}/cancel`, { method: 'PUT' }),
        requestReturn: (id, data) => makeRequest(`/orders/${id}/return`, { method: 'PUT', body: JSON.stringify(data) }),
        requestExchange: (id, data) => makeRequest(`/orders/${id}/exchange`, { method: 'PUT', body: JSON.stringify(data) }),
        downloadInvoice: (id) => makeRequest(`/orders/${id}/invoice`),
        getShipments: (id) => makeRequest(`/orders/${id}/shipments`),
        updateStatus: (id, data) => makeRequest(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
        updateTracking: (id, data) => makeRequest(`/admin/orders/${id}/tracking`, { method: 'PUT', body: JSON.stringify(data) }),
        getTracking: (id) => makeRequest(`/orders/${id}/tracking`),
        addNote: (id, data) => makeRequest(`/admin/orders/${id}/notes`, { method: 'POST', body: JSON.stringify(data) }),
        getNotes: (id) => makeRequest(`/admin/orders/${id}/notes`),
        resendConfirmation: (id) => makeRequest(`/orders/${id}/resend-confirmation`, { method: 'POST' }),
        split: (id, data) => makeRequest(`/admin/orders/${id}/split`, { method: 'POST', body: JSON.stringify(data) }),
        merge: (id, data) => makeRequest(`/admin/orders/${id}/merge`, { method: 'POST', body: JSON.stringify(data) }),
        adminListAll: (params) => makeRequest(`/admin/orders/all?${new URLSearchParams(params)}`),
        getStats: () => makeRequest('/admin/orders/stats'),
        getFulfillmentQueue: () => makeRequest('/admin/orders/queue'),
        hold: (id) => makeRequest(`/admin/orders/${id}/hold`, { method: 'PUT' }),
        release: (id) => makeRequest(`/admin/orders/${id}/release`, { method: 'PUT' }),
        reprocess: (id) => makeRequest(`/admin/orders/${id}/reprocess`, { method: 'POST' }),
        createManual: (id, data) => makeRequest(`/admin/orders/${id}/manual`, { method: 'POST', body: JSON.stringify(data) }),
        addAdjustment: (id, data) => makeRequest(`/admin/orders/${id}/adjustment`, { method: 'POST', body: JSON.stringify(data) }),
        getTimeline: (id) => makeRequest(`/orders/${id}/timeline`),
        reship: (id) => makeRequest(`/admin/orders/${id}/reship`, { method: 'POST' }),
        writeoff: (id) => makeRequest(`/admin/orders/${id}/writeoff`, { method: 'POST' }),
    },

    // ==================== PAYMENTS, SHIPPING, PROMOS, ANALYTICS (Routes 226-250) ====================
    payments: {
        refund: (data) => makeRequest('/payments/refund', { method: 'POST', body: JSON.stringify(data) }),
        getStatus: (id) => makeRequest(`/payments/${id}`),
        getHistory: () => makeRequest('/payments/history'),
        capture: (data) => makeRequest('/payments/capture', { method: 'POST', body: JSON.stringify(data) }),
        void: (data) => makeRequest('/payments/void', { method: 'POST', body: JSON.stringify(data) }),
    },

    shipping: {
        getCarriers: () => makeRequest('/shipping/carriers'),
        getRates: (data) => makeRequest(`/shipping/rates?${new URLSearchParams(data)}`),
        createLabel: (data) => makeRequest('/shipping/labels', { method: 'POST', body: JSON.stringify(data) }),
        getLabel: (id) => makeRequest(`/shipping/labels/${id}`),
        schedulePickup: (data) => makeRequest('/shipping/pickup', { method: 'POST', body: JSON.stringify(data) }),
    },

    coupons: {
        list: () => makeRequest('/coupons'),
        create: (data) => makeRequest('/coupons', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/coupons/${id}`, { method: 'DELETE' }),
        validate: (data) => makeRequest('/coupons/validate', { method: 'POST', body: JSON.stringify(data) }),
    },

    promotions: {
        list: () => makeRequest('/promotions'),
        create: (data) => makeRequest('/promotions', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => makeRequest(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/promotions/${id}`, { method: 'DELETE' }),
    },

    analytics: {
        getSales: (params) => makeRequest(`/analytics/sales?${new URLSearchParams(params)}`),
        getCustomers: (params) => makeRequest(`/analytics/customers?${new URLSearchParams(params)}`),
        getProducts: (params) => makeRequest(`/analytics/products?${new URLSearchParams(params)}`),
        getConversion: (params) => makeRequest(`/analytics/conversion?${new URLSearchParams(params)}`),
        getTraffic: (params) => makeRequest(`/analytics/traffic?${new URLSearchParams(params)}`),
    },

    // ==================== MARKETPLACE & VENDORS ====================
    vendors: {
        list: () => makeRequest('/vendors'),
        get: (id) => makeRequest(`/vendors/${id}`),
        getProducts: (id) => makeRequest(`/vendors/${id}/products`),
        getPayouts: (id) => makeRequest(`/vendors/${id}/payouts`),
        getSettlements: (id) => makeRequest(`/vendors/${id}/settlements`),
        getKYC: (id) => makeRequest(`/vendors/${id}/kyc`),
        getRatings: (id) => makeRequest(`/vendors/${id}/ratings`),
        getDisputes: (id) => makeRequest(`/vendors/${id}/disputes`),
        apply: (data) => makeRequest('/vendor-applications', { method: 'POST', body: JSON.stringify(data) }),
        getApplications: () => makeRequest('/vendor-applications'),
        getCommissions: () => makeRequest('/vendor-commissions'),
    },

    // ==================== FINANCE & ACCOUNTING ====================
    finance: {
        calculateTax: (data) => makeRequest('/finance/taxes/calculate', { method: 'POST', body: JSON.stringify(data) }),
        getTaxRates: () => makeRequest('/finance/tax-rates'),
        getInvoices: () => makeRequest('/finance/invoices'),
        getInvoice: (id) => makeRequest(`/finance/invoices/${id}`),
        getCreditNotes: () => makeRequest('/finance/credit-notes'),
        getLedger: () => makeRequest('/finance/ledger'),
        getPayouts: () => makeRequest('/finance/payouts'),
        getReconciliation: () => makeRequest('/finance/reconciliation'),
        getVATReports: () => makeRequest('/finance/vat-reports'),
        getWithholding: () => makeRequest('/finance/withholding'),
    },

    // ==================== SEARCH & AI ====================
    search: {
        getSuggestions: (query) => makeRequest(`/search/suggestions?q=${query}`),
        getSynonyms: () => makeRequest('/search/synonyms'),
        getBoosting: () => makeRequest('/search/boosting'),
    },

    recommendations: {
        getHome: () => makeRequest('/recommendations/home'),
        getCart: () => makeRequest('/recommendations/cart'),
        getUser: (id) => makeRequest(`/recommendations/user/${id}`),
    },

    ai: {
        getPricing: () => makeRequest('/ai/pricing'),
        getFraudScore: (data) => makeRequest('/ai/fraud-score', { method: 'POST', body: JSON.stringify(data) }),
        getChurnPrediction: () => makeRequest('/ai/churn-prediction'),
        getDemandForecast: () => makeRequest('/ai/demand-forecast'),
    },

    // ==================== CUSTOMER SUPPORT ====================
    support: {
        getTickets: () => makeRequest('/support/tickets'),
        createTicket: (data) => makeRequest('/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
        getTicket: (id) => makeRequest(`/support/tickets/${id}`),
        replyToTicket: (id, data) => makeRequest(`/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),
        assignTicket: (id, data) => makeRequest(`/support/tickets/${id}/assign`, { method: 'POST', body: JSON.stringify(data) }),
        closeTicket: (id) => makeRequest(`/support/tickets/${id}/close`, { method: 'POST' }),
        getMacros: () => makeRequest('/support/macros'),
        getSLARules: () => makeRequest('/support/sla-rules'),
        getQueues: () => makeRequest('/support/queues'),
        getEscalations: () => makeRequest('/support/escalations'),
        getKnowledgeBase: () => makeRequest('/support/knowledge-base'),
    },

    // ==================== MARKETING ====================
    marketing: {
        getCampaigns: () => makeRequest('/marketing/campaigns'),
        getCampaign: (id) => makeRequest(`/marketing/campaigns/${id}`),
        createCampaign: (data) => makeRequest('/marketing/campaigns', { method: 'POST', body: JSON.stringify(data) }),
        getSegments: () => makeRequest('/marketing/segments'),
        getABTests: () => makeRequest('/marketing/ab-tests'),
        getABTestResults: (id) => makeRequest(`/marketing/ab-tests/${id}/results`),
        getReferrals: () => makeRequest('/marketing/referrals'),
        getLoyalty: () => makeRequest('/marketing/loyalty'),
        getLoyaltyPoints: () => makeRequest('/marketing/loyalty/points'),
        getGiftCards: () => makeRequest('/marketing/gift-cards'),
        getGiftCard: (code) => makeRequest(`/marketing/gift-cards/${code}`),
    },

    giftCards: {
        list: () => makeRequest('/marketing/gift-cards'),
        create: (data) => makeRequest('/marketing/gift-cards', { method: 'POST', body: JSON.stringify(data) }),
        get: (code) => makeRequest(`/marketing/gift-cards/${code}`),
    },

    // ==================== RMA & RETURNS ====================
    rma: {
        list: () => makeRequest('/rma'),
        create: (data) => makeRequest('/rma', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/rma/${id}`),
        approve: (id) => makeRequest(`/rma/${id}/approve`, { method: 'POST' }),
        reject: (id) => makeRequest(`/rma/${id}/reject`, { method: 'POST' }),
        receive: (id, data) => makeRequest(`/rma/${id}/receive`, { method: 'POST', body: JSON.stringify(data) }),
        refund: (id) => makeRequest(`/rma/${id}/refund`, { method: 'POST' }),
        getReasons: () => makeRequest('/rma/reasons'),
        getLabels: () => makeRequest('/rma/labels'),
        getInspections: () => makeRequest('/rma/inspections'),
        getDisposals: () => makeRequest('/rma/disposals'),
    },

    // ==================== COMPLIANCE & LEGAL ====================
    compliance: {
        getGDPRRequests: () => makeRequest('/compliance/gdpr/requests'),
        getConsents: () => makeRequest('/compliance/consents'),
        getRetentionPolicies: () => makeRequest('/compliance/retention-policies'),
        getAuditTrails: () => makeRequest('/compliance/audit-trails'),
        getExportControls: () => makeRequest('/compliance/export-controls'),
        getSanctionsScreening: () => makeRequest('/compliance/sanctions-screening'),
    },

    legal: {
        getTermsVersions: () => makeRequest('/legal/terms-versions'),
        getPrivacyVersions: () => makeRequest('/legal/privacy-versions'),
        getAcceptances: () => makeRequest('/legal/acceptances'),
        getDisputes: () => makeRequest('/legal/disputes'),
    },

    // ==================== INTEGRATIONS & WEBHOOKS ====================
    integrations: {
        list: () => makeRequest('/integrations'),
        get: (id) => makeRequest(`/integrations/${id}`),
        runSync: () => makeRequest('/integrations/sync/run', { method: 'POST' }),
        getSyncStatus: () => makeRequest('/integrations/sync/status'),
        getMappings: () => makeRequest('/integrations/mappings'),
    },

    webhooks: {
        list: () => makeRequest('/webhooks'),
        get: (id) => makeRequest(`/webhooks/${id}`),
        test: (data) => makeRequest('/webhooks/test', { method: 'POST', body: JSON.stringify(data) }),
    },

    etl: {
        getImports: () => makeRequest('/etl/imports'),
        getExports: () => makeRequest('/etl/exports'),
    },

    // ==================== B2B & WHOLESALE ====================
    b2b: {
        getAccounts: () => makeRequest('/b2b/accounts'),
        getContracts: () => makeRequest('/b2b/contracts'),
        getPriceLists: () => makeRequest('/b2b/price-lists'),
        getQuotes: () => makeRequest('/b2b/quotes'),
        approveQuote: (id) => makeRequest(`/b2b/quotes/${id}/approve`, { method: 'POST' }),
        getCreditLimits: () => makeRequest('/b2b/credit-limits'),
        getPaymentTerms: () => makeRequest('/b2b/payment-terms'),
        getPurchaseOrders: () => makeRequest('/b2b/purchase-orders'),
        getApprovals: () => makeRequest('/b2b/approvals'),
        getBudgets: () => makeRequest('/b2b/budgets'),
    },

    // ==================== PLATFORM OPS ====================
    admin: {
        getFeatureFlags: () => makeRequest('/admin/feature-flags'),
        updateFeatureFlag: (id, data) => makeRequest(`/admin/feature-flags/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        getConfig: () => makeRequest('/admin/config'),
        getEnv: () => makeRequest('/admin/env'),
        getJobs: () => makeRequest('/admin/jobs'),
        retryJob: (id) => makeRequest(`/admin/jobs/${id}/retry`, { method: 'POST' }),
        getHealth: () => makeRequest('/admin/health'),
        getMetrics: () => makeRequest('/admin/metrics'),
        getRateLimits: () => makeRequest('/admin/rate-limits'),
        getMaintenance: () => makeRequest('/admin/maintenance'),
    },

    // ==================== CMS & CONTENT ====================
    cms: {
        getPages: () => makeRequest('/cms/pages'),
        getPage: (id) => makeRequest(`/cms/pages/${id}`),
        getBlocks: () => makeRequest('/cms/blocks'),
        getMenus: () => makeRequest('/cms/menus'),
        getBanners: () => makeRequest('/cms/banners'),
        getLandingPages: () => makeRequest('/cms/landing-pages'),
        getRedirects: () => makeRequest('/cms/redirects'),
        getAssets: () => makeRequest('/cms/assets'),
        getForms: () => makeRequest('/cms/forms'),
        getAnnouncements: () => makeRequest('/cms/announcements'),
    },

    // ==================== INTERNATIONALIZATION ====================
    i18n: {
        getLocales: () => makeRequest('/i18n/locales'),
        getTranslations: () => makeRequest('/i18n/translations'),
    },

    channels: {
        list: () => makeRequest('/channels'),
        get: (id) => makeRequest(`/channels/${id}`),
    },

    stores: {
        list: () => makeRequest('/stores'),
        getInventory: (id) => makeRequest(`/stores/${id}/inventory`),
        getPickup: (id) => makeRequest(`/stores/${id}/pickup`),
        getReturns: (id) => makeRequest(`/stores/${id}/returns`),
    },

    zones: {
        getPricingZones: () => makeRequest('/pricing/zones'),
        getShippingZones: () => makeRequest('/shipping/zones'),
    },

    // ==================== ENTITY DESIGNER (Advanced CRM) ====================
    entities: {
        list: () => makeRequest('/admin/entities'),
        create: (data) => makeRequest('/admin/entities', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/admin/entities/${id}`),
        update: (id, data) => makeRequest(`/admin/entities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/admin/entities/${id}`, { method: 'DELETE' }),
        clone: (id) => makeRequest(`/admin/entities/${id}/clone`, { method: 'POST' }),
        publish: (id) => makeRequest(`/admin/entities/${id}/publish`, { method: 'PUT' }),
        unpublish: (id) => makeRequest(`/admin/entities/${id}/unpublish`, { method: 'PUT' }),
        getFields: (id) => makeRequest(`/admin/entities/${id}/fields`),
        createField: (id, data) => makeRequest(`/admin/entities/${id}/fields`, { method: 'POST', body: JSON.stringify(data) }),
        updateField: (id, fieldId, data) => makeRequest(`/admin/entities/${id}/fields/${fieldId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteField: (id, fieldId) => makeRequest(`/admin/entities/${id}/fields/${fieldId}`, { method: 'DELETE' }),
        reorderFields: (id, fieldId, data) => makeRequest(`/admin/entities/${id}/fields/${fieldId}/reorder`, { method: 'PUT', body: JSON.stringify(data) }),
        getRelations: (id) => makeRequest(`/admin/entities/${id}/relations`),
        createRelation: (id, data) => makeRequest(`/admin/entities/${id}/relations`, { method: 'POST', body: JSON.stringify(data) }),
        deleteRelation: (id, relId) => makeRequest(`/admin/entities/${id}/relations/${relId}`, { method: 'DELETE' }),
        getIndexes: (id) => makeRequest(`/admin/entities/${id}/indexes`),
        createIndex: (id, data) => makeRequest(`/admin/entities/${id}/indexes`, { method: 'POST', body: JSON.stringify(data) }),
        deleteIndex: (id, indexId) => makeRequest(`/admin/entities/${id}/indexes/${indexId}`, { method: 'DELETE' }),
        getPermissions: (id) => makeRequest(`/admin/entities/${id}/permissions`),
        updatePermissions: (id, data) => makeRequest(`/admin/entities/${id}/permissions`, { method: 'PUT', body: JSON.stringify(data) }),
        getForms: (id) => makeRequest(`/admin/entities/${id}/forms`),
        createForm: (id, data) => makeRequest(`/admin/entities/${id}/forms`, { method: 'POST', body: JSON.stringify(data) }),
        updateForm: (id, formId, data) => makeRequest(`/admin/entities/${id}/forms/${formId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteForm: (id, formId) => makeRequest(`/admin/entities/${id}/forms/${formId}`, { method: 'DELETE' }),
        getViews: (id) => makeRequest(`/admin/entities/${id}/views`),
        createView: (id, data) => makeRequest(`/admin/entities/${id}/views`, { method: 'POST', body: JSON.stringify(data) }),
        updateView: (id, viewId, data) => makeRequest(`/admin/entities/${id}/views/${viewId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteView: (id, viewId) => makeRequest(`/admin/entities/${id}/views/${viewId}`, { method: 'DELETE' }),
        migrate: (id) => makeRequest(`/admin/entities/${id}/migrate`, { method: 'POST' }),
    },

    // ==================== VERSIONED RECORDS & AUDIT ====================
    records: {
        list: (entity, params) => makeRequest(`/records/${entity}?${new URLSearchParams(params)}`),
        create: (entity, data) => makeRequest(`/records/${entity}`, { method: 'POST', body: JSON.stringify(data) }),
        get: (entity, id) => makeRequest(`/records/${entity}/${id}`),
        getVersions: (entity, id) => makeRequest(`/records/${entity}/${id}/versions`),
        getVersion: (entity, id, versionId) => makeRequest(`/records/${entity}/${id}/versions/${versionId}`),
        rollback: (entity, id, data) => makeRequest(`/records/${entity}/${id}/rollback`, { method: 'POST', body: JSON.stringify(data) }),
        diff: (entity, id, versionA, versionB) => makeRequest(`/records/${entity}/${id}/diff/${versionA}/${versionB}`),
        lock: (entity, id) => makeRequest(`/records/${entity}/${id}/lock`, { method: 'PUT' }),
        unlock: (entity, id) => makeRequest(`/records/${entity}/${id}/unlock`, { method: 'PUT' }),
        clone: (entity, id) => makeRequest(`/records/${entity}/${id}/clone`, { method: 'POST' }),
        delete: (entity, id) => makeRequest(`/records/${entity}/${id}`, { method: 'DELETE' }),
        restore: (entity, id) => makeRequest(`/records/${entity}/${id}/restore`, { method: 'POST' }),
        getAudit: (entity, id) => makeRequest(`/records/${entity}/${id}/audit`),
        getApprovals: (entity, id) => makeRequest(`/records/${entity}/${id}/approvals`),
    },

    audit: {
        getLogs: (params) => makeRequest(`/audit/logs?${new URLSearchParams(params)}`),
        exportLogs: () => makeRequest('/audit/logs/export'),
        getEntityAudit: (entity) => makeRequest(`/audit/entities/${entity}`),
        getUserAudit: (id) => makeRequest(`/audit/users/${id}`),
        getChanges: () => makeRequest('/audit/changes'),
        annotate: (data) => makeRequest('/audit/annotations', { method: 'POST', body: JSON.stringify(data) }),
        getRetention: () => makeRequest('/audit/retention'),
        updateRetention: (data) => makeRequest('/audit/retention', { method: 'PUT', body: JSON.stringify(data) }),
        archive: (data) => makeRequest('/audit/archive', { method: 'POST', body: JSON.stringify(data) }),
        purge: (data) => makeRequest('/audit/purge', { method: 'POST', body: JSON.stringify(data) }),
        checkIntegrity: () => makeRequest('/audit/integrity'),
    },

    // ==================== WORKFLOW ENGINE ====================
    workflows: {
        list: () => makeRequest('/workflows'),
        create: (data) => makeRequest('/workflows', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/workflows/${id}`),
        update: (id, data) => makeRequest(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/workflows/${id}`, { method: 'DELETE' }),
        publish: (id) => makeRequest(`/workflows/${id}/publish`, { method: 'PUT' }),
        unpublish: (id) => makeRequest(`/workflows/${id}/unpublish`, { method: 'PUT' }),
        getStates: (id) => makeRequest(`/workflows/${id}/states`),
        createState: (id, data) => makeRequest(`/workflows/${id}/states`, { method: 'POST', body: JSON.stringify(data) }),
        updateState: (id, stateId, data) => makeRequest(`/workflows/${id}/states/${stateId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteState: (id, stateId) => makeRequest(`/workflows/${id}/states/${stateId}`, { method: 'DELETE' }),
        getTransitions: (id) => makeRequest(`/workflows/${id}/transitions`),
        createTransition: (id, data) => makeRequest(`/workflows/${id}/transitions`, { method: 'POST', body: JSON.stringify(data) }),
        updateTransition: (id, transitionId, data) => makeRequest(`/workflows/${id}/transitions/${transitionId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteTransition: (id, transitionId) => makeRequest(`/workflows/${id}/transitions/${transitionId}`, { method: 'DELETE' }),
        test: (id, data) => makeRequest(`/workflows/${id}/test`, { method: 'POST', body: JSON.stringify(data) }),
        validate: (id) => makeRequest(`/workflows/${id}/validate`, { method: 'POST' }),
        getHistory: (id) => makeRequest(`/workflows/${id}/history`),
        clone: (id) => makeRequest(`/workflows/${id}/clone`, { method: 'POST' }),
        triggerManual: (id, data) => makeRequest(`/workflows/${id}/trigger/manual`, { method: 'POST', body: JSON.stringify(data) }),
        triggerEvent: (id, data) => makeRequest(`/workflows/${id}/trigger/event`, { method: 'POST', body: JSON.stringify(data) }),
        triggerSchedule: (id, data) => makeRequest(`/workflows/${id}/trigger/schedule`, { method: 'POST', body: JSON.stringify(data) }),
        getRuns: (id) => makeRequest(`/workflows/${id}/runs`),
        getRun: (runId) => makeRequest(`/workflows/runs/${runId}`),
        retryRun: (runId) => makeRequest(`/workflows/runs/${runId}/retry`, { method: 'POST' }),
        cancelRun: (runId) => makeRequest(`/workflows/runs/${runId}/cancel`, { method: 'POST' }),
        getRunLogs: (runId) => makeRequest(`/workflows/runs/${runId}/logs`),
        export: (id) => makeRequest(`/workflows/${id}/export`, { method: 'POST' }),
        import: (data) => makeRequest('/workflows/import', { method: 'POST', body: JSON.stringify(data) }),
        getTemplates: () => makeRequest('/workflows/templates'),
        createTemplate: (data) => makeRequest('/workflows/templates', { method: 'POST', body: JSON.stringify(data) }),
        deleteTemplate: (id) => makeRequest(`/workflows/templates/${id}`, { method: 'DELETE' }),
        getPermissions: (id) => makeRequest(`/workflows/${id}/permissions`),
        updatePermissions: (id, data) => makeRequest(`/workflows/${id}/permissions`, { method: 'PUT', body: JSON.stringify(data) }),
        bindToEntity: (id, data) => makeRequest(`/workflows/${id}/bind/entity`, { method: 'POST', body: JSON.stringify(data) }),
        bindToEvent: (id, data) => makeRequest(`/workflows/${id}/bind/event`, { method: 'POST', body: JSON.stringify(data) }),
        getSLA: (id) => makeRequest(`/workflows/${id}/sla`),
        updateSLA: (id, data) => makeRequest(`/workflows/${id}/sla`, { method: 'PUT', body: JSON.stringify(data) }),
        getMetrics: (id) => makeRequest(`/workflows/${id}/metrics`),
        getHealth: () => makeRequest('/workflows/health'),
    },

    // ==================== BUSINESS RULES ENGINE ====================
    rules: {
        list: () => makeRequest('/rules'),
        create: (data) => makeRequest('/rules', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/rules/${id}`),
        update: (id, data) => makeRequest(`/rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/rules/${id}`, { method: 'DELETE' }),
        enable: (id) => makeRequest(`/rules/${id}/enable`, { method: 'PUT' }),
        disable: (id) => makeRequest(`/rules/${id}/disable`, { method: 'PUT' }),
        test: (id, data) => makeRequest(`/rules/${id}/test`, { method: 'POST', body: JSON.stringify(data) }),
        simulate: (id, data) => makeRequest(`/rules/${id}/simulate`, { method: 'POST', body: JSON.stringify(data) }),
        getHistory: (id) => makeRequest(`/rules/${id}/history`),
        clone: (id) => makeRequest(`/rules/${id}/clone`, { method: 'POST' }),
        getConditions: (id) => makeRequest(`/rules/${id}/conditions`),
        updateConditions: (id, data) => makeRequest(`/rules/${id}/conditions`, { method: 'PUT', body: JSON.stringify(data) }),
        getActions: (id) => makeRequest(`/rules/${id}/actions`),
        updateActions: (id, data) => makeRequest(`/rules/${id}/actions`, { method: 'PUT', body: JSON.stringify(data) }),
        getScope: (id) => makeRequest(`/rules/${id}/scope`),
        updateScope: (id, data) => makeRequest(`/rules/${id}/scope`, { method: 'PUT', body: JSON.stringify(data) }),
        getPermissions: (id) => makeRequest(`/rules/${id}/permissions`),
        updatePermissions: (id, data) => makeRequest(`/rules/${id}/permissions`, { method: 'PUT', body: JSON.stringify(data) }),
        getEngineStatus: () => makeRequest('/rules/engine/status'),
        reloadEngine: () => makeRequest('/rules/engine/reload', { method: 'POST' }),
        getEngineLogs: () => makeRequest('/rules/engine/logs'),
        detectConflicts: () => makeRequest('/rules/conflicts'),
        resolveConflict: (data) => makeRequest('/rules/resolve-conflict', { method: 'POST', body: JSON.stringify(data) }),
        getCoverage: () => makeRequest('/rules/coverage'),
        getMetrics: () => makeRequest('/rules/metrics'),
        export: () => makeRequest('/rules/export', { method: 'POST' }),
        import: (data) => makeRequest('/rules/import', { method: 'POST', body: JSON.stringify(data) }),
        getTemplates: () => makeRequest('/rules/templates'),
        createTemplate: (data) => makeRequest('/rules/templates', { method: 'POST', body: JSON.stringify(data) }),
    },

    // ==================== REPORT BUILDER & BI ====================
    reports: {
        list: () => makeRequest('/reports'),
        create: (data) => makeRequest('/reports', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/reports/${id}`),
        update: (id, data) => makeRequest(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/reports/${id}`, { method: 'DELETE' }),
        run: (id, data) => makeRequest(`/reports/${id}/run`, { method: 'POST', body: JSON.stringify(data) }),
        getResults: (id) => makeRequest(`/reports/${id}/results`),
        schedule: (id, data) => makeRequest(`/reports/${id}/schedule`, { method: 'POST', body: JSON.stringify(data) }),
        getSchedules: (id) => makeRequest(`/reports/${id}/schedules`),
        deleteSchedule: (id, scheduleId) => makeRequest(`/reports/${id}/schedules/${scheduleId}`, { method: 'DELETE' }),
        exportPDF: (id) => makeRequest(`/reports/${id}/export/pdf`, { method: 'POST' }),
        exportExcel: (id) => makeRequest(`/reports/${id}/export/excel`, { method: 'POST' }),
        exportCSV: (id) => makeRequest(`/reports/${id}/export/csv`, { method: 'POST' }),
        getPermissions: (id) => makeRequest(`/reports/${id}/permissions`),
        updatePermissions: (id, data) => makeRequest(`/reports/${id}/permissions`, { method: 'PUT', body: JSON.stringify(data) }),
        getHistory: (id) => makeRequest(`/reports/${id}/history`),
        clone: (id) => makeRequest(`/reports/${id}/clone`, { method: 'POST' }),
        getTemplates: () => makeRequest('/reports/templates'),
        createTemplate: (data) => makeRequest('/reports/templates', { method: 'POST', body: JSON.stringify(data) }),
    },

    dashboards: {
        list: () => makeRequest('/dashboards'),
        create: (data) => makeRequest('/dashboards', { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => makeRequest(`/dashboards/${id}`),
        update: (id, data) => makeRequest(`/dashboards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => makeRequest(`/dashboards/${id}`, { method: 'DELETE' }),
        addWidget: (id, data) => makeRequest(`/dashboards/${id}/widgets`, { method: 'POST', body: JSON.stringify(data) }),
        updateWidget: (id, widgetId, data) => makeRequest(`/dashboards/${id}/widgets/${widgetId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteWidget: (id, widgetId) => makeRequest(`/dashboards/${id}/widgets/${widgetId}`, { method: 'DELETE' }),
        getPermissions: (id) => makeRequest(`/dashboards/${id}/permissions`),
        updatePermissions: (id, data) => makeRequest(`/dashboards/${id}/permissions`, { method: 'PUT', body: JSON.stringify(data) }),
        clone: (id) => makeRequest(`/dashboards/${id}/clone`, { method: 'POST' }),
    },

    bi: {
        getDatasets: () => makeRequest('/bi/datasets'),
        createDataset: (data) => makeRequest('/bi/datasets', { method: 'POST', body: JSON.stringify(data) }),
        getQueries: () => makeRequest('/bi/queries'),
        saveQuery: (data) => makeRequest('/bi/queries', { method: 'POST', body: JSON.stringify(data) }),
        refreshCache: () => makeRequest('/bi/refresh'),
    },
};

export default apiService;
