import React from "react"
import { useApp } from "../../context/AppContext"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Gavel,
  Users,
} from "lucide-react"

export const AdminDashboardScreen: React.FC = () => {
  const {
    currentTenant,
    participants,
    kafilahs,
    assessments,
    auditLogs,
    setCurrentScreen,
    setSelectedParticipantId,
  } = useApp()

  const pending = participants.filter(
    (item) => item.status === "Belum Dimulai",
  ).length
  const active = participants.filter(
    (item) => item.status === "Berlangsung",
  ).length
  const final = participants.filter(
    (item) => item.status === "Final/Terkunci",
  ).length
  const progress = Math.round((final / Math.max(participants.length, 1)) * 100)
  const activeParticipants = participants.filter(
    (item) => item.status === "Berlangsung",
  )

  const metrics = [
    { label: "Peserta", value: participants.length, icon: Users },
    { label: "Kafilah", value: kafilahs.length, icon: Building2 },
    { label: "Hakim", value: currentTenant.judgesCount, icon: Gavel },
    { label: "Penilaian final", value: `${progress}%`, icon: CheckCircle2 },
  ]

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 xl:p-8">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{currentTenant.name}</p>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950">
              Dashboard
            </h1>
            <p className="mt-1 truncate text-sm text-slate-600">
              {currentTenant.eventName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen("rekap-nilai")}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Rekap nilai
          </button>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div
                key={metric.label}
                className="rounded-[10px] border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-950">
                  {metric.value}
                </p>
              </div>
            )
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <div className="rounded-[10px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Progres penilaian
                </h2>
                <p className="mt-1 text-sm text-slate-500">Babak penyisihan</p>
              </div>
              <span className="text-lg font-semibold tabular-nums text-slate-900">
                {progress}%
              </span>
            </div>
            <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${(final / Math.max(participants.length, 1)) * 100}%`,
                }}
              />
              <div
                className="bg-amber-400"
                style={{
                  width: `${(active / Math.max(participants.length, 1)) * 100}%`,
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Belum dimulai</p>
                <p className="mt-1 font-semibold tabular-nums text-slate-900">
                  {pending}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Berlangsung</p>
                <p className="mt-1 font-semibold tabular-nums text-amber-700">
                  {active}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Final</p>
                <p className="mt-1 font-semibold tabular-nums text-emerald-700">
                  {final}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">
              Perlu perhatian
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              <div className="py-3 first:pt-0">
                <p className="text-sm font-medium text-slate-900">
                  2 peserta belum mendapat maqra
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Jadwal undian pukul 13.30 WIB
                </p>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-slate-900">
                  Rubrik “Aslah” belum dikonfirmasi
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Menunggu pengesahan dewan hakim
                </p>
              </div>
              <div className="py-3 last:pb-0">
                <p className="text-sm font-medium text-slate-900">
                  Semua kanal sinkronisasi aktif
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Tidak ada perubahan tertunda
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Sedang dinilai
              </h2>
              <button
                type="button"
                onClick={() => setCurrentScreen("hakim-list")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Lihat semua
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {activeParticipants.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-500">
                  Tidak ada penilaian aktif.
                </p>
              ) : (
                activeParticipants.map((participant) => {
                  const assessment = assessments.find(
                    (item) =>
                      item.participantId === participant.id &&
                      item.judgeId === "judge-1",
                  )
                  return (
                    <button
                      key={participant.id}
                      type="button"
                      onClick={() => {
                        setSelectedParticipantId(participant.id)
                        setCurrentScreen("hakim-workspace")
                      }}
                      className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {participant.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {participant.id} · {participant.kafilahName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums text-slate-900">
                          {assessment?.finalScore.toFixed(2) ?? "—"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
              <Clock className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">
                Aktivitas terbaru
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-slate-900">
                      {log.action}
                    </p>
                    <span className="shrink-0 text-xs tabular-nums text-slate-400">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
