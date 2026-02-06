import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    userType: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Try to load user data from localStorage on initialization
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const updateUser = (userData: Partial<User>) => {
        setUser(prevUser => {
            const updatedUser = prevUser ? { ...prevUser, ...userData } : userData as User;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const setUserData = (userData: User | null) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser: setUserData, 
            updateUser 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};