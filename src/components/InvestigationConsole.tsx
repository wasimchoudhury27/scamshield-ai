import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Globe,
  FileImage,
  Mail,
  ArrowRight,
  Upload,
  X,
  AlertCircle,
  Trash2,
  Check,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type InputMode = 'message' | 'url' | 'image' | 'email' | 'voice';

interface ImageUploadData {
  base64: string;
  mimeType: string;
  name: string;
  previewUrl: string;
  size: number;
  isFromPaste?: boolean;
}

const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif'
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

interface InvestigationConsoleProps {
  onAnalyzeMessage: (text: string, imageBase64?: string, mimeType?: string) => void;
  onAnalyzeUrl: (url: string) => void;
  isLoading: boolean;
  activeMode: InputMode;
  setActiveMode: (mode: InputMode) => void;
  initialText?: string;
  initialUrl?: string;
}

export const InvestigationConsole: React.FC<InvestigationConsoleProps> = ({
  onAnalyzeMessage,
  onAnalyzeUrl,
  isLoading,
  activeMode,
  setActiveMode,
  initialText = '',
  initialUrl = ''
}) => {
  const [messageText, setMessageText] = useState(initialText);
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [emailText, setEmailText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [imageFile, setImageFile] = useState<ImageUploadData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteSuccessNotice, setPasteSuccessNotice] = useState(false);
  const [isUploadFocused, setIsUploadFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const pasteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialText) {
      if (activeMode === 'email') {
        setEmailText(initialText);
      } else {
        setMessageText(initialText);
      }
    }
  }, [initialText, activeMode]);

  useEffect(() => {
    if (initialUrl) {
      setUrlInput(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      if (pasteTimeoutRef.current) {
        clearTimeout(pasteTimeoutRef.current);
      }
    };
  }, []);

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImageFile(null);
    setErrorMsg(null);
    setPasteSuccessNotice(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFile = (file: File, isFromPaste = false) => {
    const fileType = (file.type || '').toLowerCase();

    if (!fileType.startsWith('image/')) {
      setErrorMsg('Please upload a valid image (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.includes(fileType)) {
      setErrorMsg('Unsupported image format. Please upload or paste PNG, JPG, WEBP, or GIF.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size exceeds 8MB. Please upload a smaller screenshot or document.');
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];

      let fileName = file.name;
      if (!fileName || fileName === 'image.png' || fileName === 'blob') {
        const ext = fileType.split('/')[1] || 'png';
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        fileName = `screenshot-${timestamp}.${ext}`;
      }

      setImageFile({
        base64,
        mimeType: file.type || 'image/png',
        name: fileName,
        size: file.size,
        previewUrl: objectUrl,
        isFromPaste
      });
      setErrorMsg(null);

      if (isFromPaste) {
        setPasteSuccessNotice(true);
        if (pasteTimeoutRef.current) clearTimeout(pasteTimeoutRef.current);
        pasteTimeoutRef.current = setTimeout(() => {
          setPasteSuccessNotice(false);
        }, 3500);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Failed to process image data. Please try uploading or pasting again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, false);
  };

  const extractImageFromClipboard = (clipboardData: DataTransfer | null): File | null | 'unsupported' => {
    if (!clipboardData) return null;

    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const mime = item.type.toLowerCase();
          if (!SUPPORTED_IMAGE_TYPES.includes(mime)) {
            return 'unsupported';
          }
          const blob = item.getAsFile();
          if (blob) {
            const ext = mime.split('/')[1] || 'png';
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
            const fileName = blob.name && blob.name !== 'image.png' && blob.name !== 'blob'
              ? blob.name
              : `screenshot-${timestamp}.${ext}`;
            return new File([blob], fileName, { type: blob.type || mime, lastModified: Date.now() });
          }
        }
      }
    }

    const files = clipboardData.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          if (!SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
            return 'unsupported';
          }
          return file;
        }
      }
    }

    return null;
  };

  const handleContainerPaste = (e: React.ClipboardEvent) => {
    const result = extractImageFromClipboard(e.clipboardData);

    if (result === 'unsupported') {
      e.preventDefault();
      setErrorMsg('Unsupported image format. Please paste PNG, JPG, WEBP, or GIF.');
      return;
    }

    if (result) {
      e.preventDefault();
      handleFile(result, true);
    }
  };

  useEffect(() => {
    if (activeMode !== 'image') return;

    const handleDocumentPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const result = extractImageFromClipboard(e.clipboardData);

      if (result === 'unsupported') {
        e.preventDefault();
        setErrorMsg('Unsupported image format. Please paste PNG, JPG, WEBP, or GIF.');
        return;
      }

      if (result) {
        e.preventDefault();
        handleFile(result, true);
      }
    };

    window.addEventListener('paste', handleDocumentPaste);
    return () => {
      window.removeEventListener('paste', handleDocumentPaste);
    };
  }, [activeMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeMode === 'message') {
      if (!messageText.trim() && !imageFile) {
        setErrorMsg('Please paste a suspicious message or conversation to analyze.');
        return;
      }
      onAnalyzeMessage(messageText, imageFile?.base64, imageFile?.mimeType);
    } else if (activeMode === 'email') {
      if (!emailText.trim()) {
        setErrorMsg('Please paste the suspicious email body, sender, or headers.');
        return;
      }
      onAnalyzeMessage(`[SUSPICIOUS EMAIL CONTENT]\n${emailText}`);
    } else if (activeMode === 'image') {
      if (!imageFile && !messageText.trim()) {
        setErrorMsg('Please upload a document screenshot or paste text for OCR verification.');
        return;
      }
      onAnalyzeMessage(
        messageText || 'Analyze document screenshot for letterhead and deposit red flags.',
        imageFile?.base64,
        imageFile?.mimeType
      );
    } else if (activeMode === 'url') {
      if (!urlInput.trim()) {
        setErrorMsg('Please enter a website URL or suspicious link to inspect.');
        return;
      }
      onAnalyzeUrl(urlInput);
    } else if (activeMode === 'voice') {
      if (!voiceText.trim()) {
        setErrorMsg('Please paste or select a voice call transcript to analyze.');
        return;
      }
      onAnalyzeMessage(`[SUSPICIOUS VOICE CALL & VISHING AUDIO TRANSCRIPT]\n${voiceText}`);
    }
  };

  const modeOptions: { id: InputMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'message', label: 'Message', icon: MessageSquare },
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'image', label: 'Image OCR', icon: FileImage },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'voice', label: 'Voice Call', icon: PhoneCall }
  ];

  return (
    <div
      id="investigation-console"
      className="w-full bg-white border border-[#F0E5EC] rounded-2xl shadow-[0_14px_40px_-14px_rgba(201,45,125,0.14)] p-5 sm:p-7 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0E5EC] mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#252033] tracking-tight">
              AI Threat Scanner
            </h2>
            <p className="text-xs text-[#777181]">
              Submit a message, link, email, screenshot, or call transcript
            </p>
          </div>
          <span className="text-xs font-medium text-[#C92D7D]">
            Google Gemini + Risk Engine
          </span>
        </div>

        {/* Segmented Channel Selector */}
        <div className="flex flex-wrap sm:grid sm:grid-cols-5 gap-1.5 p-1 bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl mb-5">
          {modeOptions.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id);
                  setErrorMsg(null);
                }}
                className={`min-h-[40px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white shadow-sm'
                    : 'text-[#777181] hover:text-[#252033] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeMode === 'message' && (
            <motion.div
              key="mode-message"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="relative">
                <textarea
                  id="console-message-textarea"
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste the suspicious WhatsApp chat, SMS, job offer, rental request, or payment demand here..."
                  disabled={isLoading}
                  className="w-full bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl p-4 text-sm text-[#252033] placeholder-[#777181]/75 focus:outline-none focus:bg-white focus:border-[#E94D9B] focus:ring-2 focus:ring-[#E94D9B]/15 transition-all leading-relaxed resize-y disabled:opacity-50"
                />
                <div className="mt-1.5 flex items-center justify-between text-xs text-[#777181] px-1">
                  <span>Supports WhatsApp, SMS, Telegram, and job/rental texts</span>
                  <div className="flex items-center gap-3">
                    {messageText.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMessageText('')}
                        className="text-[#777181] hover:text-[#E5484D] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                    <span className="font-mono tabular-nums">{messageText.length} chars</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'url' && (
            <motion.div
              key="mode-url"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="console-url-input" className="block text-xs font-semibold text-[#252033] mb-1.5">
                  Suspicious Website or Payment Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Globe className="w-4 h-4 text-[#E94D9B]" />
                  </div>
                  <input
                    id="console-url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://sbi-online-kyc-verification.xyz"
                    disabled={isLoading}
                    className="w-full bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl pl-10 pr-4 py-3.5 text-sm font-mono text-[#252033] placeholder-[#777181]/75 focus:outline-none focus:bg-white focus:border-[#E94D9B] focus:ring-2 focus:ring-[#E94D9B]/15 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <p className="text-xs text-[#777181] bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl p-3 leading-relaxed">
                Inspects domain structure, TLD risk, protocol encryption, brand homoglyph spoofing, and URL entropy safely without visiting the link.
              </p>
            </motion.div>
          )}

          {activeMode === 'image' && (
            <motion.div
              key="mode-image"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <AnimatePresence>
                {pasteSuccessNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#16A36A]/10 border border-[#16A36A]/30 text-[#16A36A] text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Screenshot pasted from clipboard and ready for OCR</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                id="image-dropzone-container"
                tabIndex={0}
                role="region"
                aria-label="Screenshot and document upload dropzone"
                onFocus={() => setIsUploadFocused(true)}
                onBlur={() => setIsUploadFocused(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onPaste={handleContainerPaste}
                onClick={() => {
                  if (!imageFile) fileInputRef.current?.click();
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !imageFile) {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all outline-none ${
                  isDragOver || isUploadFocused
                    ? 'border-[#E94D9B] bg-[#FCE7F3]/40'
                    : imageFile
                    ? 'border-[#16A36A]/40 bg-[#16A36A]/5'
                    : 'border-[#F0E5EC] hover:border-[#E94D9B]/60 bg-[#FFF8FC] cursor-pointer'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, false);
                  }}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                />

                {imageFile ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 rounded-xl border border-[#F0E5EC] gap-3 text-left">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={imageFile.previewUrl}
                        alt={imageFile.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#F0E5EC] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-[#252033] truncate block">
                          {imageFile.name}
                        </span>
                        <span className="text-xs text-[#777181] font-mono">
                          {imageFile.mimeType.replace('image/', '').toUpperCase()} · {formatFileSize(imageFile.size)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#777181] hover:text-[#E5484D] hover:bg-[#FFF8FC] border border-[#F0E5EC] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 py-1">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#C92D7D]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-[#252033] font-medium">
                      Drop or paste a screenshot here, or <span className="text-[#C92D7D] underline">browse files</span>
                    </p>
                    <p className="text-xs text-[#777181]">
                      PNG, JPG, WEBP, GIF up to 8MB · Inspected with Gemini multimodal OCR
                    </p>
                  </div>
                )}
              </div>

              <textarea
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Optional context (e.g. Received via WhatsApp asking for a security deposit)..."
                className="w-full bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl p-3 text-sm text-[#252033] placeholder-[#777181]/75 focus:outline-none focus:bg-white focus:border-[#E94D9B]"
              />
            </motion.div>
          )}

          {activeMode === 'email' && (
            <motion.div
              key="mode-email"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <textarea
                id="console-email-textarea"
                rows={6}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the suspicious email including sender address, subject line, and body content..."
                disabled={isLoading}
                className="w-full bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl p-4 text-sm text-[#252033] placeholder-[#777181]/75 focus:outline-none focus:bg-white focus:border-[#E94D9B] focus:ring-2 focus:ring-[#E94D9B]/15 transition-all leading-relaxed resize-y disabled:opacity-50"
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-[#777181] px-1">
                <span>Checks spoofed senders, urgent directives, and credential lures</span>
                <span className="font-mono tabular-nums">{emailText.length} chars</span>
              </div>
            </motion.div>
          )}

          {activeMode === 'voice' && (
            <motion.div
              key="mode-voice"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#777181] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#E94D9B]" />
                  <span>Load a sample call transcript:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setVoiceText(
                        'Hello, this is Inspector Rathore from Mumbai Police Cyber Cell. Your Aadhaar number has been used in a Canara Bank account involved in 65 crore hawala money laundering. A Supreme Court non-bailable arrest warrant is issued against you. You are placed under 24-hour Digital Arrest on this Skype call. You must immediately transfer ₹95,000 security deposit to the RBI verification account to clear your name or a police vehicle will arrive at your home.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-medium text-[#252033] transition-colors cursor-pointer"
                  >
                    Digital Arrest Call
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVoiceText(
                        'Sir, I am calling from State Electricity Board sub-station. Your electricity connection CA number 882910 is scheduled for immediate disconnection at 9:30 PM due to unpaid bill of ₹650. You must download our quick payment app immediately or send ₹650 on PhonePe to officer UPI powerdesk@ybl right now.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-medium text-[#252033] transition-colors cursor-pointer"
                  >
                    Electricity Disconnection Call
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVoiceText(
                        'This is FedEx Customs Clearance Desk at Mumbai Airport. A package with your name and passport copy heading to Taiwan was intercepted by Narcotics Control Bureau. It contains 250 grams of MDMA and 5 fake credit cards. Transfer ₹45,000 customs penalty or CBI will issue Interpol notice.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-medium text-[#252033] transition-colors cursor-pointer"
                  >
                    Customs Drug Parcel Call
                  </button>
                </div>
              </div>

              <textarea
                id="console-voice-textarea"
                rows={4}
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Paste or transcribe the suspicious phone call, deepfake voice note, or coercive conversation..."
                disabled={isLoading}
                className="w-full bg-[#FFF8FC] border border-[#F0E5EC] rounded-xl p-4 text-sm text-[#252033] placeholder-[#777181]/75 focus:outline-none focus:bg-white focus:border-[#E94D9B] focus:ring-2 focus:ring-[#E94D9B]/15 transition-all leading-relaxed resize-y disabled:opacity-50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            id="run-ai-investigation-button"
            type="submit"
            disabled={isLoading}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] hover:from-[#d93d8b] hover:to-[#b3246d] text-white text-sm font-semibold shadow-[0_8px_22px_-6px_rgba(233,77,155,0.45)] active:scale-[0.99] transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <span>{isLoading ? 'Analyzing Evidence...' : 'Analyze Threat'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

          <span className="text-xs text-[#777181]">
            Private session · No data stored
          </span>
        </div>
      </form>
    </div>
  );
};
