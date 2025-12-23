import { createContext, useState, ReactNode } from "react";

export interface SelectionContextValue {
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  selectAll: (labelIds: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  hasSelection: boolean;
  selectedCount: number;
  selectRange: (ids: string[]) => void;
  setLastClickedIndex: (index: number | null) => void;
  lastClickedIndex: number | null;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(
  undefined
);

export { SelectionContext };

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndexState] = useState<number | null>(null);

  const selectAll = (labelIds: string[]) => {
    setSelectedIds(new Set(labelIds));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setLastClickedIndexState(null);
  };

  const selectRange = (ids: string[]) => {
    setSelectedIds(new Set(ids));
  };

  const setLastClickedIndex = (index: number | null) => {
    setLastClickedIndexState(index);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const isSelected = (id: string) => {
    return selectedIds.has(id);
  };

  const value: SelectionContextValue = {
    selectedIds,
    setSelectedIds,
    selectAll,
    clearSelection,
    toggleSelection,
    isSelected,
    hasSelection: selectedIds.size > 0,
    selectedCount: selectedIds.size,
    selectRange,
    setLastClickedIndex,
    lastClickedIndex,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};
