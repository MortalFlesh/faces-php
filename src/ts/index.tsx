import { createRoot } from 'react-dom/client'
import FaceDashboard from './component/FaceDashboard'
import BaseProvider from "./component/Base";
import './styles.scss'

const container = document.getElementById('faces-app')
if (container) {
    const root = createRoot(container)
    root.render(
        <BaseProvider base={{ interval: 2000, faces: 16, delay: 2000 }}>
            <FaceDashboard />
        </BaseProvider>
    )
} else {
    console.error('Could not find #faces-app element')
}
