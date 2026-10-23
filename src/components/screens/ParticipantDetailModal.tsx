import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import {
  X,
  User,
  Gavel,
  ShieldCheck,
  FileCheck2,
  Clock,
  Lock,
  History,
  PenTool,
  AlertCircle,
  Eye,
  CheckCircle2,
  Building2,
  BookOpen,
} from "lucide-react"
import { MushafCanvasViewer } from "../mushaf/MushafCanvasViewer"

interface ParticipantDetailModalProps {
  participantId: string
  onClose: () => void
}

export const ParticipantDetailModal: React.FC<ParticipantDetailModalProps> = ({
  participantId,
  onClose,
}) => {
  const {
    participants,
    assessments,
    errorCategories,
    auditLogs,
    setCurrentScreen,
    setSelectedParticipantId,
  } = useApp()

  const participant = participants.find((p) => p.id === participantId)
  if (!participant) return null

  const participantAssessments = assessments.filter(
    (a) => a.participantId === participantId,
  )
  const participantLogs = auditLogs.filter(
    (log) =>
      log.participantId === participantId ||
      log.details.includes(participantId),
  )

  const [activeTab, setActiveTab] = useState<"judges" | "mushaf" | "audit">(
    "judges",
  )
  const [selectedJudgeForMushaf, setSelectedJudgeForMushaf] =
    useState<string>("judge-1")

  // Compute average score across judges
  const avgScore =
    participantAssessments.length > 0
      ? (
          participantAssessments.reduce((sum, a) => sum + a.finalScore, 0) /
          participantAssessments.length
        ).toFixed(2)
      : "0.00"

  const allFinal = participantAssessments.every(
    (a) => a.status === "Final/Terkunci",
  )

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">
              {participant.noUndian}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  {participant.name}
                </h3>
                <span className="text-[11px] font-mono bg-blue-900/80 px-2 py-0.5 rounded border border-blue-400/30">
                  {participant.id}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {participant.kafilahName} • {participant.cabang} •{" "}
                {participant.babak}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Status Summary */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTab("judges")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "judges"
                  ? "bg-white text-[#173D74] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              Penilaian Dewan Hakim ({participantAssessments.length})
            </button>
            <button
              onClick={() => setActiveTab("mushaf")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "mushaf"
                  ? "bg-white text-[#173D74] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Pratinjau Coretan Mushaf
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "audit"
                  ? "bg-white text-[#173D74] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Log Koreksi & Audit ({participantLogs.length})
            </button>
          </div>

          {/* Aggregated Score Summary */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium block">
                {allFinal
                  ? "Nilai Rata-rata Akhir (Final)"
                  : "Nilai Sementara (Provisional)"}
              </span>
              <span className="text-lg font-black font-mono text-[#173D74]">
                {avgScore}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold border ${
                allFinal
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {allFinal ? "Final/Terkunci" : "Sedang Berlangsung"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: JUDGES BREAKDOWN */}
          {activeTab === "judges" && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-lg flex items-start gap-2.5 text-xs text-blue-900">
                <AlertCircle className="w-4 h-4 text-[#173D74] shrink-0 mt-0.5" />
                <div>
                  <strong>Monitoring Nilai Admin:</strong> Administrator dapat
                  memantau rincian nilai dan sinkronisasi seluruh hakim secara
                  transparan, namun tidak dapat mengubah nilai hakim secara
                  sepihak. Koreksi hanya melalui prosedur resmi.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {participantAssessments.map((judgeAssessment) => {
                  const isJudgeLocked =
                    judgeAssessment.status === "Final/Terkunci"
                  return (
                    <div
                      key={judgeAssessment.id}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Judge Header */}
                        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {judgeAssessment.judgeName}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {judgeAssessment.judgeRoleTitle}
                            </p>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              isJudgeLocked
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {judgeAssessment.status}
                          </span>
                        </div>

                        {/* Breakdown of Categories */}
                        <div className="py-2.5 space-y-1.5 text-xs">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Rincian Kesalahan
                          </p>
                          {errorCategories.map((cat) => {
                            const count =
                              judgeAssessment.errorCounts[cat.id] || 0
                            const deduction =
                              judgeAssessment.deductions[cat.id] || 0
                            return (
                              <div
                                key={cat.id}
                                className="flex items-center justify-between text-xs py-0.5"
                              >
                                <span className="text-slate-600 truncate max-w-[130px]">
                                  {cat.name}
                                </span>
                                <div className="flex items-center gap-2 font-mono">
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[11px] ${
                                      count > 0
                                        ? "bg-rose-50 text-rose-700 font-bold"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {count}x
                                  </span>
                                  <span className="text-slate-500 text-[11px] w-12 text-right">
                                    -{deduction.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Judge Notes */}
                        {judgeAssessment.notes && (
                          <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                            <strong>Catatan:</strong> {judgeAssessment.notes}
                          </div>
                        )}
                      </div>

                      {/* Footer: Final Score & Timestamp */}
                      <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400">
                            Total Pengurangan
                          </p>
                          <p className="text-xs font-mono font-bold text-rose-600">
                            -{judgeAssessment.totalDeduction.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400">
                            Nilai Hakim
                          </p>
                          <p className="text-base font-mono font-black text-[#173D74]">
                            {judgeAssessment.finalScore.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MUSHAF ANNOTATION PREVIEW */}
          {activeTab === "mushaf" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Pilih Lembar Koreksi Coretan Dewan Hakim:
                </span>
                <div className="flex gap-2">
                  {participantAssessments.map((a) => (
                    <button
                      key={a.judgeId}
                      onClick={() => setSelectedJudgeForMushaf(a.judgeId)}
                      className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                        selectedJudgeForMushaf === a.judgeId
                          ? "bg-[#173D74] text-white border-[#173D74]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {a.judgeName} ({a.annotations.length} coretan)
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[460px] border border-slate-300 rounded-lg overflow-hidden">
                <MushafCanvasViewer
                  participantId={participant.id}
                  judgeId={selectedJudgeForMushaf}
                  isReadOnly={true}
                />
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL LOG */}
          {activeTab === "audit" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Semua rekaman aktivitas penyimpanan autosave, perubahan
                kesalahan, dan penguncian final pada peserta ini:
              </p>

              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {participantLogs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Belum ada rekaman audit log khusus peserta ini.
                  </div>
                ) : (
                  participantLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {log.user}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{log.role}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="font-medium text-[#173D74]">{log.action}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        {log.details}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            ID Peserta:{" "}
            <span className="font-mono font-semibold text-slate-800">
              {participant.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedParticipantId(participant.id)
                setCurrentScreen("hakim-workspace")
                onClose()
              }}
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#173D74] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Buka di Workspace Penilaian
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
