import { secureDB } from '../database-secure'
import { InputSanitizer } from '../security'
import { Product, CreateProductRequest, UpdateProductRequest } from '../../types/api'
import { APIError, ErrorType } from '../error-handler'

export class ProductService {
  // Get product by ID
  static async getProductById(productId: string, userId: string): Promise<Product | null> {
    try {
      if (!productId) {
        throw new APIError('Product ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const product = await secureDB.getProductById(productId, userId)
      return product
    } catch (error) {
      console.error('Get product by ID error:', error)
      throw error
    }
  }

  // Create new product
  static async createProduct(userId: string, productData: CreateProductRequest): Promise<Product> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Validate required fields
      if (!productData.name || !productData.price) {
        throw new APIError('Product name and price are required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Validate price
      if (productData.price <= 0) {
        throw new APIError('Price must be greater than 0', ErrorType.VALIDATION_ERROR, 400)
      }

      // Validate stock if provided
      if (productData.stock !== undefined && productData.stock < 0) {
        throw new APIError('Stock cannot be negative', ErrorType.VALIDATION_ERROR, 400)
      }

      // Sanitize product data
      const sanitizedData = {
        name: InputSanitizer.sanitizeString(productData.name, 200),
        description: productData.description ? InputSanitizer.sanitizeHtml(productData.description) : undefined,
        price: Number(productData.price),
        stock: productData.stock ? Number(productData.stock) : undefined,
        category: productData.category ? InputSanitizer.sanitizeString(productData.category, 100) : undefined,
        material: productData.material ? InputSanitizer.sanitizeString(productData.material, 200) : undefined,
        dimensions: productData.dimensions ? InputSanitizer.sanitizeString(productData.dimensions, 200) : undefined,
        weight: productData.weight ? Number(productData.weight) : undefined,
        sku: productData.sku ? InputSanitizer.sanitizeString(productData.sku, 100) : undefined,
        tags: productData.tags ? productData.tags.map(tag => InputSanitizer.sanitizeString(tag, 50)) : undefined,
        images: productData.images ? productData.images.map(img => InputSanitizer.sanitizeString(img, 500)) : undefined
      }

      const product = await secureDB.createProduct(sanitizedData, userId)
      return product
    } catch (error) {
      console.error('Create product error:', error)
      throw error
    }
  }

  // Update product
  static async updateProduct(productId: string, userId: string, updateData: UpdateProductRequest): Promise<Product> {
    try {
      if (!productId) {
        throw new APIError('Product ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if product exists and belongs to user
      const existingProduct = await this.getProductById(productId, userId)
      if (!existingProduct) {
        throw new APIError('Product not found', ErrorType.NOT_FOUND_ERROR, 404)
      }

      // Validate price if provided
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new APIError('Price must be greater than 0', ErrorType.VALIDATION_ERROR, 400)
      }

      // Validate stock if provided
      if (updateData.stock !== undefined && updateData.stock < 0) {
        throw new APIError('Stock cannot be negative', ErrorType.VALIDATION_ERROR, 400)
      }

      // Sanitize update data
      const sanitizedData: Partial<Product> = {}
      
      if (updateData.name) {
        sanitizedData.name = InputSanitizer.sanitizeString(updateData.name, 200)
      }
      if (updateData.description !== undefined) {
        sanitizedData.description = updateData.description ? InputSanitizer.sanitizeHtml(updateData.description) : undefined
      }
      if (updateData.price !== undefined) {
        sanitizedData.price = Number(updateData.price)
      }
      if (updateData.stock !== undefined) {
        sanitizedData.stock = Number(updateData.stock)
      }
      if (updateData.category !== undefined) {
        sanitizedData.category = updateData.category ? InputSanitizer.sanitizeString(updateData.category, 100) : undefined
      }
      if (updateData.material !== undefined) {
        sanitizedData.material = updateData.material ? InputSanitizer.sanitizeString(updateData.material, 200) : undefined
      }
      if (updateData.dimensions !== undefined) {
        sanitizedData.dimensions = updateData.dimensions ? InputSanitizer.sanitizeString(updateData.dimensions, 200) : undefined
      }
      if (updateData.weight !== undefined) {
        sanitizedData.weight = updateData.weight ? Number(updateData.weight) : undefined
      }
      if (updateData.sku !== undefined) {
        sanitizedData.sku = updateData.sku ? InputSanitizer.sanitizeString(updateData.sku, 100) : undefined
      }
      if (updateData.tags !== undefined) {
        sanitizedData.tags = updateData.tags ? updateData.tags.map(tag => InputSanitizer.sanitizeString(tag, 50)) : undefined
      }
      if (updateData.images !== undefined) {
        sanitizedData.images = updateData.images ? updateData.images.map(img => InputSanitizer.sanitizeString(img, 500)) : undefined
      }
      if (updateData.isActive !== undefined) {
        sanitizedData.isActive = Boolean(updateData.isActive)
      }

      sanitizedData.updatedAt = new Date().toISOString()

      const updatedProduct = await secureDB.updateProduct(productId, userId, sanitizedData)
      return updatedProduct
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  }

  // Delete product
  static async deleteProduct(productId: string, userId: string): Promise<boolean> {
    try {
      if (!productId) {
        throw new APIError('Product ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if product exists and belongs to user
      const existingProduct = await this.getProductById(productId, userId)
      if (!existingProduct) {
        throw new APIError('Product not found', ErrorType.NOT_FOUND_ERROR, 404)
      }

      const success = await secureDB.deleteProduct(productId, userId)
      return success
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    }
  }

  // Get products with pagination and filters
  static async getProducts(
    userId: string, 
    page: number = 1, 
    limit: number = 20, 
    filters?: {
      category?: string
      status?: string
      search?: string
    }
  ): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const offset = (page - 1) * limit
      const products = await secureDB.getProducts(userId, limit, offset, filters)
      const total = await secureDB.getProductsCount(userId, filters)

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Get products error:', error)
      throw error
    }
  }

  // Get product analytics
  static async getProductAnalytics(productId: string, userId: string): Promise<any> {
    try {
      if (!productId) {
        throw new APIError('Product ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if product exists and belongs to user
      const existingProduct = await this.getProductById(productId, userId)
      if (!existingProduct) {
        throw new APIError('Product not found', ErrorType.NOT_FOUND_ERROR, 404)
      }

      const analytics = await secureDB.getProductAnalytics(productId, userId)
      return analytics
    } catch (error) {
      console.error('Get product analytics error:', error)
      throw error
    }
  }

  // Bulk update products
  static async bulkUpdateProducts(
    userId: string, 
    updates: Array<{ id: string; data: UpdateProductRequest }>
  ): Promise<Product[]> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new APIError('Updates array is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const results: Product[] = []
      
      for (const update of updates) {
        try {
          const updatedProduct = await this.updateProduct(update.id, userId, update.data)
          results.push(updatedProduct)
        } catch (error) {
          console.error(`Bulk update error for product ${update.id}:`, error)
          // Continue with other updates
        }
      }

      return results
    } catch (error) {
      console.error('Bulk update products error:', error)
      throw error
    }
  }

  // Get product categories
  static async getProductCategories(userId: string): Promise<string[]> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const categories = await secureDB.getProductCategories(userId)
      return categories
    } catch (error) {
      console.error('Get product categories error:', error)
      throw error
    }
  }

  // Search products
  static async searchProducts(
    userId: string,
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      if (!query || query.trim().length === 0) {
        throw new APIError('Search query is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const sanitizedQuery = InputSanitizer.sanitizeString(query, 200)
      const offset = (page - 1) * limit
      
      const products = await secureDB.searchProducts(userId, sanitizedQuery, limit, offset)
      const total = await secureDB.searchProductsCount(userId, sanitizedQuery)

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Search products error:', error)
      throw error
    }
  }
}
