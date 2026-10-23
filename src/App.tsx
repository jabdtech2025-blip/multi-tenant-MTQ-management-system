import React from "react"
import { AppProvider, useApp } from "./context/AppContext"
import { Sidebar } from "./components/layout/Sidebar"
import { TopBar } from "./components/layout/TopBar"
import { LoginScreen } from "./components/screens/LoginScreen"
import { AdminDashboardScreen } from "./components/screens/AdminDashboardScreen"
import { KafilahPesertaScreen } from "./components/screens/KafilahPesertaScreen"
import { BankSoalScreen } from "./components/screens/BankSoalScreen"
import { MasterDataScreen } from "./components/screens/MasterDataScreen"
import { HakimParticipantListScreen } from "./components/screens/HakimParticipantListScreen"
import { HakimScoringWorkspaceScreen } from "./components/screens/HakimScoringWorkspaceScreen"
import { RekapNilaiScreen } from "./components/screens/RekapNilaiScreen"

const MainShell: React.FC = () => {
  const { currentScreen } = useApp()

  // Screen A: Standalone Login Screen
  if (currentScreen === "login") {
    return <LoginScreen />
  }

  // Persistent SaaS Administrative Application Shell
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Compact Top Bar */}
        <TopBar />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-hidden relative">
          {currentScreen === "dashboard" && <AdminDashboardScreen />}
          {currentScreen === "kafilah-peserta" && <KafilahPesertaScreen />}
          {currentScreen === "bank-soal" && <BankSoalScreen />}
          {currentScreen === "master-data" && <MasterDataScreen />}
          {currentScreen === "hakim-list" && <HakimParticipantListScreen />}
          {currentScreen === "hakim-workspace" && (
            <HakimScoringWorkspaceScreen />
          )}
          {currentScreen === "rekap-nilai" && <RekapNilaiScreen />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  )
}
