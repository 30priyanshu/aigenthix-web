import { apiClient } from './api';

class CareersService {
  async submitCareersForm(formData) {
    const requestData = new FormData();
    requestData.append('fullName', formData.fullName);
    requestData.append('email', formData.email);
    if (formData.phone) requestData.append('phone', formData.phone);
    requestData.append('position', formData.position);
    if (formData.experience) requestData.append('experience', formData.experience);
    if (formData.message) requestData.append('message', formData.message);
    if (formData.resume) requestData.append('resume', formData.resume);
    return apiClient.postForm('/api/careers', requestData, 30000);
  }
}

export const careersService = new CareersService();
