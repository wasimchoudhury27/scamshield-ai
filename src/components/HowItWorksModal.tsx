import React from 'react';
import { X, ShieldCheck, Cpu, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252033]/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.16 }}
          className="w-full max-w-2xl bg-white border border-[#F0E5EC] rounded-2xl shadow-2xl overflow-hidden text-[#252033]"
        >
          <div className="p-5 sm:p-6 border-b border-[#F0E5EC] flex items-center justify-between bg-[#FFF8FC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E94D9B] to-[#C92D7D] text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#252033]">
                  How SCAMSHIELD AI Works
                </h3>
                <p className="text-xs text-[#777181]">
                  Hybrid Detection Architecture · Deterministic Rules &amp; Google Gemini
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#777181] hover:text-[#252033] hover:bg-[#FCE7F3]/50 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[#C92D7D] font-semibold text-xs uppercase tracking-wide">
                <Cpu className="w-4 h-4" />
                <span>01. Zero-Tolerance Risk Engine</span>
              </div>
              <p className="text-sm leading-relaxed text-[#777181]">
                Every submission runs through calibrated lexical, payment, and domain-entropy rules. When a message combines unvetted hiring or housing offers with upfront UPI deposits or coercive countdowns, the score locks into high or critical risk without guesswork.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0E5EC] space-y-1.5">
              <div className="flex items-center gap-2 text-[#C92D7D] font-semibold text-xs uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>02. Google Gemini Multimodal Reasoning</span>
              </div>
              <p className="text-sm leading-relaxed text-[#777181]">
                Google Gemini extracts text from uploaded screenshots and appointment letters, detects visual tampering or spoofed branding, and translates complex technical findings into clear, protective guidance.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0E5EC] space-y-1.5">
              <div className="flex items-center gap-2 text-[#16A36A] font-semibold text-xs uppercase tracking-wide">
                <Lock className="w-4 h-4" />
                <span>03. Ephemeral Zero-Storage Privacy</span>
              </div>
              <p className="text-sm leading-relaxed text-[#777181]">
                Messages, URLs, and screenshots are inspected strictly in volatile memory for your active session. Nothing is logged to external databases or retained after you close your tab.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0E5EC]">
              <span className="text-xs font-semibold text-[#777181] block mb-3">
                The 3-Step Protection Protocol
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
                  <div className="font-bold text-[#252033] text-sm">1. Pause</div>
                  <div className="text-xs text-[#777181] mt-0.5">Ignore artificial deadlines</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
                  <div className="font-bold text-[#252033] text-sm">2. Verify</div>
                  <div className="text-xs text-[#777181] mt-0.5">Check official domains</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
                  <div className="font-bold text-[#252033] text-sm">3. Protect</div>
                  <div className="text-xs text-[#777181] mt-0.5">Block, report, or freeze</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF8FC] border-t border-[#F0E5EC] flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white text-sm font-semibold hover:from-[#d93d8b] hover:to-[#b3246d] transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
