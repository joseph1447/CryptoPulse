"use client";
import { I18nContext } from "@/context/i18n-provider";
import { useContext } from "react";

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
