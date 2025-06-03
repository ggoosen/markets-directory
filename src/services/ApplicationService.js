// src/services/ApplicationService.js - Fix the import and missing methods
import pb from '../lib/pocketbase.js';
import { auditLogger } from '../utils/security.js';

class ApplicationService {
  // Get applications for market organizer
  async getMarketApplications(marketId, filters = {}) {
    try {
      const filterConditions = [`market = "${marketId}"`];
      
      if (filters.status) {
        filterConditions.push(`status = "${filters.status}"`);
      }

      const result = await pb.collection('applications').getList(
        filters.page || 1,
        filters.perPage || 20,
        {
          filter: filterConditions.join(' && '),
          sort: '-created',
          expand: 'stallholder,stallholder.user,market'
        }
      );

      return result;
    } catch (error) {
      console.error('Error fetching market applications:', error);
      throw error;
    }
  }

  // Get applications for stallholder (method that was missing)
  async getStallholderApplications(stallholderId, filters = {}) {
    try {
      const filterConditions = [`stallholder = "${stallholderId}"`];
      
      if (filters.status) {
        filterConditions.push(`status = "${filters.status}"`);
      }

      const result = await pb.collection('applications').getList(
        filters.page || 1,
        filters.perPage || 20,
        {
          filter: filterConditions.join(' && '),
          sort: '-created',
          expand: 'market,stallholder'
        }
      );

      return result;
    } catch (error) {
      console.error('Error fetching stallholder applications:', error);
      throw error;
    }
  }

  // Submit application to market
  async submitApplication(applicationData) {
    try {
      const application = await pb.collection('applications').create({
        ...applicationData,
        status: 'pending',
        payment_status: 'unpaid'
      });
      
      auditLogger.log('application_submitted', pb.authStore.model?.id, {
        applicationId: application.id,
        marketId: applicationData.market,
        stallholderId: applicationData.stallholder
      });

      return application;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId, status, organizerNotes = '') {
    try {
      const application = await pb.collection('applications').update(applicationId, {
        status,
        organizer_notes: organizerNotes
      });
      
      auditLogger.log('application_status_updated', pb.authStore.model?.id, {
        applicationId,
        newStatus: status
      });

      return application;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Get application statistics for market
  async getApplicationStats(marketId) {
    try {
      const applications = await pb.collection('applications').getFullList({
        filter: `market = "${marketId}"`
      });

      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        cancelled: applications.filter(app => app.status === 'cancelled').length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  }

  // Check if stallholder has existing application for market
  async checkExistingApplication(stallholderId, marketId) {
    try {
      const existing = await pb.collection('applications').getFirstListItem(
        `stallholder = "${stallholderId}" && market = "${marketId}" && status != "cancelled" && status != "rejected"`
      );
      return existing;
    } catch (error) {
      if (error.status === 404) {
        return null; // No existing application
      }
      throw error;
    }
  }

  // Cancel application
  async cancelApplication(applicationId) {
    try {
      const application = await pb.collection('applications').update(applicationId, {
        status: 'cancelled'
      });
      
      auditLogger.log('application_cancelled', pb.authStore.model?.id, {
        applicationId
      });

      return application;
    } catch (error) {
      console.error('Error cancelling application:', error);
      throw error;
    }
  }
}

export default new ApplicationService();