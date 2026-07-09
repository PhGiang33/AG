import { useEffect } from "react";

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export const useKeyboardShortcut = (combo: KeyCombo, callback: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchKey = event.key.toLowerCase() === combo.key.toLowerCase();
      const matchCtrl = combo.ctrlKey === undefined || event.ctrlKey === combo.ctrlKey;
      const matchMeta = combo.metaKey === undefined || event.metaKey === combo.metaKey;
      const matchAlt = combo.altKey === undefined || event.altKey === combo.altKey;
      const matchShift = combo.shiftKey === undefined || event.shiftKey === combo.shiftKey;

      if (matchKey && matchCtrl && matchMeta && matchAlt && matchShift) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [combo, callback]);
};
