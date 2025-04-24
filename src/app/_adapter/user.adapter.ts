import { User } from '../_model/user.interface';

export class UserAdapter {
  static adaptFromApi(apiUser: any): User {
    return {
      id: apiUser.id,
      username: apiUser.username,
      email: apiUser.email,
      name: apiUser.name,
      avatar: apiUser.avatar,
      role: apiUser.role || 'user',
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
      lastLogin: apiUser.last_login,
      isActive: apiUser.is_active || true,
      preferences: apiUser.preferences || {}
    };
  }

  static adaptToApi(user: User): any {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      last_login: user.lastLogin,
      is_active: user.isActive,
      preferences: user.preferences
    };
  }

  static adaptPreferences(preferences: any): any {
    return {
      language: preferences.language || 'es',
      theme: preferences.theme || 'light',
      notifications: preferences.notifications || true,
      emailNotifications: preferences.emailNotifications || true,
      watchlistVisibility: preferences.watchlistVisibility || 'private'
    };
  }
}
