import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import { UserRole } from "../../types"
import {
  BookOpen,
  Lock,
  Mail,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export const LoginScreen: React.FC = () => {
  const { currentTenant, tenants, setCurrentTenant, loginAs } = useApp()

  const [email, setEmail] = useState("admin.jabar@mtq.kemenag.go.id")
  const [password, setPassword] = useState("••••••••••••")
  const [selectedTenantId, setSelectedTenantId] = useState(currentTenant.id)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const t = tenants.find((item) => item.id === selectedTenantId)
    if (t) setCurrentTenant(t)
    loginAs("admin")
  }

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      {/* Central Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#173D74] border border-[#2b5894] mx-auto flex items-center justify-center text-emerald-300 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Manajemen MTQ
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Informasi Musabaqah Digital
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Tenant Context Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Penyelenggara / Tenant MTQ</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Konteks Terisolasi
              </span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <select
                value={selectedTenantId}
                onChange={(e) => {
                  setSelectedTenantId(e.target.value)
                  const match = tenants.find((t) => t.id === e.target.value)
                  if (match) setCurrentTenant(match)
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#173D74] bg-slate-50 text-slate-800 font-medium"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email / Username */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Email atau Nama Pengguna
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kemenag.go.id"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#173D74] text-slate-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Kata Sandi</span>
              <a
                href="#reset"
                className="text-[11px] text-[#173D74] hover:underline"
              >
                Lupa Sandi?
              </a>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#173D74] text-slate-800"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#173D74] hover:bg-[#12305c] text-white font-bold rounded-lg shadow-sm transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Masuk ke Sistem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Switcher (Evaluator friendly) */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            Akses Cepat Pengujian Peran (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin("admin")}
              className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[#173D74] hover:bg-blue-100 font-semibold transition-colors text-left flex flex-col"
            >
              <span className="font-bold">Masuk: Admin MTQ</span>
              <span className="text-[10px] text-blue-600 font-normal">
                Dashboard & Rekap
              </span>
            </button>
            <button
              onClick={() => handleQuickLogin("hakim")}
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors text-left flex flex-col"
            >
              <span className="font-bold">Masuk: Dewan Hakim</span>
              <span className="text-[10px] text-emerald-700 font-normal">
                Workspace & Mushaf
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keamanan Terenkripsi & Multi-Tenant Terisolasi</span>
        </div>
      </div>
    </div>
  )
}
