import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {API_BASE_URL} from "../constant.js";

export default function ReportDetails({report}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [publisher, setPublisher] = useState({ img: "", username: "", id: ""});

    useEffect(() => {
        if (report.reporterID) fetchUserData();
    }, []);
  async function fetchUserData() {
    // Fetch user data from the backend
    await fetch(`${API_BASE_URL}users/${report.reporterID}?proPic=1`)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.user;
        console.log(userData.username);
        setPublisher({
          img: userData.proPic[0]
            ? userData.proPic[0]
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          username: userData.username,
          id: userData._id,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }
  return (
    <>
      <Button onPress={onOpen} className="bg-blue-950 text-white font-bold rounded-md px-2 hover:bg-blue-800 hover:scale-105">Dettagli</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-blue-950  h-4/6 absolute top-1/4 text-white  rounded-xl p-4"> 
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                    <Link to={`/reports/${report._id}` } >
                        <h1 className='text-xl font-semibold hover:underline'>{report._id}</h1>
                    </Link>
                </ModalHeader>
                <ModalBody className="space-y-3 overflow-scroll no-scrollbar">
                    <div className='flex flex-col  bg-white rounded-lg bg-opacity-5 p-2'>
                                <label htmlFor="" className="font-semibold">
                                    Reporter:   
                                </label>
                                <Link
                                    to={`/findatenant/${publisher.id}`}
                                    className="flex flex-row space-x-4 items-center"
                                    >
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={
                                        publisher.img.includes("http") ||
                                            publisher.img.includes("data:image/png;base64,")
                                            ? publisher.img
                                            : `data:image/png;base64,${publisher.img}`
                                        }
                                        alt="propic"
                                    />
                                    <p>{publisher.username}</p>
                                </Link>
                                
                    </div>
                    <div className='flex flex-col space-y-1 bg-white rounded-lg bg-opacity-5 p-2'>
                            <label htmlFor="" className="font-semibold">
                                Data:   
                            </label>
                            <h2 className='text-normal  '>
                            {new Date(report.createdAt).toLocaleDateString(
                                "it-IT",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                                )}
                            </h2>
                        </div>
                        <div className="flex flex-row items-center justify-around bg-white rounded-lg bg-opacity-5 p-2 ">
                            
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="" className="font-semibold">
                                    Tipo:                             
                                </label>
                                <Link to={
                                    report.reportType=="match"? `/matches/${report.targetID}` :  
                                        report.reportType=="inserzione"? `/findaflat/${report.targetID}` :  
                                            report.reportType=="utente"? `/findatenant/${report.targetID}` : `/messages/${report.targetID}`
                                } className={
                                            report.reportType=="match"? `bg-blue-500 px-2 rounded-md` :  
                                                report.reportType=="inserzione"? `bg-green-400 px-2 rounded-md` :  
                                                    report.reportType=="utente"? `bg-amber-400px-2 rounded-md` : `bg-indigo-500 px-2 rounded-md`}>
                                    <h2 className='text-lg font-bold text-white'>{report.reportType}</h2>
                                </Link>
                            </div>
                            <div className='flex flex-col  '>
                                    <label htmlFor="" className="font-semibold">
                                        Stato:   
                                    </label>
                                    <h2 className={report.reportStatus=="in revisione"? `text-yellow-500 text-normal font-bold` : report.reportStatus=="risolto"? `text-green-500 text-normal font-bold` : `text-red-500 text-normal font-bold`
                                    }>{report.reportStatus}</h2>
                            </div>
                        </div>
                    
                        <div className='flex flex-col  bg-white rounded-lg bg-opacity-5 p-2'>
                                <label htmlFor="" className="font-semibold">
                                    Descrizione:   
                                </label>
                                <p className='overflow-hidden '>{report.description}</p>
                        </div>
                </ModalBody>
              <ModalFooter>
                <Button className="bg-blue-50 text-blue-950 font-bold rounded-md px-2 hover:bg-blue-800 hover:text-white hover:scale-105" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-blue-50 text-blue-950 font-bold rounded-md px-2 hover:bg-blue-800 hover:text-white hover:scale-105" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
