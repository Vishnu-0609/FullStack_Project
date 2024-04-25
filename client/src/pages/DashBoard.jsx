import React, { useEffect, useState,useMemo } from 'react';
import {CAvatar} from '@coreui/react';
import {cilPencil,cilArrowCircleLeft} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Chatbot from '../components/Chatbot';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import {io} from "socket.io-client";
import TextEditor from '../components/TextEditor';
import { useNavigate, useParams } from 'react-router-dom';

function DashBoard({documentName="",setDocumentName=""}) {

    const [isDone,SetisDone] = useState(true);
    const [isUpdated,setIsUpdated] = useState(true);
    const [AllUserData,setAllUserData] = useState([]);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    const [socketData, setSocketData] = useState("");

    const socket = useMemo(()=>io(`${import.meta.env.VITE_HOST_URL}`,{withCredentials:true}),[]);
    let mousePosition = [];
    const [mousePosition1, setMousePosition] = useState([]);
    const {id} = useParams();

    if(!isAuthenticated)
    {
        navigate("/");
    }

    useEffect(()=>{
        socket.on("connect",()=>{
          setSocketData(socket);
          socket.on("welcome",(s)=>{
            console.log(s);
          })
        })
    
        return () =>
        {
            socket.disconnect();
        }
    },[])

    const UpdateSocketId = async () =>
    {
        try
        {
            const userdata = {"username":user?.name,"email":user?.email,"socketId":socket.id,Avatar:user?.picture};
            const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/register`,userdata,{
            "Content-Type":"application/json",
            });

            const data = await response.data;
            const status = await response.status;
            getAllContributer();
        }
        catch(err)
        {
            console.log("hii");
        }
    }

    useEffect(()=>
    {
        if(isDone)
        {
            getAllContributer();
            SetisDone(false);
        }
    },[])

    const getAllContributer = async () =>
    {
        const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/getAllUser`,{
            "Content-Type":"application/json",
        });
        const AllUser = await response.data;
        setAllUserData(AllUser);
    }

    if(socket.id && user?.email)
    {
        if(isUpdated)
        {
            UpdateSocketId();
            getAllContributer();
            setIsUpdated(false);
        }
    }

    const handlemoveEffect = (e) =>
    {
        socket.emit("mousemovedata",{"x":e.pageX,"y":e.pageY,"name":user?.name});
    }

    useEffect(()=>{
        socket.on("mousemove",(data)=>
        {
            let counter = 0;
            if(mousePosition.length==0)
            {
                mousePosition = [...mousePosition,{ x: data.x, y: data.y, name: data.name }];
            }
            mousePosition.map((item,idx)=>{
                if(data.name===item.name)
                {
                    mousePosition = mousePosition.filter(i=>i.name!==data.name);
                    const newData = {x:data.x,y:data.y,name:data.name};
                    return mousePosition = [...mousePosition,newData]
                    counter = -1;
                }
            })

            if(counter===0)
            {
                mousePosition = [...mousePosition,{ x: data.x, y: data.y, name: data.name }];
            }
            setMousePosition(mousePosition);
        })
    },[handlemoveEffect])

  return (
    <>
    <div className="bg-body-tertiary" onMouseMove={handlemoveEffect}>
    {mousePosition1.length>0 && mousePosition1.map((mousePosition)=>(
        <div style={{ position: 'absolute', left: mousePosition.x, top: mousePosition.y,zIndex:99 }}>
            <div><h6>{mousePosition.name}</h6><CIcon icon={cilPencil} size="xxl"/></div>
        </div>
    ))}
      <div>
        <div className='d-flex justify-content-between p-2 gap-2 px-4'>
            <div>
                <button className='border border-0 bg-transparent' onClick={()=>navigate("/")}>
                    <CIcon icon={cilArrowCircleLeft} size="xxl"/>
                </button>
            </div>
            <div className='d-flex gap-2'>
                {AllUserData.length > 0 && AllUserData.map((userdata)=>(
                    <CAvatar key={userdata?._id} src={userdata?.Avatar} className={userdata?.socketId?`border border-3 border-success overflow-hidden`:`border border-3 border-danger overflow-hidden`} size="lg" />
                ))}
            </div>
        </div>
        {socketData && (
            <TextEditor socket={socketData} documentName={documentName} setDocumentName={documentName}/>
        )}
      </div>
    </div>
    <Chatbot socket={socket} DocumentId={id}/>
    </>
  )
}

export default DashBoard
