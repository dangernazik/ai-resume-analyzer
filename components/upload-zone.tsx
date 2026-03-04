"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onFileSelect: (file: File | null) => void;
};

export default function UploadZone({ onFileSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      alert("Only PDF files!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum 5MB");
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        inputRef.current?.click();
    }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
        transition-all duration-200
        ${isDragging
         ? "border-cyan-400 bg-cyan-950/30"
         : "border-slate-600 hover:border-cyan-500 hover:bg-cyan-950/20"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {fileName ? (
  <div className="space-y-2">
    <div className="text-3xl">📄</div>
    <p className="font-medium text-slate-700">{fileName}</p> 
    <button
      onClick={(e) => {
        e.stopPropagation();
        setFileName(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = "";
      }}
      className="text-sm text-red-400 hover:text-red-600 transition-colors"
    >
      ✕ Delete file
    </button>
  </div>
      ) : (
        <div className="space-y-2">
          <div className="text-3xl">⬆️</div>
          <p className="font-medium text-slate-700">Drag and drop PDF or click</p>
          <p className="text-sm text-slate-400">Maximum 5MB</p>
        </div>
      )}
    </div>
  );
}