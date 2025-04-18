"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff, Mail, User, MapPin, UserPlus } from "lucide-react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

// All chartered, independent, and component cities in the Philippines
const cityOptions = [
  // Highly Urbanized Cities (33)
  "Angeles City","Bacolod","Baguio","Butuan","Cagayan de Oro","Caloocan","Cebu City","Davao City","General Santos","Iligan","Iloilo City","Lapu-Lapu City","Las Piñas","Lucena","Makati","Malabon","Mandaluyong","Mandaue","Manila","Marikina","Muntinlupa","Navotas","Olongapo","Parañaque","Pasay","Pasig","Puerto Princesa","Quezon City","San Juan","Tacloban","Taguig","Valenzuela","Zamboanga City",
  // Independent Component Cities (5)
  "Cotabato City","Dagupan","Naga, Camarines Sur","Ormoc","Santiago",
  // Component Cities (111)
  "Alaminos","Antipolo","Bacoor","Bago","Bais","Balanga","Baliwag","Batac","Batangas City","Bayawan","Baybay","Bayugan","Biñan","Bislig","Bogo","Borongan","Cabadbaran","Cabanatuan","Cabuyao","Cadiz","Calaca","Calamba","Calapan","Calbayog","Candon","Canlaon","Carcar","Carmona","Catbalogan","Cauayan","Cavite City","Danao","Dapitan","Dasmariñas","Digos","Dipolog","Dumaguete","El Salvador","Escalante","Gapan","General Trias","Gingoog","Guihulngan","Himamaylan","Ilagan","Imus","Iriga","Isabela","Kabankalan","Kidapawan","Koronadal","La Carlota","Lamitan","Laoag","Legazpi","Ligao","Lipa","Maasin","Mabalacat","Malaybalay","Malolos","Marawi","Masbate City","Mati","Meycauayan","Muñoz","Naga, Cebu","Oroquieta","Ozamiz","Pagadian","Palayan","Panabo","Passi","Roxas","Sagay","Samal","San Carlos, Negros Occidental","San Carlos, Pangasinan","San Fernando, La Union","San Fernando, Pampanga","San Jose, Nueva Ecija","San Jose del Monte","San Pablo","San Pedro","Santa Rosa","Santo Tomas","Silay","Sipalay","Sorsogon City","Surigao City","Tabaco","Tabuk","Tacurong","Tagaytay","Tagbilaran","Tagum","Talisay, Cebu","Talisay, Negros Occidental","Tanauan","Tandag","Tangub","Tanjay","Tarlac City","Tayabas","Toledo","Trece Martires","Tuguegarao","Urdaneta","Valencia","Victorias","Vigan"
];

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setStatus("Please complete the CAPTCHA.");
      return;
    }

    setStatus("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          city,
          gender,
          password,
          confirmPassword,
          acceptTerms,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setStatus(data.message || "Sign up error.");
        setCaptchaToken(null);
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred during sign up.");
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden border border-[#e6dfd3] transition-all duration-300 hover:shadow-xl">
        <div className="p-6 pb-0 text-center">
          <div className="w-16 h-16 bg-[#f8f5f0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UserPlus size={28} className="text-[#8d6e63]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#5d4037]">Create an account</h2>
          <p className="text-[#8d6e63] mt-2 mb-6">Enter your information to get started</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[#5d4037]">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-[#a1887f]" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-[#5d4037]">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-[#a1887f]" />
                  </div>
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238d6e63' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="" disabled>Select your city</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-[#5d4037]">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female")}
                required
                className="w-full px-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200 appearance-none pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238d6e63' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#5d4037]">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#a1887f]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 relative">
                <label htmlFor="password" className="block text-sm font-medium text-[#5d4037]">Password (max 8 chars)</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => e.target.value.length <= 8 && setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-[#8d6e63] hover:text-[#5d4037] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5d4037]">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => e.target.value.length <= 8 && setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-[#8d6e63] focus:ring-[#8d6e63] border-[#d7cec7] rounded transition-colors"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-[#5d4037]">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-[#8d6e63] hover:text-[#5d4037] hover:underline transition-colors font-medium"
                >Terms and Conditions</button>
              </label>
            </div>

            {/* CAPTCHA widget */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token: React.SetStateAction<string | null>) => setCaptchaToken(token)}
              />
            </div>

            {status && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{status}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || !acceptTerms || !captchaToken}
              className="w-full py-3 px-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8d6e63] disabled:hover:shadow-sm mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create account</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-[#8d6e63] text-sm">
                Already have an account?{' '}
                <a href="/signin" className="text-[#5d4037] font-medium hover:underline transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {isTermsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsTermsModalOpen(false)}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Cavite Venture Terms & Conditions</h2>
            <div className="overflow-y-auto max-h-80 text-sm text-[#5d4037]">
              <p className="mb-2">Welcome to Cavite Venture. By using our services, you agree to the following terms and conditions. Please read them carefully.</p>
              <p className="mb-2"><strong>1. Acceptance of Terms:</strong> Your use of our platform constitutes your acceptance of these terms.</p>
              <p className="mb-2"><strong>2. Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account.</p>
              <p className="mb-2"><strong>3. Data Usage:</strong> Your personal data will be processed in accordance with our privacy policy.</p>
              <p className="mb-2"><strong>4. Service Modifications:</strong> We reserve the right to modify or discontinue services at any time.</p>
              <p className="mb-2"><strong>5. Limitation of Liability:</strong> Cavite Venture is not liable for any direct, indirect, or consequential damages arising from your use of our services.</p>
              <p className="mb-2">By continuing, you acknowledge that you have read, understood, and agreed to these terms and conditions.</p>
            </div>
            <button type="button" onClick={() => setIsTermsModalOpen(false)} className="mt-4 py-2 px-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-medium rounded transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
