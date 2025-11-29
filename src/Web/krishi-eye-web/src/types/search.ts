// Search types and interfaces

export type TabType = "products" | "transporters" | "consultants";

export interface SearchParams {
    q?: string;
    type?: TabType;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    verified?: boolean;
    transport?: boolean;
    vehicleType?: string;
    location?: string;
    serviceType?: string;
    consultantType?: "Individual" | "Agency";
    experience?: string;
    sort?: SortOption;
    view?: "grid" | "list";
}

export type SortOption =
    | "price-low"
    | "price-high"
    | "rating"
    | "newest";

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface ProductFilters {
    categories: FilterOption[];
    priceRange: PriceRange;
    ratings: FilterOption[];
    verifiedOnly: boolean;
    transportAvailable: boolean;
}

export interface TransporterFilters {
    vehicleTypes: FilterOption[];
    locations: FilterOption[];
    ratings: FilterOption[];
    verifiedOnly: boolean;
}

export interface ConsultantFilters {
    serviceTypes: FilterOption[];
    consultantTypes: FilterOption[];
    ratings: FilterOption[];
    experienceLevels: FilterOption[];
    verifiedOnly: boolean;
}
