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
  Star,
  User,
  TrendingUp,
  Users,
  FileText,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  Award,
  Target,
  Zap,
  Sparkles
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, jobFilter, sortBy, sortOrder])

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

    // Sort applications
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
          break
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

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

  const getApplicationStats = () => {
    const total = applications.length
    const pending = applications.filter(app => app.status === 'pending').length
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length
    const hired = applications.filter(app => app.status === 'hired').length
    
    return { total, pending, shortlisted, hired }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-container">
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500 mx-auto"></div>
              <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-white/70 mt-6 text-lg">Loading applications...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = getApplicationStats()

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-container">
        {/* Clean Minimal Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">
                Job Applications
              </h1>
              <p className="text-slate-400">Manage and review candidate applications</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                {viewMode === 'grid' ? <FileText className="w-4 h-4 text-slate-300" /> : <Users className="w-4 h-4 text-slate-300" />}
              </button>
            </div>
          </div>

          {/* Minimal Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total</p>
                  <p className="text-2xl font-semibold text-white">{stats.total}</p>
                </div>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-semibold text-white">{stats.pending}</p>
                </div>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Shortlisted</p>
                  <p className="text-2xl font-semibold text-white">{stats.shortlisted}</p>
                </div>
                <Star className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Hired</p>
                  <p className="text-2xl font-semibold text-white">{stats.hired}</p>
                </div>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clean Filters */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">Filters</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-slate-400 text-sm">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 text-sm focus:outline-none focus:border-slate-600"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
              >
                <ArrowUpDown className={`w-3 h-3 text-slate-400 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-600 transition-colors"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-600 transition-colors"
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
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-600 transition-colors"
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
            <div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setJobFilter('all')
                  setSortBy('date')
                  setSortOrder('desc')
                }}
                className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Applications List/Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredApplications.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No applications found</h3>
              <p className="text-slate-400">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className={`bg-slate-900 rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-colors ${
                  viewMode === 'grid' ? 'h-full' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                          {getInitials(application.first_name, application.last_name)}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-white">
                            {application.first_name} {application.last_name}
                          </h3>
                          <p className="text-slate-400 text-sm">{application.job_title}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center text-sm text-slate-400">
                        <Mail className="w-3 h-3 mr-2" />
                        <span className="truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Phone className="w-3 h-3 mr-2" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <MapPin className="w-3 h-3 mr-2" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Calendar className="w-3 h-3 mr-2" />
                        <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-sm transition-colors"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => downloadResume(application.resume_filename, `${application.first_name} ${application.last_name}`)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(application.first_name, application.last_name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-medium text-white">
                            {application.first_name} {application.last_name}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{application.job_title}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2" />
                            <span className="truncate">{application.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2" />
                            {application.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-2" />
                            {application.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-2" />
                            {new Date(application.applied_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 lg:mt-0">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadResume(application.resume_filename, `${application.first_name} ${application.last_name}`)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clean Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-white font-medium">
                      {getInitials(selectedApplication.first_name, selectedApplication.last_name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {selectedApplication.first_name} {selectedApplication.last_name}
                      </h2>
                      <p className="text-slate-400">{selectedApplication.job_title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </span>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Personal Information */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-300 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Email</label>
                        <p className="text-white text-sm">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Phone</label>
                        <p className="text-white text-sm">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Location</label>
                        <p className="text-white text-sm">{selectedApplication.location}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Applied Date</label>
                        <p className="text-white text-sm">{new Date(selectedApplication.applied_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-300 mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Experience</label>
                        <p className="text-white text-sm">{selectedApplication.experience}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Education</label>
                        <p className="text-white text-sm">{selectedApplication.education}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Current Company</label>
                        <p className="text-white text-sm">{selectedApplication.current_company || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Expected Salary</label>
                        <p className="text-white text-sm">{selectedApplication.expected_salary || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs block mb-1">Notice Period</label>
                        <p className="text-white text-sm">{selectedApplication.notice_period || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links & Cover Letter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Links */}
                  {(selectedApplication.portfolio || selectedApplication.linkedin || selectedApplication.github) && (
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h3 className="text-sm font-medium text-slate-300 mb-4">Portfolio & Links</h3>
                      <div className="space-y-2">
                        {selectedApplication.portfolio && (
                          <a
                            href={selectedApplication.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Portfolio</span>
                          </a>
                        )}
                        {selectedApplication.linkedin && (
                          <a
                            href={selectedApplication.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {selectedApplication.github && (
                          <a
                            href={selectedApplication.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-300 mb-4">Cover Letter</h3>
                    <div className="bg-slate-900 border border-slate-700 rounded p-3 max-h-48 overflow-y-auto">
                      <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 mb-4">Update Application Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                        className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                          selectedApplication.status === status
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-1">
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
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
