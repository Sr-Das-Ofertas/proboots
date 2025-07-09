export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  coverImage: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  forYou: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productIds: string[];
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
}

// Dados iniciais
export const initialBanners: Banner[] = [
  {
    id: "1",
    title: "Chuteiras de Campo",
    image: "https://ext.same-assets.com/4023899342/1707337737.jpeg",
    active: true
  },
  {
    id: "2",
    title: "Society Collection",
    image: "https://ext.same-assets.com/4023899342/1504921622.jpeg",
    active: true
  },
  {
    id: "3",
    title: "Futsal Line",
    image: "https://ext.same-assets.com/4023899342/929125204.jpeg",
    active: true
  }
];

export const initialCategories: Category[] = [
  {
    id: "campo",
    name: "Campo",
    image: "/banner3.png",
    description: "Chuteiras para futebol de campo",
    productIds: ["1", "2"]
  },
  {
    id: "society",
    name: "Society",
    image: "/banner5.png",
    description: "Chuteiras para futebol society",
    productIds: ["3"]
  },
  {
    id: "futsal",
    name: "Futsal",
    image: "/banner1.png",
    description: "Chuteiras para futsal",
    productIds: []
  },
  {
    id: "brindes",
    name: "Chuteira + Brindes",
    image: "/banner4.png",
    description: "Combos especiais de chuteiras com brindes",
    productIds: []
  },
  {
    id: "acessorios",
    name: "Acessórios",
    image: "/banner2.png",
    description: "Luvas, meiões, bolsas e mais",
    productIds: []
  },
  {
    id: "trava-mista",
    name: "Trava Mista",
    image: "/banner6.png",
    description: "Chuteiras para campos macios ou úmidos",
    productIds: []
  }
];

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Nike Mercurial Air Zoom Superfly X Elite FG",
    price: 54999,
    originalPrice: 179900,
    discount: 69,
    description: "Chuteira de campo profissional com tecnologia Nike Air Zoom",
    images: [
      "https://ext.same-assets.com/4023899342/3098715259.jpeg",
      "https://ext.same-assets.com/4023899342/96348537.jpeg"
    ],
    coverImage: "https://ext.same-assets.com/4023899342/3098715259.jpeg",
    category: "campo",
    inStock: true,
    featured: true,
    bestSeller: true,
    forYou: false
  },
  {
    id: "2",
    name: "Nike Phantom GX II Elite FG",
    price: 48399,
    originalPrice: 179900,
    discount: 69,
    description: "Chuteira elite para controle e precisão máxima",
    images: [
      "https://ext.same-assets.com/4023899342/2762738962.jpeg",
      "https://ext.same-assets.com/4023899342/3966987016.jpeg"
    ],
    coverImage: "https://ext.same-assets.com/4023899342/2762738962.jpeg",
    category: "campo",
    inStock: true,
    featured: true,
    bestSeller: true,
    forYou: true
  },
  {
    id: "3",
    name: "Joma TopFlex Rebound",
    price: 43119,
    originalPrice: 9799,
    discount: 51,
    description: "Chuteira com excelente custo-benefício",
    images: [
      "https://ext.same-assets.com/4023899342/229197584.jpeg"
    ],
    coverImage: "https://ext.same-assets.com/4023899342/229197584.jpeg",
    category: "society",
    inStock: true,
    featured: false,
    bestSeller: false,
    forYou: true
  }
];

// Store em memória (será substituído por banco de dados real)
export class DataStore {
  private static instance: DataStore;
  private banners: Banner[] = [...initialBanners];
  private categories: Category[] = [...initialCategories];
  private products: Product[] = [...initialProducts];

  constructor() {
    this.loadFromStorage();
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // Carregar dados do localStorage
  private loadFromStorage() {
    try {
      const savedBanners = localStorage.getItem('proboots-banners');
      const savedCategories = localStorage.getItem('proboots-categories');
      const savedProducts = localStorage.getItem('proboots-products');

      if (savedBanners) {
        this.banners = JSON.parse(savedBanners);
      }
      if (savedCategories) {
        this.categories = JSON.parse(savedCategories);
      }
      if (savedProducts) {
        this.products = JSON.parse(savedProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }

  // Salvar dados no localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('proboots-banners', JSON.stringify(this.banners));
      localStorage.setItem('proboots-categories', JSON.stringify(this.categories));
      localStorage.setItem('proboots-products', JSON.stringify(this.products));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  // Método para sincronizar produtos com categorias
  private syncProductsWithCategories() {
    for (const category of this.categories) {
      category.productIds = this.products
        .filter(product => product.category === category.id)
        .map(product => product.id);
    }
  }

  // Banners
  getBanners(): Banner[] {
    return this.banners.filter(b => b.active);
  }

  getAllBanners(): Banner[] {
    return this.banners;
  }

  addBanner(banner: Omit<Banner, 'id'>): Banner {
    const newBanner = { ...banner, id: Date.now().toString() };
    this.banners.push(newBanner);
    this.saveToStorage();
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<Banner>): Banner | null {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.banners[index] = { ...this.banners[index], ...updates };
    this.saveToStorage();
    return this.banners[index];
  }

  deleteBanner(id: string): boolean {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.banners.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Categories
  getCategories(): Category[] {
    this.syncProductsWithCategories();
    return this.categories;
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory = { ...category, id: Date.now().toString() };
    this.categories.push(newCategory);
    this.saveToStorage();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    this.saveToStorage();
    return this.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    // Remover categoria dos produtos
    for (const product of this.products) {
      if (product.category === id) {
        product.category = '';
      }
    }

    this.categories.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getBestSellers(): Product[] {
    return this.products.filter(p => p.bestSeller);
  }

  getForYouProducts(): Product[] {
    return this.products.filter(p => p.forYou);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter(p => p.category === categoryId);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    this.syncProductsWithCategories();
    this.saveToStorage();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    this.syncProductsWithCategories();
    this.saveToStorage();
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this.syncProductsWithCategories();
    this.saveToStorage();
    return true;
  }
}
