import { InitialPage, Auth, OrderPage, PesonalAccount, AnalysisOrderPage } from './pages'
import { Routes, Route } from "react-router-dom";


import React from "react";


function App() {

  return (
    <>
    <Routes>
          <Route path='/' element={<InitialPage/>} />
          <Route path='/Auth' element={<Auth/>} />
          <Route path='/Orders/CreateOrder' element={<OrderPage/>} />
          <Route path='/PersonalAccount' element={<PesonalAccount/>} />
          <Route path='/Orders/Analysis' element={<AnalysisOrderPage/>} />
    </Routes>
    {/* <InitialPage/> */}
    {/* <Auth/> */}
    {/* <OrderPage/> */}
    {/* <PesonalAccount/> */}
    {/* <AnalysisOrderPage/> */}
    </>
  )}

export default App
