import React, { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import { Question } from "../../types"
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  X,
  ShieldCheck,
  Bookmark,
  Layers,
  ArrowRight,
  UserCheck,
} from "lucide-react"

export const BankSoalScreen: React.FC = () => {
  const {
    questions,
    addQuestion,
    participants,
    setSelectedParticipantId,
    setCurrentScreen,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCabang, setSelectedCabang] = useState("ALL")
  const [selectedBabak, setSelectedBabak] = useState("ALL")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null)

  // Form states
  const [newTitle, setNewTitle] = useState("")
  const [newCode, setNewCode] = useState("")
  const [newSurah, setNewSurah] = useState("")
  const [newAyatRange, setNewAyatRange] = useState("")
  const [newPage, setNewPage] = useState<number>(305)
  const [newCabang, setNewCabang] = useState("Tilawah Dewasa Putra")
  const [newJenjang, setNewJenjang] = useState("Ulya")
  const [newBabak, setNewBabak] = useState("Penyisihan")
  const [newInstructions, setNewInstructions] = useState("")

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.surah.toLowerCase().includes(searchTerm.toLowerCase())

      const matchCabang =
        selectedCabang === "ALL" || q.cabang === selectedCabang
      const matchBabak = selectedBabak === "ALL" || q.babak === selectedBabak

      return matchSearch && matchCabang && matchBabak
    })
  }, [questions, searchTerm, selectedCabang, selectedBabak])

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    addQuestion({
      title: newTitle,
      code: newCode || `MQ-TLW-${Math.floor(Math.random() * 90 + 10)}`,
      surah: newSurah || "Surat Pilihan",
      ayatRange: newAyatRange || "Ayat 1 - 10",
      mushafPage: Number(newPage) || 305,
      cabang: newCabang,
      jenjang: newJenjang,
      babak: newBabak,
      instructions:
        newInstructions ||
        "Dibaca tartil riwayat Hafs 'an 'Ashim Thariq Asy-Syathibiyyah.",
      verifiedMushafSource: "Mushaf Standar Indonesia Kemenag RI",
      status: "Aktif",
    })
    setNewTitle("")
    setNewCode("")
    setNewSurah("")
    setNewAyatRange("")
    setNewInstructions("")
    setIsAddModalOpen(false)
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 xl:p-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Bank Soal & Maqra Tilawah
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#173D74] border border-blue-200">
                Terverifikasi Lajnah Kemenag
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola paket maqra, surah, ayat, dan penetapan soal undian bagi
              peserta musabaqah
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#173D74] hover:bg-[#12305c] text-white flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Soal / Maqra</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode soal, surah, atau maqra..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
            />
          </div>

          {/* Cabang Filter */}
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
              <option value="Tahfiz 10 Juz">Tahfiz 10 Juz</option>
            </select>
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

          <span className="text-xs text-slate-500 font-mono ml-auto">
            {filteredQuestions.length} Paket Soal
          </span>
        </div>
      </div>

      {/* Verified Mushaf Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center justify-between gap-4 text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong>Sumber Mushaf Resmi:</strong> Seluruh soal maqra merujuk
            pada{" "}
            <span className="font-semibold underline">
              Mushaf Standar Indonesia Kemenag RI (Rasm 'Utsmani)
            </span>
            . Dilengkapi nomor halaman resmi untuk navigasi cepat hakim di
            mimbar.
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-1 rounded shrink-0">
          Lajnah Pentashihan Al-Qur'an
        </span>
      </div>

      {/* Question Bank Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-700 font-semibold">
            <tr>
              <th className="px-4 py-3 w-28">Kode Soal</th>
              <th className="px-5 py-3">Judul / Referensi Maqra</th>
              <th className="px-4 py-3">Surah & Ayat</th>
              <th className="px-3 py-3 text-center">Hal. Mushaf</th>
              <th className="px-4 py-3">Cabang & Jenjang</th>
              <th className="px-3 py-3 text-center">Babak</th>
              <th className="px-3 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                  {q.code}
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-900">{q.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {q.instructions}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-medium text-[#173D74]">{q.surah}</span>
                  <span className="text-slate-400 block text-[11px]">
                    {q.ayatRange}
                  </span>
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold text-slate-800 bg-slate-50/60">
                  Hal. {q.mushafPage}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{q.cabang}</div>
                  <div className="text-[10px] text-slate-400">{q.jenjang}</div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {q.babak}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="px-2.5 py-1.5 rounded text-xs font-semibold text-[#173D74] hover:bg-blue-100 bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Tambah Soal Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateQuestion}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Tambah Paket Maqra / Bank Soal
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul / Paket Maqra *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maqra 05: QS. Ta-Ha [20]: 1 - 24"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Soal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: MQ-TLW-05"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Halaman Mushaf Kemenag
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={604}
                    value={newPage}
                    onChange={(e) => setNewPage(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Surah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ta-Ha (20)"
                    value={newSurah}
                    onChange={(e) => setNewSurah(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rentang Ayat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ayat 1 - 24"
                    value={newAyatRange}
                    onChange={(e) => setNewAyatRange(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cabang
                  </label>
                  <select
                    value={newCabang}
                    onChange={(e) => setNewCabang(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  >
                    <option value="Tilawah Dewasa Putra">
                      Tilawah Dewasa Putra
                    </option>
                    <option value="Tilawah Dewasa Putri">
                      Tilawah Dewasa Putri
                    </option>
                    <option value="Tahfiz 10 Juz">Tahfiz 10 Juz</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenjang
                  </label>
                  <select
                    value={newJenjang}
                    onChange={(e) => setNewJenjang(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  >
                    <option value="Ula">Ula</option>
                    <option value="Mutawassit">Mutawassit</option>
                    <option value="Ulya">Ulya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Babak
                  </label>
                  <select
                    value={newBabak}
                    onChange={(e) => setNewBabak(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  >
                    <option value="Penyisihan">Penyisihan</option>
                    <option value="Semifinal">Semifinal</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Petunjuk Pembacaan / Maqamat
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruksi maqamat atau tata cara tilawah..."
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#173D74] hover:bg-[#12305c]"
              >
                Simpan Paket Soal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Pratinjau Soal & Penetapan ke Peserta */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{previewQuestion.code}</h3>
                <p className="text-xs text-blue-200">{previewQuestion.title}</p>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Surah / Ayat:</span>
                  <span className="font-bold text-slate-900">
                    {previewQuestion.surah} ({previewQuestion.ayatRange})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Halaman Mushaf Standar:
                  </span>
                  <span className="font-mono font-bold text-[#173D74]">
                    Halaman {previewQuestion.mushafPage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cabang & Babak:</span>
                  <span>
                    {previewQuestion.cabang} / {previewQuestion.babak}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Sumber Referensi:</span>
                  <span className="text-emerald-700 font-medium">
                    {previewQuestion.verifiedMushafSource}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">
                  Instruksi & Ketentuan Maqamat:
                </h4>
                <p className="p-3 bg-blue-50/50 rounded border border-blue-200 text-slate-700 leading-relaxed text-[11px]">
                  {previewQuestion.instructions}
                </p>
              </div>

              {/* Action: Assign Question to Participant */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#173D74]" />
                  Tetapkan Soal Ini ke Peserta:
                </h4>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                    defaultValue={participants[0]?.id}
                  >
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.noUndian} — {p.name} ({p.kafilahName})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      alert(`Soal ${previewQuestion.code} berhasil ditetapkan.`)
                      setPreviewQuestion(null)
                    }}
                    className="px-3 py-1.5 bg-[#173D74] hover:bg-[#12305c] text-white font-bold rounded text-xs transition-colors shrink-0"
                  >
                    Tetapkan
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-1.5 rounded text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
