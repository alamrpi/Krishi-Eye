export type ProductStatus = 'Draft' | 'Published';

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    unitId: string; // Maps to Custom or Global Unit
    categoryId: string;
    status: ProductStatus;
    imageUrl?: string;
}

export interface MeasurementUnit {
    id: string;
    name: string; // e.g., "Sack"
    symbol: string; // e.g., "50kg"
    isGlobal: boolean;
}
