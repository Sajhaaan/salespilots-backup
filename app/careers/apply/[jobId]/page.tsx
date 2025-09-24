"use client"

import { useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Linkedin,
  Github
} from 'lucide-react'

const jobListings = [
  {
    id: 1,
    title: "Senior NLP Engineer (ESOP Only)",
    department: "AI Research & Development",
    location: "Remote (India) / Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    salary: "2-5% ESOP"
  },
  {
    id: 2,
    title: "Senior Full-Stack Engineer (ESOP Only)",
    department: "Engineering",
    location: "Remote (India) / Mumbai",
    type: "Full-time",
    experience: "3-5 years",
    salary: "2-5% ESOP"
  },
  {
    id: 3,
    title: "AI/ML Intern",
    department: "AI Research",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate"
  },
  {
    id: 4,
    title: "Frontend Development Intern",
    department: "Engineering",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate"
  },
  {
    id: 5,
    title: "Backend Development Intern",
    department: "Engineering",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate"
  },
  {
    id: 6,
    title: "Data Science Intern",
    department: "Data Science",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate"
  }
]

export default function JobApplicationPage({ params }: { params: { jobId: string } }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    education: '',
    currentCompany: '',
    expectedSalary: '',
    noticePeriod: '',
    portfolio: '',
    linkedin: '',
    github: '',
    coverLetter: '',
    resume: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const jobId = parseInt(params.jobId)
  const job = jobListings.find(j => j.id === jobId)

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-container py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <Link href="/careers" className="btn-premium">
            Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }))
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or DOC file' }))
        return
      }
      setFormData(prev => ({ ...prev, resume: file }))
      setErrors(prev => ({ ...prev, resume: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required'
    if (!formData.education.trim()) newErrors.education = 'Education is required'
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required'
    if (!formData.resume) newErrors.resume = 'Resume is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })
      formDataToSend.append('jobId', jobId.toString())
      formDataToSend.append('jobTitle', job.title)

      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('Application failed')
      }
    } catch (error) {
      console.error('Application error:', error)
      setErrors({ submit: 'Failed to submit application. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
            <p className="text-white/70 text-lg mb-8">
              Thank you for applying to the {job.title} position. We've received your application and will review it carefully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers" className="btn-premium">
                View Other Positions
              </Link>
              <Link href="/" className="btn-secondary-premium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <div className="max-container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/careers" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Apply for {job.title}</h1>
            <p className="text-white/70">{job.department} • {job.location} • {job.type}</p>
          </div>

          {/* Application Form */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.firstName ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.lastName ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.email ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.location ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Enter your current location"
                    />
                    {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-400" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Experience/Education Level *</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.experience ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder={job?.type === 'Internship' ? 'e.g., Final year B.Tech, 6 months internship' : 'e.g., 3-5 years'}
                    />
                    {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Education *</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.education ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="e.g., B.Tech Computer Science"
                    />
                    {errors.education && <p className="text-red-400 text-sm mt-1">{errors.education}</p>}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Current Company</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your current company"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Expected Compensation</label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={job?.type === 'Internship' ? 'e.g., Learning opportunities, Certificate' : 'e.g., 3-5% ESOP'}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Notice Period/Availability</label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="">Select availability</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                      <option value="Part-time">Part-time (for internships)</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                  Portfolio & Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Portfolio URL</label>
                    <input
                      type="text"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="your-portfolio.com or leave blank"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">LinkedIn Profile</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="linkedin.com/in/your-profile or leave blank"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">GitHub Profile</label>
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="github.com/your-username or leave blank"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Cover Letter *</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none ${
                    errors.coverLetter ? 'border-red-400' : 'border-white/20'
                  }`}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                />
                {errors.coverLetter && <p className="text-red-400 text-sm mt-1">{errors.coverLetter}</p>}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Resume/CV *</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                    <p className="text-white/70 mb-1">
                      {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-white/50 text-sm">PDF, DOC, or DOCX (max 5MB)</p>
                  </label>
                </div>
                {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
