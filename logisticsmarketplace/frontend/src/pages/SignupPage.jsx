import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Truck,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react";
import api from "../services/api";

export default function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", {
                name,
                email,
                password
            });

            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-slate-950
                via-black
                to-slate-950
                text-white
                relative
                overflow-hidden
            "
        >
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

                <div className="text-center mb-10">
                    <div className="text-7xl mb-6">🚚</div>

                    <h1 className="text-7xl font-black tracking-tight">
                        Logi<span className="text-cyan-400">Flow</span>
                    </h1>

                    <p className="mt-4 text-xl text-slate-300">
                        Create Your Logistics Account
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
                    <h2 className="text-3xl font-bold text-center">
                        Create Account
                    </h2>

                    <p className="text-center text-slate-400 mt-3">
                        Join LogiFlow today
                    </p>

                    <form
                        onSubmit={handleSignup}
                        className="mt-8 space-y-5"
                    >
                        <div>
                            <label className="text-sm text-slate-400">
                                Full Name
                            </label>

                            <div className="mt-2 relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-4 text-slate-500"
                                />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                    className="
                                        w-full
                                        pl-12
                                        pr-4
                                        py-4
                                        rounded-2xl
                                        bg-slate-900/70
                                        border
                                        border-slate-800
                                        focus:border-cyan-500
                                        outline-none
                                    "
                                />
                            </div>
                        </div>

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
                                    placeholder="Enter your email"
                                    required
                                    className="
                                        w-full
                                        pl-12
                                        pr-4
                                        py-4
                                        rounded-2xl
                                        bg-slate-900/70
                                        border
                                        border-slate-800
                                        focus:border-cyan-500
                                        outline-none
                                    "
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
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Create password"
                                    required
                                    className="
                                        w-full
                                        pl-12
                                        pr-12
                                        py-4
                                        rounded-2xl
                                        bg-slate-900/70
                                        border
                                        border-slate-800
                                        focus:border-cyan-500
                                        outline-none
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-4
                                        text-slate-400
                                        hover:text-cyan-400
                                    "
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
                            className="
                                w-full
                                py-4
                                rounded-2xl
                                bg-gradient-to-r
                                from-cyan-500
                                to-blue-600
                                font-semibold
                                flex
                                items-center
                                justify-center
                                gap-2
                                hover:scale-[1.02]
                                transition
                            "
                        >
                            Create Account
                            <ArrowRight size={18} />
                        </button>

                        <p className="text-center text-slate-400 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-cyan-400 hover:text-cyan-300"
                            >
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}