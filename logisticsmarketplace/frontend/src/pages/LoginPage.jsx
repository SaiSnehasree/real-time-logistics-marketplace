import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import { Truck, Mail, Lock, ArrowRight , Eye , EyeOff } from "lucide-react";
import api from "../services/api";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="
    min-h-screen
    bg-gradient-to-br
    from-slate-950
    via-black
    to-slate-950
    text-white
    relative
    overflow-hidden
">

            <div className="absolute top-0 left-0 w-full h-full">

                <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

                <div className="text-center mb-12">

                    <div className="text-7xl mb-6">
                        🚚
                    </div>

                    <h1 className="text-7xl font-black tracking-tight">
                        Logi<span className="text-cyan-400">Flow</span>
                    </h1>

                    <p className="mt-6 text-2xl text-slate-300">
                        Real-Time Logistics Marketplace
                    </p>

                    <p className="mt-4 text-slate-500 max-w-2xl">
                        Connect shippers, carriers and customers through one unified
                        freight marketplace with real-time shipment tracking.
                    </p>

                </div>

                <div
                    className="
    w-full
    max-w-md
    bg-white/5
    backdrop-blur-xl
    border
    border-white/10
    rounded-[32px]
    p-8
    shadow-[0_0_60px_rgba(6,182,212,0.15)]
"
                >
                        <div className="flex flex-col items-center">

                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                                <Truck size={36} />
                            </div>

                            <h2 className="text-3xl font-bold text-center">
                                Welcome Back
                            </h2>

                            <p className="text-center text-slate-400 mt-3">
                                Log in to continue to LogiFlow
                            </p>

                        </div>

                        <form
                            onSubmit={handleLogin}
                            className="mt-10 space-y-6"
                        >

                            <div>

                                <label className="text-sm text-slate-400">
                                    Email
                                </label>

                                <div className="mt-2 relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-4 text-slate-500"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 outline-none"
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                            </div>

                            <div>

                                <label className="text-sm text-slate-400">
                                    Password
                                </label>

                                <div className="mt-2 relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-4 text-slate-500"
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 outline-none"
                                        placeholder="Enter your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-4 text-slate-400 hover:text-cyan-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                            >
                                Log In
                                <ArrowRight size={18} />
                            </button>
                            <p className="text-center text-slate-400 text-sm mt-4">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-cyan-400 hover:text-cyan-300"
                                >
                                    Create Account
                                </Link>
                            </p>

                        </form>
                    <div className="mt-12 flex gap-10 text-center justify-center">

                        <div>
                            <h3 className="text-3xl font-bold text-cyan-400">
                                10K+
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Shipments
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-cyan-400">
                                5K+
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Carriers
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-cyan-400">
                                25+
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Cities
                            </p>
                        </div>

                    </div>

                    </div>

                </div>

            </div>


    );
}