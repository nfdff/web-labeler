import { createContext, Dispatch, ReactNode } from "react";
import { Options, OptionsAction } from "../../options/types.ts";
import { usePersistentReducer } from "../../hooks/usePersistedReducer";
import { optionsReducer } from "../../options/options.ts";
import defaultLabels from "../../options/defaulLabels.ts";

const OptionsContext = createContext<
  | {
      options: Options;
      isInitialized: boolean;
      dispatch: Dispatch<OptionsAction>;
    }
  | undefined
>(undefined);

export { OptionsContext };

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const { state, isInitialized, dispatch } = usePersistentReducer<
    Options,
    OptionsAction
  >(
    optionsReducer,
    {
      labels: [],
      isActive: false,
    },
    {
      isActive: true,
      labels: defaultLabels,
    },
    "options",
  );

  return (
    <OptionsContext.Provider
      value={{ options: state, isInitialized, dispatch }}
    >
      {children}
    </OptionsContext.Provider>
  );
};
