import { ProductForm } from "@/components/catalog/ProductForm";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/catalog";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock fetch
    const product: Product = {
        id,
        name: "Fresh Potatoes",
        sku: "POT-001",
        price: 25,
        stock: 500,
        unitId: "1",
        categoryId: "veg",
        status: "Published",
        imageUrl: ""
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-gray-500">Update product details and inventory.</p>
            </div>
            <Separator />
            <div className="max-w-3xl">
                <ProductForm initialData={product} />
            </div>
        </div>
    );
}
