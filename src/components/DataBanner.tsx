import { useData } from '../contexts/DataContext'
import { COLORS } from '../colors'

export function DataBanner() {
  const { dataDir, watching, loading, error, selectDirectory } = useData()

  const handleOpenFolder = async () => {
    const dir = await window.electron.dialog.openDirectory()
    if (dir) {
      await selectDirectory(dir)
    }
  }

  const buttonStyle: React.CSSProperties = {
    padding: '4px 12px',
    backgroundColor: COLORS.Primary ?? '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  if (error) {
    return (
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>Error loading data: {error}</span>
        <button onClick={handleOpenFolder} style={buttonStyle}>
          Open Folder
        </button>
      </div>
    )
  }

  if (!dataDir) {
    return (
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1e40af',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>No data directory selected. Select the directory containing your CSV data files.</span>
        <button onClick={handleOpenFolder} style={buttonStyle}>
          Open Folder
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '8px 16px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#166534',
      fontSize: '13px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>
        {loading ? 'Loading data...' : `Data: ${dataDir}`}
        {watching && ' (auto-reload on)'}
      </span>
    </div>
  )
}
