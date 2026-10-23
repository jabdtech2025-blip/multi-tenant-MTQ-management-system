import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react"
import {
  Tenant,
  User,
  UserRole,
  ScreenId,
  Kafilah,
  Participant,
  Question,
  ErrorCategory,
  JudgeAssessment,
  MasterRound,
  MasterLevel,
  MasterBranch,
  AuditLog,
  MushafStroke,
} from "../types"
import {
  INITIAL_TENANTS,
  INITIAL_USERS,
  INITIAL_KAFILAHS,
  INITIAL_PARTICIPANTS,
  INITIAL_QUESTIONS,
  INITIAL_ERROR_CATEGORIES,
  INITIAL_ASSESSMENTS,
  INITIAL_ROUNDS,
  INITIAL_LEVELS,
  INITIAL_BRANCHES,
  INITIAL_AUDIT_LOGS,
} from "../data/mockData"

interface AppContextType {
  currentTenant: Tenant
  tenants: Tenant[]
  setCurrentTenant: (t: Tenant) => void
  currentUser: User
  currentRole: UserRole
  setCurrentRole: (r: UserRole) => void
  currentScreen: ScreenId
  setCurrentScreen: (s: ScreenId) => void

  kafilahs: Kafilah[]
  participants: Participant[]
  questions: Question[]
  errorCategories: ErrorCategory[]
  assessments: JudgeAssessment[]
  rounds: MasterRound[]
  levels: MasterLevel[]
  branches: MasterBranch[]
  auditLogs: AuditLog[]

  selectedParticipantId: string
  setSelectedParticipantId: (id: string) => void
  selectedKafilahId: string | null
  setSelectedKafilahId: (id: string | null) => void
  inspectingParticipantId: string | null
  setInspectingParticipantId: (id: string | null) => void

  // Scoring actions
  updateErrorCount: (
    participantId: string,
    judgeId: string,
    categoryId: string,
    delta: number,
  ) => void
  saveStroke: (
    participantId: string,
    judgeId: string,
    stroke: MushafStroke,
  ) => void
  undoStroke: (participantId: string, judgeId: string) => void
  clearStrokes: (participantId: string, judgeId: string, page: number) => void
  updateAssessmentNotes: (
    participantId: string,
    judgeId: string,
    notes: string,
  ) => void
  finalizeAssessment: (participantId: string, judgeId: string) => void

  // Data management actions
  addKafilah: (data: Partial<Kafilah>) => void
  addParticipant: (data: Partial<Participant>) => void
  addQuestion: (data: Partial<Question>) => void
  updateErrorCategory: (cat: ErrorCategory) => void
  toggleCategoryStatus: (id: string) => void

  // Auth flow helpers
  loginAs: (role: UserRole, user?: User) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS)
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0])
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0])
  const [currentRole, setCurrentRole] = useState<UserRole>("admin")
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard")

  const [kafilahs, setKafilahs] = useState<Kafilah[]>(INITIAL_KAFILAHS)
  const [participants, setParticipants] =
    useState<Participant[]>(INITIAL_PARTICIPANTS)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [errorCategories, setErrorCategories] = useState<ErrorCategory[]>(
    INITIAL_ERROR_CATEGORIES,
  )
  const [assessments, setAssessments] =
    useState<JudgeAssessment[]>(INITIAL_ASSESSMENTS)
  const [rounds, setRounds] = useState<MasterRound[]>(INITIAL_ROUNDS)
  const [levels, setLevels] = useState<MasterLevel[]>(INITIAL_LEVELS)
  const [branches, setBranches] = useState<MasterBranch[]>(INITIAL_BRANCHES)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS)

  const [selectedParticipantId, setSelectedParticipantId] =
    useState<string>("TLW-004")
  const [selectedKafilahId, setSelectedKafilahId] = useState<string | null>(
    null,
  )
  const [inspectingParticipantId, setInspectingParticipantId] =
    useState<string | null>(null)

  // When role changes, switch screen to appropriate starting screen if needed
  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role)
    const matchingUser = INITIAL_USERS.find((u) => u.role === role)
    if (matchingUser) {
      setCurrentUser(matchingUser)
    }
    if (role === "hakim") {
      setCurrentScreen("hakim-list")
    } else {
      setCurrentScreen("dashboard")
    }
  }

  const loginAs = (role: UserRole, user?: User) => {
    setCurrentRole(role)
    if (user) {
      setCurrentUser(user)
    } else {
      const match = INITIAL_USERS.find((u) => u.role === role)
      if (match) setCurrentUser(match)
    }
    if (role === "hakim") {
      setCurrentScreen("hakim-list")
    } else {
      setCurrentScreen("dashboard")
    }
  }

  const logout = () => {
    setCurrentScreen("login")
  }

  const getTimestamp = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} WIB`
  }

  // Update error count for a judge on a participant
  const updateErrorCount = (
    participantId: string,
    judgeId: string,
    categoryId: string,
    delta: number,
  ) => {
    const category = errorCategories.find((c) => c.id === categoryId)
    const weight = category ? category.defaultWeight : 1.0

    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          // If already locked, do not modify
          if (item.status === "Final/Terkunci") return item

          const currentCount = item.errorCounts[categoryId] || 0
          const newCount = Math.max(0, currentCount + delta)

          const updatedCounts = {
            ...item.errorCounts,
            [categoryId]: newCount,
          }

          // Recompute deductions
          const updatedDeductions = { ...item.deductions }
          updatedDeductions[categoryId] = Number((newCount * weight).toFixed(2))

          const totalDeduction = Object.values(updatedDeductions).reduce(
            (sum, val) => sum + (val || 0),
            0,
          )
          const finalScore = Number(
            Math.max(0, item.baseScore - totalDeduction).toFixed(2),
          )

          return {
            ...item,
            errorCounts: updatedCounts,
            deductions: updatedDeductions,
            totalDeduction,
            finalScore,
            status: "Berlangsung",
            syncStatus: "Menyimpan...",
            lastSavedAt: getTimestamp(),
          }
        }
        return item
      }),
    )

    // Also update participant overall status if it was 'Belum Dimulai'
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId && p.status === "Belum Dimulai") {
          return { ...p, status: "Berlangsung" }
        }
        return p
      }),
    )

    // Simulate async sync confirmation (optimistic update -> confirmed)
    setTimeout(() => {
      setAssessments((prev) =>
        prev.map((item) => {
          if (
            item.participantId === participantId &&
            item.judgeId === judgeId
          ) {
            return { ...item, syncStatus: "Tersinkronisasi" }
          }
          return item
        }),
      )
    }, 450)

    // Add audit entry
    const catName = category ? category.name : categoryId
    const actionText = delta > 0 ? `+${delta}` : `${delta}`
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: getTimestamp(),
      user: currentUser.name,
      role: currentUser.title,
      action: "Pembaruan Kesalahan (Real-Time)",
      details: `Mengubah jumlah kesalahan ${catName} (${actionText}) untuk peserta ${participantId}. Perubahan tersinkronisasi.`,
      participantId,
    }
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)])
  }

  const saveStroke = (
    participantId: string,
    judgeId: string,
    stroke: MushafStroke,
  ) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          if (item.status === "Final/Terkunci") return item
          return {
            ...item,
            annotations: [...item.annotations, stroke],
            syncStatus: "Menyimpan...",
            lastSavedAt: getTimestamp(),
          }
        }
        return item
      }),
    )

    setTimeout(() => {
      setAssessments((prev) =>
        prev.map((item) => {
          if (
            item.participantId === participantId &&
            item.judgeId === judgeId
          ) {
            return { ...item, syncStatus: "Tersinkronisasi" }
          }
          return item
        }),
      )
    }, 350)
  }

  const undoStroke = (participantId: string, judgeId: string) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          if (item.status === "Final/Terkunci" || item.annotations.length === 0)
            return item
          const next = [...item.annotations]
          next.pop()
          return {
            ...item,
            annotations: next,
            syncStatus: "Tersinkronisasi",
            lastSavedAt: getTimestamp(),
          }
        }
        return item
      }),
    )
  }

  const clearStrokes = (
    participantId: string,
    judgeId: string,
    page: number,
  ) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          if (item.status === "Final/Terkunci") return item
          return {
            ...item,
            annotations: item.annotations.filter((a) => a.page !== page),
            syncStatus: "Tersinkronisasi",
            lastSavedAt: getTimestamp(),
          }
        }
        return item
      }),
    )
  }

  const updateAssessmentNotes = (
    participantId: string,
    judgeId: string,
    notes: string,
  ) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          if (item.status === "Final/Terkunci") return item
          return {
            ...item,
            notes,
            lastSavedAt: getTimestamp(),
          }
        }
        return item
      }),
    )
  }

  const finalizeAssessment = (participantId: string, judgeId: string) => {
    const timestamp = getTimestamp()
    let updatedScore = 0

    setAssessments((prev) =>
      prev.map((item) => {
        if (item.participantId === participantId && item.judgeId === judgeId) {
          updatedScore = item.finalScore
          return {
            ...item,
            status: "Final/Terkunci",
            lockedAt: timestamp,
            syncStatus: "Tersinkronisasi",
            lastSavedAt: timestamp,
          }
        }
        return item
      }),
    )

    // Check if other judges for this participant are also finalized
    setTimeout(() => {
      setAssessments((current) => {
        const participantAssessments = current.filter(
          (a) => a.participantId === participantId,
        )
        const allFinal = participantAssessments.every(
          (a) => a.status === "Final/Terkunci",
        )
        const avgScore =
          participantAssessments.reduce((sum, a) => sum + a.finalScore, 0) /
          (participantAssessments.length || 1)

        setParticipants((prev) =>
          prev.map((p) => {
            if (p.id === participantId) {
              return {
                ...p,
                status: allFinal ? "Final/Terkunci" : "Berlangsung",
                overallScore: Number(avgScore.toFixed(2)),
              }
            }
            return p
          }),
        )
        return current
      })
    }, 100)

    // Audit log entry for finalization
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp,
      user: currentUser.name,
      role: currentUser.title,
      action: "Finalisasi & Penguncian Penilaian (Simpan Penilaian)",
      details: `Mengunci penilaian peserta ${participantId}. Snapshot nilai (${updatedScore}) dan anotasi mushaf disimpan secara konsisten.`,
      participantId,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const addKafilah = (data: Partial<Kafilah>) => {
    const newK: Kafilah = {
      id: `kf-${Date.now()}`,
      code: data.code || `KF-${Math.floor(Math.random() * 900 + 100)}`,
      name: data.name || "Kafilah Baru",
      region: data.region || "Jawa Barat",
      participantsCount: 0,
      contactPerson: data.contactPerson || "-",
      phone: data.phone || "-",
      status: "Aktif",
    }
    setKafilahs((prev) => [newK, ...prev])
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: getTimestamp(),
      user: currentUser.name,
      role: currentUser.title,
      action: "Tambah Kafilah",
      details: `Menambahkan kafilah baru: ${newK.name} (${newK.code})`,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const addParticipant = (data: Partial<Participant>) => {
    const newP: Participant = {
      id: data.id || `TLW-${Math.floor(Math.random() * 900 + 100)}`,
      noUndian: data.noUndian || `${participants.length + 1}`.padStart(2, "0"),
      name: data.name || "Nama Peserta",
      gender: data.gender || "Laki-laki",
      kafilahId: data.kafilahId || kafilahs[0].id,
      kafilahName: data.kafilahName || kafilahs[0].name,
      jenjang: data.jenjang || "Ulya",
      cabang: data.cabang || "Tilawah Dewasa Putra",
      babak: data.babak || "Penyisihan",
      questionId: data.questionId || questions[0].id,
      questionTitle: data.questionTitle || questions[0].title,
      status: "Belum Dimulai",
    }

    setParticipants((prev) => [...prev, newP])

    // Update kafilah participant count
    setKafilahs((prev) =>
      prev.map((k) =>
        k.id === newP.kafilahId
          ? { ...k, participantsCount: k.participantsCount + 1 }
          : k,
      ),
    )

    // Create empty assessments for 3 judges
    const newAssessments: JudgeAssessment[] = [
      {
        id: `as-${newP.id}-j1`,
        participantId: newP.id,
        judgeId: "judge-1",
        judgeName: "KH. Ahmad Dahlan, M.Ag",
        judgeRoleTitle: "Hakim 1 - Tajwid & Makhraj",
        status: "Belum Dimulai",
        errorCounts: {},
        deductions: {},
        baseScore: 100.0,
        totalDeduction: 0,
        finalScore: 100.0,
        notes: "",
        annotations: [],
        syncStatus: "Tersinkronisasi",
        lastSavedAt: "-",
        lockedAt: null,
        ruleVersion: "v2.4 - LPTQ 2024",
      },
      {
        id: `as-${newP.id}-j2`,
        participantId: newP.id,
        judgeId: "judge-2",
        judgeName: "Dr. H. M. Quraish, MA",
        judgeRoleTitle: "Hakim 2 - Fasahah & Waqf",
        status: "Belum Dimulai",
        errorCounts: {},
        deductions: {},
        baseScore: 100.0,
        totalDeduction: 0,
        finalScore: 100.0,
        notes: "",
        annotations: [],
        syncStatus: "Tersinkronisasi",
        lastSavedAt: "-",
        lockedAt: null,
        ruleVersion: "v2.4 - LPTQ 2024",
      },
      {
        id: `as-${newP.id}-j3`,
        participantId: newP.id,
        judgeId: "judge-3",
        judgeName: "Hj. Siti Maryam, S.Th.I",
        judgeRoleTitle: "Hakim 3 - Lagu & Suara",
        status: "Belum Dimulai",
        errorCounts: {},
        deductions: {},
        baseScore: 100.0,
        totalDeduction: 0,
        finalScore: 100.0,
        notes: "",
        annotations: [],
        syncStatus: "Tersinkronisasi",
        lastSavedAt: "-",
        lockedAt: null,
        ruleVersion: "v2.4 - LPTQ 2024",
      },
    ]
    setAssessments((prev) => [...prev, ...newAssessments])

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: getTimestamp(),
      user: currentUser.name,
      role: currentUser.title,
      action: "Pendaftaran Peserta",
      details: `Menambahkan peserta baru: ${newP.name} (${newP.id}) Kafilah ${newP.kafilahName}`,
      participantId: newP.id,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const addQuestion = (data: Partial<Question>) => {
    const newQ: Question = {
      id: data.id || `SO-USR-${Date.now()}`,
      code: data.code || `MQ-NEW-${Math.floor(Math.random() * 90 + 10)}`,
      title: data.title || "Maqra Baru",
      surah: data.surah || "Surah Pilihan",
      ayatRange: data.ayatRange || "Ayat 1 - 10",
      mushafPage: data.mushafPage || 305,
      cabang: data.cabang || "Tilawah Dewasa Putra",
      jenjang: data.jenjang || "Ulya",
      babak: data.babak || "Penyisihan",
      instructions:
        data.instructions ||
        "Tartil dan bertilawah sesuai maqamat yang ditentukan.",
      verifiedMushafSource: "Mushaf Standar Indonesia Kemenag RI",
      status: "Aktif",
      assignedParticipantsCount: 0,
    }
    setQuestions((prev) => [newQ, ...prev])
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: getTimestamp(),
      user: currentUser.name,
      role: currentUser.title,
      action: "Tambah Bank Soal",
      details: `Menambahkan soal maqra baru: ${newQ.title} (${newQ.code})`,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const updateErrorCategory = (cat: ErrorCategory) => {
    setErrorCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)))
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: getTimestamp(),
      user: currentUser.name,
      role: currentUser.title,
      action: "Ubah Rubrik Master Data",
      details: `Memperbarui konfigurasi bobot/metode kategori ${cat.name} (Bobot: ${cat.defaultWeight})`,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const toggleCategoryStatus = (id: string) => {
    setErrorCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : c,
      ),
    )
  }

  const value = useMemo(
    () => ({
      currentTenant,
      tenants,
      setCurrentTenant,
      currentUser,
      currentRole,
      setCurrentRole: handleSetRole,
      currentScreen,
      setCurrentScreen,
      kafilahs,
      participants,
      questions,
      errorCategories,
      assessments,
      rounds,
      levels,
      branches,
      auditLogs,
      selectedParticipantId,
      setSelectedParticipantId,
      selectedKafilahId,
      setSelectedKafilahId,
      inspectingParticipantId,
      setInspectingParticipantId,
      updateErrorCount,
      saveStroke,
      undoStroke,
      clearStrokes,
      updateAssessmentNotes,
      finalizeAssessment,
      addKafilah,
      addParticipant,
      addQuestion,
      updateErrorCategory,
      toggleCategoryStatus,
      loginAs,
      logout,
    }),
    [
      currentTenant,
      tenants,
      currentUser,
      currentRole,
      currentScreen,
      kafilahs,
      participants,
      questions,
      errorCategories,
      assessments,
      rounds,
      levels,
      branches,
      auditLogs,
      selectedParticipantId,
      selectedKafilahId,
      inspectingParticipantId,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
