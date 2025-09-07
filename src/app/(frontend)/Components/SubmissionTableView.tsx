// components/SubmissionTableView.tsx
import React from 'react'

interface DynamicField {
  fieldName: string
  fieldLabel: string
  fieldValue: string
  fieldType: string
}

interface SubmissionData {
  field: string
  value: string
}

interface FormField {
  name?: string
  label?: string
  type?: string
  required?: boolean
}

interface FormSubmission {
  id: string
  dynamicFields?: DynamicField[]
  submissionData?: SubmissionData[]
  form?: {
    title?: string
    id?: string
    fields?: FormField[]
  }
  createdAt?: string
  submissionSummary?: string
  ipAddress?: string
  userAgent?: string
}

interface ParsedFieldData {
  value: string
  type: string
}

// This component will replace the entire collection list view
const FormSubmissionsTableView: React.FC = () => {
  const [submissions, setSubmissions] = React.useState<FormSubmission[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = React.useState<FormSubmission | null>(null)
  const [showModal, setShowModal] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalDocs, setTotalDocs] = React.useState(0)
  const itemsPerPage = 10

  // Fetch submissions
  const fetchSubmissions = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/form-submissions?depth=3&limit=${itemsPerPage}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      setSubmissions(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSubmissions()
  }, [])

  // Parse form data from different possible structures
  const parseSubmissionData = (submission: FormSubmission): Record<string, ParsedFieldData> => {
    const fields: Record<string, ParsedFieldData> = {}

    // Try dynamicFields first (your custom structure)
    if (submission.dynamicFields?.length) {
      submission.dynamicFields.forEach((field) => {
        fields[field.fieldLabel || field.fieldName] = {
          value: field.fieldValue,
          type: field.fieldType,
        }
      })
      return fields
    }

    // Try submissionData (default PayloadCMS structure)
    if (submission.submissionData?.length) {
      submission.submissionData.forEach((field) => {
        fields[field.field] = {
          value: field.value,
          type: 'text',
        }
      })
      return fields
    }

    // Try parsing submissionSummary as fallback
    if (submission.submissionSummary) {
      const summary = submission.submissionSummary
      const parts = summary.split(/\s(?=\w+:)/g)

      parts.forEach((part) => {
        const match = part.match(/^(.+?):\s*(.+)$/)
        if (match) {
          const [, label, value] = match
          fields[label.trim()] = {
            value: value.trim(),
            type: 'text',
          }
        }
      })
      return fields
    }

    return fields
  }

  // Get all unique field names across all submissions
  const getAllFieldNames = () => {
    const allFields = new Set<string>()

    submissions.forEach((submission) => {
      const fields = parseSubmissionData(submission)
      Object.keys(fields).forEach((fieldName) => allFields.add(fieldName))
    })

    return Array.from(allFields).sort()
  }

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSubmissions(currentPage)
      } else {
        alert('Failed to delete submission')
      }
    } catch (_err) {
      alert('Error deleting submission')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchSubmissions()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const fieldNames = getAllFieldNames()
  const totalPages = Math.ceil(totalDocs / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
              <p className="text-gray-600 mt-1">
                {totalDocs} total submission{totalDocs !== 1 ? 's' : ''}
                {fieldNames.length > 0 && ` • ${fieldNames.length} unique fields`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchSubmissions(currentPage)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                🔄 Refresh
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                📊 Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Form Submissions</h3>
            <p className="text-gray-600">No form submissions have been received yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Form
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Date
                    </th>
                    {fieldNames.slice(0, 6).map((fieldName) => (
                      <th
                        key={fieldName}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-48"
                      >
                        {fieldName.length > 15 ? `${fieldName.substring(0, 15)}...` : fieldName}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission, index) => {
                    const parsedData = parseSubmissionData(submission)

                    return (
                      <tr
                        key={submission.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          #{submission.id.slice(-6)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="truncate max-w-32" title={submission.form?.title}>
                            {submission.form?.title || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {submission.createdAt
                            ? new Date(submission.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Unknown'}
                        </td>
                        {fieldNames.slice(0, 6).map((fieldName) => (
                          <td key={fieldName} className="px-4 py-3 text-sm text-gray-900 max-w-48">
                            <div className="truncate" title={parsedData[fieldName]?.value || ''}>
                              {parsedData[fieldName]?.value || (
                                <span className="text-gray-400 italic">—</span>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(submission)}
                              className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(submission.id)}
                              className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} • Showing {submissions.length} of {totalDocs}{' '}
                  submissions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchSubmissions(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchSubmissions(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Submission #{selectedSubmission.id.slice(-6)} Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Form:</strong> {selectedSubmission.form?.title || 'Unknown'}
                  </div>
                  <div>
                    <strong>Submitted:</strong>{' '}
                    {selectedSubmission.createdAt
                      ? new Date(selectedSubmission.createdAt).toLocaleString()
                      : 'Unknown'}
                  </div>
                  <div>
                    <strong>ID:</strong> {selectedSubmission.id}
                  </div>
                  <div>
                    <strong>IP Address:</strong> {selectedSubmission.ipAddress || 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Field
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b w-20">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(parseSubmissionData(selectedSubmission)).map(
                      ([field, data], index) => (
                        <tr key={field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                            {field}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b break-words max-w-md">
                            {data.value || <span className="text-gray-400 italic">No value</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 border-b">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {data.type}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormSubmissionsTableView
