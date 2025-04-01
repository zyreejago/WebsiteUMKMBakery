// Product Types
export type ProductCategory = "Kue Kering" | "Kue Basah" | "Kue Loyang"

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: ProductCategory
  dailyLimit: number
}

// Mock Products Data
export const products: Product[] = [
  // Kue Kering
  {
    id: 1,
    name: "Kaasstengels",
    price: 115000,
    description: "Kue kering keju yang renyah dan gurih, cocok untuk camilan atau hidangan hari raya.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 2,
    name: "Nastar",
    price: 115000,
    description: "Kue kering dengan isian selai nanas yang manis dan lezat.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 3,
    name: "Choco Chips",
    price: 90000,
    description: "Kue kering dengan taburan coklat chips yang manis dan renyah.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 4,
    name: "Palm Cheese",
    price: 90000,
    description: "Kue kering berbentuk daun dengan rasa keju yang gurih.",
    image: "https://images.unsplash.com/photo-1590080876206-c48b4c9bcbec?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 5,
    name: "Putri Salju",
    price: 90000,
    description: "Kue kering lembut dengan taburan gula halus yang manis.",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 6,
    name: "Kue Kacang",
    price: 50000,
    description: "Kue kering berbahan dasar kacang yang renyah dan gurih.",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },
  {
    id: 7,
    name: "Sagu Keju",
    price: 100000,
    description: "Kue sagu dengan campuran keju yang lumer di mulut.",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Kering",
    dailyLimit: 50,
  },

  // Kue Basah
  {
    id: 8,
    name: "Soes",
    price: 3500,
    description: "Kue sus dengan kulit yang renyah dan isian vla yang lembut.",
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 9,
    name: "Lemper",
    price: 4000,
    description: "Kue dari ketan dengan isian ayam yang gurih.",
    image: "https://images.unsplash.com/photo-1625535163131-9d1fc30fe9e6?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 10,
    name: "Risol Mayo",
    price: 4000,
    description: "Risol dengan isian mayonaise, telur, dan daging asap yang lezat.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 11,
    name: "Risol Ragout Ayam",
    price: 4000,
    description: "Risol dengan isian ragout ayam yang gurih dan lezat.",
    image: "https://images.unsplash.com/photo-1619221882266-0a6833929c60?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 12,
    name: "Kroket",
    price: 4000,
    description: "Kroket dengan isian kentang dan daging yang gurih.",
    image: "https://images.unsplash.com/photo-1599599810778-cdc4356519c2?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 13,
    name: "Kue Lumpur",
    price: 3500,
    description: "Kue tradisional berbahan dasar kentang dengan topping kismis.",
    image: "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 14,
    name: "Puding Black Forest",
    price: 5000,
    description: "Puding coklat dengan lapisan krim dan taburan coklat serut.",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 15,
    name: "Puding Mie",
    price: 6000,
    description: "Puding unik berbentuk mie dengan saus spesial.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },
  {
    id: 16,
    name: "Bolu Kukus",
    price: 2500,
    description: "Bolu kukus yang lembut dan manis dengan berbagai varian rasa.",
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Basah",
    dailyLimit: 250,
  },

  // Kue Loyang
  {
    id: 17,
    name: "Marmer Cake",
    price: 105000,
    description: "Kue dengan motif marmer yang lembut dan harum.",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 18,
    name: "Balapis Manado",
    price: 110000,
    description: "Kue lapis khas Manado dengan cita rasa yang khas.",
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 19,
    name: "Puding Crackers",
    price: 100000,
    description: "Puding dengan lapisan crackers yang renyah dan lezat.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 20,
    name: "Chiffon Cake Pandan",
    price: 70000,
    description: "Kue chiffon dengan aroma pandan yang lembut dan ringan.",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 21,
    name: "Lapis Legit Gulung",
    price: 75000,
    description: "Kue lapis legit yang digulung dengan cita rasa yang kaya.",
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 22,
    name: "Brownies Panggang",
    price: 65000,
    description: "Brownies panggang yang padat dan kaya akan rasa coklat.",
    image: "https://images.unsplash.com/photo-1589375025852-a66cca98a800?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 23,
    name: "Brownies Kukus",
    price: 75000,
    description: "Brownies kukus yang lembut dan moist dengan rasa coklat yang kaya.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 24,
    name: "Insert Tiramisu Brownies",
    price: 110000,
    description: "Brownies dengan lapisan tiramisu yang lezat dan mewah.",
    image: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 25,
    name: "Black Forest Puding",
    price: 125000,
    description: "Puding black forest dengan lapisan krim dan buah ceri.",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
  {
    id: 26,
    name: "Puding Buah",
    price: 125000,
    description: "Puding dengan berbagai macam buah segar di dalamnya.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=300&h=300&auto=format&fit=crop",
    category: "Kue Loyang",
    dailyLimit: 25,
  },
]

// User Types
export interface User {
  id: number
  name: string
  email: string
  password: string
  role: "admin" | "customer"
  address?: string
  phone?: string
}

// Mock Users Data
export const users: User[] = [
  {
    id: 1,
    name: "Admin",
    email: "admin@bakeryumkm.com",
    password: "admin123",
    role: "admin",
    phone: "081234567890",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "customer",
    address: "Jl. Contoh No. 123, Jakarta",
    phone: "081234567891",
  },
]

// Order Types
export type OrderStatus = "pending" | "waiting_payment" | "processing" | "completed" | "cancelled"

export interface OrderItem {
  productId: number
  quantity: number
  price: number
}

export interface Order {
  id: number
  userId: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  deliveryDate: string
  createdAt: string
  paymentProof?: string
  address: string
  notes?: string
}

// Mock Orders Data
export const orders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      { productId: 1, quantity: 2, price: 115000 },
      { productId: 8, quantity: 5, price: 3500 },
    ],
    total: 247500,
    status: "completed",
    deliveryDate: "2023-06-15",
    createdAt: "2023-06-10",
    paymentProof: "https://images.unsplash.com/photo-1616077168712-fc6c788c2efd?q=80&w=300&h=200&auto=format&fit=crop",
    address: "Jl. Contoh No. 123, Jakarta",
  },
  {
    id: 2,
    userId: 2,
    items: [{ productId: 17, quantity: 1, price: 105000 }],
    total: 105000,
    status: "processing",
    deliveryDate: "2023-06-20",
    createdAt: "2023-06-18",
    paymentProof: "https://images.unsplash.com/photo-1616077168712-fc6c788c2efd?q=80&w=300&h=200&auto=format&fit=crop",
    address: "Jl. Contoh No. 123, Jakarta",
  },
]

// QRIS Data
export const qrisData = {
  image: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?q=80&w=400&h=400&auto=format&fit=crop",
  name: "Bakery UMKM",
  number: "1234567890",
}

