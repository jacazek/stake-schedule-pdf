interface ElectronAPI {
  dialog: {
    openDirectory: () => Promise<string | null>
  }
  fs: {
    readFile: (path: string) => Promise<string>
  }
  fswatch: {
    watch: (dir: string, callbackId: string) => Promise<void>
    unwatch: () => Promise<void>
  }
  onChange: (callbackId: string, callback: (event: string, filename: string) => void) => void
  removeChangeCallback: (callbackId: string) => void
  onEvent: (event: string, callback: (...args: any[]) => void) => { off: () => void }
}

declare global {
  interface Window {
    electron: ElectronAPI
    __dataChangeCallbacks?: Record<string, (event: string, filename: string) => void>
  }
}

export {}
