import { ReactNode } from "react";

export interface ConfirmationModalProps {
  message?: string | ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  variant?: "default" | "compact";
}
