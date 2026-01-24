import browser from "webextension-polyfill";
import React, { useCallback, useEffect, useReducer, useState } from "react";

interface resetAction<State> {
  type: "initialize";
  payload: State;
}

export function usePersistentReducer<State, Action>(
  reducer: (state: State, action: Action | resetAction<State>) => State,
  initialState: State,
  defaultState: State,
  storageKey: string,
): { state: State; dispatch: React.Dispatch<Action>; isInitialized: boolean } {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeStorage = useCallback(async () => {
    try {
      const storage = await browser.storage.sync.get(storageKey);

      dispatch({
        type: "initialize",
        payload:
          typeof storage?.[storageKey] === "undefined"
            ? defaultState
            : (storage[storageKey] as State),
      });
    } catch (error) {
      console.error("Failed to load from storage:", error);
      // Use default state on error
      dispatch({
        type: "initialize",
        payload: defaultState,
      });
    } finally {
      setIsInitialized(true);
    }
  }, [storageKey]);

  useEffect(() => {
    initializeStorage();
  }, [initializeStorage]);

  useEffect(() => {
    if (isInitialized) {
      browser.storage.sync.set({ [storageKey]: state });
    }
  }, [state, isInitialized, storageKey]);

  return { state, isInitialized, dispatch };
}
