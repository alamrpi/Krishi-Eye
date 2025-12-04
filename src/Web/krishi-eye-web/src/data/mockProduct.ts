export const mockProduct = {
    id: 1,
    title: "Premium Miniket Rice (50kg Sack)",
    price: 3200,
    regularPrice: 3500,
    unit: "Sack",
    rating: 4.8,
    reviewCount: 124,
    description: "High-quality Miniket rice sourced directly from the best farms in Dinajpur. Known for its long, slender grains and aromatic flavor when cooked. Perfect for daily consumption and special occasions.",
    specifications: [
        { label: "Variety", value: "Miniket" },
        { label: "Weight", value: "50 kg" },
        { label: "Origin", value: "Dinajpur, Bangladesh" },
        { label: "Harvest Year", value: "2024" },
        { label: "Texture", value: "Fine & Slender" },
        { label: "Cooking Time", value: "15-20 minutes" },
    ],
    images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample YouTube video
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop",
        "https://youtu.be/jNQXAC9IVRw", // Another sample video (short URL format)
        "https://images.unsplash.com/photo-1536304993881-ff000997bc50?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596568359553-a56de6970068?q=80&w=1000&auto=format&fit=crop",
    ],
    seller: {
        id: 101,
        name: "Mayer Doa Enterprise",
        isVerified: true,
        rating: 4.9,
        location: "Dinajpur Sadar",
    },
    transportIncluded: true,
    stock: 50,
    reviews: [
        {
            id: 1,
            user: "Rahim Uddin",
            rating: 5,
            date: "2024-03-15",
            comment: "Excellent quality rice. Very clean and tastes great.",
        },
        {
            id: 2,
            user: "Karim Mia",
            rating: 4,
            date: "2024-03-10",
            comment: "Good product, but delivery took 2 days longer than expected.",
        },
    ],
};
