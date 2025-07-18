"use client";
import { useTheme as useNextTheme } from "@/context/theme-provider";

export const useTheme = () => {
    const context = useNextTheme();
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
