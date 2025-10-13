// Simple CSV export utilities
export function generateUsersCSV(data: any[]): string {
  const headers = ['Name', 'Email', 'Plan', 'Status', 'Location', 'Join Date']
  const csvRows = [headers.join(',')]
  
  data.forEach(user => {
    const row = [
      user?.name || '',
      user?.email || '',
      user?.plan || '',
      user?.status || '',
      user?.location || '',
      user?.joinDate || ''
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generateProductsCSV(data: any[]): string {
  const headers = ['Name', 'Category', 'Price', 'Stock', 'Status', 'SKU']
  const csvRows = [headers.join(',')]
  
  data.forEach(product => {
    const row = [
      product?.name || '',
      product?.category || '',
      product?.price || '',
      product?.stock || '',
      product?.status || '',
      product?.sku || ''
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generateOrdersCSV(data: any[]): string {
  const headers = ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date']
  const csvRows = [headers.join(',')]
  
  data.forEach(order => {
    const row = [
      order?.id || '',
      order?.customerName || '',
      order?.productName || '',
      order?.totalAmount || '',
      order?.status || '',
      order?.createdAt || ''
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generatePaymentsCSV(data: any[]): string {
  const headers = ['Payment ID', 'Order ID', 'Amount', 'Method', 'Status', 'Date']
  const csvRows = [headers.join(',')]
  
  data.forEach(payment => {
    const row = [
      payment?.id || '',
      payment?.orderId || '',
      payment?.amount || '',
      payment?.method || '',
      payment?.verificationStatus || '',
      payment?.createdAt || ''
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generateAnalyticsCSV(data: any): string {
  const headers = ['Metric', 'Value', 'Growth', 'Period']
  const csvRows = [headers.join(',')]
  
  const metrics = [
    { name: 'Total Revenue', value: data.totalRevenue || 0, growth: data.revenueGrowth || 0 },
    { name: 'Total Users', value: data.totalUsers || 0, growth: data.userGrowth || 0 },
    { name: 'Total Orders', value: data.totalOrders || 0, growth: data.orderGrowth || 0 },
    { name: 'Conversion Rate', value: data.conversionRate || 0, growth: data.conversionGrowth || 0 },
    { name: 'Average Order Value', value: data.avgOrderValue || 0, growth: data.aovGrowth || 0 },
    { name: 'Churn Rate', value: data.churnRate || 0, growth: data.churnGrowth || 0 }
  ]
  
  metrics.forEach(metric => {
    const row = [
      metric.name,
      metric.value,
      `${metric.growth}%`,
      'Current Period'
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generateDashboardCSV(data: any): string {
  const headers = ['Metric', 'Value', 'Change', 'Trend']
  const csvRows = [headers.join(',')]
  
  const metrics = [
    { name: 'Total Revenue', value: data.totalRevenue || 0, change: '+12.5%', trend: 'up' },
    { name: 'Total Orders', value: data.totalOrders || 0, change: '+8.2%', trend: 'up' },
    { name: 'Active Customers', value: data.activeCustomers || 0, change: '-2.1%', trend: 'down' },
    { name: 'Automation Rate', value: `${data.automationRate || 0}%`, change: '+5.3%', trend: 'up' },
    { name: 'Messages Automated', value: data.messagesAutomated || 0, change: '+15.2%', trend: 'up' },
    { name: 'Payments Verified', value: data.paymentsVerified || 0, change: '+3.8%', trend: 'up' }
  ]
  
  metrics.forEach(metric => {
    const row = [
      metric.name,
      metric.value,
      metric.change,
      metric.trend
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function generateDatabaseTableCSV(data: any[], tableName: string): string {
  if (!data || data.length === 0) {
    return `No data available for table: ${tableName}`
  }
  
  // Get headers from the first row
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    })
    const csvRow = values.map(field => `"${field}"`).join(',')
    csvRows.push(csvRow)
  })
  
  return csvRows.join('\n')
}

export function generateSecurityLogsCSV(data: any[]): string {
  const headers = ['Timestamp', 'Event Type', 'Severity', 'Source', 'Description', 'IP Address', 'User Agent', 'Status']
  const csvRows = [headers.join(',')]
  
  data.forEach(log => {
    const row = [
      log?.timestamp || '',
      log?.eventType || '',
      log?.severity || '',
      log?.source || '',
      log?.description || '',
      log?.ipAddress || '',
      log?.userAgent || '',
      log?.status || ''
    ].map(field => `"${field}"`).join(',')
    csvRows.push(row)
  })
  
  return csvRows.join('\n')
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Simple CSV export functions for different data types
export function exportUsersAsCSV(data: any[], filename: string): void {
  try {
    const csvContent = generateUsersCSV(data)
    downloadCSV(csvContent, filename)
    alert('Users data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export users data as CSV.')
  }
}

export function exportProductsAsCSV(data: any[], filename: string): void {
  try {
    const csvContent = generateProductsCSV(data)
    downloadCSV(csvContent, filename)
    alert('Products data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export products data as CSV.')
  }
}

export function exportOrdersAsCSV(data: any[], filename: string): void {
  try {
    const csvContent = generateOrdersCSV(data)
    downloadCSV(csvContent, filename)
    alert('Orders data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export orders data as CSV.')
  }
}

export function exportPaymentsAsCSV(data: any[], filename: string): void {
  try {
    const csvContent = generatePaymentsCSV(data)
    downloadCSV(csvContent, filename)
    alert('Payments data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export payments data as CSV.')
  }
}

export function exportAnalyticsAsCSV(data: any, filename: string): void {
  try {
    const csvContent = generateAnalyticsCSV(data)
    downloadCSV(csvContent, filename)
    alert('Analytics data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export analytics data as CSV.')
  }
}

export function exportDashboardAsCSV(data: any, filename: string): void {
  try {
    const csvContent = generateDashboardCSV(data)
    downloadCSV(csvContent, filename)
    alert('Dashboard data exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export dashboard data as CSV.')
  }
}

export function exportDatabaseTableAsCSV(data: any[], tableName: string, filename: string): void {
  try {
    const csvContent = generateDatabaseTableCSV(data, tableName)
    downloadCSV(csvContent, filename)
    alert(`${tableName} data exported as CSV successfully!`)
  } catch (error) {
    console.error('CSV export error:', error)
    alert(`Failed to export ${tableName} data as CSV.`)
  }
}

export function exportSecurityLogsAsCSV(data: any[], filename: string): void {
  try {
    const csvContent = generateSecurityLogsCSV(data)
    downloadCSV(csvContent, filename)
    alert('Security logs exported as CSV successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    alert('Failed to export security logs as CSV.')
  }
}
