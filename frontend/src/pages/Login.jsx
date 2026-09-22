import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { requestNonce } from "../api";
import { Activity, Wallet, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { account, chainId, connectWallet, signMessage, isConnecting } = useWeb3();
  const navigate = useNavigate();

  const routeByRole = (role) => {
    if (role === "doctor") navigate("/doctor-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
    else navigate("/patient-dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 1. Make sure a wallet is connected (identity = the wallet itself).
      let activeAccount = account;
      if (!activeAccount) {
        activeAccount = await connectWallet();
        if (!activeAccount) {
          setError("A Web3 wallet is required to sign in.");
          return;
        }
      }

      // 2. Ask the server for a single-use challenge message for this wallet.
      const challenge = await requestNonce(activeAccount, chainId);
      if (!challenge.registered) {
        setError("No account found for this wallet. Please register first.");
        return;
      }

      // 3. Sign the challenge with the wallet's private key (no password sent).
      const signature = await signMessage(challenge.message);

      // 4. Exchange the signature for a session token.
      const res = await login({
        walletAddress: activeAccount,
        message: challenge.message,
        signature,
      });

      routeByRole(res.user?.role);
    } catch (err) {
      setError(err.message || "Wallet authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20 mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to CareChain
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your encrypted health vault by proving ownership of your wallet
          </p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-xs">
                <Wallet className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-700">Wallet</span>
              </div>
              {account ? (
                <span className="font-mono text-[11px] text-slate-700">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Not connected</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              You&apos;ll be asked to sign a gasless, single-use message. We never see a password or your key.
            </div>

            <button
              type="submit"
              disabled={loading || isConnecting}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>
                {loading
                  ? "Awaiting signature..."
                  : account
                    ? "Sign In with Wallet"
                    : "Connect Wallet & Sign In"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              First time here?{" "}
              <Link to="/register" className="font-semibold text-sky-600 hover:underline">
                Register your wallet identity
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
