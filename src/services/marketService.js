// src/services/marketService.js - Complete with Requirements System
import pb from '../lib/pocketbase.js';
import { auditLogger } from '../utils/security.js';

class MarketService {
  // ===== BASIC MARKET OPERATIONS =====

  async getMarkets(filters = {}) {
    try {
      const filterConditions = [];

      if (filters.state) {
        filterConditions.push(`state = "${filters.state}"`);
      }

      if (filters.category) {
        filterConditions.push(`category = "${filters.category}"`);
      }

      if (filters.search) {
        filterConditions.push(`(name ~ "${filters.search}" || suburb ~ "${filters.search}" || description ~ "${filters.search}")`);
      }

      const filterString = filterConditions.length > 0 ? filterConditions.join(' && ') : '';

      const result = await pb.collection('markets').getList(
        filters.page || 1,
        filters.perPage || 20,
        {
          filter: filterString,
          sort: filters.sort || '-created',
          expand: 'category,organizer'
        }
      );

      return result;
    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  }

  async getMarket(idOrSlug) {
    try {
      const market = await pb.collection('markets').getFirstListItem(
        `id = "${idOrSlug}" || slug = "${idOrSlug}"`,
        {
          expand: 'category,organizer'
        }
      );

      return market;
    } catch (error) {
      console.error('Error fetching market:', error);
      throw error;
    }
  }

  async createMarket(marketData) {
    try {
      console.log('Creating market with data:', marketData);
      const market = await pb.collection('markets').create(marketData);
      
      auditLogger.log('market_created', pb.authStore.model?.id, {
        marketId: market.id,
        marketName: market.name
      });

      return market;
    } catch (error) {
      console.error('Error creating market:', error);
      throw error;
    }
  }

  async updateMarket(id, marketData) {
    try {
      const market = await pb.collection('markets').update(id, marketData);

      auditLogger.log('market_updated', pb.authStore.model?.id, {
        marketId: id,
        changes: Object.keys(marketData)
      });

      return market;
    } catch (error) {
      console.error('Error updating market:', error);
      throw error;
    }
  }

  async deleteMarket(id) {
    try {
      await pb.collection('markets').delete(id);
      
      auditLogger.log('market_deleted', pb.authStore.model?.id, {
        marketId: id
      });

      return true;
    } catch (error) {
      console.error('Error deleting market:', error);
      throw error;
    }
  }

  // ===== MARKET CATEGORIES =====

  async getCategories() {
    try {
      console.log('Fetching categories from PocketBase...');
      const categories = await pb.collection('market_categories').getFullList({
        sort: 'sort_order,name'
      });
      console.log('Categories fetched successfully:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching categories from PocketBase:', error);
      
      // Fallback categories
      console.warn('Using fallback categories...');
      return [
        { id: 'farmers_fallback', name: 'Farmers Market', color: '#22c55e' },
        { id: 'craft_fallback', name: 'Craft & Artisan', color: '#8b5cf6' },
        { id: 'community_fallback', name: 'Community Market', color: '#3b82f6' },
        { id: 'specialty_fallback', name: 'Specialty Market', color: '#f59e0b' },
        { id: 'food_fallback', name: 'Food Market', color: '#ef4444' },
        { id: 'vintage_fallback', name: 'Vintage & Antiques', color: '#6b7280' }
      ];
    }
  }

  // ===== REQUIREMENTS SYSTEM =====

  async getRequirementTypes() {
    try {
      console.log('Fetching requirement types...');
      const types = await pb.collection('requirement_types').getFullList({
        filter: 'active = true',
        sort: 'category,sort_order,name'
      });
      
      // Group by category for easier UI handling
      const grouped = types.reduce((acc, type) => {
        if (!acc[type.category]) {
          acc[type.category] = [];
        }
        acc[type.category].push(type);
        return acc;
      }, {});

      console.log('Requirement types fetched:', types.length, 'types in', Object.keys(grouped).length, 'categories');
      return { types, grouped };
    } catch (error) {
      console.error('Error fetching requirement types:', error);
      
      // Return fallback types
      const fallbackTypes = [
        {
          id: 'insurance_fallback',
          name: 'Public Liability Insurance',
          description: 'Minimum public liability insurance coverage required',
          category: 'legal',
          value_type: 'amount',
          value_options: { currency: 'AUD', suggested_amounts: [2000000, 5000000, 10000000] },
          active: true,
          system_managed: true
        },
        {
          id: 'abn_fallback',
          name: 'ABN Registration',
          description: 'Valid Australian Business Number required',
          category: 'business',
          value_type: 'boolean',
          value_options: {},
          active: true,
          system_managed: true
        }
      ];
      
      const grouped = { legal: [fallbackTypes[0]], business: [fallbackTypes[1]] };
      return { types: fallbackTypes, grouped };
    }
  }

  async createRequirementType(typeData) {
    try {
      const type = await pb.collection('requirement_types').create({
        ...typeData,
        system_managed: false, // User-created types are not system managed
        active: true
      });
      
      auditLogger.log('requirement_type_created', pb.authStore.model?.id, {
        typeId: type.id,
        typeName: type.name
      });

      return type;
    } catch (error) {
      console.error('Error creating requirement type:', error);
      throw error;
    }
  }

  async getMarketRequirements(marketId) {
    try {
      const requirements = await pb.collection('market_requirements').getFullList({
        filter: `market = "${marketId}" && active = true`,
        expand: 'requirement_type',
        sort: 'requirement_type.category,requirement_type.sort_order'
      });
      
      console.log(`Fetched ${requirements.length} requirements for market ${marketId}`);
      return requirements;
    } catch (error) {
      console.error('Error fetching market requirements:', error);
      return [];
    }
  }

  async updateMarketRequirements(marketId, requirements) {
    try {
      console.log(`Updating requirements for market ${marketId}:`, requirements);
      
      // Delete existing requirements
      const existing = await pb.collection('market_requirements').getFullList({
        filter: `market = "${marketId}"`
      });
      
      for (const req of existing) {
        await pb.collection('market_requirements').delete(req.id);
      }

      // Create new requirements
      const created = [];
      for (const requirement of requirements) {
        const reqData = {
          market: marketId,
          requirement_type: requirement.requirement_type,
          is_required: requirement.is_required !== false,
          requirement_value: requirement.requirement_value || {},
          custom_notes: requirement.custom_notes || '',
          priority: requirement.priority || (requirement.is_required ? 'required' : 'optional'),
          active: true
        };
        
        const newReq = await pb.collection('market_requirements').create(reqData);
        created.push(newReq);
      }

      auditLogger.log('market_requirements_updated', pb.authStore.model?.id, {
        marketId,
        requirementCount: created.length
      });

      return created;
    } catch (error) {
      console.error('Error updating market requirements:', error);
      throw error;
    }
  }

  // ===== AMENITIES SYSTEM =====

  async getAmenityTypes() {
    try {
      const amenityTypes = await pb.collection('amenity_types').getFullList({
        sort: 'category,name'
      });

      const grouped = amenityTypes.reduce((acc, amenity) => {
        if (!acc[amenity.category]) {
          acc[amenity.category] = [];
        }
        acc[amenity.category].push(amenity);
        return acc;
      }, {});

      return grouped;
    } catch (error) {
      console.error('Error fetching amenity types:', error);
      return {
        facility: [
          { id: 'toilets', name: 'Toilets', category: 'facility' },
          { id: 'parking', name: 'Parking', category: 'facility' },
          { id: 'atm', name: 'ATM', category: 'facility' }
        ],
        service: [
          { id: 'food_court', name: 'Food Court', category: 'service' },
          { id: 'security', name: 'Security', category: 'service' }
        ],
        accessibility: [
          { id: 'wheelchair_access', name: 'Wheelchair Access', category: 'accessibility' }
        ]
      };
    }
  }

  async getMarketAmenities(marketId) {
    try {
      const amenities = await pb.collection('market_amenities').getFullList({
        filter: `market = "${marketId}"`,
        expand: 'amenity_type'
      });
      return amenities;
    } catch (error) {
      console.error('Error fetching market amenities:', error);
      return [];
    }
  }

  async updateMarketAmenities(marketId, amenities) {
    try {
      const existing = await pb.collection('market_amenities').getFullList({
        filter: `market = "${marketId}"`
      });

      for (const amenity of existing) {
        await pb.collection('market_amenities').delete(amenity.id);
      }

      const created = [];
      for (const amenity of amenities) {
        const newAmenity = await pb.collection('market_amenities').create({
          market: marketId,
          amenity_type: amenity.amenity_type,
          available: amenity.available !== false,
          notes: amenity.notes || ''
        });
        created.push(newAmenity);
      }

      return created;
    } catch (error) {
      console.error('Error updating market amenities:', error);
      throw error;
    }
  }

  // ===== SCHEDULES SYSTEM =====

  async getMarketSchedules(marketId) {
    try {
      const schedules = await pb.collection('market_schedules').getFullList({
        filter: `market = "${marketId}"`,
        sort: 'start_date'
      });
      return schedules;
    } catch (error) {
      console.error('Error fetching market schedules:', error);
      return [];
    }
  }

  // In marketService.js, replace the updateMarketSchedules function:

async updateMarketSchedules(marketId, schedules) {
  try {
    console.log(`Updating schedules for market ${marketId}:`, schedules)
    
    // Delete existing schedules
    const existing = await pb.collection('market_schedules').getFullList({
      filter: `market = "${marketId}"`
    })
    
    for (const schedule of existing) {
      await pb.collection('market_schedules').delete(schedule.id)
    }

    // Create new schedules with normalized data structure
    const created = []
    for (const schedule of schedules) {
      const scheduleData = {
        market: marketId,
        schedule_type: schedule.schedule_type,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        start_date: schedule.start_date || null,
        end_date: schedule.end_date || null,
        notes: schedule.notes || '',
        active: true,
        
        // Store the normalized pattern data as JSON
        pattern_data: {
          days_of_week: schedule.days_of_week || [],
          week_number: schedule.week_number || null,
          frequency_weeks: schedule.frequency_weeks || 1,
          custom_dates: schedule.custom_dates || []
        }
      }
      
      console.log('Creating schedule with data:', scheduleData)
      const newSchedule = await pb.collection('market_schedules').create(scheduleData)
      created.push(newSchedule)
    }

    console.log(`Created ${created.length} schedules`)
    return created
  } catch (error) {
    console.error('Error updating market schedules:', error)
    throw error
  }
}

  // ===== FEES SYSTEM =====

  async getMarketFees(marketId) {
    try {
      const fees = await pb.collection('market_fees').getFullList({
        filter: `market = "${marketId}"`,
        sort: 'fee_type'
      });
      return fees;
    } catch (error) {
      console.error('Error fetching market fees:', error);
      return [];
    }
  }

  async updateMarketFees(marketId, fees) {
    try {
      const existing = await pb.collection('market_fees').getFullList({
        filter: `market = "${marketId}"`
      });

      for (const fee of existing) {
        await pb.collection('market_fees').delete(fee.id);
      }

      const created = [];
      for (const fee of fees) {
        const newFee = await pb.collection('market_fees').create({
          market: marketId,
          fee_type: fee.fee_type,
          fee_name: fee.fee_name || fee.fee_type.replace('_', ' '),
          amount: parseFloat(fee.amount),
          currency: fee.currency || 'AUD',
          frequency: fee.frequency || 'per_day',
          required: fee.required !== false,
          conditions: fee.conditions || {},
          active: true
        });
        created.push(newFee);
      }

      return created;
    } catch (error) {
      console.error('Error updating market fees:', error);
      throw error;
    }
  }

  // ===== COMPREHENSIVE MARKET OPERATIONS =====

  async createMarketWithDetails(marketData, requirements = [], amenities = [], schedules = [], fees = []) {
    try {
      console.log('Creating comprehensive market...');
      
      // Create the main market record
      const market = await this.createMarket(marketData);
      console.log('Market created, adding details...');

      // Create all related records
      const results = {};
      
      if (requirements.length > 0) {
        try {
          results.requirements = await this.updateMarketRequirements(market.id, requirements);
          console.log(`Added ${results.requirements.length} requirements`);
        } catch (error) {
          console.warn('Could not create requirements:', error);
        }
      }

      if (amenities.length > 0) {
        try {
          results.amenities = await this.updateMarketAmenities(market.id, amenities);
          console.log(`Added ${results.amenities.length} amenities`);
        } catch (error) {
          console.warn('Could not create amenities:', error);
        }
      }

      if (schedules.length > 0) {
        try {
          results.schedules = await this.updateMarketSchedules(market.id, schedules);
          console.log(`Added ${results.schedules.length} schedules`);
        } catch (error) {
          console.warn('Could not create schedules:', error);
        }
      }

      if (fees.length > 0) {
        try {
          results.fees = await this.updateMarketFees(market.id, fees);
          console.log(`Added ${results.fees.length} fees`);
        } catch (error) {
          console.warn('Could not create fees:', error);
        }
      }

      auditLogger.log('comprehensive_market_created', pb.authStore.model?.id, {
        marketId: market.id,
        marketName: market.name,
        requirementCount: results.requirements?.length || 0,
        amenityCount: results.amenities?.length || 0,
        scheduleCount: results.schedules?.length || 0,
        feeCount: results.fees?.length || 0
      });

      return { market, ...results };
    } catch (error) {
      console.error('Error creating comprehensive market:', error);
      throw error;
    }
  }

  async getMarketWithDetails(idOrSlug) {
    try {
      const market = await this.getMarket(idOrSlug);

      // Fetch all related data in parallel
      const [requirements, amenities, schedules, fees] = await Promise.all([
        this.getMarketRequirements(market.id),
        this.getMarketAmenities(market.id),
        this.getMarketSchedules(market.id),
        this.getMarketFees(market.id)
      ]);

      return {
        ...market,
        requirements,
        amenities,
        schedules,
        fees
      };
    } catch (error) {
      console.error('Error fetching comprehensive market:', error);
      throw error;
    }
  }

  // ===== STALLHOLDER QUALIFICATION CHECKING =====

  async checkStallholderQualifications(stallholderId, marketId) {
    try {
      const [marketRequirements, stallholderQualifications] = await Promise.all([
        this.getMarketRequirements(marketId),
        pb.collection('stallholder_qualifications').getFullList({
          filter: `stallholder = "${stallholderId}"`,
          expand: 'requirement_type'
        })
      ]);

      const qualificationMap = new Map();
      stallholderQualifications.forEach(qual => {
        qualificationMap.set(qual.requirement_type, qual);
      });

      const results = {
        qualified: true,
        missing_required: [],
        missing_preferred: [],
        met_requirements: [],
        warnings: []
      };

      for (const requirement of marketRequirements) {
        const reqType = requirement.expand?.requirement_type;
        if (!reqType) continue;

        const qualification = qualificationMap.get(requirement.requirement_type);
        
        if (!qualification || qualification.status !== 'verified') {
          if (requirement.is_required) {
            results.qualified = false;
            results.missing_required.push({
              requirement: reqType.name,
              type: reqType.value_type,
              value: requirement.requirement_value
            });
          } else {
            results.missing_preferred.push({
              requirement: reqType.name,
              type: reqType.value_type,
              value: requirement.requirement_value
            });
          }
        } else {
          results.met_requirements.push({
            requirement: reqType.name,
            qualification: qualification
          });

          // Check expiry warnings
          if (qualification.expiry_date) {
            const expiryDate = new Date(qualification.expiry_date);
            const warningDate = new Date();
            warningDate.setMonth(warningDate.getMonth() + 1); // 1 month warning

            if (expiryDate < warningDate) {
              results.warnings.push({
                requirement: reqType.name,
                message: `Expires on ${expiryDate.toLocaleDateString()}`
              });
            }
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error checking stallholder qualifications:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  async searchNearby(latitude, longitude, radiusKm = 25) {
    try {
      const markets = await pb.collection('markets').getList(1, 50, {
        filter: 'latitude != null && longitude != null',
        expand: 'category'
      });

      const marketsWithDistance = markets.items.map(market => {
        const distance = this.calculateDistance(
          latitude, longitude,
          market.latitude, market.longitude
        );
        return { ...market, distance };
      });

      return marketsWithDistance
        .filter(market => market.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error searching nearby markets:', error);
      throw error;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export default new MarketService();