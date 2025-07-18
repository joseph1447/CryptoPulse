"use client";
import { CryptoContext } from "@/context/crypto-provider";
import { useContext } from "react";

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};
