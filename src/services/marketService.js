// src/services/marketService.js - Updated with better error handling
import pb from '../lib/pocketbase.js';
import { auditLogger } from '../utils/security.js';

class MarketService {
  // Get all active markets
  async getMarkets(filters = {}) {
    try {
      const filterConditions = []; // Removed 'active = true' since the field might not exist yet
      
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

  // Get single market by ID or slug
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

  // Create new market
  async createMarket(marketData) {
    try {
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

  // Update market
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

  // Delete market
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

  // Search markets by location (geolocation)
  async searchNearby(latitude, longitude, radiusKm = 25) {
    try {
      // This is a simplified version - in production you'd use proper geospatial queries
      const markets = await pb.collection('markets').getList(1, 50, {
        filter: 'latitude != null && longitude != null',
        expand: 'category'
      });

      // Calculate distances client-side (in production, do this server-side)
      const marketsWithDistance = markets.items.map(market => {
        const distance = this.calculateDistance(
          latitude, longitude,
          market.latitude, market.longitude
        );
        return { ...market, distance };
      });

      // Filter by radius and sort by distance
      return marketsWithDistance
        .filter(market => market.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error searching nearby markets:', error);
      throw error;
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Get market categories - handle case where collection might not exist yet
  async getCategories() {
    try {
      const categories = await pb.collection('market_categories').getFullList({
        sort: 'name'
      });
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return default categories if collection doesn't exist yet
      return [
        { id: 'farmers', name: 'Farmers Market', color: '#22c55e' },
        { id: 'craft', name: 'Craft & Artisan', color: '#8b5cf6' },
        { id: 'community', name: 'Community Market', color: '#3b82f6' },
        { id: 'specialty', name: 'Specialty Market', color: '#f59e0b' },
        { id: 'food', name: 'Food Market', color: '#ef4444' },
        { id: 'vintage', name: 'Vintage & Antiques', color: '#6b7280' }
      ];
    }
  }
}

export default new MarketService();