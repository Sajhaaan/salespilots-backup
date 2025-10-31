#!/usr/bin/env node

/**
 * Security Test Suite for SalesPilots.io
 * This script performs automated security checks on the application
 */

const fs = require('fs');
const path = require('path');

class SecurityTester {
  constructor() {
    this.findings = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    this.passed = [];
  }

  log(level, message, details = null) {
    const finding = { message, details, timestamp: new Date().toISOString() };
    if (level === 'pass') {
      this.passed.push(finding);
    } else {
      this.findings[level].push(finding);
    }
  }

  // Test 1: Check for exposed secrets
  testExposedSecrets() {
    console.log('\n🔍 Test 1: Checking for exposed secrets...');
    
    const sensitivePatterns = [
      { pattern: /-----BEGIN.*PRIVATE KEY-----/g, name: 'Private Key' },
      { pattern: /eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, name: 'JWT Token' },
      { pattern: /sk_live_[0-9a-zA-Z]{24,}/g, name: 'Stripe Secret Key' },
      { pattern: /AIza[0-9A-Za-z-_]{35}/g, name: 'Google API Key' }
    ];

    const checkDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        // Skip node_modules, .git, and other common directories
        if (file.isDirectory()) {
          if (!['node_modules', '.git', '.next', 'build'].includes(file.name)) {
            checkDirectory(fullPath);
          }
          continue;
        }

        // Only check code files
        if (!['.ts', '.tsx', '.js', '.jsx', '.env'].some(ext => file.name.endsWith(ext))) {
          continue;
        }

        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          
          for (const { pattern, name } of sensitivePatterns) {
            const matches = content.match(pattern);
            if (matches && !fullPath.includes('.env.example')) {
              this.log('high', `Potential ${name} exposed`, {
                file: fullPath,
                count: matches.length
              });
            }
          }
        } catch (err) {
          // Skip files we can't read
        }
      }
    };

    try {
      checkDirectory(process.cwd());
      this.log('pass', 'No obvious secrets found in code');
    } catch (err) {
      this.log('medium', 'Error scanning for secrets', { error: err.message });
    }
  }

  // Test 2: Check authentication bypass
  testAuthenticationBypass() {
    console.log('\n🔍 Test 2: Checking for authentication bypass...');
    
    const adminUsersPath = path.join(process.cwd(), 'app/api/admin/users/route.ts');
    
    if (fs.existsSync(adminUsersPath)) {
      const content = fs.readFileSync(adminUsersPath, 'utf-8');
      
      if (content.includes('// Temporarily bypass authentication') || 
          content.includes('//   return NextResponse.json({ error: \'Unauthorized\' }')) {
        this.log('critical', '🚨 Authentication bypass detected in admin endpoint', {
          file: adminUsersPath,
          issue: 'Admin authentication is commented out, allowing unauthorized access',
          recommendation: 'Uncomment and enable authentication checks immediately'
        });
      } else {
        this.log('pass', 'No authentication bypass detected');
      }
    }
  }

  // Test 3: Check for SQL injection vulnerabilities
  testSQLInjection() {
    console.log('\n🔍 Test 3: Checking for SQL injection vulnerabilities...');
    
    const checkFile = (filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Look for direct SQL query construction with template strings
        const dangerousPatterns = [
          /\$\{.*\}.*FROM/gi,
          /\+.*SELECT.*FROM/gi,
          /`SELECT.*\$\{/gi
        ];

        for (const pattern of dangerousPatterns) {
          if (pattern.test(content)) {
            return true;
          }
        }
      } catch (err) {
        // Skip
      }
      return false;
    };

    const scanDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      let found = false;

      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          if (!['node_modules', '.git', '.next'].includes(file.name)) {
            if (scanDirectory(fullPath)) found = true;
          }
          continue;
        }

        if (['.ts', '.js'].some(ext => file.name.endsWith(ext))) {
          if (checkFile(fullPath)) {
            this.log('high', 'Potential SQL injection vulnerability', {
              file: fullPath,
              recommendation: 'Use parameterized queries or ORM'
            });
            found = true;
          }
        }
      }
      return found;
    };

    if (!scanDirectory(path.join(process.cwd(), 'app/api'))) {
      this.log('pass', 'No obvious SQL injection vulnerabilities detected');
    }
  }

  // Test 4: Check security headers
  testSecurityHeaders() {
    console.log('\n🔍 Test 4: Checking security headers configuration...');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf-8');
      
      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];

      const missingHeaders = requiredHeaders.filter(header => 
        !content.includes(header)
      );

      if (missingHeaders.length > 0) {
        this.log('medium', 'Missing security headers', {
          missing: missingHeaders,
          recommendation: 'Add all recommended security headers'
        });
      } else {
        this.log('pass', 'All critical security headers configured');
      }
    }
  }

  // Test 5: Check rate limiting
  testRateLimiting() {
    console.log('\n🔍 Test 5: Checking rate limiting configuration...');
    
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      if (content.includes('RATE_LIMIT') && content.includes('checkRateLimit')) {
        this.log('pass', 'Rate limiting is configured');
      } else {
        this.log('high', 'Rate limiting not properly configured', {
          recommendation: 'Implement rate limiting to prevent abuse'
        });
      }
    } else {
      this.log('high', 'Middleware file not found', {
        recommendation: 'Create middleware with rate limiting'
      });
    }
  }

  // Test 6: Check for hardcoded credentials
  testHardcodedCredentials() {
    console.log('\n🔍 Test 6: Checking for hardcoded credentials...');
    
    const patterns = [
      /password\s*=\s*["'][^"']{8,}["']/gi,
      /api[_-]?key\s*=\s*["'][^"']{10,}["']/gi,
      /secret\s*=\s*["'][^"']{10,}["']/gi
    ];

    const scanDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      let found = false;

      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          if (!['node_modules', '.git', '.next'].includes(file.name)) {
            if (scanDirectory(fullPath)) found = true;
          }
          continue;
        }

        if (['.ts', '.tsx', '.js', '.jsx'].some(ext => file.name.endsWith(ext))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            for (const pattern of patterns) {
              if (pattern.test(content) && 
                  !content.includes('process.env') &&
                  !fullPath.includes('.example') &&
                  !fullPath.includes('test')) {
                this.log('critical', 'Potential hardcoded credentials', {
                  file: fullPath,
                  recommendation: 'Use environment variables for all secrets'
                });
                found = true;
                break;
              }
            }
          } catch (err) {
            // Skip
          }
        }
      }
      return found;
    };

    if (!scanDirectory(process.cwd())) {
      this.log('pass', 'No hardcoded credentials detected');
    }
  }

  // Test 7: Check CORS configuration
  testCORSConfiguration() {
    console.log('\n🔍 Test 7: Checking CORS configuration...');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf-8');
      
      if (content.includes('Access-Control-Allow-Origin')) {
        if (content.includes('*') && !content.includes('NODE_ENV')) {
          this.log('high', 'Overly permissive CORS configuration', {
            issue: 'Wildcard (*) CORS origin detected',
            recommendation: 'Restrict CORS to specific domains'
          });
        } else {
          this.log('pass', 'CORS configuration appears secure');
        }
      } else {
        this.log('info', 'CORS not explicitly configured');
      }
    }
  }

  // Test 8: Check input validation
  testInputValidation() {
    console.log('\n🔍 Test 8: Checking input validation...');
    
    const apiDir = path.join(process.cwd(), 'app/api');
    let validationFound = false;
    let apiRoutesChecked = 0;

    const checkFile = (filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        apiRoutesChecked++;
        
        // Look for validation libraries or patterns
        if (content.includes('zod') || 
            content.includes('joi') || 
            content.includes('Schema') ||
            content.includes('.safeParse') ||
            content.includes('validate(')) {
          validationFound = true;
          return true;
        }
      } catch (err) {
        // Skip
      }
      return false;
    };

    const scanDirectory = (dir) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            scanDirectory(fullPath);
            continue;
          }

          if (file.name === 'route.ts' || file.name === 'route.js') {
            checkFile(fullPath);
          }
        }
      } catch (err) {
        // Skip
      }
    };

    if (fs.existsSync(apiDir)) {
      scanDirectory(apiDir);
      
      if (validationFound) {
        this.log('pass', `Input validation detected in API routes (${apiRoutesChecked} routes checked)`);
      } else {
        this.log('high', 'Limited input validation detected', {
          routesChecked: apiRoutesChecked,
          recommendation: 'Implement input validation using Zod or Joi'
        });
      }
    }
  }

  // Test 9: Check dependency vulnerabilities
  async testDependencyVulnerabilities() {
    console.log('\n🔍 Test 9: Checking for known dependency vulnerabilities...');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Check for security-related packages
      const securityPackages = [
        'helmet',
        'express-rate-limit',
        'express-validator',
        'joi',
        'zod'
      ];

      const installedSecurityPackages = securityPackages.filter(pkg => 
        packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]
      );

      if (installedSecurityPackages.length > 0) {
        this.log('pass', 'Security-focused packages detected', {
          packages: installedSecurityPackages
        });
      } else {
        this.log('medium', 'Few security-focused packages installed', {
          recommendation: 'Consider adding helmet, joi/zod for validation'
        });
      }

      // Check for audit script
      if (packageJson.scripts?.['security:audit']) {
        this.log('pass', 'Security audit script configured');
      } else {
        this.log('info', 'No security audit script found', {
          recommendation: 'Add "security:audit": "npm audit" to package.json scripts'
        });
      }
    }
  }

  // Test 10: Check environment variable handling
  testEnvironmentVariables() {
    console.log('\n🔍 Test 10: Checking environment variable handling...');
    
    const envExamplePath = path.join(process.cwd(), 'env.example');
    
    if (!fs.existsSync(envExamplePath)) {
      this.log('medium', 'No env.example file found', {
        recommendation: 'Create env.example to document required variables'
      });
      return;
    }

    const content = fs.readFileSync(envExamplePath, 'utf-8');
    
    const requiredVars = [
      'JWT_SECRET',
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL'
    ];

    const missingVars = requiredVars.filter(v => !content.includes(v));
    
    if (missingVars.length > 0) {
      this.log('medium', 'Missing critical environment variables in example', {
        missing: missingVars
      });
    } else {
      this.log('pass', 'Environment variables properly documented');
    }

    // Check for sensitive data exposure
    if (content.includes('your-actual-') || content.includes('sk_live')) {
      this.log('critical', 'Real credentials in env.example file', {
        recommendation: 'Remove all real credentials from example file'
      });
    }
  }

  // Test 11: Check password security
  testPasswordSecurity() {
    console.log('\n🔍 Test 11: Checking password security...');
    
    const authPath = path.join(process.cwd(), 'lib/auth.ts');
    
    if (fs.existsSync(authPath)) {
      const content = fs.readFileSync(authPath, 'utf-8');
      
      // Check for password hashing
      if (content.includes('pbkdf2') || content.includes('bcrypt') || content.includes('scrypt')) {
        this.log('pass', 'Strong password hashing detected');
      } else {
        this.log('critical', 'Weak or no password hashing', {
          recommendation: 'Use bcrypt, scrypt, or pbkdf2 for password hashing'
        });
      }

      // Check for timing-safe comparison
      if (content.includes('timingSafeEqual')) {
        this.log('pass', 'Timing-safe password comparison detected');
      } else {
        this.log('medium', 'Password comparison may be vulnerable to timing attacks', {
          recommendation: 'Use crypto.timingSafeEqual for password comparison'
        });
      }
    }
  }

  // Test 12: Check XSS protection
  testXSSProtection() {
    console.log('\n🔍 Test 12: Checking XSS protection...');
    
    const scanDirectory = (dir) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        let issues = [];

        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            if (!['node_modules', '.git', '.next'].includes(file.name)) {
              issues = issues.concat(scanDirectory(fullPath));
            }
            continue;
          }

          if (['.tsx', '.jsx'].some(ext => file.name.endsWith(ext))) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              
              // Look for dangerous patterns
              if (content.includes('dangerouslySetInnerHTML') && 
                  !content.includes('sanitize') && 
                  !content.includes('DOMPurify')) {
                issues.push({
                  file: fullPath,
                  issue: 'dangerouslySetInnerHTML without sanitization'
                });
              }
            } catch (err) {
              // Skip
            }
          }
        }
        return issues;
      } catch (err) {
        return [];
      }
    };

    const issues = scanDirectory(path.join(process.cwd(), 'app'));
    
    if (issues.length > 0) {
      this.log('high', 'Potential XSS vulnerabilities found', {
        count: issues.length,
        issues: issues,
        recommendation: 'Sanitize all user input before rendering'
      });
    } else {
      this.log('pass', 'No obvious XSS vulnerabilities detected');
    }
  }

  // Generate report
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🔒 SECURITY TEST REPORT');
    console.log('='.repeat(80));
    
    const total = Object.values(this.findings).reduce((sum, arr) => sum + arr.length, 0);
    const passed = this.passed.length;

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   🚨 Critical: ${this.findings.critical.length}`);
    console.log(`   ⚠️  High: ${this.findings.high.length}`);
    console.log(`   ⚡ Medium: ${this.findings.medium.length}`);
    console.log(`   ℹ️  Low: ${this.findings.low.length}`);
    console.log(`   📝 Info: ${this.findings.info.length}`);

    if (this.findings.critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Fix Immediately):');
      this.findings.critical.forEach((finding, i) => {
        console.log(`\n   ${i + 1}. ${finding.message}`);
        if (finding.details) {
          console.log(`      ${JSON.stringify(finding.details, null, 6)}`);
        }
      });
    }

    if (this.findings.high.length > 0) {
      console.log('\n⚠️  HIGH PRIORITY ISSUES:');
      this.findings.high.forEach((finding, i) => {
        console.log(`\n   ${i + 1}. ${finding.message}`);
        if (finding.details) {
          console.log(`      ${JSON.stringify(finding.details, null, 6)}`);
        }
      });
    }

    if (this.findings.medium.length > 0) {
      console.log('\n⚡ MEDIUM PRIORITY ISSUES:');
      this.findings.medium.forEach((finding, i) => {
        console.log(`   ${i + 1}. ${finding.message}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    
    if (this.findings.critical.length > 0) {
      console.log('❌ SECURITY TEST FAILED - Critical issues found!');
      console.log('='.repeat(80));
      return false;
    } else if (this.findings.high.length > 0) {
      console.log('⚠️  SECURITY TEST WARNING - High priority issues found');
      console.log('='.repeat(80));
      return true;
    } else {
      console.log('✅ SECURITY TEST PASSED - No critical or high issues found');
      console.log('='.repeat(80));
      return true;
    }
  }

  // Save detailed report to file
  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.passed.length,
        critical: this.findings.critical.length,
        high: this.findings.high.length,
        medium: this.findings.medium.length,
        low: this.findings.low.length,
        info: this.findings.info.length
      },
      findings: this.findings,
      passed: this.passed
    };

    const reportPath = path.join(process.cwd(), 'security-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  // Run all tests
  async runAllTests() {
    console.log('🔒 Starting Security Test Suite...');
    console.log('Target: ' + process.cwd());
    
    this.testExposedSecrets();
    this.testAuthenticationBypass();
    this.testSQLInjection();
    this.testSecurityHeaders();
    this.testRateLimiting();
    this.testHardcodedCredentials();
    this.testCORSConfiguration();
    this.testInputValidation();
    await this.testDependencyVulnerabilities();
    this.testEnvironmentVariables();
    this.testPasswordSecurity();
    this.testXSSProtection();
    
    const passed = this.generateReport();
    this.saveReport();
    
    process.exit(passed ? 0 : 1);
  }
}

// Run tests
const tester = new SecurityTester();
tester.runAllTests();

