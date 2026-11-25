import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";

const Web3Context = createContext(null);

// Deterministic Hardhat test accounts for simulated demo mode (zero extension dependency)
export const DEMO_WALLETS = {
  patient: {
    role: "patient",
    name: "Demo Patient (Account 0)",
    address: "0xf39Fd2eE8f2F71792FcA73506474f1485f7f357d",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  doctor: {
    role: "doctor",
    name: "Demo Doctor (Account 1)",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  admin: {
    role: "admin",
    name: "Demo Admin (Account 2)",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
};

/**
 * Resolves the active Ethereum provider.
 * When multiple Web3 extensions (e.g. MetaMask, Phantom, Coinbase) are active,
 * window.ethereum.providers contains all injected providers. We prioritize MetaMask.
 */
export function getEthereumProvider() {
  if (typeof window === "undefined" || !window.ethereum) return null;

  if (Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
    const metaMask = window.ethereum.providers.find(
      (p) => p.isMetaMask && !p.isPhantom && !p.isCoinbaseWallet
    );
    if (metaMask) return metaMask;

    const anyMetaMask = window.ethereum.providers.find((p) => p.isMetaMask);
    if (anyMetaMask) return anyMetaMask;

    return window.ethereum.providers[0];
  }

  return window.ethereum;
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);

  const signerRef = useRef(null);

  useEffect(() => {
    const initProvider = async () => {
      const eth = getEthereumProvider();
      if (!eth) return;

      try {
        const browserProvider = new ethers.BrowserProvider(eth);
        setProvider(browserProvider);

        const accounts = await eth.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          const browserSigner = await browserProvider.getSigner();
          setSigner(browserSigner);
          signerRef.current = browserSigner;
          const network = await browserProvider.getNetwork();
          setChainId(network.chainId.toString());
        }
      } catch (err) {
        console.warn("Silent Web3 initialization notice:", err.message);
      }
    };

    initProvider();

    // MetaMask emits ethereum#initialized if it injects asynchronously
    if (typeof window !== "undefined") {
      window.addEventListener("ethereum#initialized", initProvider, { once: true });
    }

    const eth = getEthereumProvider();
    if (eth && eth.on) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) {
            try {
              const browserSigner = await provider.getSigner();
              setSigner(browserSigner);
              signerRef.current = browserSigner;
            } catch (_) {}
          }
        } else {
          setAccount(null);
          setSigner(null);
          signerRef.current = null;
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      eth.on("accountsChanged", handleAccountsChanged);
      eth.on("chainChanged", handleChainChanged);

      return () => {
        if (eth.removeListener) {
          eth.removeListener("accountsChanged", handleAccountsChanged);
          eth.removeListener("chainChanged", handleChainChanged);
        }
        if (typeof window !== "undefined") {
          window.removeEventListener("ethereum#initialized", initProvider);
        }
      };
    }
  }, [provider]);

  const connectWallet = useCallback(async () => {
    const eth = getEthereumProvider();
    if (!eth) {
      const msg =
        "MetaMask or Web3 wallet extension not detected in this browser window. " +
        "If you are using an Incognito/Private window, open 'chrome://extensions', click Details on MetaMask, and enable 'Allow in Incognito'.";
      setError(msg);
      throw new Error(msg);
    }

    try {
      setIsConnecting(true);
      setError("");

      const browserProvider = new ethers.BrowserProvider(eth);
      const accounts = await browserProvider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in MetaMask. Please unlock MetaMask and import or create an account.");
      }

      const activeAccount = accounts[0];
      const browserSigner = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();

      setAccount(activeAccount);
      setSigner(browserSigner);
      signerRef.current = browserSigner;
      setChainId(network.chainId.toString());
      setProvider(browserProvider);
      setIsSimulated(false);

      return activeAccount;
    } catch (err) {
      console.error("Wallet connection error:", err);
      let userMsg = err.shortMessage || err.message || "Failed to connect wallet";
      if (err.code === -32002 || (err.message && err.message.includes("already pending"))) {
        userMsg =
          "A connection request is already pending in MetaMask. Please open your MetaMask extension popup to approve or cancel it.";
      } else if (err.code === 4001 || (err.message && err.message.includes("rejected"))) {
        userMsg = "Connection request was rejected in MetaMask. Please click 'Connect Wallet' and approve the prompt.";
      }
      setError(userMsg);
      throw new Error(userMsg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Connects via local deterministic demo key (Zero external extension dependency)
  const connectSimulatedWallet = useCallback((role = "patient") => {
    const target = DEMO_WALLETS[role] || DEMO_WALLETS.patient;
    const simulatedWallet = new ethers.Wallet(target.privateKey);

    signerRef.current = simulatedWallet;
    setAccount(simulatedWallet.address);
    setSigner(simulatedWallet);
    setChainId("31337");
    setIsSimulated(true);
    setError("");

    return simulatedWallet;
  }, []);

  // Signs an arbitrary UTF-8 message (EIP-191 personal_sign)
  const signMessage = useCallback(
    async (message, customSigner = null) => {
      const activeSigner = customSigner || signerRef.current || signer;
      if (activeSigner) {
        return activeSigner.signMessage(message);
      }
      const eth = getEthereumProvider();
      const activeProvider =
        provider || (eth ? new ethers.BrowserProvider(eth) : null);
      if (!activeProvider) throw new Error("No wallet provider available to sign message");
      const activeSignerFromProvider = await activeProvider.getSigner();
      signerRef.current = activeSignerFromProvider;
      return activeSignerFromProvider.signMessage(message);
    },
    [provider, signer]
  );

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    signerRef.current = null;
    setIsSimulated(false);
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
        isSimulated,
        connectWallet,
        connectSimulatedWallet,
        disconnectWallet,
        signMessage,
        isWalletConnected: !!account,
        shortAddress: account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "",
        hasInjectedProvider: !!getEthereumProvider(),
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
