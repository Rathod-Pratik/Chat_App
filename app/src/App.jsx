import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Auth from './Pages/auth'
import Chat from './Pages/Chat'
import Profile from './Pages/Profile'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/chat' element={<Chat/>}/>
      <Route path='/profile' element={<Profile/>}/>

      <Route path='*' element={<Navigate to={'/auth'}/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App

// pass rhMKfeKJNi2nrCUq
//name rathodpratik1928
//url mongodb+srv://rathodpratik1928:rhMKfeKJNi2nrCUq@chatapp.c5vx2.mongodb.net/