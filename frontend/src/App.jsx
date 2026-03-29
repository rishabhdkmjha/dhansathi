import React, { useState } from 'react'
import Header from './components/Header.jsx'
import TaxPage from './pages/TaxPage.jsx'
import InvestmentPage from './pages/InvestmentPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

export default function App() {
  const [tab, setTab] = useState('tax')

  return (
    <>
      <Header activeTab={tab} onTabChange={setTab} />
      <main>
        {tab === 'tax'        && <TaxPage />}
        {tab === 'investment' && <InvestmentPage />}
        {tab === 'chat'       && <ChatPage />}
      </main>
    </>
  )
}