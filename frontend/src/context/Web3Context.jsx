import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { updateWallet } from "../api";
import { useAuth } from "./AuthContext";

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleWalletSync = useCallback(
    async (newAddress) => {
      if (user && user.walletAddress !== newAddress.toLowerCase()) {
        try {
          await updateWallet(newAddress);
          refreshUser();
        } catch (err) {
          console.warn("Wallet sync warning:", err.message);
        }
      }
    },
    [user, refreshUser]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      window.ethereum
        .request({ method: "eth_accounts" })
        .then(async (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const browserSigner = await browserProvider.getSigner();
            setSigner(browserSigner);
          }
        })
        .catch(console.error);

      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const browserSigner = await browserProvider.getSigner();
          setSigner(browserSigner);
          handleWalletSync(accounts[0]);
        } else {
          setAccount(null);
          setSigner(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [handleWalletSync]);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask or Web3 wallet extension not detected. You can still use simulated off-chain mode!");
      return null;
    }

    try {
      setIsConnecting(true);
      setError("");
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const activeAccount = accounts[0];
      const browserSigner = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();

      setAccount(activeAccount);
      setSigner(browserSigner);
      setChainId(network.chainId.toString());
      setProvider(browserProvider);

      handleWalletSync(activeAccount);
      return activeAccount;
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect wallet");
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        provider,
        signer,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        isWalletConnected: !!account,
        shortAddress: account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "",
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
