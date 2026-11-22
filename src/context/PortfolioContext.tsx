"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import defaultDataJson from "@/data/portfolioData.json";
import { PortfolioData } from "@/types/portfolio";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  saveData: (updated: PortfolioData) => Promise<{ success: boolean; message?: string }>;
  resetToDefault: () => Promise<void>;
}

const defaultData = defaultDataJson as unknown as PortfolioData;

const PortfolioContext = createContext<PortfolioContextType>({
  data: defaultData,
  isLoading: true,
  saveData: async () => ({ success: false }),
  resetToDefault: async () => {},
});

const STORAGE_KEY = "gta6_portfolio_custom_data";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from API and localStorage on mount
  useEffect(() => {
    async function loadInitial() {
      // 1. First check localStorage for immediate client cache
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.profile) {
            setData(parsed);
          }
        }
      } catch (err) {
        console.warn("Could not read from localStorage:", err);
      }

      // 2. Fetch fresh data from backend API
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && serverData.profile) {
            setData(serverData);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Could not fetch /api/portfolio, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitial();
  }, []);

  // Save updated data to both API (file persistence) and localStorage
  const saveData = async (updated: PortfolioData): Promise<{ success: boolean; message?: string }> => {
    setData(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        return { success: true, message: "Changes saved to database and synchronized!" };
      } else {
        return { success: true, message: "Saved to browser cache (server write failed)" };
      }
    } catch (err) {
      console.warn("API write failed, data preserved in browser cache:", err);
      return { success: true, message: "Saved to local cache" };
    }
  };

  // Reset to default data
  const resetToDefault = async () => {
    setData(defaultData);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultData),
      });
    } catch (err) {
      console.warn("Reset error:", err);
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, isLoading, saveData, resetToDefault }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
