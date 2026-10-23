import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import { ScreenId } from "../../types"
import {
  BookOpen,
  Building2,
  ChevronDown,
  FileSpreadsheet,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
  Database,
} from "lucide-react"

const adminItems: {
  id: ScreenId
  label: string
  icon: React.FC<{ className?: string }>
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "kafilah-peserta", label: "Kafilah & Peserta", icon: Users },
  { id: "bank-soal", label: "Bank Soal", icon: BookOpen },
  { id: "master-data", label: "Master Data", icon: Database },
  { id: "hakim-list", label: "Penilaian Hakim", icon: Gavel },
  { id: "rekap-nilai", label: "Rekap Nilai", icon: FileSpreadsheet },
]

export const TopBar: React.FC = () => {
  const {
    currentTenant,
    tenants,
    setCurrentTenant,
    currentScreen,
    setCurrentScreen,
    currentRole,
    currentUser,
    logout,
  } = useApp()
  const [tenantOpen, setTenantOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const judgeItems: typeof adminItems = [
    { id: "hakim-list", label: "Daftar Tugas", icon: Users },
    { id: "hakim-workspace", label: "Penilaian", icon: Gavel },
    { id: "rekap-nilai", label: "Rekap Nilai", icon: FileSpreadsheet },
  ]
  const items = currentRole === "hakim" ? judgeItems : adminItems

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Buka navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => setTenantOpen((value) => !value)}
              className="flex h-10 max-w-[180px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50 sm:max-w-[260px]"
            >
              <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate font-medium">{currentTenant.name}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
            {tenantOpen && (
              <div className="absolute left-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    type="button"
                    onClick={() => {
                      setCurrentTenant(tenant)
                      setTenantOpen(false)
                    }}
                    className={`block w-full px-3 py-2.5 text-left hover:bg-slate-50 ${
                      tenant.id === currentTenant.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {tenant.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {tenant.eventName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden min-w-0 border-l border-slate-200 pl-4 lg:block">
            <p className="truncate text-sm font-medium text-slate-800">
              {currentTenant.eventName}
            </p>
            <p className="text-xs text-slate-500">
              Penyisihan · Tilawah Dewasa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Terhubung
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {currentUser.avatarInitials}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
          />
          <div className="relative flex h-full w-[280px] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173D74] text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Manajemen MTQ
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentScreen(item.id)
                      setMobileOpen(false)
                    }}
                    className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium ${
                      currentScreen === item.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={logout}
              className="m-3 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
