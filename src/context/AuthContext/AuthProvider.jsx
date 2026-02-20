import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // User DB sync — /users/login endpoint call
  const syncUserWithDatabase = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosSecure.post("/users/login", {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      });

      if (response.data.success) {
        const dbUser = response.data.user;

        setUser({
          // Firebase data
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || dbUser.name,
          photoURL: firebaseUser.photoURL || dbUser.avatar,
          emailVerified: firebaseUser.emailVerified,
          // DB data
          _id: dbUser._id,
          name: dbUser.name,
          phone: dbUser.phone || "",
          role: dbUser.role,
          status: dbUser.status,
          totalOrders: dbUser.totalOrders || 0,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        });
      }
    } catch (error) {
      console.error("Error syncing user with database:", error);
      setUser({
        ...firebaseUser,
        role: "buyer",
        status: "active",
        totalOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // User data refresh
  const refreshUser = async () => {
    if (!user?.email) return;

    try {
      const response = await axiosSecure.get(`/users/email/${user.email}`);

      if (response.data.success) {
        const dbUser = response.data.user;
        setUser((prev) => ({
          ...prev,
          _id: dbUser._id,
          name: dbUser.name,
          phone: dbUser.phone || "",
          role: dbUser.role,
          status: dbUser.status,
          totalOrders: dbUser.totalOrders,
          photoURL: dbUser.avatar || prev.photoURL,
          updatedAt: dbUser.updatedAt,
        }));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const signUpFunc = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInFunc = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = async (profile) => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, profile);
      if (user?._id) await refreshUser();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Auth state observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await syncUserWithDatabase(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    signUpFunc,
    signInFunc,
    signInGoogle,
    logOut,
    updateUserProfile,
    refreshUser,
    syncUserWithDatabase,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
