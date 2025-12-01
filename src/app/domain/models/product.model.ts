export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    tags?: string[];
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    isNew?: boolean;
}
