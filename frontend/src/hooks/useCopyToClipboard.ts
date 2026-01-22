import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
  const copy = async (text: string) => {
    if (!navigator.clipboard) {
      // Simple fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Copied!");
      } catch (err) {
        toast.error("Error copying.");
      }
      document.body.removeChild(textArea);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (error) {
      console.error("Error copying", error);
      toast.error("Error copying.");
    }
  };

  return { copy };
};
