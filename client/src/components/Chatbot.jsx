import React, { useEffect, useState } from 'react'
import {
  CButton,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CContainer,
  CAvatar,
  CFormLabel,
  CFormInput
} from '@coreui/react'
import {
  cilCommentBubble,
  cilSend
} from '@coreui/icons'
import CIcon from '@coreui/icons-react';
import { useAuth0 } from '@auth0/auth0-react';

function Chatbot({socket,DocumentId}) {
    const [visible,setVisible] = useState(false);
    const [message,setMessage] = useState([]);
    const [value,setValue] = useState("");
    const [isDone,setIsDone] = useState(true);
    const {user} = useAuth0();

    const HandleForm = () =>
    {
        const avatar = user?.picture;
        const email = user?.email;
        socket.emit("message",{value,avatar,email,DocumentId});
        setValue("");
    }

    useEffect(()=>
    {
        if(isDone)
        {
            socket.on("receive-message",(data)=>{
                setMessage(prev=>[data,...prev]);
            })
            setIsDone(false);
        }
    })

    return (
    <>
        <div className='sticky-bottom p-4'>
            <div className='d-flex justify-content-end'>
                <CButton onClick={() => setVisible(true)} className="border border-0 bg-success rounded-circle py-2 pe-3 d-flex justify-content-center align-self-center">
                    <CIcon className='bg-success' size='xxl' icon={cilCommentBubble} title="Download file" />
                </CButton>
            </div>
        </div>
        <COffcanvas backdrop="static" placement="end" visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasHeader>
            <COffcanvasTitle>Communicate With Contributer</COffcanvasTitle>
            <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className='d-flex flex-column'>
            <CContainer className='flex-grow-1 d-flex flex-column-reverse overflow-y-scroll py-4'>
                {message.length>0 && message.map((data,idx)=>(
                    <CContainer key={idx} className={data.email===user.email?`d-flex my-2 flex-row-reverse justify-content-start align-items-center gap-2`:`d-flex my-2 flex-row justify-content-start align-items-center gap-2`}>
                        <CAvatar src={data.avatar} className={`border border-3 border-dark overflow-hidden`} size="lg" />
                        <CFormLabel>{data.value}</CFormLabel>
                    </CContainer>
                ))}
            </CContainer>
            <CContainer className='d-flex justify-content-center gap-2'>
                <CFormInput value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Write Message..." variant='outlined'/>
                <CButton type='button' onClick={HandleForm} className='bg-success'><CIcon icon={cilSend} size='xxl' /></CButton>
            </CContainer>
        </COffcanvasBody>
        </COffcanvas>
    </>
  )
}

export default Chatbot
