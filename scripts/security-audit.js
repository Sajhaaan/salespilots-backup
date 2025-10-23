#!/usr/bin/env node

/**
 * Comprehensive Security Audit Script for SalesPilots.io
 * Scans for vulnerabilities, security issues, and best practices
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class SecurityAuditor {
  constructor() {
    this.issues = []
    this.warnings = []
    this.recommendations = []
    this.score = 100
  }

  log(level, message, file = '', line = '') {
    const entry = {
      level,
      message,
      file,
      line,
      timestamp: new Date().toISOString()
    }
    
    if (level === 'ERROR') {
      this.issues.push(entry)
      this.score -= 10
    } else if (level === 'WARNING') {
      this.warnings.push(entry)
      this.score -= 5
    } else {
      this.recommendations.push(entry)
    }
  }

  // Scan for hardcoded secrets
  scanSecrets() {
    console.log('🔍 Scanning for hardcoded secrets...')
    
    const secretPatterns = [
      /password\s*=\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
      /secret\s*=\s*['"][^'"]+['"]/gi,
      /token\s*=\s*['"][^'"]+['"]/gi,
      /private[_-]?key\s*=\s*['"][^'"]+['"]/gi,
      /aws[_-]?access[_-]?key/gi,
      /aws[_-]?secret[_-]?key/gi,
      /mongodb[_-]?uri/gi,
      /database[_-]?url/gi,
      /jwt[_-]?secret/gi
    ]

    this.scanFiles(/\.(js|ts|tsx|jsx|json|env)$/, (content, filePath) => {
      secretPatterns.forEach(pattern => {
        const matches = content.match(pattern)
        if (matches) {
          matches.forEach(match => {
            if (!match.includes('process.env') && !match.includes('placeholder')) {
              this.log('ERROR', `Potential hardcoded secret found: ${match}`, filePath)
            }
          })
        }
      })
    })
  }

  // Scan for SQL injection vulnerabilities
  scanSQLInjection() {
    console.log('🔍 Scanning for SQL injection vulnerabilities...')
    
    const sqlPatterns = [
      /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\$\{/gi,
      /INSERT\s+INTO\s+.*\s+VALUES\s+.*\$\{/gi,
      /UPDATE\s+.*\s+SET\s+.*\$\{/gi,
      /DELETE\s+FROM\s+.*\s+WHERE\s+.*\$\{/gi,
      /query\s*\(\s*['"][^'"]*\$[^'"]*['"]/gi,
      /execute\s*\(\s*['"][^'"]*\$[^'"]*['"]/gi
    ]

    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      sqlPatterns.forEach(pattern => {
        const matches = content.match(pattern)
        if (matches) {
          matches.forEach(match => {
            this.log('ERROR', `Potential SQL injection vulnerability: ${match}`, filePath)
          })
        }
      })
    })
  }

  // Scan for XSS vulnerabilities
  scanXSS() {
    console.log('🔍 Scanning for XSS vulnerabilities...')
    
    const xssPatterns = [
      /dangerouslySetInnerHTML/gi,
      /innerHTML\s*=/gi,
      /document\.write/gi,
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(\s*['"][^'"]*['"]/gi,
      /setInterval\s*\(\s*['"][^'"]*['"]/gi
    ]

    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      xssPatterns.forEach(pattern => {
        const matches = content.match(pattern)
        if (matches) {
          matches.forEach(match => {
            this.log('WARNING', `Potential XSS vulnerability: ${match}`, filePath)
          })
        }
      })
    })
  }

  // Scan for authentication issues
  scanAuthentication() {
    console.log('🔍 Scanning for authentication issues...')
    
    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      // Check for hardcoded admin bypasses
      if (content.includes('isAdmin = true') && !content.includes('TODO')) {
        this.log('ERROR', 'Hardcoded admin bypass found', filePath)
      }
      
      // Check for missing authentication
      if (content.includes('export async function') && 
          !content.includes('getAuthUserFromRequest') && 
          !content.includes('auth') &&
          filePath.includes('/api/')) {
        this.log('WARNING', 'API endpoint may be missing authentication', filePath)
      }
      
      // Check for weak password requirements
      if (content.includes('password') && !content.includes('minLength') && !content.includes('regex')) {
        this.log('WARNING', 'Password validation may be weak', filePath)
      }
    })
  }

  // Scan for CORS issues
  scanCORS() {
    console.log('🔍 Scanning for CORS issues...')
    
    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      if (content.includes('Access-Control-Allow-Origin') && content.includes('*')) {
        this.log('WARNING', 'CORS allows all origins (*)', filePath)
      }
      
      if (content.includes('cors()') && !content.includes('origin')) {
        this.log('WARNING', 'CORS configuration may be too permissive', filePath)
      }
    })
  }

  // Scan for rate limiting
  scanRateLimiting() {
    console.log('🔍 Scanning for rate limiting...')
    
    let hasRateLimiting = false
    
    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      if (content.includes('rateLimit') || content.includes('rate-limit')) {
        hasRateLimiting = true
      }
    })
    
    if (!hasRateLimiting) {
      this.log('WARNING', 'No rate limiting implementation found')
    }
  }

  // Scan for input validation
  scanInputValidation() {
    console.log('🔍 Scanning for input validation...')
    
    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      if (content.includes('req.body') && !content.includes('validate') && !content.includes('schema')) {
        this.log('WARNING', 'API endpoint may be missing input validation', filePath)
      }
      
      if (content.includes('JSON.parse') && !content.includes('try')) {
        this.log('WARNING', 'JSON.parse without error handling', filePath)
      }
    })
  }

  // Scan for security headers
  scanSecurityHeaders() {
    console.log('🔍 Scanning for security headers...')
    
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy'
    ]
    
    let hasSecurityHeaders = false
    
    this.scanFiles(/\.(js|ts|tsx|jsx)$/, (content, filePath) => {
      requiredHeaders.forEach(header => {
        if (content.includes(header)) {
          hasSecurityHeaders = true
        }
      })
    })
    
    if (!hasSecurityHeaders) {
      this.log('WARNING', 'Security headers may not be properly configured')
    }
  }

  // Scan for dependency vulnerabilities
  scanDependencies() {
    console.log('🔍 Scanning for dependency vulnerabilities...')
    
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8' })
      const audit = JSON.parse(result)
      
      if (audit.vulnerabilities) {
        Object.keys(audit.vulnerabilities).forEach(vuln => {
          const vulnData = audit.vulnerabilities[vuln]
          vulnData.via.forEach(via => {
            if (typeof via === 'string') {
              this.log('ERROR', `Dependency vulnerability: ${vuln} - ${via}`)
            } else {
              this.log('ERROR', `Dependency vulnerability: ${vuln} - ${via.title}`)
            }
          })
        })
      }
    } catch (error) {
      this.log('WARNING', 'Could not run npm audit - dependencies may have vulnerabilities')
    }
  }

  // Scan for environment variable issues
  scanEnvironmentVariables() {
    console.log('🔍 Scanning for environment variable issues...')
    
    const envFile = path.join(process.cwd(), '.env')
    const envExample = path.join(process.cwd(), '.env.example')
    
    if (fs.existsSync(envFile)) {
      this.log('WARNING', '.env file found in repository - should be in .gitignore')
    }
    
    if (!fs.existsSync(envExample)) {
      this.log('WARNING', '.env.example file not found - should document required environment variables')
    }
  }

  // Scan for file permissions
  scanFilePermissions() {
    console.log('🔍 Scanning for file permission issues...')
    
    const sensitiveFiles = [
      'package.json',
      'package-lock.json',
      '.env',
      '.env.local',
      '.env.production'
    ]
    
    sensitiveFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath)
          const mode = stats.mode & parseInt('777', 8)
          
          if (mode > parseInt('644', 8)) {
            this.log('WARNING', `File ${file} has overly permissive permissions: ${mode.toString(8)}`)
          }
        } catch (error) {
          // Ignore permission errors
        }
      }
    })
  }

  // Utility function to scan files
  scanFiles(filePattern, callback) {
    const scanDirectory = (dir) => {
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanDirectory(filePath)
        } else if (stat.isFile() && filePattern.test(file)) {
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            callback(content, filePath)
          } catch (error) {
            // Ignore files that can't be read
          }
        }
      })
    }
    
    scanDirectory(process.cwd())
  }

  // Generate security report
  generateReport() {
    console.log('\n' + '='.repeat(80))
    console.log('🔒 SECURITY AUDIT REPORT')
    console.log('='.repeat(80))
    
    console.log(`\n📊 Security Score: ${this.score}/100`)
    
    if (this.issues.length > 0) {
      console.log(`\n❌ CRITICAL ISSUES (${this.issues.length}):`)
      this.issues.forEach(issue => {
        console.log(`  • ${issue.message}`)
        if (issue.file) console.log(`    File: ${issue.file}`)
        if (issue.line) console.log(`    Line: ${issue.line}`)
      })
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`)
      this.warnings.forEach(warning => {
        console.log(`  • ${warning.message}`)
        if (warning.file) console.log(`    File: ${warning.file}`)
      })
    }
    
    if (this.recommendations.length > 0) {
      console.log(`\n💡 RECOMMENDATIONS (${this.recommendations.length}):`)
      this.recommendations.forEach(rec => {
        console.log(`  • ${rec.message}`)
      })
    }
    
    console.log('\n' + '='.repeat(80))
    
    if (this.score >= 90) {
      console.log('✅ EXCELLENT SECURITY POSTURE')
    } else if (this.score >= 70) {
      console.log('⚠️  GOOD SECURITY POSTURE - Some improvements needed')
    } else if (this.score >= 50) {
      console.log('🔶 MODERATE SECURITY POSTURE - Significant improvements needed')
    } else {
      console.log('❌ POOR SECURITY POSTURE - Immediate action required')
    }
    
    return {
      score: this.score,
      issues: this.issues,
      warnings: this.warnings,
      recommendations: this.recommendations
    }
  }

  // Run all security checks
  async run() {
    console.log('🔒 Starting comprehensive security audit...\n')
    
    this.scanSecrets()
    this.scanSQLInjection()
    this.scanXSS()
    this.scanAuthentication()
    this.scanCORS()
    this.scanRateLimiting()
    this.scanInputValidation()
    this.scanSecurityHeaders()
    this.scanDependencies()
    this.scanEnvironmentVariables()
    this.scanFilePermissions()
    
    return this.generateReport()
  }
}

// Run the security audit
if (require.main === module) {
  const auditor = new SecurityAuditor()
  auditor.run().then(report => {
    process.exit(report.score < 50 ? 1 : 0)
  }).catch(error => {
    console.error('Security audit failed:', error)
    process.exit(1)
  })
}

module.exports = SecurityAuditor
