"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Product } from "@/types/catalog"
import { CategoryRequestDialog } from "./CategoryRequestDialog"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogService } from "@/services/catalogService"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    sku: z.string().min(2, { message: "SKU is required." }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Price must be positive." }),
    stock: z.number().min(0, { message: "Stock cannot be negative." }),
    unitId: z.string().min(1, { message: "Please select a unit." }),
    categoryId: z.string().min(1, { message: "Please select a category." }),
    status: z.boolean().default(false), // true = Published, false = Draft
    imageUrl: z.string().url().optional().or(z.literal("")),
})

interface ProductFormProps {
    initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    // Fetch Units
    const { data: units } = useQuery({
        queryKey: ['units'],
        queryFn: catalogService.getUnits,
    });

    // Fetch Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: catalogService.getCategories,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            sku: initialData.sku,
            description: "", // Mock
            price: initialData.price,
            stock: initialData.stock,
            unitId: initialData.unitId,
            categoryId: initialData.categoryId,
            status: initialData.status === "Published",
            imageUrl: initialData.imageUrl || "",
        } : {
            name: "",
            sku: "",
            description: "",
            price: 0,
            stock: 0,
            unitId: "",
            categoryId: "",
            status: false,
            imageUrl: "",
        },
    })

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            const productData = {
                ...values,
                status: values.status ? "Published" : "Draft"
            } as any; // Type cast for now to match backend expectations roughly

            if (initialData) {
                return catalogService.updateProduct(initialData.id, productData);
            } else {
                return catalogService.createProduct(productData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            router.push("/dashboard/products");
            router.refresh();
        },
        onError: (error) => {
            console.error("Failed to save product:", error);
            // TODO: Show toast error
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Fresh Tomatoes" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU / Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. TOM-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe your product..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pricing & Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (৳)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a unit" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {units?.map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Can't find your unit? Create one in Settings.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Classification */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Classification</h3>
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CategoryRequestDialog />
                    </div>

                    {/* Media & Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Media & Status</h3>
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Publish Product</FormLabel>
                                        <FormDescription>
                                            Make this product visible to buyers immediately.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
