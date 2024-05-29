import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom'
import ScaleIcon from '@heroicons/react/24/solid/ScaleIcon.jsx'
import CheckIcon from '@heroicons/react/24/solid/CheckIcon.jsx'
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon.jsx'
import ReportDetails from '../components/ReportDetails';

const ViewReports = () => {
    const {isLoggedIn, isAdmin,sessionToken, userId} = useAuth();
    const [reports, setReports] = useState([]);
    const [reviewReports, setReviewReports] = useState([]);
    const [resolvedReports, setResolvedReports] = useState([]);
    const [viewResolved, setViewResolved] = useState(false);
    
    
    useEffect( () => {
        fetchRewiewReports();
        fetchReports();
    }, [isLoggedIn]);
    useEffect( () => {
        if(viewResolved){
            fetchResolvedReports();
        }
    }, [viewResolved]);
    const fetchRewiewReports = async () => {
        try {
            const response = await fetch(`http://localhost:5050/api/reports/reviewing/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            setReviewReports(data.reports);
        } catch (error) {
            
            console.error(error);
        }
    };
    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/reports/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            setReports(data.reports);
        } catch (error) {
            
            console.error(error);
        }
    };
    const fetchResolvedReports = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/reports/resolved', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            setResolvedReports(data.reports);
        } catch (error) {
            
            console.error(error);
        }
    }
    const handleResolve = async (reportID) => {
        
        try {
            const response = await fetch('http://localhost:5050/api/reports/resolve', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                },
                body: JSON.stringify({ reportID: reportID, reportStatus: 'risolto' })
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            //console.log(data);
            fetchReports();
            fetchRewiewReports();
        } catch (error) {
            console.error(error);
        }

    }
    const handleRemove = async (reportID) => {
        
        try {
            const response = await fetch('http://localhost:5050/api/reports/remove', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                },
                body: JSON.stringify({ reportID: reportID })
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            //console.log(data);
            fetchReports();
            fetchRewiewReports();
        } catch (error) {
            console.error(error);
        }

    }
    const handleReview = async (reportID) => {
        try {
            const response = await fetch('http://localhost:5050/api/reports/review', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  `${sessionToken}`
                },
                body: JSON.stringify({ reportID: reportID, reviewerID: userId, reportStatus: 'in revisione' })
            });

            if (!response.ok) {
                throw new Error('Errore durante il fetch');
            }

            const data = await response.json();
            //console.log(data);
            fetchRewiewReports();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='relative h-full w-full flex flex-col space-y-4 items-center bg-white px-8 overflow-scroll no-scrollbar'>
            <h1 className='text-3xl font-bold text-black p-2'>Visualizza Segnalazioni</h1>
            <div className='w-full flex flex-col space-y-4 items-center  px-8'>
                <div className='w-full'>
                    <h1 className='text-xl font-bold text-black'>In revisione...</h1>
                </div>
                
                {reviewReports.length ? (
                    reviewReports.map((report) => (
                        <div key={report.id} className='flex flex-row items-center bg-blue-100 rounded-md mx-10  w-full px-6 py-3 justify-between' >
                            <div className='flex flex-row space-x-6 '>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Id:   
                                    
                                </label>
                                <Link to={`/reports/${report._id}`}><h1 className='text-normal font-semibold hover:underline'>{report._id}</h1></Link>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Data:   
                                </label>
                                <h2 className='text-normal '>
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Stato:   
                                </label>
                                <h2 className={report.reportStatus=="in revisione"? `text-yellow-500 text-normal font-bold` : report.reportStatus=="risolto"? `text-green-500 text-normal font-bold` : `text-red-500 text-normal font-bold`
                                }>{report.reportStatus}</h2>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Descrizione:   
                                </label>
                                <p className='overflow-hidden w-11 h-5 '>{report.description}</p>
                            </div>
                            
                            </div>
                            <ReportDetails report={report}></ReportDetails>
                            <div className='flex flex-row space-x-4'>
                            <button type="button" className='bg-blue-950 p-1 rounded-full hover:bg-blue-800 hover:scale-105' onClick={()=>handleRemove(report._id)}><XMarkIcon className="w-6 h-6" fill="white" ></XMarkIcon></button>
                                <button type="button" className='bg-blue-950 p-1 rounded-full hover:bg-blue-800 hover:scale-105' onClick={()=>handleResolve(report._id)}><CheckIcon className="w-6 h-6" fill="white" ></CheckIcon></button>
                            </div>
                        </div>
                    ))
                ): (
                    <p>Nessuna segnalazione presente</p>
                )
                

                }
            </div>
            <div className='w-full flex flex-col space-y-4 items-center  px-8 mb-10'>
                <div className='w-full'>
                    <h1 className='text-xl font-bold text-black'>In attesa...</h1>
                </div>
                
                {reports.length ? (
                    reports.map((report) => (
                        <div key={report.id} className='flex flex-row items-center bg-blue-100 rounded-md mx-10  w-full px-6 py-3 justify-between' >
                            <div className='flex flex-row space-x-6 '>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Id:   
                                </label>
                                <Link to={`/reports/${report._id}`}><h1 className='text-normal font-semibold hover:underline'>{report._id}</h1></Link>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Data:   
                                </label>
                                <h2 className='text-normal '>
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Stato:   
                                </label>
                                <h2 className={report.reportStatus=="in revisione"? `text-yellow-500 text-normal font-bold` : report.reportStatus=="risolto"? `text-green-500 text-normal font-bold` : `text-red-500 text-normal font-bold`
                                }>{report.reportStatus}</h2>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Descrizione:   
                                </label>
                                <p className='overflow-hidden '>{report.description}</p>
                            </div>
                            </div>
                            <ReportDetails report={report}></ReportDetails>
                            <div className='flex flex-row'>
                                <button type="button" className='bg-blue-950 p-1 rounded-full hover:bg-blue-800 hover:scale-105' onClick={()=>handleReview(report._id)}><ScaleIcon className="w-8 h-8" fill="white" ></ScaleIcon></button>
                            </div>
                        </div>
                    ))
                ): (
                    <p>Nessuna segnalazione presente</p>
                )
                

                }
            </div>
            {!viewResolved && <button type="button" className='bg-blue-950 p-3 rounded-md hover:bg-blue-800 hover:scale-105 text-white font-bold ' onClick={()=>setViewResolved(true)}>View resolved</button> }
            {viewResolved && (<div className='w-full flex flex-col space-y-4 items-center  px-8 mb-10'>
                <div className='w-full'>
                    <h1 className='text-xl font-bold text-black'>Risolte:</h1>
                </div>
                
                {resolvedReports.length ? (
                    resolvedReports.map((report) => (
                        <div key={report.id} className='flex flex-row items-center bg-blue-100 rounded-md mx-10  w-full px-6 py-3 justify-between' >
                            <div className='flex flex-row space-x-6 '>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Id:   
                                </label>
                                <Link to={`/reports/${report._id}`}><h1 className='text-normal font-semibold hover:underline'>{report._id}</h1></Link>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Data:   
                                </label>
                                <h2 className='text-normal '>
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
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Stato:   
                                </label>
                                <h2 className={report.reportStatus=="in revisione"? `text-yellow-500 text-normal font-bold` : report.reportStatus=="risolto"? `text-green-500 text-normal font-bold` : `text-red-500 text-normal font-bold`
                                }>{report.reportStatus}</h2>
                            </div>
                            <div className='flex flex-col space-y-1 '>
                                <label htmlFor="">
                                    Descrizione:   
                                </label>
                                <p className='overflow-hidden '>{report.description}</p>
                            </div>
                            </div>
                            <ReportDetails report={report}></ReportDetails>    
                            <div className='flex flex-col  space-y-1'>
                            <label htmlFor="">
                                    Data risoluzione:   
                                </label>
                                <p className=' '>{new Date(report.resolvedDate).toLocaleDateString(
                                    "it-IT",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                    )}</p>
                            </div>
                            
                        </div>
                    ))
                ): (
                    <p>Nessuna segnalazione presente</p>
                )
                

                }
            </div>)
            }
            

            
        </div>
    );
};

export default ViewReports;