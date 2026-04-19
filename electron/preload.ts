import { contextBridge, ipcRenderer } from 'electron'

declare var window: Record<string, unknown> & {
  __dataChangeCallbacks?: Record<string, (event: string, filename: string) => void>
}

const electronAPI = {
  dialog: {
    openDirectory: (): Promise<string | null> =>
      ipcRenderer.invoke('dialog:open-directory'),
  },
  fs: {
    readFile: (path: string): Promise<string> =>
      ipcRenderer.invoke('fs:read-file', path),
  },
  fswatch: {
    watch: (dir: string, callbackId: string): Promise<void> =>
      ipcRenderer.invoke('fswatch:watch', dir, callbackId),
    unwatch: (): Promise<void> =>
      ipcRenderer.invoke('fswatch:unwatch'),
  },
  onChange: (callbackId: string, callback: (event: string, filename: string) => void): void => {
    (window as any).__dataChangeCallbacks ??= {}
    ;(window as any).__dataChangeCallbacks[callbackId] = callback
  },
  removeChangeCallback: (callbackId: string): void => {
    const callbacks = (window as any).__dataChangeCallbacks
    if (callbacks) delete callbacks[callbackId]
  },
  onEvent: (event: string, callback: (...args: any[]) => void): { off: () => void } => {
    const handler = (_event: unknown, ...args: any[]) => callback(...args)
    ipcRenderer.on(event, handler)
    return {
      off: () => {
        ipcRenderer.removeListener(event, handler)
      },
    }
  },
}

contextBridge.exposeInMainWorld('electron', electronAPI)
