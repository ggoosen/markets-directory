// src/components/market/TimeInput.jsx
import { useState } from 'react'
import { Clock } from 'lucide-react'

export default function TimeInput({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange,
  error 
}) {
  const [timeError, setTimeError] = useState('')

  const validateTimes = (start, end) => {
    if (!start || !end) return ''
    
    const startMinutes = timeToMinutes(start)
    const endMinutes = timeToMinutes(end)
    
    if (startMinutes >= endMinutes) {
      return 'End time must be after start time'
    }
    
    const duration = endMinutes - startMinutes
    if (duration < 60) { // Less than 1 hour
      return 'Market should run for at least 1 hour'
    }
    
    if (duration > 720) { // More than 12 hours
      return 'Market duration seems unusually long'
    }
    
    return ''
  }

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const formatDuration = (start, end) => {
    if (!start || !end) return ''
    
    const startMinutes = timeToMinutes(start)
    const endMinutes = timeToMinutes(end)
    const duration = endMinutes - startMinutes
    
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
  }

  const handleStartChange = (value) => {
    onStartTimeChange(value)
    const error = validateTimes(value, endTime)
    setTimeError(error)
  }

  const handleEndChange = (value) => {
    onEndTimeChange(value)
    const error = validateTimes(startTime, value)
    setTimeError(error)
  }

  const quickTimeOptions = [
    { label: 'Early Morning', start: '06:00', end: '10:00' },
    { label: 'Morning Market', start: '08:00', end: '12:00' },
    { label: 'Weekend Market', start: '08:00', end: '14:00' },
    { label: 'Afternoon Market', start: '14:00', end: '18:00' },
    { label: 'Evening Market', start: '16:00', end: '20:00' }
  ]

  const setQuickTime = (start, end) => {
    handleStartChange(start)
    handleEndChange(end)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Operating Hours *
      </label>

      {/* Quick Time Presets */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Quick presets:</div>
        <div className="flex flex-wrap gap-2">
          {quickTimeOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setQuickTime(option.start, option.end)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Start Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleStartChange(e.target.value)}
              className={`input-field pl-10 ${timeError ? 'border-red-300' : ''}`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            End Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleEndChange(e.target.value)}
              className={`input-field pl-10 ${timeError ? 'border-red-300' : ''}`}
              required
            />
          </div>
        </div>
      </div>

      {/* Duration Display */}
      {startTime && endTime && !timeError && (
        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          Duration: {formatDuration(startTime, endTime)}
        </div>
      )}

      {/* Error Display */}
      {(timeError || error) && (
        <div className="text-sm text-red-600">
          {timeError || error}
        </div>
      )}
    </div>
  )
}