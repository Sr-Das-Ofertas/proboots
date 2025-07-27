import dbData from '../../db.json';

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

// Store em memória que lê do db.json e salva via API
export class DataStore {
  private static instance: DataStore;
  private banners: Banner[];
  private categories: Category[];
  private products: Product[];

  constructor() {
    this.banners = dbData.banners;
    this.categories = dbData.categories;
    this.products = dbData.products;
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // Salvar o estado completo no db.json via API
  private async saveState() {
    try {
      const response = await fetch('/api/update-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banners: this.banners,
          categories: this.categories,
          products: this.products,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar os dados no servidor.');
      }
    } catch (error) {
      console.error('Erro ao salvar o estado:', error);
      // Opcional: Adicionar lógica para notificar o usuário do erro
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

  async addBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    const newBanner = { ...banner, id: Date.now().toString() };
    this.banners.push(newBanner);
    await this.saveState();
    return newBanner;
  }

  async updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.banners[index] = { ...this.banners[index], ...updates };
    await this.saveState();
    return this.banners[index];
  }

  async deleteBanner(id: string): Promise<boolean> {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.banners.splice(index, 1);
    await this.saveState();
    return true;
  }

  // Categories
  getCategories(): Category[] {
    this.syncProductsWithCategories();
    return this.categories;
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory = { ...category, id: Date.now().toString() };
    this.categories.push(newCategory);
    await this.saveState();
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    await this.saveState();
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    // Remover categoria dos produtos
    for (const product of this.products) {
      if (product.category === id) {
        product.category = '';
      }
    }

    this.categories.splice(index, 1);
    await this.saveState();
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

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    this.syncProductsWithCategories();
    await this.saveState();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    this.syncProductsWithCategories();
    await this.saveState();
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this.syncProductsWithCategories();
    await this.saveState();
    return true;
  }
}
