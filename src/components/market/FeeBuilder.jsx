// src/components/market/FeeBuilder.jsx
import { useState, useEffect } from 'react'
import { Plus, X, DollarSign } from 'lucide-react'

export default function FeeBuilder({ 
  fees = [], 
  onChange 
}) {
  const [localFees, setLocalFees] = useState(fees)

  useEffect(() => {
    setLocalFees(fees)
  }, [fees])

  const feeTypes = [
    { value: 'stall_fee', label: 'Stall Fee', description: 'Regular stall rental fee' },
    { value: 'application_fee', label: 'Application Fee', description: 'One-time application processing fee' },
    { value: 'bond', label: 'Security Bond', description: 'Refundable security deposit' },
    { value: 'power_fee', label: 'Power Fee', description: 'Electricity usage fee' },
    { value: 'parking_fee', label: 'Parking Fee', description: 'Reserved parking space fee' },
    { value: 'storage_fee', label: 'Storage Fee', description: 'Storage space rental' },
    { value: 'insurance_fee', label: 'Insurance Fee', description: 'Insurance coverage fee' },
    { value: 'other', label: 'Other Fee', description: 'Custom fee type' }
  ]

  const frequencies = [
    { value: 'per_day', label: 'Per Day' },
    { value: 'per_week', label: 'Per Week' },
    { value: 'per_month', label: 'Per Month' },
    { value: 'per_event', label: 'Per Event' },
    { value: 'one_time', label: 'One Time' },
    { value: 'annual', label: 'Annual' }
  ]

  const addFee = () => {
    const newFee = {
      id: Date.now(), // Temporary ID for local state
      fee_type: 'stall_fee',
      amount: '',
      frequency: 'per_day',
      description: '',
      required: true
    }

    const updated = [...localFees, newFee]
    setLocalFees(updated)
    onChange(updated)
  }

  const removeFee = (index) => {
    const updated = localFees.filter((_, i) => i !== index)
    setLocalFees(updated)
    onChange(updated)
  }

  const updateFee = (index, field, value) => {
    const updated = localFees.map((fee, i) => 
      i === index ? { ...fee, [field]: value } : fee
    )
    setLocalFees(updated)
    onChange(updated)
  }

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00'
    return `$${parseFloat(amount).toFixed(2)}`
  }

  const calculateTotal = () => {
    return localFees
      .filter(fee => fee.frequency === 'per_day' || fee.frequency === 'per_week')
      .reduce((total, fee) => total + (parseFloat(fee.amount) || 0), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Market Fees & Pricing
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Define the fees stallholders will pay to participate in your market.
          </p>
        </div>
        <button
          type="button"
          onClick={addFee}
          className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Fee
        </button>
      </div>

      {localFees.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Fees Defined</h3>
          <p className="text-gray-500 mb-4">Add fees to let stallholders know your pricing structure.</p>
          <button
            type="button"
            onClick={addFee}
            className="btn-primary"
          >
            Add Your First Fee
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {localFees.map((fee, index) => (
            <div key={fee.id || index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Fee {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeFee(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Type
                  </label>
                  <select
                    value={fee.fee_type}
                    onChange={(e) => updateFee(index, 'fee_type', e.target.value)}
                    className="input-field"
                  >
                    {feeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {feeTypes.find(t => t.value === fee.fee_type)?.description}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={fee.amount}
                      onChange={(e) => updateFee(index, 'amount', e.target.value)}
                      className="input-field pl-10"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={fee.frequency}
                    onChange={(e) => updateFee(index, 'frequency', e.target.value)}
                    className="input-field"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Description (for 'other' fee type) */}
                {fee.fee_type === 'other' && (
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Fee Description
                    </label>
                    <input
                      type="text"
                      value={fee.description}
                      onChange={(e) => updateFee(index, 'description', e.target.value)}
                      className="input-field"
                      placeholder="Describe this custom fee..."
                    />
                  </div>
                )}

                {/* Required/Optional */}
                <div className="lg:col-span-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={fee.required}
                      onChange={(e) => updateFee(index, 'required', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      This fee is required for all stallholders
                    </span>
                  </label>
                </div>
              </div>

              {/* Fee Preview */}
              {fee.amount && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center text-blue-800">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <div className="text-sm">
                      <strong>Preview:</strong> {formatCurrency(fee.amount)} {fee.frequency.replace('_', ' ')}
                      {!fee.required && <span className="text-blue-600 ml-2">(Optional)</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Fee Summary */}
          {localFees.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Summary</h3>
              
              <div className="space-y-2">
                {localFees.map((fee, index) => (
                  <div key={fee.id || index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {feeTypes.find(t => t.value === fee.fee_type)?.label}
                      {fee.fee_type === 'other' && fee.description && ` (${fee.description})`}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(fee.amount)} {fee.frequency.replace('_', ' ')}
                      {!fee.required && <span className="text-gray-500 ml-1">(opt)</span>}
                    </span>
                  </div>
                ))}
              </div>

              {calculateTotal() > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center font-medium">
                    <span>Regular Fees Total (per day/week):</span>
                    <span className="text-lg text-primary-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}