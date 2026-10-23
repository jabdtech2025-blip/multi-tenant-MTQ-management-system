export type UserRole = "admin" | "hakim" | "superadmin"

export type AssessmentStatus = "Belum Dimulai" | "Berlangsung" | "Final/Terkunci"

export type SyncStatus = "Tersinkronisasi" | "Menyimpan..." | "Belum tersinkronisasi"

export interface Tenant {
  id: string
  name: string
  code: string
  eventName: string
  location: string
  startDate: string
  endDate: string
  status: "Aktif" | "Persiapan" | "Selesai"
  participantsCount: number
  judgesCount: number
  stagesCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId: string
  title: string
  assignedBranch?: string
  assignedCategories?: string[]
  avatarInitials: string
}

export interface Kafilah {
  id: string
  code: string
  name: string
  region: string
  participantsCount: number
  contactPerson: string
  phone: string
  status: "Aktif" | "Nonaktif"
}

export interface Participant {
  id: string // e.g., TLW-004
  noUndian: string
  name: string
  gender: "Laki-laki" | "Perempuan"
  kafilahId: string
  kafilahName: string
  jenjang: string
  cabang: string
  babak: string
  questionId: string
  questionTitle: string
  status: AssessmentStatus
  overallScore?: number
}

export interface Question {
  id: string
  code: string
  title: string
  surah: string
  ayatRange: string
  mushafPage: number
  cabang: string
  jenjang: string
  babak: string
  instructions: string
  verifiedMushafSource: string
  status: "Aktif" | "Draft"
  assignedParticipantsCount: number
}

export interface ErrorCategory {
  id: string
  code: string
  name: string
  description: string
  defaultWeight: number // e.g. 0.5 or 1.0 deduction
  scoringMethod: string
  applicableBranch: string
  ruleVersion: string
  status: "Aktif" | "Nonaktif"
  isProvisional?: boolean
}

export interface MushafStroke {
  id: string
  tool: "pen" | "highlighter" | "eraser"
  color: string
  size: number
  points: { x: number; y: number }[]
  page: number
  timestamp: string
}

export interface JudgeAssessment {
  id: string
  participantId: string
  judgeId: string
  judgeName: string
  judgeRoleTitle: string
  status: AssessmentStatus
  errorCounts: Record<string, number> // categoryId -> count
  deductions: Record<string, number> // categoryId -> total deduction
  baseScore: number // 100.00
  totalDeduction: number
  finalScore: number
  notes: string
  annotations: MushafStroke[]
  syncStatus: SyncStatus
  lastSavedAt: string
  lockedAt: string | null
  ruleVersion: string
}

export interface MasterRound {
  id: string
  code: string
  name: string
  sequence: number
  status: "Aktif" | "Selesai" | "Mendatang"
  participantCount: number
}

export interface MasterLevel {
  id: string
  code: string
  name: string
  ageRange: string
  status: "Aktif" | "Nonaktif"
}

export interface MasterBranch {
  id: string
  code: string
  name: string
  categoryType: "Tilawah" | "Tahfiz" | "Tafsir" | "Fahmil" | "Syarhil" | "Khat"
  quota: number
  status: "Aktif" | "Nonaktif"
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  details: string
  participantId?: string
}

export type ScreenId = "login" | "dashboard" | "kafilah-peserta" | "bank-soal" | "master-data" | "hakim-list" | "hakim-workspace" | "rekap-nilai"
