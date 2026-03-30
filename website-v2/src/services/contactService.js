/**
 * Contact Service.
 * Handles contact form submissions.
 */
import { apiClient } from './api';

class ContactService {
    toContactPayload(formData) {
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyEmail: formData.companyEmail,
            companyName: formData.companyName,
            jobTitle: formData.jobTitle,
            phoneNumber: formData.phoneNumber || null,
            country: formData.country,
            comments: formData.comments,
        };
    }

    /**
     * Submit contact form data.
     * 
     * @param {Object} formData
     * @returns {Promise<Object>} Response data
     */
    async submitContactForm(formData) {
        return apiClient.post('/api/contact', this.toContactPayload(formData));
    }
}

export const contactService = new ContactService();
