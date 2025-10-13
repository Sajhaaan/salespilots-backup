'use client'

import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Upload,
  Image as ImageIcon,
  Package,
  Tag,
  IndianRupee,
  Camera,
  X,
  Save,
  AlertCircle,
  FileText
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback, memo } from 'react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  sku: string
  status: 'active' | 'inactive' | 'out_of_stock'
  tags: string[]
  weight?: number
  dimensions?: string
  material?: string
  colors?: string[]
  sizes?: string[]
  created_at: string
  updated_at: string
}

const categories = [
  'Fashion & Apparel',
  'Electronics', 
  'Home & Decor',
  'Beauty & Cosmetics',
  'Food & Beverages',
  'Jewelry & Accessories',
  'Books & Education',
  'Sports & Fitness',
  'Handmade & Crafts',
  'Other'
]

// Separate ProductModal component to prevent re-renders
const ProductModal = memo(({ 
  isEdit = false,
  formData,
  setFormData,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  setSelectedProduct,
  handleSubmit,
  handleImageUpload,
  removeImage
}: {
  isEdit?: boolean
  formData: any
  setFormData: (fn: (prev: any) => any) => void
  showAddModal: boolean
  setShowAddModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  setSelectedProduct: (product: any) => void
  handleSubmit: (e: React.FormEvent) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}) => {
  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, name: value }))
  }, [setFormData])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, description: value }))
  }, [setFormData])

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setFormData(prev => ({ ...prev, price: value }))
  }, [setFormData])

  const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setFormData(prev => ({ ...prev, stock: value }))
  }, [setFormData])

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, category: value }))
  }, [setFormData])

  const handleSkuChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, sku: value }))
  }, [setFormData])

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, status: value }))
  }, [setFormData])

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, tags: value }))
  }, [setFormData])

  const handleColorsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, colors: value }))
  }, [setFormData])

  const handleSizesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, sizes: value }))
  }, [setFormData])

  const handleMaterialChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, material: value }))
  }, [setFormData])

  const handleClose = useCallback(() => {
    isEdit ? setShowEditModal(false) : setShowAddModal(false)
    setSelectedProduct(null)
  }, [isEdit, setShowEditModal, setShowAddModal, setSelectedProduct])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative glass-card border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={handleDescriptionChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 h-24 resize-none"
                  placeholder="Describe your product..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={handlePriceChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={handleStockChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={handleSkuChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                >
                  <option value="active" className="bg-gray-800">Active</option>
                  <option value="inactive" className="bg-gray-800">Inactive</option>
                  <option value="out_of_stock" className="bg-gray-800">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="summer, trending, bestseller"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors || ''}
                  onChange={handleColorsChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="red, blue, green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes || ''}
                  onChange={handleSizesChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material || ''}
                  onChange={handleMaterialChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 product-form-input"
                  placeholder="Cotton, Polyester, etc."
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Camera className="w-8 h-8 text-white/60" />
                    <span className="text-white/60">Click to upload images</span>
                    <span className="text-xs text-white/40">PNG, JPG, JPEG up to 5MB each</span>
                  </label>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Update Product' : 'Add Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default function ProductsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    sku: '',
    status: 'active',
    tags: [],
    images: [],
    colors: [],
    sizes: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products', { credentials: 'include' })
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleImageUpload = async (files: FileList) => {
    const uploadedImages: string[] = []
    
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        // Create a data URL for preview (in real app, upload to cloud storage)
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            uploadedImages.push(e.target.result as string)
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), e.target?.result as string]
            }))
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      sku: '',
      status: 'active',
      tags: [],
      images: [],
      colors: [],
      sizes: []
    })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const url = selectedProduct ? `/api/products/${selectedProduct.id}` : '/api/products'
      const method = selectedProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          sku: formData.sku || `SKU-${Date.now()}`,
          tags: typeof formData.tags === 'string' 
            ? (formData.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
            : formData.tags,
          colors: typeof formData.colors === 'string'
            ? (formData.colors as string).split(',').map((c: string) => c.trim()).filter(Boolean)
            : formData.colors,
          sizes: typeof formData.sizes === 'string'
            ? (formData.sizes as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : formData.sizes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(selectedProduct ? 'Product updated successfully' : 'Product added successfully')
        setShowAddModal(false)
        setShowEditModal(false)
        setSelectedProduct(null)
        resetForm()
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to save product')
      }
    } catch (error) {
      toast.error('Failed to save product')
    }
  }, [formData, selectedProduct, setShowAddModal, setShowEditModal, setSelectedProduct, resetForm, fetchProducts])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      ...product,
      tags: product.tags || [],
      colors: product.colors || [],
      sizes: product.sizes || []
    })
    setShowEditModal(true)
  }



  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="premium-card">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products Management</h1>
          <p className="text-white/70">Manage your product catalog and inventory</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button className="btn-secondary-premium px-4 py-2 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/products/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `products_export_${new Date().toISOString().split('T')[0]}.json`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                        toast.success('Products exported as JSON successfully!')
                      } else {
                        toast.error('Failed to export products')
                      }
                    } catch (error) {
                      toast.error('Failed to export products')
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </button>
                
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/products/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const data = await response.json()
                        const { exportProductsAsCSV } = await import('@/lib/csv-export')
                        exportProductsAsCSV(data.data.products, `products_report_${new Date().toISOString().split('T')[0]}.csv`)
                      } else {
                        toast.error('Failed to export products')
                      }
                    } catch (error) {
                      toast.error('Failed to export products')
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                >
                           <FileText className="w-4 h-4 mr-2" />
         Export as CSV
                </button>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-premium px-4 py-2 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="premium-card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200 product-form-input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200 product-form-input"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200 product-form-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-white/60 mb-6">
              {products.length === 0 
                ? "Start by adding your first product to build your catalog"
                : "Try adjusting your search or filters"
              }
            </p>
            {products.length === 0 && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-premium px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <div key={product.id} className="premium-card group hover:scale-105 transition-all duration-300">
              {/* Product Image */}
              <div className="relative h-48 mb-4 bg-white/5 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/40" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-medium rounded-full
                    ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                      product.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' : 
                      'bg-red-500/20 text-red-400'}
                  `}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">₹{product.price.toLocaleString()}</p>
                    <p className="text-white/60 text-sm">{product.stock} in stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{product.category}</p>
                    <p className="text-white/60 text-xs">SKU: {product.sku}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductModal 
          isEdit={false}
          formData={formData}
          setFormData={setFormData}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          setSelectedProduct={setSelectedProduct}
          handleSubmit={handleSubmit}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
      )}
      {showEditModal && (
        <ProductModal 
          isEdit={true}
          formData={formData}
          setFormData={setFormData}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          setSelectedProduct={setSelectedProduct}
          handleSubmit={handleSubmit}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
      )}
    </div>
  )
}
