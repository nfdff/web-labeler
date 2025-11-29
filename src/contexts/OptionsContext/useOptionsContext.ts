import { useContext } from "react";
import { OptionsContext } from "./OptionsContext.tsx";

export const useOptionsContext = () => {
  const optionsContext = useContext(OptionsContext);

  if (optionsContext === undefined) {
    throw new Error("useOptionsContext should be used with UseOptionsProvider");
  }

  return optionsContext;
};
