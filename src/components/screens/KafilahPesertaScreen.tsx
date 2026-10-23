import React, { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import { Kafilah, Participant } from "../../types"
import {
  Users,
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  ChevronRight,
  ArrowLeft,
  X,
  CheckCircle2,
  UserPlus,
  Phone,
  MapPin,
  Award,
  Layers,
  FileCheck2,
} from "lucide-react"

export const KafilahPesertaScreen: React.FC = () => {
  const {
    kafilahs,
    participants,
    addKafilah,
    addParticipant,
    setSelectedParticipantId,
    setCurrentScreen,
    selectedKafilahId,
    setSelectedKafilahId,
    setInspectingParticipantId,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [participantSearch, setParticipantSearch] = useState("")
  const [isAddKafilahModalOpen, setIsAddKafilahModalOpen] = useState(false)
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] =
    useState(false)

  // Form states for Kafilah
  const [newKafilahName, setNewKafilahName] = useState("")
  const [newKafilahCode, setNewKafilahCode] = useState("")
  const [newKafilahRegion, setNewKafilahRegion] = useState(
    "Jawa Barat - Wilayah I",
  )
  const [newKafilahContact, setNewKafilahContact] = useState("")
  const [newKafilahPhone, setNewKafilahPhone] = useState("")

  // Form states for Participant
  const [newPartName, setNewPartName] = useState("")
  const [newPartId, setNewPartId] = useState("")
  const [newPartUndian, setNewPartUndian] = useState("")
  const [newPartGender, setNewPartGender] = useState<"Laki-laki" | "Perempuan">(
    "Laki-laki",
  )
  const [newPartJenjang, setNewPartJenjang] = useState("Ulya")
  const [newPartCabang, setNewPartCabang] = useState("Tilawah Dewasa Putra")

  // Filtered Kafilah list
  const filteredKafilahs = useMemo(() => {
    return kafilahs.filter(
      (k) =>
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.region.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [kafilahs, searchTerm])

  // Selected Kafilah detail
  const activeKafilah = kafilahs.find((k) => k.id === selectedKafilahId)

  // Participants of selected Kafilah
  const kafilahParticipants = useMemo(() => {
    if (!selectedKafilahId) return []
    return participants.filter(
      (p) =>
        p.kafilahId === selectedKafilahId &&
        (p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
          p.id.toLowerCase().includes(participantSearch.toLowerCase()) ||
          p.cabang.toLowerCase().includes(participantSearch.toLowerCase())),
    )
  }, [participants, selectedKafilahId, participantSearch])

  const handleCreateKafilah = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKafilahName) return
    addKafilah({
      name: newKafilahName,
      code: newKafilahCode || `KF-${Math.floor(Math.random() * 900 + 100)}`,
      region: newKafilahRegion,
      contactPerson: newKafilahContact,
      phone: newKafilahPhone,
    })
    setNewKafilahName("")
    setNewKafilahCode("")
    setNewKafilahContact("")
    setNewKafilahPhone("")
    setIsAddKafilahModalOpen(false)
  }

  const handleCreateParticipant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPartName || !activeKafilah) return
    addParticipant({
      name: newPartName,
      id: newPartId || `TLW-${Math.floor(Math.random() * 900 + 100)}`,
      noUndian: newPartUndian || `${participants.length + 1}`.padStart(2, "0"),
      gender: newPartGender,
      kafilahId: activeKafilah.id,
      kafilahName: activeKafilah.name,
      jenjang: newPartJenjang,
      cabang: newPartCabang,
      babak: "Penyisihan",
    })
    setNewPartName("")
    setNewPartId("")
    setNewPartUndian("")
    setIsAddParticipantModalOpen(false)
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 xl:p-8 space-y-6">
      {/* If a Kafilah is selected, show Drilldown Kafilah Detail View */}
      {activeKafilah ? (
        <div className="space-y-6">
          {/* Back button & Kafilah Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 flex-wrap">
              <button
                onClick={() => setSelectedKafilahId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Seluruh Kafilah
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddParticipantModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173D74] hover:bg-[#12305c] text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />+ Tambah Peserta ke
                  Kafilah Ini
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#173D74] border border-blue-200">
                    {activeKafilah.code}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeKafilah.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {activeKafilah.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeKafilah.region}
                  <span>•</span>
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Pendamping: {activeKafilah.contactPerson} (
                  {activeKafilah.phone})
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-right">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Total Peserta Terdaftar
                </span>
                <span className="text-xl font-black font-mono text-[#173D74]">
                  {kafilahParticipants.length}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    orang
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Kafilah Participant Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Peserta Kafilah {activeKafilah.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Peserta yang bertanding mewakili kafilah pada MTQ Jabar 2025
                </p>
              </div>

              {/* Filter / Search Peserta */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Cari nama atau ID peserta..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-3 py-2.5 text-center w-12">Undian</th>
                    <th className="px-3 py-2.5 w-24">ID Peserta</th>
                    <th className="px-4 py-2.5">Nama Lengkap</th>
                    <th className="px-3 py-2.5">Jenjang</th>
                    <th className="px-4 py-2.5">Cabang / Golongan</th>
                    <th className="px-3 py-2.5 text-center">Status Nilai</th>
                    <th className="px-3 py-2.5 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kafilahParticipants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-xs text-slate-400"
                      >
                        Belum ada peserta yang didaftarkan pada kafilah ini.
                        Klik "+ Tambah Peserta" di atas untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    kafilahParticipants.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-700">
                          {p.noUndian}
                        </td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#173D74]">
                          {p.id}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-900">
                          {p.name}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {p.jenjang}
                        </td>
                        <td className="px-4 py-2.5 text-slate-700 font-medium">
                          {p.cabang}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              p.status === "Final/Terkunci"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : p.status === "Berlangsung"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedParticipantId(p.id)
                              setCurrentScreen("hakim-workspace")
                            }}
                            className="px-2 py-1 rounded text-xs font-semibold text-[#173D74] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                            title="Buka Lembar Penilaian Peserta"
                          >
                            Workspace
                          </button>
                          <button
                            onClick={() => setInspectingParticipantId(p.id)}
                            className="px-2 py-1 rounded text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                            title="Lihat Detail Penilaian"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Default View: Kafilah Management Table */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Kafilah & Peserta MTQ
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola kafilah delegasi kabupaten/kota dan daftar peserta
                  dalam naungan tenant
                </p>
              </div>

              <button
                onClick={() => setIsAddKafilahModalOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#173D74] hover:bg-[#12305c] text-white flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Kafilah</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kode, nama kafilah, atau wilayah..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {filteredKafilahs.length} Kafilah Terdaftar
              </span>
            </div>
          </div>

          {/* Kafilah List Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 w-28">Kode Kafilah</th>
                  <th className="px-5 py-3">Nama Kafilah</th>
                  <th className="px-4 py-3">Wilayah</th>
                  <th className="px-4 py-3 text-center">Jumlah Peserta</th>
                  <th className="px-4 py-3">Penanggung Jawab</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredKafilahs.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#173D74]">
                      {k.code}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {k.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{k.region}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                      {k.participantsCount}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{k.contactPerson}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {k.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedKafilahId(k.id)}
                        className="px-2.5 py-1.5 rounded text-xs font-semibold text-[#173D74] hover:bg-blue-100 bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Kafilah */}
      {isAddKafilahModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateKafilah}
            className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Kafilah Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddKafilahModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kafilah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kabupaten Kuningan"
                  value={newKafilahName}
                  onChange={(e) => setNewKafilahName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Kafilah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: KF-KNG"
                  value={newKafilahCode}
                  onChange={(e) => setNewKafilahCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wilayah / Zonasi
                </label>
                <select
                  value={newKafilahRegion}
                  onChange={(e) => setNewKafilahRegion(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                >
                  <option value="Jawa Barat - Wilayah I (Bogor/Depok)">
                    Jawa Barat - Wilayah I
                  </option>
                  <option value="Jawa Barat - Wilayah II (Bekasi/Karawang)">
                    Jawa Barat - Wilayah II
                  </option>
                  <option value="Jawa Barat - Wilayah III (Cirebon/Indramayu)">
                    Jawa Barat - Wilayah III
                  </option>
                  <option value="Jawa Barat - Wilayah IV (Bandung Raya)">
                    Jawa Barat - Wilayah IV
                  </option>
                  <option value="Jawa Barat - Wilayah V (Priangan Timur)">
                    Jawa Barat - Wilayah V
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penanggung Jawab / Pendamping
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={newKafilahContact}
                  onChange={(e) => setNewKafilahContact(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Kontak / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="0812-XXXX-XXXX"
                  value={newKafilahPhone}
                  onChange={(e) => setNewKafilahPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddKafilahModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#173D74] hover:bg-[#12305c]"
              >
                Simpan Kafilah
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Tambah Peserta ke Kafilah */}
      {isAddParticipantModalOpen && activeKafilah && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateParticipant}
            className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#173D74] text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Tambah Peserta Musabaqah</h3>
                <p className="text-[11px] text-blue-200">
                  Kafilah: {activeKafilah.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddParticipantModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Peserta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Raihan Al-Ghifari"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ID Peserta
                  </label>
                  <input
                    type="text"
                    placeholder="Auto: TLW-XXX"
                    value={newPartId}
                    onChange={(e) => setNewPartId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Undian
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 07"
                    value={newPartUndian}
                    onChange={(e) => setNewPartUndian(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newPartGender}
                    onChange={(e) => setNewPartGender(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenjang
                  </label>
                  <select
                    value={newPartJenjang}
                    onChange={(e) => setNewPartJenjang(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                  >
                    <option value="Ula">Ula (Anak-anak)</option>
                    <option value="Mutawassit">Mutawassit (Remaja)</option>
                    <option value="Ulya">Ulya (Dewasa)</option>
                    <option value="Jami'ah">Jami'ah (Mahasiswa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cabang / Golongan
                </label>
                <select
                  value={newPartCabang}
                  onChange={(e) => setNewPartCabang(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:border-[#173D74]"
                >
                  <option value="Tilawah Dewasa Putra">
                    Tilawah Dewasa Putra
                  </option>
                  <option value="Tilawah Dewasa Putri">
                    Tilawah Dewasa Putri
                  </option>
                  <option value="Tilawah Remaja Putra">
                    Tilawah Remaja Putra
                  </option>
                  <option value="Tahfiz 10 Juz">Tahfiz 10 Juz</option>
                  <option value="Tahfiz 30 Juz">Tahfiz 30 Juz</option>
                  <option value="Qira'at Sab'ah Mujawwad">
                    Qira'at Sab'ah Mujawwad
                  </option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddParticipantModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#173D74] hover:bg-[#12305c]"
              >
                Daftarkan Peserta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
