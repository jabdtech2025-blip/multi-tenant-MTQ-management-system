import React, { useRef, useState, useEffect, useCallback } from "react"
import { useApp } from "../../context/AppContext"
import { MUSHAF_PAGES, MushafPageContent } from "../../data/mockData"
import { MushafStroke } from "../../types"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Highlighter,
  Eraser,
  Undo2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react"

interface MushafCanvasViewerProps {
  participantId: string
  judgeId: string
  isReadOnly?: boolean
}

export const MushafCanvasViewer: React.FC<MushafCanvasViewerProps> = ({
  participantId,
  judgeId,
  isReadOnly = false,
}) => {
  const { assessments, saveStroke, undoStroke, clearStrokes } = useApp()

  const assessment = assessments.find(
    (a) => a.participantId === participantId && a.judgeId === judgeId,
  )

  const [currentPage, setCurrentPage] = useState<number>(305)
  const [zoomLevel, setZoomLevel] = useState<number>(() =>
    window.innerWidth < 1280 ? 75 : 100,
  )
  const [activeTool, setActiveTool] =
    useState<"pen" | "highlighter" | "eraser">("pen")
  const [penColor, setPenColor] = useState<string>("#dc2626") // Red for error markup
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentStrokePoints = useRef<{ x: number; y: number }[]>([])

  const pageData: MushafPageContent =
    MUSHAF_PAGES[currentPage] || MUSHAF_PAGES[305]
  const annotations = assessment?.annotations || []
  const pageAnnotations = annotations.filter((a) => a.page === currentPage)

  // Redraw canvas whenever annotations, page, or zoomLevel changes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    pageAnnotations.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(
        (stroke.points[0].x * canvas.width) / 1000,
        (stroke.points[0].y * canvas.height) / 1000,
      )

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(
          (stroke.points[i].x * canvas.width) / 1000,
          (stroke.points[i].y * canvas.height) / 1000,
        )
      }

      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (stroke.tool === "highlighter") {
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 0.4
        ctx.lineWidth = (stroke.size * canvas.width) / 500
      } else {
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 0.85
        ctx.lineWidth = (stroke.size * canvas.width) / 600
      }

      ctx.stroke()
      ctx.globalAlpha = 1.0
    })
  }, [pageAnnotations])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas, zoomLevel, currentPage])

  // Handle drawing events (normalized coordinates 0-1000)
  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    let clientX = 0
    let clientY = 0

    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 }
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = Math.max(
      0,
      Math.min(1000, ((clientX - rect.left) / rect.width) * 1000),
    )
    const y = Math.max(
      0,
      Math.min(1000, ((clientY - rect.top) / rect.height) * 1000),
    )
    return { x, y }
  }

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadOnly || activeTool === "eraser") return
    setIsDrawing(true)
    const coords = getCanvasCoordinates(e)
    currentStrokePoints.current = [coords]
  }

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isReadOnly || activeTool === "eraser") return
    const coords = getCanvasCoordinates(e)
    currentStrokePoints.current.push(coords)

    // Live preview on canvas
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const points = currentStrokePoints.current
    if (points.length >= 2) {
      const p1 = points[points.length - 2]
      const p2 = points[points.length - 1]

      ctx.beginPath()
      ctx.moveTo((p1.x * canvas.width) / 1000, (p1.y * canvas.height) / 1000)
      ctx.lineTo((p2.x * canvas.width) / 1000, (p2.y * canvas.height) / 1000)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (activeTool === "highlighter") {
        ctx.strokeStyle = "#facc15"
        ctx.globalAlpha = 0.35
        ctx.lineWidth = (16 * canvas.width) / 500
      } else {
        ctx.strokeStyle = penColor
        ctx.globalAlpha = 0.85
        ctx.lineWidth = (3.5 * canvas.width) / 600
      }

      ctx.stroke()
      ctx.globalAlpha = 1.0
    }
  }

  const handlePointerUp = () => {
    if (!isDrawing || isReadOnly) return
    setIsDrawing(false)

    if (currentStrokePoints.current.length > 1) {
      const newStroke: MushafStroke = {
        id: `stroke-${Date.now()}`,
        tool: activeTool,
        color: activeTool === "highlighter" ? "#facc15" : penColor,
        size: activeTool === "highlighter" ? 14 : 3,
        points: currentStrokePoints.current,
        page: currentPage,
        timestamp: new Date().toLocaleTimeString("id-ID"),
      }
      saveStroke(participantId, judgeId, newStroke)
    }
    currentStrokePoints.current = []
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden rounded-[10px] border border-slate-200 bg-slate-100 select-none"
    >
      {/* Top Mushaf Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2">
        {/* Page Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(304, p - 1))}
            disabled={currentPage <= 304}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 border border-slate-200"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs">
            <span className="font-semibold text-slate-800">
              Hal. {currentPage}
            </span>
            <span className="text-slate-400">/ 604</span>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(306, p + 1))}
            disabled={currentPage >= 306}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 border border-slate-200"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-slate-300 mx-1 hidden sm:inline">|</span>

          {/* Surah & Juz Info */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-semibold text-[#173D74]">
              {pageData.surahName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Juz {pageData.juzNumber}</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 border border-slate-200"
            title="Perkecil Tampilan"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-700 px-1 w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(145, z + 15))}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 border border-slate-200"
            title="Perbesar Tampilan"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="px-1.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 rounded ml-1"
            title="Atur Ukuran Normal (100%)"
          >
            Reset
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded text-slate-600 hover:bg-slate-100 border border-slate-200 ml-1"
            title="Layar Penuh"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Annotation Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Alat Koreksi:
          </span>

          {isReadOnly ? (
            <div className="flex items-center gap-1 text-slate-500 bg-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
              <Lock className="w-3 h-3 text-slate-500" />
              Mode Terkunci (Hanya Baca)
            </div>
          ) : (
            <>
              {/* Pen Tool */}
              <button
                onClick={() => setActiveTool("pen")}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                  activeTool === "pen"
                    ? "bg-blue-50 text-[#173D74] border-blue-400 font-semibold shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Pena</span>
              </button>

              {/* Pen Colors */}
              {activeTool === "pen" && (
                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <button
                    onClick={() => setPenColor("#dc2626")}
                    className={`w-3.5 h-3.5 rounded-full bg-rose-600 transition-transform ${
                      penColor === "#dc2626"
                        ? "ring-2 ring-slate-800 scale-110"
                        : "opacity-70"
                    }`}
                    title="Merah (Kesalahan Jali / Tajwid)"
                  />
                  <button
                    onClick={() => setPenColor("#eab308")}
                    className={`w-3.5 h-3.5 rounded-full bg-amber-500 transition-transform ${
                      penColor === "#eab308"
                        ? "ring-2 ring-slate-800 scale-110"
                        : "opacity-70"
                    }`}
                    title="Kuning (Catatan Ringan / Waqf)"
                  />
                  <button
                    onClick={() => setPenColor("#2563eb")}
                    className={`w-3.5 h-3.5 rounded-full bg-blue-600 transition-transform ${
                      penColor === "#2563eb"
                        ? "ring-2 ring-slate-800 scale-110"
                        : "opacity-70"
                    }`}
                    title="Biru (Tanda Ibtida)"
                  />
                </div>
              )}

              {/* Highlighter Tool */}
              <button
                onClick={() => setActiveTool("highlighter")}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                  activeTool === "highlighter"
                    ? "bg-amber-50 text-amber-900 border-amber-400 font-semibold shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-600" />
                <span>Stabilo</span>
              </button>

              {/* Eraser */}
              <button
                onClick={() => setActiveTool("eraser")}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                  activeTool === "eraser"
                    ? "bg-rose-50 text-rose-800 border-rose-300 font-semibold shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
                title="Mode Penghapus"
              >
                <Eraser className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Hapus</span>
              </button>

              <div className="h-4 w-px bg-slate-300" />

              {/* Undo */}
              <button
                onClick={() => undoStroke(participantId, judgeId)}
                disabled={pageAnnotations.length === 0}
                className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-30 border border-slate-200 bg-white"
                title="Batalkan Coretan Terakhir"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              {/* Clear Page */}
              <button
                onClick={() =>
                  clearStrokes(participantId, judgeId, currentPage)
                }
                disabled={pageAnnotations.length === 0}
                className="p-1 rounded text-rose-600 hover:bg-rose-50 disabled:opacity-30 border border-slate-200 bg-white"
                title="Bersihkan Semua Coretan di Halaman Ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Stroke count & status */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
            {pageAnnotations.length} coretan aktif
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vektor Tersinkron
          </span>
        </div>
      </div>

      {/* Mushaf Page Presentation Area */}
      <div className="flex flex-1 items-start justify-center overflow-auto bg-slate-100 p-3 md:p-4">
        <div
          style={{ width: `${zoomLevel * 6.5}px` }}
          className="shrink-0 transition-all duration-150 ease-out"
        >
          {/* Authentic Mushaf Page Sheet */}
          <div className="relative bg-[#FFFDF5] border-4 border-[#C8A766] rounded-md shadow-md p-6 text-slate-900 overflow-hidden">
            {/* Islamic Frame Ornamental Corner Borders */}
            <div className="absolute inset-1 border border-[#D7B774] pointer-events-none" />
            <div className="absolute inset-2 border-2 border-[#B9924B] pointer-events-none" />
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8A6321] pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8A6321] pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8A6321] pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8A6321] pointer-events-none" />

            {/* Page Header Header Band */}
            <div className="flex items-center justify-between border-b border-[#C8A766]/60 pb-2 mb-4 text-xs text-[#6B5325] font-serif">
              <span>الجزء السادس عشر</span>
              <span className="font-semibold">{pageData.surahName}</span>
              <span>الصفحة {pageData.pageNumber}</span>
            </div>

            {/* Surah Ornamental Header Box if beginning of surah */}
            {pageData.bismillahRequired && (
              <div className="mb-4 text-center">
                <div className="bg-[#EFE4C8] border-2 border-[#B9924B] py-1.5 px-4 rounded-sm text-center shadow-xs">
                  <h2 className="font-arabic text-xl font-bold text-[#4B3714]">
                    سُورَةُ مَرْيَمَ
                  </h2>
                  <p className="text-[10px] text-[#785E2B] font-medium tracking-wide">
                    مَكِّيَّةٌ • ٩٨ آيَةً
                  </p>
                </div>

                <div className="my-3 font-arabic text-2xl text-[#3A290E] tracking-wider">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </div>
              </div>
            )}

            {/* Quranic Verses Body */}
            <div
              dir="rtl"
              className="font-arabic text-right text-[25px] leading-[2.4] text-[#1E1912] font-normal tracking-wide px-2 select-text"
            >
              {pageData.ayat.map((ayah) => (
                <span
                  key={ayah.number}
                  className="inline ml-1.5 hover:bg-[#F3E7C4]/50 rounded px-1 transition-colors"
                >
                  <span>{ayah.text}</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 mx-1.5 text-sm font-bold text-[#8A6321] border border-[#B9924B] rounded-full bg-[#FAF3DE] align-middle shadow-2xs">
                    {ayah.arabicNumber}
                  </span>
                </span>
              ))}
            </div>

            {/* Page Footer */}
            <div className="mt-6 pt-2 border-t border-[#C8A766]/60 flex items-center justify-between text-[11px] text-[#785E2B]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Mushaf Standar Indonesia • Kemenag RI
              </span>
              <span className="font-bold text-xs">{pageData.pageNumber}</span>
              <span>Riwayat Hafs 'an 'Ashim</span>
            </div>

            {/* Interactive Vector Stroke Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={1000}
              height={1000}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              className={`absolute inset-0 w-full h-full z-10 ${
                isReadOnly
                  ? "cursor-default pointer-events-none"
                  : activeTool === "pen"
                    ? "cursor-crosshair"
                    : activeTool === "highlighter"
                      ? "cursor-cell"
                      : "cursor-default"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Verified Attribution Strip */}
      <div className="bg-white border-t border-slate-200 px-3 py-1.5 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <span className="truncate">
          Teks Rasm 'Utsmani bersumber dari Lajnah Pentashihan Mushaf Al-Qur'an.
        </span>
        <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
          Koordinat Vektor Terstandarisasi (1000x1000)
        </span>
      </div>
    </div>
  )
}
