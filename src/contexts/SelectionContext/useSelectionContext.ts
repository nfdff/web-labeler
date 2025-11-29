import { useContext } from "react";
import { SelectionContext } from "./SelectionContext.tsx";

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error(
      "useSelectionContext must be used within a SelectionProvider"
    );
  }
  return context;
};
