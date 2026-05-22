import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme as antdUtils } from 'antd'
import type { ThemeConfig } from 'antd'
import { SiteProvider } from './context/SiteContext'
import HomePage from './pages/public/Home'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import './index.css'

const darkTheme: ThemeConfig = {
  algorithm: antdUtils.darkAlgorithm,
  token: {
    colorPrimary:  '#00DDB8',
    colorBgBase:   '#0B0B0E',
    fontFamily:    "'Inter', system-ui, sans-serif",
    borderRadius:  10,
    controlHeight: 46,
  },
  components: {
    Button: { borderRadius: 8, fontWeight: 600 },
  },
}

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    fontFamily:   "'Inter', system-ui, sans-serif",
    borderRadius: 8,
  },
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ConfigProvider theme={darkTheme}>
              <HomePage />
            </ConfigProvider>
          }
        />
        <Route
          path="/walkyshow"
          element={
            <ConfigProvider theme={lightTheme}>
              <AdminLogin />
            </ConfigProvider>
          }
        />
        <Route
          path="/walkyshow/dashboard"
          element={
            <ConfigProvider theme={lightTheme}>
              <AdminDashboard />
            </ConfigProvider>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteProvider>
  )
}
