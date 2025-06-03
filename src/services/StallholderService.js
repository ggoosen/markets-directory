// src/services/StallholderService.js - Updated to fix import issues
import pb from '../lib/pocketbase.js';
import { auditLogger } from '../utils/security.js';
import ApplicationService from './ApplicationService.js';

class StallholderService {
  // Get all stallholders with filtering
  async getStallholders(filters = {}) {
    try {
      const filterConditions = ['user != ""']; // Changed from 'active = true' since we don't have that field
      
      if (filters.category) {
        filterConditions.push(`product_categories ~ "${filters.category}"`);
      }
      
      if (filters.state) {
        filterConditions.push(`state = "${filters.state}"`);
      }
      
      if (filters.search) {
        filterConditions.push(`(business_name ~ "${filters.search}" || description ~ "${filters.search}")`);
      }

      if (filters.rating) {
        filterConditions.push(`rating >= ${filters.rating}`);
      }

      if (filters.user) {
        filterConditions.push(`user = "${filters.user}"`);
      }

      const result = await pb.collection('stallholders').getList(
        filters.page || 1,
        filters.perPage || 20,
        {
          filter: filterConditions.join(' && '),
          sort: filters.sort || '-created',
          expand: 'user'
        }
      );

      return result;
    } catch (error) {
      console.error('Error fetching stallholders:', error);
      throw error;
    }
  }

  // Get single stallholder
  async getStallholder(id) {
    try {
      const stallholder = await pb.collection('stallholders').getOne(id, {
        expand: 'user'
      });
      return stallholder;
    } catch (error) {
      console.error('Error fetching stallholder:', error);
      throw error;
    }
  }

  // Create stallholder profile
  async createStallholder(stallholderData) {
    try {
      const stallholder = await pb.collection('stallholders').create(stallholderData);
      
      auditLogger.log('stallholder_created', pb.authStore.model?.id, {
        stallholderId: stallholder.id,
        businessName: stallholder.business_name
      });

      return stallholder;
    } catch (error) {
      console.error('Error creating stallholder:', error);
      throw error;
    }
  }

  // Update stallholder profile
  async updateStallholder(id, stallholderData) {
    try {
      const stallholder = await pb.collection('stallholders').update(id, stallholderData);
      
      auditLogger.log('stallholder_updated', pb.authStore.model?.id, {
        stallholderId: id,
        changes: Object.keys(stallholderData)
      });

      return stallholder;
    } catch (error) {
      console.error('Error updating stallholder:', error);
      throw error;
    }
  }

  // Get stallholder's applications - now properly delegated
  async getApplications(stallholderId, filters = {}) {
    return ApplicationService.getStallholderApplications(stallholderId, filters);
  }

  // Submit application to market - now properly delegated
  async submitApplication(applicationData) {
    return ApplicationService.submitApplication(applicationData);
  }

  // Get reviews for stallholder
  async getReviews(stallholderId) {
    try {
      const reviews = await pb.collection('reviews').getList(1, 50, {
        filter: `target_id = "${stallholderId}" && target_type = "stallholder"`,
        sort: '-created',
        expand: 'reviewer'
      });
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Add review for stallholder
  async addReview(reviewData) {
    try {
      const review = await pb.collection('reviews').create({
        ...reviewData,
        target_type: 'stallholder'
      });

      // Update stallholder rating
      await this.updateStallholderRating(reviewData.target_id);
      
      auditLogger.log('review_added', pb.authStore.model?.id, {
        reviewId: review.id,
        targetId: reviewData.target_id,
        rating: reviewData.rating
      });

      return review;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Update stallholder's average rating
  async updateStallholderRating(stallholderId) {
    try {
      const reviews = await pb.collection('reviews').getFullList({
        filter: `target_id = "${stallholderId}" && target_type = "stallholder"`
      });

      if (reviews.length === 0) return;

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await pb.collection('stallholders').update(stallholderId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviews_count: reviews.length
      });
    } catch (error) {
      console.error('Error updating stallholder rating:', error);
    }
  }

  // Get product categories
  async getProductCategories() {
    return [
      'Fresh Produce',
      'Baked Goods',
      'Arts & Crafts',
      'Clothing & Accessories',
      'Food & Beverages',
      'Home & Garden',
      'Beauty & Wellness',
      'Books & Media',
      'Vintage & Antiques',
      'Handmade Jewelry',
      'Plants & Flowers',
      'Other'
    ];
  }
}

export default new StallholderService();