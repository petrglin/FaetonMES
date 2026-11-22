"use client";

import { useMemo, useSyncExternalStore } from "react";
import { systemModules } from "@/lib/modules";

const storageKey = "faetonmes:selected-modules:v1";
const changeEvent = "faetonmes:module-selection";
let memorySnapshot = "[]";
let memoryOnly = false;

function getSnapshot() {
  if (memoryOnly) return memorySnapshot;
  try {
    return window.localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return memorySnapshot;
  }
}

function getServerSnapshot() { return "[]"; }

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, notify);
  };
}

function parseSelection(snapshot: string): string[] {
  try {
    const ids: unknown = JSON.parse(snapshot);
    if (!Array.isArray(ids)) return [];
    return systemModules.filter(({ id }) => ids.includes(id)).map(({ id }) => id);
  } catch {
    return [];
  }
}

export function setModuleSelection(ids: string[]) {
  const validIds = systemModules.filter(({ id }) => ids.includes(id)).map(({ id }) => id);
  memorySnapshot = JSON.stringify(validIds);
  try {
    window.localStorage.setItem(storageKey, memorySnapshot);
  } catch {
    // Selection remains usable for this session when browser storage is unavailable.
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useModuleSelection() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const selectedIds = useMemo(() => parseSelection(snapshot), [snapshot]);
  const selectedModules = useMemo(() => systemModules.filter(({ id }) => selectedIds.includes(id)), [selectedIds]);
  return {
    selectedIds,
    selectedModules,
    toggleModule: (id: string) => setModuleSelection(selectedIds.includes(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]),
    clearSelection: () => setModuleSelection([]),
  };
}
