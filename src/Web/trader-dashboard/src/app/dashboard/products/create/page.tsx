import { ProductForm } from "@/components/catalog/ProductForm";
import { Separator } from "@/components/ui/separator";

export default function CreateProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                <p className="text-gray-500">Create a new product listing for your catalog.</p>
            </div>
            <Separator />
            <div className="max-w-3xl">
                <ProductForm />
            </div>
        </div>
    );
}
