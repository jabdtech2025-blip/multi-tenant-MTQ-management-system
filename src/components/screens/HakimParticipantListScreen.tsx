import React, { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import {
  Gavel,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Lock,
  Award,
  ArrowRight,
  ShieldCheck,
  User,
  BookOpen,
} from "lucide-react"

export const HakimParticipantListScreen: React.FC = () => {
  const {
    participants,
    assessments,
    currentUser,
    setSelectedParticipantId,
    setCurrentScreen,
    currentTenant,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedCabang, setSelectedCabang] = useState("ALL")

  // Active Judge identity
  const activeJudgeId =
    currentUser.role === "hakim" ? currentUser.id : "judge-1"

  // Filter participants assigned to this judge
  const assignedParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kafilahName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus =
        selectedStatus === "ALL" || p.status === selectedStatus
      const matchCabang =
        selectedCabang === "ALL" || p.cabang === selectedCabang

      return matchSearch && matchStatus && matchCabang
    })
  }, [participants, searchTerm, selectedStatus, selectedCabang])

  // Statistics for this judge
  const totalAssigned = participants.length
  const totalCompleted = participants.filter((p) => {
    const a = assessments.find(
      (ass) => ass.participantId === p.id && ass.judgeId === activeJudgeId,
    )
    return a?.status === "Final/Terkunci"
  }).length
  const totalInProgress = participants.filter((p) => {
    const a = assessments.find(
      (ass) => ass.participantId === p.id && ass.judgeId === activeJudgeId,
    )
    return a?.status === "Berlangsung"
  }).length
  const totalPending = totalAssigned - totalCompleted - totalInProgress

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 xl:p-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Gavel className="w-3 h-3 text-emerald-600" />
                Portal Penjurian Mandiri
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">
                {currentTenant.name}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Daftar Penugasan Penilaian Peserta
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dewan Hakim:{" "}
              <span className="font-semibold text-slate-800">
                {currentUser.role === "hakim"
                  ? currentUser.name
                  : "KH. Ahmad Dahlan, M.Ag"}
              </span>{" "}
              • Bidang Tajwid & Makhraj • Mimbar Utama Masjid Al-Jabbar
            </p>
          </div>
        </div>

        {/* 4 Summary Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-medium text-slate-500">
              Total Ditugaskan
            </span>
            <p className="text-xl font-black font-mono text-slate-900 mt-0.5">
              {totalAssigned}
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
            <span className="text-[11px] font-medium text-emerald-800">
              Selesai (Final/Terkunci)
            </span>
            <p className="text-xl font-black font-mono text-emerald-900 mt-0.5">
              {totalCompleted}
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
            <span className="text-[11px] font-medium text-amber-800">
              Sedang Berlangsung
            </span>
            <p className="text-xl font-black font-mono text-amber-900 mt-0.5">
              {totalInProgress}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-medium text-slate-500">
              Menunggu Tampil
            </span>
            <p className="text-xl font-black font-mono text-slate-700 mt-0.5">
              {totalPending}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor undian, nama peserta, atau kafilah..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">
              Status Penilaian:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-700"
            >
              <option value="ALL">Semua Status</option>
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Final/Terkunci">Final / Terkunci</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">
              Cabang:
            </span>
            <select
              value={selectedCabang}
              onChange={(e) => setSelectedCabang(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-700"
            >
              <option value="ALL">Semua Cabang</option>
              <option value="Tilawah Dewasa Putra">Tilawah Dewasa Putra</option>
              <option value="Tilawah Dewasa Putri">Tilawah Dewasa Putri</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-mono ml-auto">
            {assignedParticipants.length} Peserta Ditampilkan
          </span>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-700 font-semibold">
            <tr>
              <th className="px-4 py-3 w-16 text-center">Undian</th>
              <th className="px-4 py-3 w-24">ID Peserta</th>
              <th className="px-5 py-3">Nama Lengkap Peserta</th>
              <th className="px-4 py-3">Kafilah</th>
              <th className="px-4 py-3">Cabang & Babak</th>
              <th className="px-5 py-3">Soal Maqra Ditugaskan</th>
              <th className="px-3 py-3 text-center">Status Saya</th>
              <th className="px-3 py-3 text-center">Nilai Saya</th>
              <th className="px-4 py-3 text-center w-36">Aksi Penilaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {assignedParticipants.map((p) => {
              const myAssessment = assessments.find(
                (a) => a.participantId === p.id && a.judgeId === activeJudgeId,
              )
              const isLocked = myAssessment?.status === "Final/Terkunci"
              const isInProgress = myAssessment?.status === "Berlangsung"

              return (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                    {p.noUndian}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                    {p.id}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.kafilahName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{p.cabang}</div>
                    <div className="text-[10px] text-slate-400">{p.babak}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-[#173D74]">
                      {p.questionTitle}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Riwayat Hafs 'an 'Ashim
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                        isLocked
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isInProgress
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-2.5 h-2.5" />
                          Final/Terkunci
                        </>
                      ) : isInProgress ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Berlangsung
                        </>
                      ) : (
                        "Belum Dimulai"
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                    {myAssessment && (isInProgress || isLocked)
                      ? myAssessment.finalScore.toFixed(2)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedParticipantId(p.id)
                        setCurrentScreen("hakim-workspace")
                      }}
                      className={`w-full py-1.5 px-2.5 rounded text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                        isLocked
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                          : "bg-[#173D74] hover:bg-[#12305c] text-white"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{isLocked ? "Lihat Lembar" : "Mulai Menilai"}</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
