import { createRoot } from 'react-dom/client'
import Face from './component/Face'
import './styles.scss'

const container = document.getElementById('faces-app')
if (container) {
    const root = createRoot(container)
    root.render(<Face />)
} else {
    console.error('Could not find #faces-app element')
}

