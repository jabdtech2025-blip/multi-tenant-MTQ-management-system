import React from "react"
import { useApp } from "../../context/AppContext"
import { ScreenId } from "../../types"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Database,
  FileSpreadsheet,
  LogOut,
  Gavel,
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

const judgeItems: typeof adminItems = [
  { id: "hakim-list", label: "Daftar Tugas", icon: Users },
  { id: "hakim-workspace", label: "Penilaian", icon: Gavel },
  { id: "rekap-nilai", label: "Rekap Nilai", icon: FileSpreadsheet },
]

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, currentRole, currentUser, logout } =
    useApp()
  const items = currentRole === "hakim" ? judgeItems : adminItems

  return (
    <aside className="hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white md:flex md:w-[72px] xl:w-56">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 md:justify-center xl:justify-start xl:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173D74] text-white">
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="hidden min-w-0 xl:block">
          <p className="truncate text-sm font-semibold text-slate-900">
            Manajemen MTQ
          </p>
          <p className="truncate text-xs text-slate-500">Musabaqah Digital</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon
          const active = currentScreen === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentScreen(item.id)}
              title={item.label}
              className={`flex h-10 w-full items-center rounded-lg transition-colors md:justify-center xl:justify-start xl:gap-3 xl:px-3 ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden truncate text-sm font-medium xl:block">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center md:justify-center xl:justify-between xl:gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden min-w-0 xl:block">
              <p className="truncate text-xs font-medium text-slate-900">
                {currentUser.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {currentRole === "hakim" ? "Dewan Hakim" : "Admin MTQ"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Keluar"
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 xl:flex"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
