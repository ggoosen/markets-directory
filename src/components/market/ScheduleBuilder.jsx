// src/components/market/ScheduleBuilder.jsx - Normalized and Simplified
import { useState, useEffect } from 'react'
import { Plus, X, Calendar, Clock, CalendarDays } from 'lucide-react'

export default function ScheduleBuilder({ 
  schedules = [], 
  onChange 
}) {
  const [localSchedules, setLocalSchedules] = useState(schedules)

  useEffect(() => {
    setLocalSchedules(schedules)
  }, [schedules])

  const scheduleTypes = [
    { 
      value: 'weekly', 
      label: 'Weekly Pattern', 
      description: 'Runs on specific days each week',
      icon: '📅'
    },
    { 
      value: 'monthly', 
      label: 'Monthly Pattern', 
      description: 'Runs on specific week/day each month',
      icon: '🗓️'
    },
    { 
      value: 'custom_dates', 
      label: 'Custom Dates', 
      description: 'Specific dates that don\'t follow a pattern',
      icon: '📋'
    }
  ]

  const daysOfWeek = [
    { value: 0, short: 'Sun', full: 'Sunday' },
    { value: 1, short: 'Mon', full: 'Monday' },
    { value: 2, short: 'Tue', full: 'Tuesday' },
    { value: 3, short: 'Wed', full: 'Wednesday' },
    { value: 4, short: 'Thu', full: 'Thursday' },
    { value: 5, short: 'Fri', full: 'Friday' },
    { value: 6, short: 'Sat', full: 'Saturday' }
  ]

  const weekNumbers = [
    { value: 1, label: '1st' },
    { value: 2, label: '2nd' },
    { value: 3, label: '3rd' },
    { value: 4, label: '4th' },
    { value: -1, label: 'Last' }
  ]

  const frequencyOptions = [
    { value: 1, label: 'Every week' },
    { value: 2, label: 'Every 2 weeks (Fortnightly)' },
    { value: 4, label: 'Every 4 weeks (Monthly)' }
  ]

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      schedule_type: 'weekly',
      start_time: '08:00',
      end_time: '14:00',
      days_of_week: [6], // Default to Saturday
      week_number: null,
      frequency_weeks: 1,
      start_date: null, // Seasonal start
      end_date: null,   // Seasonal end
      custom_dates: [],
      notes: ''
    }

    const updated = [...localSchedules, newSchedule]
    setLocalSchedules(updated)
    onChange(updated)
  }

  const removeSchedule = (index) => {
    const updated = localSchedules.filter((_, i) => i !== index)
    setLocalSchedules(updated)
    onChange(updated)
  }

  const updateSchedule = (index, field, value) => {
    const updated = localSchedules.map((schedule, i) => 
      i === index ? { ...schedule, [field]: value } : schedule
    )
    setLocalSchedules(updated)
    onChange(updated)
  }

  const toggleDay = (index, dayValue) => {
    const schedule = localSchedules[index]
    const currentDays = schedule.days_of_week || []
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort()
    
    updateSchedule(index, 'days_of_week', newDays)
  }

  const addCustomDate = (index) => {
    const dateInput = prompt('Enter date (YYYY-MM-DD):')
    if (dateInput && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const schedule = localSchedules[index]
      const currentDates = schedule.custom_dates || []
      const newDates = [...currentDates, dateInput].sort()
      updateSchedule(index, 'custom_dates', newDates)
    }
  }

  const removeCustomDate = (index, dateToRemove) => {
    const schedule = localSchedules[index]
    const currentDates = schedule.custom_dates || []
    const newDates = currentDates.filter(date => date !== dateToRemove)
    updateSchedule(index, 'custom_dates', newDates)
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getSchedulePreview = (schedule) => {
    const timeRange = `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
    
    // Add seasonal info if present
    const seasonalInfo = schedule.start_date && schedule.end_date 
      ? ` (${new Date(schedule.start_date).toLocaleDateString()} - ${new Date(schedule.end_date).toLocaleDateString()})`
      : ''

    switch (schedule.schedule_type) {
      case 'weekly':
        if (!schedule.days_of_week?.length) return `Weekly ${timeRange}${seasonalInfo}`
        
        const dayNames = schedule.days_of_week
          .map(dayNum => daysOfWeek.find(d => d.value === dayNum)?.short)
          .join(', ')
        
        const frequencyText = schedule.frequency_weeks === 1 ? 'Every' : 
                             schedule.frequency_weeks === 2 ? 'Every 2 weeks on' :
                             `Every ${schedule.frequency_weeks} weeks on`
        
        return `${frequencyText} ${dayNames} ${timeRange}${seasonalInfo}`
        
      case 'monthly':
        const weekNum = weekNumbers.find(w => w.value === schedule.week_number)?.label || '1st'
        const dayName = daysOfWeek.find(d => d.value === schedule.days_of_week?.[0])?.full || 'Saturday'
        return `${weekNum} ${dayName} of each month ${timeRange}${seasonalInfo}`
        
      case 'custom_dates':
        const dateCount = schedule.custom_dates?.length || 0
        return `${dateCount} custom date${dateCount !== 1 ? 's' : ''} ${timeRange}`
        
      default:
        return timeRange
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Market Schedule
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Define when your market operates. You can add multiple schedule patterns.
          </p>
        </div>
        <button
          type="button"
          onClick={addSchedule}
          className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </button>
      </div>

      {localSchedules.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Defined</h3>
          <p className="text-gray-500 mb-4">Add a schedule to let stallholders know when your market operates.</p>
          <button
            type="button"
            onClick={addSchedule}
            className="btn-primary"
          >
            Add Your First Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {localSchedules.map((schedule, index) => (
            <div key={schedule.id || index} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Schedule {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Schedule Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Schedule Pattern
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {scheduleTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateSchedule(index, 'schedule_type', type.value)}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          schedule.schedule_type === type.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) => updateSchedule(index, 'start_time', e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) => updateSchedule(index, 'end_time', e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Weekly Pattern Configuration */}
                {schedule.schedule_type === 'weekly' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operating Days
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {daysOfWeek.map((day) => {
                          const isSelected = schedule.days_of_week?.includes(day.value)
                          
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => toggleDay(index, day.value)}
                              className={`p-3 text-sm border-2 rounded-lg transition-colors ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium">{day.short}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={schedule.frequency_weeks || 1}
                        onChange={(e) => updateSchedule(index, 'frequency_weeks', parseInt(e.target.value))}
                        className="input-field"
                      >
                        {frequencyOptions.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Monthly Pattern Configuration */}
                {schedule.schedule_type === 'monthly' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Week of Month
                      </label>
                      <select
                        value={schedule.week_number || 1}
                        onChange={(e) => updateSchedule(index, 'week_number', parseInt(e.target.value))}
                        className="input-field"
                      >
                        {weekNumbers.map((week) => (
                          <option key={week.value} value={week.value}>
                            {week.label} week
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day of Week
                      </label>
                      <select
                        value={schedule.days_of_week?.[0] || 6}
                        onChange={(e) => updateSchedule(index, 'days_of_week', [parseInt(e.target.value)])}
                        className="input-field"
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.full}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Custom Dates Configuration */}
                {schedule.schedule_type === 'custom_dates' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Market Dates
                      </label>
                      <button
                        type="button"
                        onClick={() => addCustomDate(index)}
                        className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Date
                      </button>
                    </div>

                    {schedule.custom_dates?.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {schedule.custom_dates.map((date, dateIndex) => (
                          <div key={dateIndex} className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50">
                            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                            <button
                              type="button"
                              onClick={() => removeCustomDate(index, date)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center text-gray-500 text-sm">
                        No custom dates added yet. Click "Add Date" to specify when your market runs.
                      </div>
                    )}
                  </div>
                )}

                {/* Seasonal Dates (for weekly/monthly only) */}
                {(schedule.schedule_type === 'weekly' || schedule.schedule_type === 'monthly') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <CalendarDays className="h-4 w-4 inline mr-2" />
                      Seasonal Dates (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Season Start</label>
                        <input
                          type="date"
                          value={schedule.start_date || ''}
                          onChange={(e) => updateSchedule(index, 'start_date', e.target.value || null)}
                          className="input-field"
                          placeholder="Leave empty for year-round"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Season End</label>
                        <input
                          type="date"
                          value={schedule.end_date || ''}
                          onChange={(e) => updateSchedule(index, 'end_date', e.target.value || null)}
                          className="input-field"
                          placeholder="Leave empty for year-round"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Set start/end dates if your market only runs during certain seasons
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={schedule.notes}
                    onChange={(e) => updateSchedule(index, 'notes', e.target.value)}
                    rows={2}
                    className="input-field"
                    placeholder="Additional schedule details, exceptions, etc."
                  />
                </div>

                {/* Schedule Preview */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start text-blue-800">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Schedule Preview:</div>
                      <div className="text-sm">{getSchedulePreview(schedule)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}