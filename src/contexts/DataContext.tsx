import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

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
  const watchRef = useRef<{ callbackId: string | null }>({ callbackId: null });

  const readFile = useCallback(async (filePath: string): Promise<string> => {
    const result = await window.electron.fs.readFile(filePath);
    return result;
  }, []);

  const loadData = useCallback(
    async (dir?: string) => {
      const currentDir = dir ?? dataDir;
      if (!currentDir) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const speakerPath = pathJoin(currentDir, "speaker-schedule.json");
        const unitPath = pathJoin(currentDir, "unit-schedule.json");

        const [speakerRaw, unitRaw] = await Promise.all([
          readFile(speakerPath),
          readFile(unitPath),
        ]);

        const speaker = JSON.parse(speakerRaw);
        const unit = JSON.parse(unitRaw);

        setSpeakerData(speaker);
        setUnitData(unit);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load data files";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [dataDir, readFile],
  );

  const selectDirectory = useCallback(
    async (dir: string) => {
      setDataDir(dir);
      setError(null);

      // Stop existing watch
      if (watchRef.current.callbackId !== null) {
        await window.electron.fswatch.unwatch();
        setWatching(false);
      }

      // Start watching
      const id = `cb-${++callbackIdCounter}`;
      watchRef.current.callbackId = id;

      window.electron.onChange(id, (_event, filename) => {
        if (filename && DATA_FILES.some((f) => filename.includes(f))) {
          loadData();
        }
      });

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
        window.history.pushState(null, "", "/speaker-schedule");
      },
    );
    const subscription2 = window.electron.onEvent(
      "nav:unit-schedule",
      () => {
        window.history.pushState(null, "", "/unit-schedule");
      },
    );
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

// Simple path join that works in browser context
function pathJoin(base: string, ...parts: string[]): string {
  const joined = base.split(/[/\\]/).filter(Boolean).join("/");
  return `/${joined}/${parts.join("/")}`;
}
