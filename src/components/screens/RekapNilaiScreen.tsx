import React, { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Lock,
  Building2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react"
import { ParticipantDetailModal } from "./ParticipantDetailModal"

export const RekapNilaiScreen: React.FC = () => {
  const {
    currentTenant,
    participants,
    assessments,
    errorCategories,
    kafilahs,
    inspectingParticipantId,
    setInspectingParticipantId,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKafilah, setSelectedKafilah] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [selectedBabak, setSelectedBabak] = useState<string>("Penyisihan")
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  // Group assessments by participant
  const judgeList = [
    {
      id: "judge-1",
      name: "Hakim 1",
      title: "Tajwid & Makhraj",
      person: "KH. Ahmad Dahlan",
    },
    {
      id: "judge-2",
      name: "Hakim 2",
      title: "Fasahah & Waqf",
      person: "Dr. H. M. Quraish",
    },
    {
      id: "judge-3",
      name: "Hakim 3",
      title: "Lagu & Suara",
      person: "Hj. Siti Maryam",
    },
  ]

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kafilahName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchKafilah =
        selectedKafilah === "ALL" || p.kafilahId === selectedKafilah
      const matchStatus =
        selectedStatus === "ALL" || p.status === selectedStatus
      const matchBabak = selectedBabak === "ALL" || p.babak === selectedBabak

      return matchSearch && matchKafilah && matchStatus && matchBabak
    })
  }, [participants, searchTerm, selectedKafilah, selectedStatus, selectedBabak])

  const handleExport = (type: string) => {
    setExportNotice(
      `Mempersiapkan ekspor ${type} untuk ${currentTenant.name}...`,
    )
    setTimeout(() => {
      setExportNotice(null)
    }, 3000)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      {/* Page Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Rekap Nilai Real-Time
              </h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Matriks Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentTenant.eventName} • Babak {selectedBabak} • Cabang Tilawah
              Dewasa
            </p>
          </div>

          {/* Export & Actions */}
          <div className="flex items-center gap-2">
            {exportNotice && (
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 animate-fade-in">
                {exportNotice}
              </span>
            )}
            <button
              onClick={() => handleExport("Excel (.xlsx)")}
              className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor undian, nama peserta, atau kafilah..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74] bg-white"
            />
          </div>

          {/* Babak Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">
              Babak:
            </span>
            <select
              value={selectedBabak}
              onChange={(e) => setSelectedBabak(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-700"
            >
              <option value="ALL">Semua Babak</option>
              <option value="Penyisihan">Penyisihan</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Final">Final</option>
            </select>
          </div>

          {/* Kafilah Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">
              Kafilah:
            </span>
            <select
              value={selectedKafilah}
              onChange={(e) => setSelectedKafilah(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-700 max-w-[150px]"
            >
              <option value="ALL">Semua Kafilah</option>
              {kafilahs.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400">
              Status:
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

          <span className="text-xs text-slate-500 font-mono ml-auto">
            {filteredParticipants.length} Peserta Terdaftar
          </span>
        </div>
      </div>

      {/* Provisional Notice Banner */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 md:px-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Nilai berstatus <strong>Berlangsung</strong> masih provisional dan
            belum menjadi hasil resmi.
          </span>
        </div>
        <span className="text-[11px] text-amber-700 font-mono hidden md:inline">
          Format Standar Penilaian LPTQ
        </span>
      </div>

      {/* Wide Data Matrix Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse text-left text-[13px] divide-y divide-slate-200">
            {/* Grouped Table Header */}
            <thead>
              {/* Top Row: Group Headers */}
              <tr className="divide-x divide-slate-200 bg-slate-100 text-slate-700">
                {/* Sticky Left Identity Headers */}
                <th
                  colSpan={4}
                  className="sticky left-0 z-20 bg-slate-100 px-4 py-2.5 text-xs font-semibold"
                >
                  Identitas Peserta Musabaqah
                </th>

                {/* Judge 1 Group Header */}
                <th colSpan={4} className="px-3 py-2 text-center bg-slate-50">
                  <div className="font-bold">Hakim 1 — Tajwid & Makhraj</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    KH. Ahmad Dahlan, M.Ag
                  </div>
                </th>

                {/* Judge 2 Group Header */}
                <th colSpan={3} className="px-3 py-2 text-center bg-slate-100">
                  <div className="font-bold">Hakim 2 — Fasahah & Waqf</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Dr. H. M. Quraish, MA
                  </div>
                </th>

                {/* Judge 3 Group Header */}
                <th colSpan={3} className="px-3 py-2 text-center bg-slate-50">
                  <div className="font-bold">Hakim 3 — Lagu & Suara</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Hj. Siti Maryam, S.Th.I
                  </div>
                </th>

                {/* Aggregated Overall Header */}
                <th colSpan={3} className="px-3 py-2 text-center bg-slate-200">
                  <div className="font-bold">Hasil Rekapitulasi</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Agregasi Majelis
                  </div>
                </th>
              </tr>

              {/* Sub-Row: Column Headers */}
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold border-b border-slate-200 divide-x divide-slate-200">
                {/* Sticky Identitas Columns */}
                <th className="sticky left-0 z-20 bg-slate-100 px-3 py-2 w-12 text-center">
                  No
                </th>
                <th className="sticky left-12 z-20 bg-slate-100 px-3 py-2 w-24">
                  ID Peserta
                </th>
                <th className="sticky left-36 z-20 bg-slate-100 px-4 py-2 min-w-[160px]">
                  Nama Peserta
                </th>
                <th className="sticky left-[304px] z-20 bg-slate-100 px-3 py-2 min-w-[130px] border-r border-slate-300 shadow-r">
                  Kafilah
                </th>

                {/* Hakim 1 Component Columns */}
                <th className="px-2.5 py-2 text-center min-w-[70px]">
                  Makhraj
                </th>
                <th className="px-2.5 py-2 text-center min-w-[70px]">Idgham</th>
                <th className="px-2.5 py-2 text-center min-w-[70px]">Tajwid</th>
                <th className="px-3 py-2 text-center min-w-[85px] bg-blue-50/50 text-[#173D74]">
                  Nilai H1
                </th>

                {/* Hakim 2 Component Columns */}
                <th className="px-2.5 py-2 text-center min-w-[70px]">
                  Fasahah
                </th>
                <th className="px-2.5 py-2 text-center min-w-[70px]">Waqf</th>
                <th className="px-3 py-2 text-center min-w-[85px] bg-blue-50/50 text-[#173D74]">
                  Nilai H2
                </th>

                {/* Hakim 3 Component Columns */}
                <th className="px-2.5 py-2 text-center min-w-[70px]">Maqam</th>
                <th className="px-2.5 py-2 text-center min-w-[70px]">Suara</th>
                <th className="px-3 py-2 text-center min-w-[85px] bg-blue-50/50 text-[#173D74]">
                  Nilai H3
                </th>

                {/* Aggregated Total, Status, Action */}
                <th className="px-3 py-2 text-center min-w-[90px] bg-slate-200/70 text-slate-900">
                  Rata-rata
                </th>
                <th className="px-3 py-2 text-center min-w-[90px]">Status</th>
                <th className="px-3 py-2 text-center min-w-[80px]">Aksi</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredParticipants.map((p, idx) => {
                const j1 = assessments.find(
                  (a) => a.participantId === p.id && a.judgeId === "judge-1",
                )
                const j2 = assessments.find(
                  (a) => a.participantId === p.id && a.judgeId === "judge-2",
                )
                const j3 = assessments.find(
                  (a) => a.participantId === p.id && a.judgeId === "judge-3",
                )

                const scores = [
                  j1?.finalScore,
                  j2?.finalScore,
                  j3?.finalScore,
                ].filter((s): s is number => s !== undefined)
                const avg =
                  scores.length > 0
                    ? (
                        scores.reduce((a, b) => a + b, 0) / scores.length
                      ).toFixed(2)
                    : "-"

                const isParticipantFinal = p.status === "Final/Terkunci"

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50/20 transition-colors group divide-x divide-slate-100"
                  >
                    {/* Sticky Columns */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 px-3 py-2 text-center font-mono text-slate-500">
                      {p.noUndian}
                    </td>
                    <td className="sticky left-12 z-10 bg-white group-hover:bg-blue-50/40 px-3 py-2 font-mono font-bold text-[#173D74]">
                      {p.id}
                    </td>
                    <td className="sticky left-36 z-10 bg-white group-hover:bg-blue-50/40 px-4 py-2 font-medium text-slate-900 truncate">
                      {p.name}
                    </td>
                    <td className="sticky left-[304px] z-10 bg-white group-hover:bg-blue-50/40 px-3 py-2 text-slate-600 truncate border-r border-slate-300 shadow-r">
                      {p.kafilahName}
                    </td>

                    {/* Hakim 1 Component Values */}
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j1 ? j1.errorCounts["cat-makharij"] || 0 : "-"}
                    </td>
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j1 ? j1.errorCounts["cat-idgham"] || 0 : "-"}
                    </td>
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j1 ? j1.errorCounts["cat-tajwid"] || 0 : "-"}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-[#173D74] bg-blue-50/30">
                      {j1 ? j1.finalScore.toFixed(2) : "-"}
                    </td>

                    {/* Hakim 2 Component Values */}
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j2 ? j2.errorCounts["cat-fasahah"] || 0 : "-"}
                    </td>
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j2
                        ? (j2.errorCounts["cat-fasahah"] || 0) > 0
                          ? 1
                          : 0
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-[#173D74] bg-blue-50/30">
                      {j2 ? j2.finalScore.toFixed(2) : "-"}
                    </td>

                    {/* Hakim 3 Component Values */}
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j3 ? j3.errorCounts["cat-lagu"] || 0 : "-"}
                    </td>
                    <td className="px-2.5 py-2 text-center font-mono">
                      {j3
                        ? (j3.errorCounts["cat-lagu"] || 0) > 0
                          ? 1
                          : 0
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-[#173D74] bg-blue-50/30">
                      {j3 ? j3.finalScore.toFixed(2) : "-"}
                    </td>

                    {/* Aggregated Average */}
                    <td className="px-3 py-2 text-center font-mono font-black text-slate-900 bg-slate-100/60">
                      {avg}
                    </td>

                    {/* Status Badge */}
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isParticipantFinal
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "Berlangsung"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {isParticipantFinal && (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        )}
                        {p.status}
                      </span>
                    </td>

                    {/* Action Button: Open Detail Drawer (Screen I) */}
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => setInspectingParticipantId(p.id)}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-[#173D74] hover:bg-blue-100 bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                        title="Lihat rincian nilai & coretan mushaf"
                      >
                        <Eye className="w-3 h-3" />
                        Detail
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen I: Participant Assessment Detail Modal */}
      {inspectingParticipantId && (
        <ParticipantDetailModal
          participantId={inspectingParticipantId}
          onClose={() => setInspectingParticipantId(null)}
        />
      )}
    </div>
  )
}
