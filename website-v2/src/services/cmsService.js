// src/services/cmsService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const cmsService = {
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/cms/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getServices: async () => {
    try {
      const response = await fetch(`${API_URL}/cms/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getIndustries: async () => {
    try {
      const response = await fetch(`${API_URL}/cms/industries`);
      if (!response.ok) throw new Error('Failed to fetch industries');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getRDs: async () => {
    try {
      const response = await fetch(`${API_URL}/cms/rd`);
      if (!response.ok) throw new Error('Failed to fetch R&D');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};
