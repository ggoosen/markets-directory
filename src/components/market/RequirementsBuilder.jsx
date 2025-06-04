// src/components/market/RequirementsBuilder.jsx
import React from 'react'  // Add this line

import { useState, useEffect } from 'react'
import { Plus, X, Shield, Building, Users, Package, Truck, Award, FileText } from 'lucide-react'
import marketService from '../../services/marketService'


export default function RequirementsBuilder({ 
  requirements = [], 
  onChange 
}) {
  const [availableTypes, setAvailableTypes] = useState({ types: [], grouped: {} })
  const [loading, setLoading] = useState(true)
  const [localRequirements, setLocalRequirements] = useState(requirements)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchRequirementTypes()
  }, [])

  useEffect(() => {
    setLocalRequirements(requirements)
  }, [requirements])

  const fetchRequirementTypes = async () => {
    try {
      setLoading(true)
      const result = await marketService.getRequirementTypes()
      setAvailableTypes(result)
      console.log('Requirement types loaded:', result)
    } catch (error) {
      console.error('Error fetching requirement types:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRequirement = (typeId) => {
    const type = availableTypes.types.find(t => t.id === typeId)
    if (!type) return

    const newReq = {
      id: Date.now(),
      requirement_type: typeId,
      type_info: type,
      is_required: true,
      requirement_value: getDefaultValue(type.value_type, type.value_options),
      custom_notes: '',
      priority: 'required'
    }

    const updated = [...localRequirements, newReq]
    setLocalRequirements(updated)
    onChange(updated)
    setShowAddModal(false)
  }

  const updateRequirement = (index, field, value) => {
    const updated = localRequirements.map((req, i) => 
      i === index ? { ...req, [field]: value } : req
    )
    setLocalRequirements(updated)
    onChange(updated)
  }

  const removeRequirement = (index) => {
    const updated = localRequirements.filter((_, i) => i !== index)
    setLocalRequirements(updated)
    onChange(updated)
  }

  const getDefaultValue = (valueType, options = {}) => {
    switch (valueType) {
      case 'boolean': 
        return { required: true }
      case 'amount': 
        return { 
          minimum_amount: options.suggested_amounts?.[1] || options.min_amount || 5000000,
          currency: options.currency || 'AUD'
        }
      case 'text': 
        return { value: '' }
      case 'select': 
        return { selected: options.options?.[0]?.value || '' }
      case 'number':
        return { value: options.default_value || options.min_value || 0 }
      case 'date':
        return { required_by: null }
      default: 
        return {}
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'legal': return Shield
      case 'business': return Building
      case 'membership': return Users
      case 'product': return Package
      case 'logistics': return Truck
      case 'experience': return Award
      case 'certification': return FileText
      default: return Shield
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderValueInput = (requirement, index) => {
    const type = requirement.type_info
    const value = requirement.requirement_value || {}

    switch (type.value_type) {
      case 'amount':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Amount Required
            </label>
            <div className="space-y-2">
              {type.value_options?.suggested_amounts && (
                <div className="grid grid-cols-2 gap-2">
                  {type.value_options.suggested_amounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => updateRequirement(index, 'requirement_value', {
                        ...value,
                        minimum_amount: amount
                      })}
                      className={`p-2 text-sm border rounded transition-colors ${
                        value.minimum_amount === amount
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={value.minimum_amount || ''}
                  onChange={(e) => updateRequirement(index, 'requirement_value', {
                    ...value,
                    minimum_amount: parseInt(e.target.value) || 0
                  })}
                  className="input-field pl-8"
                  placeholder="5000000"
                />
              </div>
            </div>
          </div>
        )

      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Option
            </label>
            <select
              value={value.selected || ''}
              onChange={(e) => updateRequirement(index, 'requirement_value', {
                ...value,
                selected: e.target.value
              })}
              className="input-field"
            >
              <option value="">Select option</option>
              {type.value_options?.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type.value_options?.unit ? `Value (${type.value_options.unit})` : 'Value'}
            </label>
            <input
              type="number"
              value={value.value || ''}
              onChange={(e) => updateRequirement(index, 'requirement_value', {
                ...value,
                value: parseInt(e.target.value) || 0
              })}
              className="input-field"
              min={type.value_options?.min_value}
              max={type.value_options?.max_value}
              placeholder={type.value_options?.default_value?.toString() || '0'}
            />
          </div>
        )

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirement Details
            </label>
            <input
              type="text"
              value={value.value || ''}
              onChange={(e) => updateRequirement(index, 'requirement_value', {
                ...value,
                value: e.target.value
              })}
              className="input-field"
              placeholder="Enter requirement details..."
            />
          </div>
        )

      case 'boolean':
      default:
        return (
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              This requirement is either met or not met by stallholders.
            </span>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Stallholder Requirements</h3>
          <p className="text-sm text-gray-500 mt-1">
            Define what stallholders need to qualify for your market. These requirements help ensure quality and compliance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </button>
      </div>

      {/* Current Requirements */}
      {localRequirements.length > 0 ? (
        <div className="space-y-4">
          {localRequirements.map((requirement, index) => {
            const Icon = getCategoryIcon(requirement.type_info?.category)
            
            return (
              <div key={requirement.id || index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <Icon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {requirement.type_info?.name || 'Unknown Requirement'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {requirement.type_info?.description}
                      </p>
                      {requirement.type_info?.help_text && (
                        <p className="text-xs text-blue-600 mt-1">
                          💡 {requirement.type_info.help_text}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Priority Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={requirement.priority || 'required'}
                      onChange={(e) => {
                        const priority = e.target.value
                        updateRequirement(index, 'priority', priority)
                        updateRequirement(index, 'is_required', priority === 'required')
                      }}
                      className="input-field"
                    >
                      <option value="required">Required - Must have</option>
                      <option value="preferred">Preferred - Bonus points</option>
                      <option value="optional">Optional - Nice to have</option>
                    </select>
                  </div>

                  {/* Value Input */}
                  <div className="md:col-span-2">
                    {renderValueInput(requirement, index)}
                  </div>

                  {/* Custom Notes */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={requirement.custom_notes || ''}
                      onChange={(e) => updateRequirement(index, 'custom_notes', e.target.value)}
                      className="input-field"
                      placeholder="Any additional context or special conditions..."
                    />
                  </div>
                </div>

                {/* Requirement Preview */}
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-sm">
                  <span className="font-medium text-gray-900">Preview: </span>
                  <span className={`${
                    requirement.priority === 'required' ? 'text-red-600' :
                    requirement.priority === 'preferred' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {requirement.priority === 'required' ? '🔴 Required' :
                     requirement.priority === 'preferred' ? '🟡 Preferred' : '🟢 Optional'}
                  </span>
                  <span className="text-gray-700"> - {requirement.type_info?.name}</span>
                  {requirement.custom_notes && (
                    <span className="text-gray-600"> ({requirement.custom_notes})</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Yet</h3>
          <p className="text-gray-500 mb-4">
            Add requirements to help stallholders understand what they need to participate in your market.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add Your First Requirement
          </button>
        </div>
      )}

      {/* Add Requirement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Add New Requirement</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(availableTypes.grouped).map(([category, types]) => (
                <div key={category}>
                  <h4 className="text-md font-medium text-gray-900 mb-3 capitalize flex items-center">
                    {React.createElement(getCategoryIcon(category), { className: "h-4 w-4 mr-2" })}
                    {category} Requirements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {types.map((type) => {
                      const Icon = getCategoryIcon(category)
                      const isAdded = localRequirements.some(req => req.requirement_type === type.id)
                      
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => addRequirement(type.id)}
                          disabled={isAdded}
                          className={`p-4 text-left border rounded-lg transition-colors ${
                            isAdded 
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{type.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                              {type.help_text && (
                                <div className="text-xs text-blue-600 mt-1">💡 {type.help_text}</div>
                              )}
                              {isAdded && (
                                <div className="text-xs text-green-600 mt-1">✓ Already added</div>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Summary */}
      {localRequirements.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Requirements Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Required:</span> {localRequirements.filter(r => r.priority === 'required').length}
            </div>
            <div>
              <span className="font-medium">Preferred:</span> {localRequirements.filter(r => r.priority === 'preferred').length}
            </div>
            <div>
              <span className="font-medium">Optional:</span> {localRequirements.filter(r => r.priority === 'optional').length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}