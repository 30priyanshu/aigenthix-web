/**
 * Enrollment Service.
 * Handles learning and development enrollment submissions.
 */
import { apiClient } from './api';

const AGENTIC_AI_PROGRAM = {
    programSlug: 'agentic-ai',
    programTitle: 'Agentic AI',
};

class EnrollmentService {
    toEnrollmentPayload(formData, metadata = {}) {
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || formData.companyEmail,
            phoneNumber: formData.phoneNumber || null,
            programSlug: metadata.programSlug || AGENTIC_AI_PROGRAM.programSlug,
            programTitle: metadata.programTitle || AGENTIC_AI_PROGRAM.programTitle,
            requestType: metadata.requestType || 'enroll',
            message: formData.message || formData.comments,
            termsAccepted: Boolean(formData.termsAccepted ?? formData.agreeToTerms),
        };
    }

    async submitEnrollmentForm(formData, metadata = {}) {
        return apiClient.post('/api/enrollments', this.toEnrollmentPayload(formData, metadata));
    }
}

export const enrollmentService = new EnrollmentService();
export { AGENTIC_AI_PROGRAM };
