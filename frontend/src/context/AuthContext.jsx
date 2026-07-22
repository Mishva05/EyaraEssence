import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    user: null
  });
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on boot
  useEffect(() => {
    // 1. Seed default customer if empty (for testing convenience)
    if (!localStorage.getItem('eyara_users')) {
      const defaultUsers = [
        {
          name: "Jane Doe",
          email: "customer@example.com",
          password: "password",
          phone: "9876543211",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('eyara_users', JSON.stringify(defaultUsers));
    }

    // 2. Authoritative check on eyara_auth
    const storedAuth = localStorage.getItem('eyara_auth');
    if (storedAuth) {
      try {
        setAuthState(JSON.parse(storedAuth));
      } catch (e) {
        console.error("Failed to parse stored auth", e);
        // Clean up corrupted storage
        localStorage.removeItem('eyara_auth');
      }
    } else {
      // 3. Clear stale legacy keys if unauthenticated on boot
      localStorage.removeItem('eyara_admin_logged_in');
      localStorage.removeItem('eyara_admin_profile');
      localStorage.removeItem('eyara_user');
    }
    setLoading(false);
  }, []);

  // Customer Login Path
  const customerLogin = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === 'admin@eyara.com') {
      throw new Error("Admin credentials cannot be used for customer login. Please choose Admin type.");
    }

    const registeredUsers = JSON.parse(localStorage.getItem('eyara_users') || '[]');
    const customer = registeredUsers.find(
      u => u.email.toLowerCase().trim() === normalizedEmail && u.password === password
    );

    if (customer) {
      const customerState = {
        isAuthenticated: true,
        role: 'customer',
        user: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || ''
        }
      };

      // Set authoritative state
      localStorage.setItem('eyara_auth', JSON.stringify(customerState));
      
      // Sync legacy customer key for backward compatibility
      localStorage.setItem('eyara_user', JSON.stringify(customerState.user));
      
      // Clean up legacy admin keys to prevent role conflicts
      localStorage.removeItem('eyara_admin_logged_in');
      localStorage.removeItem('eyara_admin_profile');

      setAuthState(customerState);
      return 'customer';
    }

    throw new Error("Invalid email or password. Please check your credentials.");
  };

  // Admin Login Path
  const adminLogin = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === 'admin@eyara.com' && password === 'password') {
      const adminState = {
        isAuthenticated: true,
        role: 'admin',
        user: {
          name: "Eyara Essence Admin",
          email: "admin@eyara.com"
        }
      };

      // Set authoritative state
      localStorage.setItem('eyara_auth', JSON.stringify(adminState));
      
      // Sync legacy admin keys for backward compatibility
      localStorage.setItem('eyara_admin_logged_in', 'true');
      localStorage.setItem('eyara_admin_profile', JSON.stringify(adminState.user));
      
      // Clean up legacy customer key to prevent role conflicts
      localStorage.removeItem('eyara_user');

      setAuthState(adminState);
      
      console.warn("⚠️ [Eyara Essence - Dev Security Warning]: Authenticated as Admin via frontend mock path.");
      return 'admin';
    }

    throw new Error("Invalid admin credentials. Use demo coordinates: admin@eyara.com / password.");
  };

  // Customer Signup Path
  const signup = async (name, email, password, phone) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === 'admin@eyara.com') {
      throw new Error("Reserved email address.");
    }

    const registeredUsers = JSON.parse(localStorage.getItem('eyara_users') || '[]');
    const alreadyExists = registeredUsers.some(u => u.email.toLowerCase().trim() === normalizedEmail);

    if (alreadyExists) {
      throw new Error("An account is already registered with this email.");
    }

    const newUser = {
      name,
      email: normalizedEmail,
      password,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    registeredUsers.push(newUser);
    localStorage.setItem('eyara_users', JSON.stringify(registeredUsers));

    const customerState = {
      isAuthenticated: true,
      role: 'customer',
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    };

    // Set authoritative state
    localStorage.setItem('eyara_auth', JSON.stringify(customerState));
    
    // Sync legacy customer key for backward compatibility
    localStorage.setItem('eyara_user', JSON.stringify(customerState.user));
    
    // Clean up legacy admin keys to prevent conflicts
    localStorage.removeItem('eyara_admin_logged_in');
    localStorage.removeItem('eyara_admin_profile');

    setAuthState(customerState);
    return 'customer';
  };

  // Logout Path
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      role: null,
      user: null
    });
    
    // Clear all storage keys to eradicate any conflicting states
    localStorage.removeItem('eyara_auth');
    localStorage.removeItem('eyara_user');
    localStorage.removeItem('eyara_admin_logged_in');
    localStorage.removeItem('eyara_admin_profile');
  };

  const value = {
    user: authState.user,
    role: authState.role,
    isAuthenticated: authState.isAuthenticated,
    loading,
    customerLogin,
    adminLogin,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be called inside an AuthProvider");
  }
  return context;
}
