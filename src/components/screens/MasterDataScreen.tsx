import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import {
  ErrorCategory,
  MasterRound,
  MasterLevel,
  MasterBranch,
} from "../../types"
import {
  Database,
  Layers,
  GraduationCap,
  Trophy,
  Sliders,
  Users,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Gavel,
  ShieldCheck,
  Check,
} from "lucide-react"

type MasterTab = "babak" | "jenjang" | "cabang" | "kategori" | "hakim"

export const MasterDataScreen: React.FC = () => {
  const {
    rounds,
    levels,
    branches,
    errorCategories,
    updateErrorCategory,
    toggleCategoryStatus,
  } = useApp()

  const [activeTab, setActiveTab] = useState<MasterTab>("kategori")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<ErrorCategory | null>(
    null,
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    updateErrorCategory(editingCategory)
    setEditingCategory(null)
    showSuccess(
      `Konfigurasi rubrik ${editingCategory.name} berhasil diperbarui.`,
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 xl:p-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Master Data & Konfigurasi Rubrik
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#173D74] border border-blue-200">
                Rubrik Versi: v2.4 (LPTQ 2024)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola babak, jenjang usia, cabang musabaqah, bobot pengurangan
              kesalahan, serta penugasan hakim
            </p>
          </div>

          {successMessage && (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-1.5 animate-fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMessage}
            </div>
          )}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab("kategori")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "kategori"
                ? "bg-[#173D74] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kategori Kesalahan & Bobot</span>
          </button>

          <button
            onClick={() => setActiveTab("babak")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "babak"
                ? "bg-[#173D74] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Babak Kompetisi ({rounds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("jenjang")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "jenjang"
                ? "bg-[#173D74] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Jenjang Usia ({levels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cabang")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "cabang"
                ? "bg-[#173D74] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Cabang / Golongan ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hakim")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "hakim"
                ? "bg-[#173D74] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Pengguna & Penugasan Hakim</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KATEGORI KESALAHAN & BOBOT (PRD Section 4.7 & Screen E) */}
      {activeTab === "kategori" && (
        <div className="space-y-4">
          {/* Rubric Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Ketentuan Konfigurasi Rubrik Dinamis:</strong> Bobot
              pengurangan, batas nilai, dan formula penilaian bersifat fleksibel
              sesuai ketetapan dewan hakim cabang masing-masing. Nilai bobot di
              bawah ini dapat disesuaikan dan disimpan oleh administrator
              sebelum sesi perlombaan dimulai.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Daftar Kategori Kesalahan, Bobot & Metode Pengurangan
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {errorCategories.length} Kategori Terdaftar
              </span>
            </div>

            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 w-20">Kode</th>
                  <th className="px-4 py-3">Nama Kategori Kesalahan</th>
                  <th className="px-4 py-3">Deskripsi / Ruang Lingkup</th>
                  <th className="px-3 py-3 text-center">Bobot Default</th>
                  <th className="px-4 py-3">Metode Pengurangan</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {errorCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                      {cat.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {cat.name}
                        {cat.isProvisional && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 font-medium border border-amber-200">
                            Provisional
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {cat.applicableBranch}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">
                      {cat.description}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-rose-600 bg-rose-50/40">
                      -{cat.defaultWeight.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {cat.scoringMethod}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => toggleCategoryStatus(cat.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                          cat.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Klik untuk mengubah status aktif/nonaktif"
                      >
                        {cat.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="px-2.5 py-1.5 rounded text-xs font-semibold text-[#173D74] hover:bg-blue-100 bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Ubah Bobot</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BABAK */}
      {activeTab === "babak" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Tahapan & Babak Musabaqah
              </h3>
              <p className="text-xs text-slate-500">
                Konfigurasi urutan dan kuota kelolosan tiap babak
              </p>
            </div>
            <button
              onClick={() => showSuccess("Babak kustom berhasil ditambahkan.")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173D74] text-white hover:bg-[#12305c]"
            >
              + Tambah Babak
            </button>
          </div>

          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 text-center w-16">Urutan</th>
                <th className="px-4 py-3">Kode Babak</th>
                <th className="px-5 py-3">Nama Babak</th>
                <th className="px-4 py-3 text-center">Peserta Terjadwal</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rounds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center font-bold text-slate-600 font-mono">
                    {r.sequence}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                    {r.code}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">
                    {r.participantCount} peserta
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        r.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs font-semibold text-[#173D74] hover:underline">
                      Edit Babak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: JENJANG */}
      {activeTab === "jenjang" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Jenjang Usia & Kategori Peserta
              </h3>
              <p className="text-xs text-slate-500">
                Batasan umur dan klasifikasi golongan peserta
              </p>
            </div>
            <button
              onClick={() => showSuccess("Jenjang baru berhasil ditambahkan.")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173D74] text-white hover:bg-[#12305c]"
            >
              + Tambah Jenjang
            </button>
          </div>

          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 w-24">Kode</th>
                <th className="px-5 py-3">Nama Jenjang</th>
                <th className="px-5 py-3">Batasan Usia</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {levels.map((lvl) => (
                <tr
                  key={lvl.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                    {lvl.code}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {lvl.name}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{lvl.ageRange}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {lvl.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs font-semibold text-[#173D74] hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CABANG / GOLONGAN */}
      {activeTab === "cabang" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Cabang & Golongan Musabaqah
              </h3>
              <p className="text-xs text-slate-500">
                Cabang yang diperlombakan pada tenant MTQ aktif
              </p>
            </div>
            <button
              onClick={() => showSuccess("Cabang baru berhasil ditambahkan.")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173D74] text-white hover:bg-[#12305c]"
            >
              + Tambah Cabang
            </button>
          </div>

          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 w-28">Kode Cabang</th>
                <th className="px-5 py-3">Nama Cabang / Golongan</th>
                <th className="px-4 py-3">Rumpun Musabaqah</th>
                <th className="px-4 py-3 text-center">Kuota Kafilah</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                    {b.code}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {b.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{b.categoryType}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">
                    {b.quota} per kafilah
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs font-semibold text-[#173D74] hover:underline">
                      Edit Cabang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: PENGGUNA & PENUGASAN HAKIM */}
      {activeTab === "hakim" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Akun Dewan Hakim & Penugasan Majelis
              </h3>
              <p className="text-xs text-slate-500">
                Penugasan hakim ke cabang musabaqah dan pembagian bidang
                penilaian
              </p>
            </div>
            <button
              onClick={() => showSuccess("Hakim baru berhasil ditugaskan.")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173D74] text-white hover:bg-[#12305c]"
            >
              + Tugaskan Hakim
            </button>
          </div>

          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-5 py-3">Nama Dewan Hakim</th>
                <th className="px-4 py-3">Bidang Penilaian</th>
                <th className="px-4 py-3">Cabang Penugasan</th>
                <th className="px-3 py-3 text-center">Kategori Kesalahan</th>
                <th className="px-3 py-3 text-center">Status Sesi</th>
                <th className="px-4 py-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                  H-01
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-900">
                    KH. Ahmad Dahlan, M.Ag
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ahmad.dahlan@hakim.mtq.id
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  Tajwid & Makharijul Huruf
                </td>
                <td className="px-4 py-3 text-slate-600">
                  Tilawah Dewasa Putra
                </td>
                <td className="px-3 py-3 text-center font-mono">3 Kategori</td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif Menilai
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-xs font-semibold text-[#173D74] hover:underline">
                    Atur Penugasan
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                  H-02
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-900">
                    Dr. H. M. Quraish, MA
                  </div>
                  <div className="text-[11px] text-slate-500">
                    quraish.hakim@mtq.id
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  Fasahah & Ahkamul Waqf
                </td>
                <td className="px-4 py-3 text-slate-600">
                  Tilawah Dewasa Putra
                </td>
                <td className="px-3 py-3 text-center font-mono">3 Kategori</td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif Menilai
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-xs font-semibold text-[#173D74] hover:underline">
                    Atur Penugasan
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                  H-03
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-900">
                    Hj. Siti Maryam, S.Th.I
                  </div>
                  <div className="text-[11px] text-slate-500">
                    siti.maryam@hakim.mtq.id
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  Lagu, Suara & Irama
                </td>
                <td className="px-4 py-3 text-slate-600">
                  Tilawah Dewasa Putra
                </td>
                <td className="px-3 py-3 text-center font-mono">2 Kategori</td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif Menilai
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-xs font-semibold text-[#173D74] hover:underline">
                    Atur Penugasan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Ubah Konfigurasi Kategori Kesalahan */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Konfigurasi Bobot Pengurangan
                </h3>
                <p className="text-[11px] text-blue-200">
                  {editingCategory.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Kategori
                  </label>
                  <input
                    type="text"
                    value={editingCategory.code}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bobot Pengurangan (Poin)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="10"
                    value={editingCategory.defaultWeight}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        defaultWeight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Metode Pengurangan
                </label>
                <input
                  type="text"
                  value={editingCategory.scoringMethod}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      scoringMethod: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Kesalahan
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Versi Rubrik
                </label>
                <input
                  type="text"
                  value={editingCategory.ruleVersion}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      ruleVersion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#173D74] hover:bg-[#12305c]"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
