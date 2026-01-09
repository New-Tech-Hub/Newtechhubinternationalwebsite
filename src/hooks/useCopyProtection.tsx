import { useEffect } from "react";

export const useCopyProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy, cut, and select all keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U (view source), Ctrl+S, Ctrl+P
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "a", "u", "s", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);

    // Add CSS to disable selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);
};
