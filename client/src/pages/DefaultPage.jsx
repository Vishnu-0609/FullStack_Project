import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Modal from '../components/Modal';

function DefaultPage({documentName,setDocumentName}) {

    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    const [allDocuments,setAllDocuments] = useState([]);
    const [visible,setVisible] = useState(false);

    const getAllDocuments = async () =>
    {
        const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/getAllDocuments`,{
            "Content-Type":"application/json",
        });
        const AllDocuments = await response.data;
        setAllDocuments(AllDocuments);
    }

    useEffect(()=>{
      getAllDocuments();
    },[])

    const handleDelete = async (id) =>
    {
      console.log(import.meta.env.VITE_HOST_URL);
      await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/deleteDocuments`,{"id":id},{
          "Content-Type":"application/json",
      });
      getAllDocuments();
    }
  return (
    <>
      <Modal visible={visible} setVisible={setVisible} documentName={documentName} setDocumentName={setDocumentName}/>
      <div className='d-flex flex-row-reverse p-2'>
        <button onClick={()=>isAuthenticated?setVisible(true):loginWithRedirect()} className='btn btn-success'>Create Dashboard</button>
      </div>
      <div className='d-flex flex-wrap gap-4 p-4'>
        {allDocuments.length>0 && allDocuments.map((document,idx)=>(
          <div key={idx} className="card" style={{width: "18rem"}}>
            <img className="card-img-top" src="/card.jpg" alt="Card image cap"/>
            <div className="card-body">
              <p className="card-text">{document.name}</p>
              <div className='d-flex gap-2 justify-content-around'>
                <button onClick={()=>isAuthenticated?navigate(`/dashboard/${document._id}`):loginWithRedirect()} className='btn btn-success'>Go to Dashboard</button>
                <button onClick={()=>handleDelete(document._id)} className='btn btn-danger'>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default DefaultPage
