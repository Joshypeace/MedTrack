// types.ts

// Weekly sales data
export type WeeklySale = {
  createdAt: Date;
  _sum: {
    totalPrice: number | null;
  };
};

// Stock distribution grouped by category
export type StockDistributionItem = {
  category: string;
  _sum: {
    quantity: number | null;
  };
};

// Top drug grouping by itemId
export type TopDrugGroup = {
  itemId: string;
  _sum: {
    quantity: number | null;
    totalPrice: number | null
  };
};

 export type InventoryItem = {
  id: string
  name: string
  batch: string | null
  price: number
  quantity: number
  expiryDate: Date | null
  category: string
}