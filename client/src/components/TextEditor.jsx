import React, { useCallback, useEffect,useState } from 'react'
import Quil from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilActionUndo, cilActionRedo,cilHistory } from '@coreui/icons';
import { COffcanvas,COffcanvasHeader,COffcanvasTitle,COffcanvasBody,CCloseButton, CFormLabel, CContainer } from '@coreui/react';
import axios from 'axios';

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{header:[1,2,3,4,5,6,false]}],
  [{font:[]}],
  [{list:"ordered"},{list:"bullet"}],
  ["bold","italic","underline"],
  [{color:[]},{background:[]}],
  [{script:"sub"},{script:"super"}],
  [{align:[]}],
  ["image","blockquote","code-block"],
  ["clean"],
]

function TextEditor({socket,documentName="",setDocumentName=""}) {

  const {id:documentId} = useParams();
  const [quill,setQuill] = useState();
  const [history,setHistory] = useState([]);
  const [visible,setVisible] = useState(false);

  const getHistory = async () =>
  {
    console.log("hii");
    const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/getAllHistory`,{
      "Content-Type":"application/json",
    });
    const historydata = await response.data;
    historydata.map((data)=>{
      const originalDate = new Date(data.createdAt);

      const targetMonth = 2;
      const targetDay = 19;
      const targetYear = originalDate.getUTCFullYear();

      const targetDate = new Date(Date.UTC(targetYear, targetMonth, targetDay, 10, 0, 0));

      targetDate.setHours(targetDate.getHours());
      targetDate.setMinutes(targetDate.getMinutes());

      const formattedDate = targetDate.toLocaleString('en-IN', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
      data.date = formattedDate;
    })
    setHistory(historydata);
    setVisible(true);
  }

  useEffect(()=>{
    if(socket == null || quill == null) return

      socket.once("load-document",document=>{
        quill.setContents(document);
        quill.enable();
      })
      
      socket.emit("get-document",{documentName,documentId});
  },[socket,quill,documentId])

  useEffect(()=>{
    if(socket == null || quill == null) return

    const interval = setInterval(()=>{
      socket.emit("save-document",quill.getContents());
    },SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval);
    }
  },[socket,quill])

  useEffect(()=>{
    if(socket == null || quill == null) return

    const handler = (delta,oldDelta,source)=>{
      if(source!=="user") return 
      socket.emit("send-changes",delta);
    }
    quill.on("text-change",handler);
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        setHistory(prevHistory => [...prevHistory, delta]);
      }
    });

    return () => {
      quill.off("text-change",handler);
    }
  },[socket,quill])

  useEffect(()=>{
    if(socket == null || quill == null) return

    const handler = (delta)=>{
      quill.updateContents(delta);
    }
    socket.on("receive-changes",handler)

    return () => {
      quill.off("text-change",handler);
    }
  },[socket,quill])

  const wrapperRef = useCallback(wrapper=>{
    if(wrapper==null) return
    wrapper.innerHTML = ""
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q=new Quil(editor,{theme:"snow",modules:{toolbar:TOOLBAR_OPTIONS,history:{delay:2000,maxStack:500,userOnly:true}}})
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  },[])

  const handleUndo = () => {
    if (quill) {
      quill.history.undo();
    }
  };

  const handleRedo = () => {
    if (quill) {
      quill.history.redo();
    }
  };

  return (
    <> 
      <COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasHeader>
          <COffcanvasTitle>Recent History</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className=''>
          {history.length > 0 && history.map((data,index)=>(
            <CContainer key={index} className={`d-flex flex-column border border-start-0 border-end-0 border-top-0 ${index === 0 ? 'border-top-0' : ''}`}> 
              <CFormLabel className='text-xl font-weight-bold text-uppercase'>{data?.date}</CFormLabel>
              <CFormLabel>last changed by {data.email}</CFormLabel>
            </CContainer>
          ))}
        </COffcanvasBody>
      </COffcanvas>
      <div id="toolbar-container" className='p-4 d-flex justify-content-end gap-2'>
        <button className='border border-0 bg-transparent' onClick={handleUndo}>
          <CIcon icon={cilActionUndo} title="Download file" size='xl'/>
        </button>
        <button className='border border-0 bg-transparent' onClick={handleRedo}>
          <CIcon icon={cilActionRedo} title="Download file" size='xl'/>
        </button>
        <button onClick={()=>getHistory()} className='border border-0 bg-transparent'>
          <CIcon icon={cilHistory} title="Download file" size='xl'/>
        </button>
      </div>
      <div className='container text-xl' ref={wrapperRef}>
      </div>
    </>
    
  )
}

export default TextEditor
