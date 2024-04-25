import React from 'react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CButton, CFormInput, CFormLabel, CContainer } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

function Modal({visible,setVisible,documentName,setDocumentName}) {
    const navigate = useNavigate();
  return (
    <CModal
    backdrop="static"
    visible={visible}
    onClose={() => setVisible(false)}
    aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Modal title</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
            <CFormLabel>Document Name</CFormLabel>
            <CFormInput value={documentName} onChange={(e)=>setDocumentName(e.target.value)}/>
        </CContainer>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton onClick={()=>navigate("/dashboard")} color="primary">Create</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default Modal
