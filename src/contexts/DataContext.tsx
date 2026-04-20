import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

interface DataState {
  speakerData: unknown[] | null;
  unitData: unknown[] | null;
  loading: boolean;
  error: string | null;
  dataDir: string | null;
  watching: boolean;
  refresh: () => Promise<void>;
  selectDirectory: (dir: string) => Promise<void>;
}

export const DataContext = createContext<DataState | null>(null);

const DATA_FILES = ["speaker-schedule.json", "unit-schedule.json"];

let callbackIdCounter = 0;

export function DataProvider({ children }: { children: ReactNode }) {
  const [speakerData, setSpeakerData] = useState<unknown[] | null>(null);
  const [unitData, setUnitData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataDir, setDataDir] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchRef = useRef<{
    callbackId: string | null;
    fileChangeOff: { off: () => void } | null;
    lastLoad: number;
  }>({ callbackId: null, fileChangeOff: null, lastLoad: 0 });
  const navigate = useNavigate();

  const loadData = useCallback(
    async (dir?: string) => {
      const currentDir = dir ?? dataDir;
      if (!currentDir) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [speakerRaw, unitRaw] = await Promise.all([
          window.electron.fs.readFileByDir(currentDir, "speaker-schedule.json"),
          window.electron.fs.readFileByDir(currentDir, "unit-schedule.json"),
        ]);

        const speaker = JSON.parse(speakerRaw);
        const unit = JSON.parse(unitRaw);

        setSpeakerData(speaker);
        setUnitData(unit);

        watchRef.current.lastLoad = Date.now();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load data files";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [dataDir],
  );

  const selectDirectory = useCallback(
    async (dir: string) => {
      setDataDir(dir);
      setError(null);

      // Stop existing watch and cleanup IPC listener
      if (watchRef.current.callbackId !== null) {
        await window.electron.fswatch.unwatch();
        setWatching(false);
        if (watchRef.current.fileChangeOff) {
          watchRef.current.fileChangeOff.off();
          watchRef.current.fileChangeOff = null;
        }
        // Remove old callback so new IPC listener doesn't find stale IDs
        window.electron.removeChangeCallback(watchRef.current.callbackId);
      }

      // Start watching
      const id = `cb-${++callbackIdCounter}`;
      watchRef.current.callbackId = id;

      window.electron.onChange(id, (_event, filename) => {
        if (filename && DATA_FILES.some((f) => filename.includes(f))) {
          // Debounce: skip reloads within 2s of last load to avoid parsing
          // incomplete JSON while the editor is still writing the file
          const now = Date.now();
          if (now - watchRef.current.lastLoad < 2000) {
            return;
          }
          loadData(dir);
        }
      });

      watchRef.current.fileChangeOff = window.electron.onFileChange();

      await window.electron.fswatch.watch(dir, id);
      setWatching(true);

      // Load data after setting up watch
      await loadData(dir);
    },
    [loadData],
  );

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Listen for directory selection from menu
  useEffect(() => {
    if (!window.electron) return;
    const subscription = window.electron.onEvent(
      "data:directory-selected",
      (dir: string) => {
        selectDirectory(dir);
      },
    );
    return () => subscription.off();
  }, [selectDirectory]);

  // Listen for navigation from Electron menu
  useEffect(() => {
    if (!window.electron) return;
    const subscription1 = window.electron.onEvent(
      "nav:speaker-schedule",
      () => {
        navigate("/speaker-schedule");
      },
    );
    const subscription2 = window.electron.onEvent("nav:unit-schedule", () => {
      navigate("/unit-schedule");
    });
    return () => {
      subscription1.off();
      subscription2.off();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchRef.current.callbackId !== null) {
        window.electron.fswatch.unwatch();
        window.electron.removeChangeCallback(watchRef.current.callbackId);
        if (watchRef.current.fileChangeOff) {
          watchRef.current.fileChangeOff.off();
        }
      }
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        speakerData,
        unitData,
        loading,
        error,
        dataDir,
        watching,
        refresh,
        selectDirectory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}

