// src/components/market/FlexibleFrequencySelector.jsx
import { useState, useEffect } from 'react'
import { Calendar, Plus, X, Clock, Repeat } from 'lucide-react'

export default function FlexibleFrequencySelector({ 
  frequencyType, 
  frequencyValue, 
  frequencyDetails, 
  onChange 
}) {
  const [localType, setLocalType] = useState(frequencyType || 'regular')
  const [localValue, setLocalValue] = useState(frequencyValue || '')
  const [localDetails, setLocalDetails] = useState(frequencyDetails || {})

  useEffect(() => {
    onChange({
      frequencyType: localType,
      frequencyValue: localValue,
      frequencyDetails: localDetails
    })
  }, [localType, localValue, localDetails, onChange])

  const handleTypeChange = (type) => {
    setLocalType(type)
    setLocalValue('')
    setLocalDetails({})
  }

  const regularOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'fortnightly', label: 'Fortnightly', description: 'Every 2 weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' }
  ]

  const weekDays = [
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

  const handleMonthlyPatternChange = (weekNumber, dayOfWeek) => {
    setLocalDetails({
      weekNumber,
      dayOfWeek,
      description: `${weekNumbers.find(w => w.value === weekNumber)?.label} ${weekDays.find(d => d.value === dayOfWeek)?.full}`
    })
    setLocalValue(`${weekNumbers.find(w => w.value === weekNumber)?.label} ${weekDays.find(d => d.value === dayOfWeek)?.full}`)
  }

  const handleWeeklyPatternChange = (selectedDays) => {
    const dayNames = selectedDays.map(day => weekDays.find(d => d.value === day)?.short).join(', ')
    setLocalDetails({ selectedDays, dayNames })
    setLocalValue(`Weekly: ${dayNames}`)
  }

  const addCustomDate = () => {
    const newDate = prompt('Enter date (YYYY-MM-DD):')
    if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      const currentDates = localDetails.customDates || []
      setLocalDetails({
        ...localDetails,
        customDates: [...currentDates, newDate].sort()
      })
      setLocalValue(`${currentDates.length + 1} custom dates`)
    }
  }

  const removeCustomDate = (dateToRemove) => {
    const updatedDates = (localDetails.customDates || []).filter(date => date !== dateToRemove)
    setLocalDetails({
      ...localDetails,
      customDates: updatedDates
    })
    setLocalValue(`${updatedDates.length} custom dates`)
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How often does your market run?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('regular')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              localType === 'regular'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Repeat className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Regular</div>
                <div className="text-sm text-gray-500">Daily, weekly, etc.</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('weekly_pattern')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              localType === 'weekly_pattern'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Weekly Pattern</div>
                <div className="text-sm text-gray-500">Specific days each week</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('monthly_pattern')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              localType === 'monthly_pattern'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Monthly Pattern</div>
                <div className="text-sm text-gray-500">3rd Wednesday, etc.</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('custom_dates')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              localType === 'custom_dates'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Custom Dates</div>
                <div className="text-sm text-gray-500">Specific dates only</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Regular Pattern */}
      {localType === 'regular' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select frequency
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {regularOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalValue(option.value)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  localValue === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Pattern */}
      {localType === 'weekly_pattern' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select which days of the week
          </label>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const selectedDays = localDetails.selectedDays || []
              const isSelected = selectedDays.includes(day.value)
              
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => {
                    const newSelected = isSelected 
                      ? selectedDays.filter(d => d !== day.value)
                      : [...selectedDays, day.value].sort()
                    handleWeeklyPatternChange(newSelected)
                  }}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{day.short}</div>
                </button>
              )
            })}
          </div>
          {localDetails.selectedDays?.length > 0 && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              Market runs: {localDetails.dayNames}
            </div>
          )}
        </div>
      )}

      {/* Monthly Pattern */}
      {localType === 'monthly_pattern' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select which week and day of the month
          </label>
          
          <div>
            <div className="text-sm text-gray-600 mb-2">Week of the month:</div>
            <div className="grid grid-cols-5 gap-2">
              {weekNumbers.map((week) => (
                <button
                  key={week.value}
                  type="button"
                  onClick={() => handleMonthlyPatternChange(week.value, localDetails.dayOfWeek || 0)}
                  className={`p-2 border-2 rounded-lg text-center transition-colors ${
                    localDetails.weekNumber === week.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{week.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">Day of the week:</div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleMonthlyPatternChange(localDetails.weekNumber || 1, day.value)}
                  className={`p-2 border-2 rounded-lg text-center transition-colors ${
                    localDetails.dayOfWeek === day.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{day.short}</div>
                </button>
              ))}
            </div>
          </div>

          {localDetails.description && (
            <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              Market runs: {localDetails.description} of each month
            </div>
          )}
        </div>
      )}

      {/* Custom Dates */}
      {localType === 'custom_dates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Custom market dates
            </label>
            <button
              type="button"
              onClick={addCustomDate}
              className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Date
            </button>
          </div>

          {localDetails.customDates?.length > 0 ? (
            <div className="space-y-2">
              {localDetails.customDates.map((date, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomDate(date)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center text-gray-500">
              No custom dates added yet. Click "Add Date" to specify when your market runs.
            </div>
          )}
        </div>
      )}

      {/* Current Selection Summary */}
      {localValue && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-blue-800">
            <Calendar className="h-5 w-5 mr-2" />
            <div>
              <div className="font-medium">Market Schedule:</div>
              <div className="text-sm">{localValue}</div>
              {localType === 'custom_dates' && localDetails.customDates?.length > 0 && (
                <div className="text-xs mt-1">
                  Next date: {new Date(Math.min(...localDetails.customDates.map(d => new Date(d)))).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}