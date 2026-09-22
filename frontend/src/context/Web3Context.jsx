import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

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
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask or Web3 wallet extension not detected. A wallet is required to authenticate.");
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

      return activeAccount;
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.shortMessage || err.message || "Failed to connect wallet");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Signs an arbitrary UTF-8 message (EIP-191 personal_sign) with the active
  // account's key. Used to prove wallet ownership during auth.
  const signMessage = useCallback(
    async (message) => {
      const activeProvider = provider || (typeof window !== "undefined" && window.ethereum
        ? new ethers.BrowserProvider(window.ethereum)
        : null);
      if (!activeProvider) throw new Error("No wallet provider available");
      const activeSigner = signer || (await activeProvider.getSigner());
      return activeSigner.signMessage(message);
    },
    [provider, signer]
  );

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
        signMessage,
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
