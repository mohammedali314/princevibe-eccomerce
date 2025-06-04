const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';

class UserService {
  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  // Get user orders by user ID
  async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      return data.data || [];
    } catch (error) {
      console.error('User orders fetch error:', error);
      // Fallback to empty array if error
      return [];
    }
  }

  // Get user orders by email (fallback method)
  async getUserOrdersByEmail(email) {
    try {
      const response = await fetch(`${API_URL}/orders/by-email/${encodeURIComponent(email)}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      return data.data || [];
    } catch (error) {
      console.error('User orders by email fetch error:', error);
      // Fallback to empty array if error
      return [];
    }
  }
}

const userService = new UserService();
export default userService; 