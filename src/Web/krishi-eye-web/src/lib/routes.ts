export const ROUTES = {
    home: "/",
    product: (id: string | number) => `/products/detail/${id}`,
    products: {
        root: "/products",
        category: (slug: string) => `/products/${slug}`,
        subcategory: (categorySlug: string, subcategorySlug: string) => `/products/${categorySlug}/${subcategorySlug}`,
    },
    transporters: {
        root: "/transporters",
        type: (type: string) => `/transporters/${type}`,
    },
    consultants: {
        root: "/consultants",
        category: (category: string) => `/consultants/${category}`,
        subcategory: (category: string, subcategory: string) => `/consultants/${category}/${subcategory}`,
    },
    cart: "/cart",
    checkout: "/checkout",
    trackOrder: "/track-order",
    offers: "/offers",
    search: "/search",
};
