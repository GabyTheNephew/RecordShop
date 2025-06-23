export interface Table {
    id: number;
    controlNumber: string;
    albumName: string;
    price: number;
    productType: 'CD' | 'Vinyl';
    stockQuantity: number;
    soldQuantity: number;
    image?: string;
}