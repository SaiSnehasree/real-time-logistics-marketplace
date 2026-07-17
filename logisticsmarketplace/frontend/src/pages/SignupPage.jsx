import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Navigation, Briefcase } from "lucide-react";
import api from "../services/api";

export default function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("SHIPPER");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            const data = response.data.data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                id: data.userId,
                name: data.name,
                role: data.role
            }));
            
            navigate("/");
        } catch {
            alert("Registration failed. Email might already exist.");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
                
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
                        <Navigation size={22} className="rotate-45" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
                        LogiFlow
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1.5">
                        Enterprise Logistics Operations & Fleet Tracker
                    </p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/80 px-8 py-8 rounded-xl shadow-xl space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-white">Create an account</h3>
                        <p className="text-xs text-zinc-500 mt-1">Join the logistics network to manage shipments or bid on loads.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Account Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole("SHIPPER")}
                                    className={`flex-1 py-2 text-xs rounded-lg border transition ${role === 'SHIPPER' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                >
                                    Shipper
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("CARRIER")}
                                    className={`flex-1 py-2 text-xs rounded-lg border transition ${role === 'CARRIER' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                >
                                    Carrier
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-3.5 text-zinc-600" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-4 py-2.5 rounded-lg text-xs text-white placeholder:text-zinc-650 focus:border-zinc-700 outline-none transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3.5 text-zinc-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-4 py-2.5 rounded-lg text-xs text-white placeholder:text-zinc-650 focus:border-zinc-700 outline-none transition"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-3.5 text-zinc-600" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-10 py-2.5 rounded-lg text-xs text-white placeholder:text-zinc-650 focus:border-zinc-700 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-xs font-semibold text-zinc-950 rounded-lg flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                        >
                            Create Account <ArrowRight size={14} />
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-xs text-zinc-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-cyan-400 hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex justify-center gap-8 text-center text-zinc-600 text-[10px] font-mono uppercase tracking-wider">
                    <div>
                        <p className="font-bold text-zinc-400">12,400+</p>
                        <p>Routes</p>
                    </div>
                    <div>
                        <p className="font-bold text-zinc-400">99.2%</p>
                        <p>OTD SLA</p>
                    </div>
                    <div>
                        <p className="font-bold text-zinc-400">&lt; 15m</p>
                        <p>Response</p>
                    </div>
                </div>

            </div>
        </div>
    );
}