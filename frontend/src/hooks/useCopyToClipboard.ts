import { useState } from "react";

import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
  const copy = async (text: string) => {
    if (!navigator.clipboard) {
      // Fallback simples
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Copiado!");
      } catch (err) {
        toast.error("Erro ao copiar.");
      }
      document.body.removeChild(textArea);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado!");
    } catch (error) {
      console.error("Falha ao copiar", error);
      toast.error("Erro ao copiar.");
    }
  };

  return { copy };
};
