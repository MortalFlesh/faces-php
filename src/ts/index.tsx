import { createRoot } from 'react-dom/client'
import FaceDashboard from './component/FaceDashboard'
import './styles.scss'

const container = document.getElementById('faces-app')
if (container) {
    const root = createRoot(container)
    root.render(<FaceDashboard />)
} else {
    console.error('Could not find #faces-app element')
}

