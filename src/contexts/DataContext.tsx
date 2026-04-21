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
import Papa from "papaparse";

import { mapSpeakerSchedule } from "../lib/speaker-schedule";
import { mapUnitSchedule } from "../lib/unit-schedule";

const DATA_DIR_KEY = "dataDir";

const CSV_FILES = [
  "units.csv",
  "speakers.csv",
  "speaking-assignments.csv",
  "speaker-ministering.csv",
  "stake_presidency_speaking_assignments.csv",
  "unit_provide_speakers.csv",
  "unit-ministering.csv",
];

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
        const csvStrings: Record<string, string> = {};
        await Promise.all(
          CSV_FILES.map(async (file) => {
            csvStrings[file] = await window.electron.fs.readFileByDir(
              currentDir,
              file,
            );
          }),
        );

        const parsed: Record<string, unknown[]> = {};
        for (const file of CSV_FILES) {
          const result = Papa.parse(csvStrings[file], { header: true });
          if (result.errors.length > 0) {
            throw new Error(
              `Error parsing ${file}: ${result.errors[0].message}`,
            );
          }
          parsed[file] = result.data;
        }

        const speakers = parsed["speakers.csv"] as Record<string, unknown>[];
        const units = parsed["units.csv"] as Record<string, unknown>[];
        const speakingAssignments = parsed[
          "speaking-assignments.csv"
        ] as Record<string, unknown>[];
        const ministering = parsed["speaker-ministering.csv"] as Record<
          string,
          unknown
        >[];
        const presidencyAssignments = parsed[
          "stake_presidency_speaking_assignments.csv"
        ] as Record<string, unknown>[];
        const providingSpeakers = parsed["unit_provide_speakers.csv"] as Record<
          string,
          unknown
        >[];
        const unitMinistering = parsed["unit-ministering.csv"] as Record<
          string,
          unknown
        >[];

        const mappedSpeakerData = mapSpeakerSchedule(
          speakers,
          speakingAssignments,
          ministering,
          units,
        );
        const mappedUnitData = mapUnitSchedule(
          units,
          speakers,
          speakingAssignments,
          presidencyAssignments,
          providingSpeakers,
          unitMinistering,
        );

        setSpeakerData(mappedSpeakerData);
        setUnitData(mappedUnitData);

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
      // Persist to localStorage
      localStorage.setItem(DATA_DIR_KEY, dir);
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
        window.electron.removeChangeCallback(watchRef.current.callbackId);
      }

      // Start watching
      const id = `cb-${++callbackIdCounter}`;
      watchRef.current.callbackId = id;

      window.electron.onChange(id, (_event, filename) => {
        if (filename && CSV_FILES.some((f) => f === filename)) {
          console.log("file changesd", filename);
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

  // Listen for manual refresh from menu
  useEffect(() => {
    if (!window.electron) return;
    const subscription = window.electron.onEvent("data:refresh", () => {
      refresh();
    });
    return () => subscription.off();
  }, [refresh]);

  // Auto-load from localStorage on mount
  useEffect(() => {
    const storedDir = localStorage.getItem(DATA_DIR_KEY);
    if (storedDir) {
      selectDirectory(storedDir);
    }
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
