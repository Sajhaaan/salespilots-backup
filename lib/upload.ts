import { supabase } from './supabase'
import sharp from 'sharp'

export interface UploadResult {
  url: string
  filename: string
  size: number
  type: string
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  private static readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain']

  static async uploadImage(
    file: File,
    userId: string,
    purpose: 'payment_screenshot' | 'product_image' | 'avatar' = 'product_image'
  ): Promise<UploadResult> {
    // Validate file
    this.validateImageFile(file)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${userId}/${purpose}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

    // Process image (resize and optimize)
    const processedBuffer = await this.processImage(file, purpose)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, processedBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename)

    // Save to database
    await supabase
      .from('file_uploads')
      .insert([{
        user_id: userId,
        filename,
        original_name: file.name,
        file_type: file.type,
        file_size: processedBuffer.length,
        url: publicUrl,
        purpose
      }])

    return {
      url: publicUrl,
      filename,
      size: processedBuffer.length,
      type: file.type
    }
  }

  static async uploadDocument(
    file: File,
    userId: string,
    purpose: 'document' = 'document'
  ): Promise<UploadResult> {
    // Validate file
    this.validateDocumentFile(file)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${userId}/${purpose}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

    // Convert to buffer
    const buffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename)

    // Save to database
    await supabase
      .from('file_uploads')
      .insert([{
        user_id: userId,
        filename,
        original_name: file.name,
        file_type: file.type,
        file_size: buffer.byteLength,
        url: publicUrl,
        purpose
      }])

    return {
      url: publicUrl,
      filename,
      size: buffer.byteLength,
      type: file.type
    }
  }

  private static validateImageFile(file: File) {
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum size is 10MB.')
    }
  }

  private static validateDocumentFile(file: File) {
    if (!this.ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF and text files are allowed.')
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum size is 10MB.')
    }
  }

  private static async processImage(
    file: File,
    purpose: string
  ): Promise<Buffer> {
    const buffer = Buffer.from(await file.arrayBuffer())

    let maxWidth = 1920
    let maxHeight = 1080
    let quality = 85

    // Adjust processing based on purpose
    switch (purpose) {
      case 'avatar':
        maxWidth = 400
        maxHeight = 400
        quality = 90
        break
      case 'product_image':
        maxWidth = 1200
        maxHeight = 1200
        quality = 85
        break
      case 'payment_screenshot':
        maxWidth = 800
        maxHeight = 1200
        quality = 80
        break
    }

    return await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer()
  }

  static async deleteFile(filename: string): Promise<void> {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filename])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    // Remove from database
    await supabase
      .from('file_uploads')
      .delete()
      .eq('filename', filename)
  }

  static async getUserFiles(
    userId: string,
    purpose?: string
  ): Promise<any[]> {
    let query = supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (purpose) {
      query = query.eq('purpose', purpose)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch files: ${error.message}`)
    }

    return data || []
  }
}
