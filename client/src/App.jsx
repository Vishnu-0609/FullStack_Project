import { Suspense, useState,useMemo,useEffect } from 'react'
import Header from './components/Header';
import { Route,Routes,BrowserRouter as Router,Navigate} from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import DefaultPage from './pages/DefaultPage';
import {v4 as uuidV4} from "uuid";

function App() {
  
  const [documentName,setDocumentName] = useState("");

  return (
    <Router>
      <Header/>
      <Suspense>
        <Routes>
          <Route path='/' element={<DefaultPage documentName={documentName} setDocumentName={setDocumentName}/>}/>
          <Route path='/dashboard' element={<Navigate to={`/dashboard/${uuidV4()}`} />}/>
          <Route path='/dashboard/:id' element={<DashBoard documentName={documentName} setDocumentName={setDocumentName}/>}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
