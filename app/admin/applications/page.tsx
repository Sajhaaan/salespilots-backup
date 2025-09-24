"use client"

import { useState, useEffect } from 'react'
import { 
  Eye, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react'

interface JobApplication {
  id: string
  job_id: number
  job_title: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  experience: string
  education: string
  current_company: string
  expected_salary: string
  notice_period: string
  portfolio: string
  linkedin: string
  github: string
  cover_letter: string
  resume_filename: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
  applied_at: string
  reviewed_at: string | null
  notes: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobFilter, setJobFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, jobFilter])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Job filter
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.job_id === parseInt(jobFilter))
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId: string, status: string, notes: string = '') => {
    try {
      const response = await fetch('/api/admin/applications/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status,
          notes
        })
      })

      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: status as any, notes, reviewed_at: new Date().toISOString() }
            : app
        ))
        
        // Close modal if open
        setSelectedApplication(null)
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const downloadResume = async (resume_filename: string, candidateName: string) => {
    try {
      const response = await fetch(`/api/admin/applications/download-resume?filename=${resume_filename}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resume_${candidateName.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'reviewed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'shortlisted': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'hired': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'reviewed': return <Eye className="w-4 h-4" />
      case 'shortlisted': return <Star className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'hired': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-container">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-white/70 mt-4">Loading applications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
          <p className="text-white/70">Manage and review job applications from candidates</p>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Job Position</label>
                             <select
                 value={jobFilter}
                 onChange={(e) => setJobFilter(e.target.value)}
                 className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
               >
                 <option value="all">All Positions</option>
                 <option value="1">Senior NLP Engineer (ESOP Only)</option>
                 <option value="2">Senior Full-Stack Engineer (ESOP Only)</option>
                 <option value="3">AI/ML Intern</option>
                 <option value="4">Frontend Development Intern</option>
                 <option value="5">Backend Development Intern</option>
                 <option value="6">Data Science Intern</option>
               </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setJobFilter('all')
                }}
                className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {application.first_name} {application.last_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </span>
                    </div>
                    <p className="text-blue-400 font-medium mb-2">{application.job_title}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-400" />
                        {application.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-purple-400" />
                        {application.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                        {application.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-400" />
                        {new Date(application.applied_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadResume(application.resume_filename, `${application.first_name} ${application.last_name}`)}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedApplication.first_name} {selectedApplication.last_name}
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-white/70 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-white/70 text-sm">Email</label>
                        <p className="text-white">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Phone</label>
                        <p className="text-white">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Location</label>
                        <p className="text-white">{selectedApplication.location}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Applied for</label>
                        <p className="text-blue-400">{selectedApplication.job_title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-white/70 text-sm">Experience</label>
                        <p className="text-white">{selectedApplication.experience}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Education</label>
                        <p className="text-white">{selectedApplication.education}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Current Company</label>
                        <p className="text-white">{selectedApplication.current_company || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Expected Salary</label>
                        <p className="text-white">{selectedApplication.expected_salary || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Notice Period</label>
                        <p className="text-white">{selectedApplication.notice_period || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links */}
                {(selectedApplication.portfolio || selectedApplication.linkedin || selectedApplication.github) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.portfolio && (
                        <a
                          href={selectedApplication.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Portfolio
                        </a>
                      )}
                      {selectedApplication.linkedin && (
                        <a
                          href={selectedApplication.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          LinkedIn
                        </a>
                      )}
                      {selectedApplication.github && (
                        <a
                          href={selectedApplication.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/90 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedApplication.status === status
                            ? 'bg-blue-500/30 border-blue-500/50 text-blue-300'
                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
