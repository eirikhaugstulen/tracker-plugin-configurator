import React, { useState, type JSX } from "react"
import { Copy, FileDown, Check, AlertCircle } from "lucide-react"

import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area"

interface ExportDialogProps {
  data: object
  title?: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function ExportDialog({
  data,
  title = "JSON Export",
  description = "Review your JSON data before exporting.",
  open,
  onOpenChange,
  trigger
}: ExportDialogProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle")
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopyStatus("success")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (err) {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "export.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloadStatus("success")
      setTimeout(() => setDownloadStatus("idle"), 2000)
    } catch (err) {
      setDownloadStatus("error")
      setTimeout(() => setDownloadStatus("idle"), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            className={`w-[160px] relative overflow-hidden transition-all duration-300 ${copyStatus === "error" ? "border-red-500 text-red-500" : ""
              }`}
            disabled={copyStatus !== "idle"}
          >
            <span className="absolute left-2 w-5 h-5 flex items-center justify-center transition-all duration-300">
              <span
                className={`absolute transition-all duration-300 ${copyStatus === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <Copy className="h-4 w-4" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${copyStatus === "success" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <Check className="h-4 w-4 text-green-500" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${copyStatus === "error" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
              </span>
            </span>
            <span className="ml-6">Copy to Clipboard</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className={`w-[160px] relative overflow-hidden transition-all duration-300 ${downloadStatus === "error" ? "border-red-500 text-red-500" : ""
              }`}
            disabled={downloadStatus !== "idle"}
          >
            <span className="absolute left-2 w-5 h-5 flex items-center justify-center transition-all duration-300">
              <span
                className={`absolute transition-all duration-300 ${downloadStatus === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <FileDown className="h-4 w-4" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${downloadStatus === "success" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <Check className="h-4 w-4 text-green-500" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${downloadStatus === "error" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
              </span>
            </span>
            <span className="ml-6">Download JSON</span>
          </Button>
        </div>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="min-w-max">
            <pre className="text-sm font-mono whitespace-pre overflow-visible">
              <JsonViewer data={data} />
            </pre>
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

interface JsonViewerProps {
  data: any
}

function JsonViewer({ data }: JsonViewerProps) {
  const formatJson = (obj: any, indent = 0): JSX.Element => {
    if (obj === null) return <span className="text-gray-500">null</span>

    if (typeof obj === "boolean") return <span className="text-yellow-600">{obj.toString()}</span>

    if (typeof obj === "number") return <span className="text-blue-600">{obj.toString()}</span>

    if (typeof obj === "string") return <span className="text-green-600">"{obj}"</span>

    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>

      return (
        <span>
          [
          <div style={{ marginLeft: 20 }}>
            {obj.map((item, index) => (
              <div key={index}>
                {formatJson(item, indent + 2)}
                {index < obj.length - 1 && <span>,</span>}
              </div>
            ))}
          </div>
          ]
        </span>
      )
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj)
      if (keys.length === 0) return <span>{"{}"}</span>

      return (
        <span>
          {"{"}
          <div style={{ marginLeft: 20 }}>
            {keys.map((key, index) => (
              <div key={key}>
                <span className="text-purple-600">"{key}"</span>: {formatJson(obj[key], indent + 2)}
                {index < keys.length - 1 && <span>,</span>}
              </div>
            ))}
          </div>
          {"}"}
        </span>
      )
    }

    return <span>{String(obj)}</span>
  }

  return formatJson(data)
}

