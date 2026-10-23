import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import { MushafCanvasViewer } from "../mushaf/MushafCanvasViewer"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck2,
  Lock,
  Minus,
  Plus,
  AlertTriangle,
} from "lucide-react"

export const HakimScoringWorkspaceScreen: React.FC = () => {
  const {
    participants,
    selectedParticipantId,
    setSelectedParticipantId,
    currentUser,
    assessments,
    errorCategories,
    updateErrorCount,
    updateAssessmentNotes,
    finalizeAssessment,
    setCurrentScreen,
  } = useApp()

  const [finalizeOpen, setFinalizeOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<"mushaf" | "score">("mushaf")
  const participant =
    participants.find((item) => item.id === selectedParticipantId) ||
    participants[0]
  const judgeId = currentUser.role === "hakim" ? currentUser.id : "judge-1"
  const assessment =
    assessments.find(
      (item) =>
        item.participantId === participant.id && item.judgeId === judgeId,
    ) || assessments[0]
  const locked = assessment.status === "Final/Terkunci"
  const totalErrors = Object.values(assessment.errorCounts).reduce(
    (sum, value) => sum + (value || 0),
    0,
  )

  const scorePanel = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] border border-slate-200 bg-white">
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className="px-4 py-3">
          <p className="text-xs text-slate-500">Kesalahan</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
            {totalErrors}
          </p>
        </div>
        <div className="border-x border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500">Pengurangan</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-rose-600">
            −{assessment.totalDeduction.toFixed(2)}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-slate-500">
            {locked ? "Nilai final" : "Nilai sementara"}
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[#173D74]">
            {assessment.finalScore.toFixed(2)}
          </p>
        </div>
      </div>

      {locked && (
        <div className="flex items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">
          <Lock className="h-3.5 w-3.5" />
          Penilaian telah dikunci pada {assessment.lockedAt}.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-900">
            Kategori kesalahan
          </h2>
          <span className="text-xs text-slate-500">
            {assessment.ruleVersion}
          </span>
        </div>

        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {errorCategories.map((category) => {
            const count = assessment.errorCounts[category.id] || 0
            const subtotal = count * category.defaultWeight
            return (
              <div key={category.id} className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {category.name}
                      </p>
                      {category.isProvisional && (
                        <span className="text-xs text-amber-700">
                          Perlu konfirmasi
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {category.scoringMethod}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={locked || count === 0}
                      onClick={() =>
                        updateErrorCount(
                          participant.id,
                          judgeId,
                          category.id,
                          -1,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={`Kurangi ${category.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-7 text-center text-base font-semibold tabular-nums text-slate-900">
                      {count}
                    </span>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() =>
                        updateErrorCount(
                          participant.id,
                          judgeId,
                          category.id,
                          1,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Tambah ${category.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {count > 0 && (
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>
                      {count} × {category.defaultWeight.toFixed(2)}
                    </span>
                    <span className="font-medium tabular-nums text-rose-600">
                      −{subtotal.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <label
          className="mt-4 block text-sm font-medium text-slate-700"
          htmlFor="judge-notes"
        >
          Catatan hakim
        </label>
        <textarea
          id="judge-notes"
          rows={3}
          disabled={locked}
          value={assessment.notes}
          onChange={(event) =>
            updateAssessmentNotes(participant.id, judgeId, event.target.value)
          }
          placeholder="Catatan opsional"
          className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        />
      </div>

      <div className="border-t border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {assessment.lastSavedAt}
          </span>
          <span
            className={
              assessment.syncStatus === "Tersinkronisasi"
                ? "text-emerald-700"
                : "text-amber-700"
            }
          >
            {assessment.syncStatus}
          </span>
        </div>
        <button
          type="button"
          disabled={locked || assessment.syncStatus !== "Tersinkronisasi"}
          onClick={() => setFinalizeOpen(true)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <FileCheck2 className="h-4 w-4" />
          )}
          {locked ? "Penilaian terkunci" : "Simpan Penilaian"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 md:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => setCurrentScreen("hakim-list")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <select
                  value={participant.id}
                  onChange={(event) =>
                    setSelectedParticipantId(event.target.value)
                  }
                  className="h-9 max-w-[320px] rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500"
                >
                  {participants.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} · {item.name}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-500">
                  {participant.kafilahName}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">
                {participant.cabang} · {participant.babak} ·{" "}
                {participant.questionTitle}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {assessment.judgeName}
            </span>
            <span
              className={`flex items-center gap-1.5 text-xs ${
                assessment.syncStatus === "Tersinkronisasi"
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  assessment.syncStatus === "Tersinkronisasi"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
              {assessment.syncStatus}
            </span>
          </div>
        </div>
        <div
          className={`mt-2 flex items-center gap-1.5 text-xs sm:hidden ${
            assessment.syncStatus === "Tersinkronisasi"
              ? "text-emerald-700"
              : "text-amber-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              assessment.syncStatus === "Tersinkronisasi"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />
          {assessment.syncStatus}
        </div>

        <div className="mt-3 grid grid-cols-2 rounded-lg bg-slate-100 p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setMobilePanel("mushaf")}
            className={`h-9 rounded-md text-sm font-medium ${
              mobilePanel === "mushaf"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Mushaf
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel("score")}
            className={`h-9 rounded-md text-sm font-medium ${
              mobilePanel === "score"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Penilaian
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 p-3 md:p-4">
        <div className="hidden h-full min-h-0 gap-4 lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(380px,45fr)]">
          <MushafCanvasViewer
            participantId={participant.id}
            judgeId={judgeId}
            isReadOnly={locked}
          />
          {scorePanel}
        </div>
        <div className="h-full min-h-0 lg:hidden">
          {mobilePanel === "mushaf" ? (
            <MushafCanvasViewer
              participantId={participant.id}
              judgeId={judgeId}
              isReadOnly={locked}
            />
          ) : (
            scorePanel
          )}
        </div>
      </div>

      {finalizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Simpan penilaian?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tindakan ini memfinalisasi dan mengunci penilaian.
              </p>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Peserta</span>
                <span className="font-medium text-slate-900">
                  {participant.id} · {participant.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nilai</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {assessment.finalScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kesalahan</span>
                <span className="font-medium text-slate-900">
                  {totalErrors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Anotasi</span>
                <span className="font-medium text-slate-900">
                  {assessment.annotations.length}
                </span>
              </div>
              <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Koreksi setelah finalisasi hanya melalui alur berizin dan
                tercatat.
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setFinalizeOpen(false)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  finalizeAssessment(participant.id, judgeId)
                  setFinalizeOpen(false)
                }}
                className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Finalisasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
