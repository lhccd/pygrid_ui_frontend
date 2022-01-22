import { useState, useEffect } from 'react';
import { get, set, useForm } from "react-hook-form"
import tw, {styled} from 'twin.macro';
import { Table } from './Table';
import { Table2 } from './Table2';
import { Link } from 'next/link'
import Tag from '../components/Tag'
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import Button from '../components/Button';
import {faCalendar, faEnvelope, faPlus, faUser, faUserPlus, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ListBox from './ListBox';
import HttpService from '../services/HttpService'
import axios from 'axios'
import {getToken} from "../services/UserService";
import useSWR from 'swr'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

function getUsers(list_type){
    const [userlist, setUserlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function fetchData() {
            try{
                setLoading(true);
                const apiRes = await fetch(
                    `/api/${list_type}`,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        }
                    }
                );
                const data = await apiRes.json();
                // console.log("form", data)
                setUserlist(data);
            }
            finally {
                setLoading(false);
            }
        }

        if(list_type !== ''){
            fetchData();
        }
    }, []);

    return [userlist, loading]; 
}

function getUserByID(id){
    const [userDetail, setUserDetail] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function fetchData() {
            try{
                const email =  id;
                setLoading(true);
                const body =JSON.stringify({
                    email
                })
                const apiRes = await fetch('/api/get_user_by_id',
                    {
                        method: "POST",
                        headers:{
                            'Accept': "application/json",
                            'Content-Type': "application/json"
                        },
                        body: body
                    });
                const data = await apiRes.json()
                console.log("GET USER BY ID outside returns", data)
                setUserDetail(data)
            }
            finally {
                setLoading(false);
            }
        }

        if(id !== ''){
            fetchData();
        }
    }, []);

    return [userDetail, loading]; 
}

function UserModal({show, onClose, data}){
    // setData(details)
    console.log("USER MODAL ", data)
    return(
        <Modal show={show} onClose={onClose}>
            <div tw="grid grid-cols-12 text-left p-6 rounded-lg gap-4">
                <div tw="col-span-full flex items-center justify-between">
                    <div tw="flex space-x-3 items-center">
                        <h2 tw="font-bold text-4xl text-gray-800">{data.full_name}</h2>
                        <Tag>Data Scientist</Tag>
                    </div>
                    <Button tw="float-right">Delete User</Button>
                </div>
                <p tw="col-span-full">Change Role</p> 

                <h3 tw="col-span-full font-bold mt-3 text-gray-600">Privacy Budget</h3>
                <div tw="col-span-full flex bg-gray-50 items-center justify-between border border-gray-100 rounded p-4 space-x-3">
                    <div>
                        <p tw="text-error-400 font-bold">{data.budget} ɛ</p>
                        <p>Current Balance</p>
                    </div>
                    <div>
                        <p tw="text-gray-800 font-bold">10.00 ɛ</p>
                        <p>Allocated Budget</p>
                    </div>
                    <Button variant={"primary"} isSmall isHollow>Adjust Budget</Button>
                </div>
                <h3 tw="col-span-full font-bold mt-3 text-gray-600">Background</h3>
                <div tw="col-span-full flex-col border border-gray-100 rounded p-4 space-y-3">
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Email:</p>
                        <p>{data.email}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Company/Institution:</p>
                        <p>{data.institution}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Website/profile:</p>
                        <p>{data.website}</p>
                    </div>
                </div>
                <h3 tw="col-span-full font-bold mt-3 text-gray-600">System</h3>
                <div tw="col-span-full flex-col border border-gray-100 rounded p-4 space-y-3">
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Date Added:</p>
                        <p>{data.added_by}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Data Access Agreement:</p>
                        <p>{data.daa_pdf}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Uploaded On:</p>
                        <p>{data.created_at}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
function Pending(){
    const [showAlert, setShowAlert] = useState(true);
    const [userList, setUserList] = useState([]);
    
    useEffect(() => {
        setUserList([{
        "email": "admin@backend.com",
        "full_name": "Admin Backend",
        "id": "116c09fa-f0ac-48f0-8a12-0a4fd670a529",
        "budget": 0,
        "created_at": null,
        "added_by": null
      }])
    },[])

    return (
        <>  
            <div tw="col-span-full">
                <div tw="flex justify-between">
                    <div tw="my-6 space-x-4">
                        <input
                            tw="p-3 border border-gray-300 rounded-lg focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                            name="search"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                    <button tw="bg-gray-800 rounded text-primary-200 text-center my-6 px-3 py-2 font-bold" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create User</button>
                </div>
            </div>
            {/* <Button variant={'primary'} onClick={getUserlist}>Get All Users</Button> */}
            <table tw="min-w-full my-3">
                <thead>
                    <tr>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                            Name</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            Σ Balance</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            Σ Allocated Budget</th> 
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            <FontAwesomeIcon icon={faCalendar} size="sm" tw="mr-1"/>Date Added</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            <FontAwesomeIcon icon={faUser} size="sm" tw="mr-1"/>Added By</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                            <FontAwesomeIcon icon={faEnvelope} size="sm" tw="mr-1"/>Email</th>
                    </tr>
                </thead>

                <tbody tw="bg-white">
                {
                    userList.map(user => (
                    <tr key={user.email}>
                        <td tw="px-6 py-4 whitespace-nowrap border-t border-b border-gray-200">
                            <div tw="flex items-center">
                                <div tw="flex-shrink-0 w-10 h-10">
                                    <img tw="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                        alt="admin dashboard ui"/>
                                </div>

                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                    <button onClick={() => setShowUserModal(true)}>
                                        {user.full_name}
                                    </button>
                                    </div>
        
                                
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.budget}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.created_at}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.added_by}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="text-sm leading-5 text-gray-500">{user.email}</div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border-t border-b border-gray-200">
                            <div tw="text-sm leading-5 text-gray-500">{user.email}</div>
                        </td>
                    </tr>))
                }
                </tbody>
            </table>
        </>
    )
}
function Active(tableData){
    // console.log("active tab", tableData)
    const userList = tableData.tableData;
    function handleUserClick(email){
        const [userDetail, loading] = getUserByID(email)
        console.log({userDetail})
    }
    return (
        <>

            <div tw="col-span-full">
                <table tw="min-w-full my-3">
                    <thead>
                        <tr>
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                                Name</th>
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                                Σ Balance</th>
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                                Σ Allocated Budget</th> 
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                                <FontAwesomeIcon icon={faCalendar} size="sm" tw="mr-1"/>Date Added</th>
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                                <FontAwesomeIcon icon={faUser} size="sm" tw="mr-1"/>Added By</th>
                            <th
                                tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                                <FontAwesomeIcon icon={faEnvelope} size="sm" tw="mr-1"/>Email</th>
                        </tr>
                    </thead>

                    <tbody tw="bg-white">
                    {   console.log(userList.tableData) }
                    {   userList.length ?
                        userList.map(user => (
                        <tr key={user.email}>
                            <td tw="px-6 py-4 whitespace-nowrap border-t border-b border-gray-200">
                                <div tw="flex items-center">
                                    <div tw="flex-shrink-0 w-10 h-10">
                                        <img tw="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                            alt="admin dashboard ui"/>
                                    </div>

                                    <div tw="ml-4">
                                        <div tw="text-sm font-medium leading-5 text-gray-900">
                                        {/* <button onClick={() => handleUserClick(user.email)}> */}
                                        <button>
                                            {user.full_name}
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                        {user.balance}
                                    </div>
                                </div>
                            </td>
                            <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                        {user.budget}
                                    </div>
                                </div>
                            </td>

                            <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                        {user.created_at}
                                    </div>
                                </div>
                            </td>

                            <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                        {user.added_by}
                                    </div>
                                </div>
                            </td>

                            <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                                <div tw="text-sm leading-5 text-gray-500">{user.email}</div>
                            </td>

                        </tr>))
                    : []}
                    </tbody>
                </table>
            </div>
        </>
    )
}
function Denied(){
    const [showAlert, setShowAlert] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        setUserList([{
        "email": "admin@backend.com",
        "full_name": "Admin Backend",
        "id": "116c09fa-f0ac-48f0-8a12-0a4fd670a529",
        "balance": 0,
        "budget": 0,
        "created_at": null,
        "added_by": null
      }])
    },[])
    return (
        <>
            <div tw="col-span-full">
            <table tw="min-w-full my-3">
                <thead>
                    <tr>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                            Name</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            Σ Balance</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            Σ Allocated Budget</th> 
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            <FontAwesomeIcon icon={faCalendar} size="sm" tw="mr-1"/>Date Added</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200">
                            <FontAwesomeIcon icon={faUser} size="sm" tw="mr-1"/>Added By</th>
                        <th
                            tw="px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-t border-b border-gray-200">
                            <FontAwesomeIcon icon={faEnvelope} size="sm" tw="mr-1"/>Email</th>
                    </tr>
                </thead>

                <tbody tw="bg-white">
                {
                    userList.map(user => (
                    <tr key={user.email}>
                        <td tw="px-6 py-4 whitespace-nowrap border-t border-b border-gray-200">
                            <div tw="flex items-center">
                                <div tw="flex-shrink-0 w-10 h-10">
                                    <img tw="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                        alt="admin dashboard ui"/>
                                </div>
                                <div tw="ml-4">
                                    <div tw="text-sm font-medium leading-5 text-gray-900">
                                    <button onClick={() => setShowUserModal(true)}>
                                        {user.full_name}
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.balance}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.budget}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.created_at}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="ml-4">
                                <div tw="text-sm font-medium leading-5 text-gray-900">
                                    {user.added_by}
                                </div>
                            </div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border border-gray-200">
                            <div tw="text-sm leading-5 text-gray-500">{user.email}</div>
                        </td>

                        <td tw="px-6 py-4 whitespace-nowrap border-t border-b border-gray-200">
                            <div tw="text-sm leading-5 text-gray-500">{user.email}</div>
                        </td>
                    </tr>))
                }
                </tbody>
            </table>
            {/* <UserModal show={showUserModal} onClose={()=>setShowUserModal(false)}/> */}
            </div>
        </>
    )
}

export function Tab(){
    const [toggleState, setToggleState] = useState(1);
    const [acceptedUsers, loading] = getUsers('accepted_userlist')

    // console.log({acceptedUsers}, {loading})

    const toggleTab = (index) => {
        setToggleState(index);
    };

    return (
        <div tw="flex flex-col relative w-auto bg-white break-all">
            <div tw="flex">
                <button
                    css={[tw`p-4 bg-white text-center w-1/2 bg-white border-b-2 border-primary-500 `,
                        (toggleState === 1) && tw`border-primary-500 border-b-0 border-t-2 border-r-2 border-l-2 rounded-t-md`]}
                    onClick={() => toggleTab(1)}
                >
                <h3 css={[tw`text-center font-bold text-gray-600`, (toggleState === 1) && tw`text-primary-500`]}>
                    Active Users ({acceptedUsers.length})
                </h3>
                </button>
                <button
                    css={[tw`p-4 bg-white text-center w-1/2 bg-white border-b-2 border-primary-500 `,
                    (toggleState === 2) && tw`border-primary-500 border-b-0 border-t-2 border-r-2 border-l-2 rounded-t-md`]}
                    onClick={() => toggleTab(2)}
                >
                <h3 css={[tw`text-center font-bold text-gray-600`, (toggleState === 2) && tw`text-primary-500`]}>
                    Pending Users ()
                </h3>
                </button>
                <button
                    css={[tw`p-4 bg-white text-center w-1/2 bg-white border-b-2 border-primary-500 `,
                    (toggleState === 3) && tw`border-primary-500 border-b-0 border-t-2 border-r-2 border-l-2 rounded-t-md`]}
                    onClick={() => toggleTab(3)}
                >
                <h3 css={[tw`text-center font-bold text-gray-600`, (toggleState === 3) && tw`text-primary-500`]}>
                    Denied Users ()
                </h3>
                </button>
            </div>


            <div tw="">
                <div 
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 1) && tw`bg-white block`,]}
                >   
                <button tw="rounded bg-primary-500" onClick={()=>getUserByID('lorenz.dang@gmail.com')}>GET USER</button>
                    {loading ? <div>Loading...</div> : <Active tableData={acceptedUsers}></Active>}
                </div>

                <div
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 2) && tw`bg-white block`,]}
                >
                    <Pending/>
                </div>

                <div
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 3) && tw`bg-white block`,]}
                >
                    <Denied/>
                </div>

            </div>
        </div>
    )
}

// /* 
// var acceptedUserlistLength = 0
// var pendingUserlistLength = 0 
// var deniedUserlistLength = 0 

// function getAcceptedUserlist(){
//     const fetcher = (...args) => fetch(...args).then(res => res.json())
//     const { data, error } = useSWR('/api/accepted_userlist', fetcher)
//     return {
//         userlist: data,
//         isLoading: !error && !data,
//         isError: error,
//     }
// }
// function getPendingUserlist(){
//     const fetcher = (...args) => fetch(...args).then(res => res.json())
//     const { data, error } = useSWR('/api/pending_userlist', fetcher)
//     return {
//         userlist: data,
//         isLoading: !error && !data,
//         isError: error
//     }
// }
// function getDeniedUserlist(){
//     const fetcher = (...args) => fetch(...args).then(res => res.json())
//     const { data, error } = useSWR('/api/denied_userlist', fetcher)
//     return {
//         userlist: data,
//         isLoading: !error && !data,
//         isError: error
//     }
// }
// async function getUserByID(values){
//     // const fetcher = (...args) => fetch(...args).then(res => res.json())
//     // const { data, error } = useSWR('/api/get_user_by_id', fetcher)
//     // return {
//     //     userlist: data,
//     //     isLoading: !error && !data,
//     //     isError: error,
//     // }
//     try {
//         console.log("values from parameters", values)
//         const email =  values;
//         // const email = "admin@backend.com"
//         const body =JSON.stringify({
//             email
//         })
//         console.log("values from login page", body)
//         const apiRes = await fetch('/api/get_user_by_id',
//             {
//                 method: "POST",
//                 headers:{
//                     'Accept': "application/json",
//                     'Content-Type': "application/json"
//                 },
//                 body: body
//             });
//         if(apiRes.status == 200){
//             const data = await apiRes.json()
//             console.log("GET USER BY ID outside returns", data)
//             return data
//         }
//         else{         
//             alert("Ooops! NO DATA", apiRes.status)
//         }

//     }catch (err) {
//         console.error(err)
//     }
// }
// // function getUserByID(email){
// //     const fetcher = (email, ...args) => fetch(email, ...args).then(res => res.json())
// //     const { data, error } = useSWR('/api/get_user_by_id', fetcher)
// //     console.log("userdetail useSWR in outside function", data)
// //     return {
// //         userlist: data,
// //         isLoading: !error && !data,
// //         isError: error,
// //     }
// // }



// function CreateUserModal({show, onClose}){
//     const { register, handleSubmit, errors, reset } = useForm();
//     const [DAARequired, setDAARequired] = useState(true);
//     const [DAAUploaded, setDAAUploaded] = useState(false);
//     const [daa, setDaa] = useState(null);
//     const [showModal, setShowModal] = useState(true);

//     async function onSubmitForm(values) {
//         const formData = new FormData
//         formData.append("email", values.email)
//         formData.append("full_name", values.full_name)
//         formData.append("institution", values.institution)
//         formData.append("password", values.password)
//         formData.append("website", values.website)
//         // formData.append("daa_pdf", values.daa_pdf[0])
//         let config = {
//           method: 'post',
//           url: 'http://localhost/api/v1/users/create',
//           data: formData
//         }
//         try {
//           console.log("config data: ", values)
//           const response = await axios(config)
//           console.log(response);
//           onClose;
//         } catch (err) {
//           console.error(err);
//         }
//     }

//     const onUploadDaa = (e) => {
//     setDAAUploaded(true);
//     let files = e.target.files;
//     setDaa(files[0]);
//     }

//     const onXClick = () => {
//     setDAAUploaded(false);
//     setDaa(null);
//     }

//     const onDAAClick = () => {
//     fileSaver.saveAs(daa);
//     };

//     return(
//         <Modal show={show} onClose={onClose}>
//             <form onSubmit={handleSubmit(onSubmitForm)} tw="grid grid-cols-12 text-sm text-center font-bold p-6 rounded-lg gap-4 ">
//                 <div tw="col-span-12 my-3 text-left text-gray-800">
//                     <FontAwesomeIcon icon={faUserPlus} size="2x" tw="my-4"/>  
//                     <p tw="text-2xl">
//                         Create a User
//                     </p>
//                     <p tw="mt-3 text-sm font-normal">
//                         PyGrid utilizes users and roles to appropriately permission data at a higher level. All users with the permission CAN CREATE USERS are allowd to create users in the domain. Create a user by filling out the fields below. 
//                     </p>
//                 </div>
//                 <div tw="col-span-6 text-left ">
//                     <label tw="block my-2" htmlFor="fullname">Full Name<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
//                     <input
//                     tw="block p-3 border border-gray-300 rounded-lg w-full
//                                 focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                     name="full_name"
//                     type="text"
//                     placeholder="Jane Doe"
//                     autoComplete="on"
//                     {...register("full_name", { required: true, message: 'You must enter a name' })}
//                     />
//                 </div>
//                 <div tw="col-span-6 text-left">
//                     <label tw="block my-2" htmlFor="email">Email<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
//                     <input
//                     tw="block p-3 border border-gray-300 rounded-lg w-full
//                                 focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                     name="email"
//                     type="email"
//                     placeholder="abc@university.edu"
//                     autoComplete="on"
//                     {...register("email",{required: true})}
//                     />
//                 </div>
//                 <div tw="col-span-6 block text-left">
//                     <label tw="block my-2" htmlFor="pw">Password<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
//                     <input
//                     tw="block p-3 border border-gray-300 rounded-lg w-full
//                                 focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                     name="password"
//                     type="password"
//                     placeholder="Text here"
//                     autoComplete="on"
//                     {...register("password", { required: true })}
//                     />
//                 </div>
//                 <div tw="col-span-6 inline-block text-left">
//                     <label tw="block my-2" htmlFor="confirmpw">Confirm Password<p tw="pl-1 inline relative bottom-1 text-primary-500">*</p></label>
//                     <input
//                     tw="block p-3 border border-gray-300 rounded-lg w-full
//                                 focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                     name="confirmpw"
//                     type="password"
//                     placeholder="Text here"
//                     autoComplete="on"
//                     {...register("confirmpw", { required: true })}
//                     />
//                 </div>
//                 <div tw="col-span-12 block text-left">
//                     <label tw="block my-2" htmlFor="website">Role<p tw="pl-1 inline relative bottom-1 text-primary-500">*</p></label>
//                     <input
//                         tw="block p-3 border border-gray-300 rounded-lg w-full
//                                     focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                         name="website"
//                         type="text"
//                         placeholder="This can help a domain owner vett your application"
//                         autoComplete="on"
//                         {...register("website", { required: false })}
//                     />
//                 </div>
//                 <div tw="col-span-5">
//                     <label tw="col-span-full block my-2 text-left" htmlFor="website">Set Privacy Budget (PB)<p tw="pl-1 inline text-base italic font-normal text-primary-500 ">(optional)</p></label>
//                     <input
//                         tw="col-span-3 block p-3 border border-gray-300 rounded-lg w-full
//                                     focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
//                         name="website"
//                         type="text"
//                         placeholder="This can help a domain owner vett your application"
//                         autoComplete="on"
//                     />
//                 </div>
//                 <div tw="col-span-7 text-justify font-normal font-mono my-2">
//                     <p>Allocating Privacy Budget (PB) is an optional setting that allows you to maintain a set standard of privacy while offloading the work of manually approving every data request for a single user. You can think of privacy budget as credits you give to a user to perform computations from. These credits of Epsilon(ɛ) indicate the amount of visibility a user has into any one entity of your data. You can learn more about privacy budgets and how to allocate them at Course.OpenMined.org</p>
//                 </div>
//                 <div tw="col-span-full flex justify-between font-bold text-xl">
//                     <button tw="bg-white rounded text-primary-500 text-center my-6 px-3 py-2 my-5 border-2 border-primary-500 " onClick={onClose}>Cancel</button>
//                     <button tw="bg-primary-500 rounded text-white text-center my-6 px-3 py-2 my-5" type="submit"><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create</button>
//                 </div>
//                 {/* {DAARequired ? [
//                   <div tw="col-span-4 block text-left">
//                     <label tw="block my-2">Upload Signed</label>
//                     <p>This domain requires a Data Access Agreement (DAA) to be signed before an
//                       account can be made. Please download the agreement below and upload a
//                       signed version when you are ready to apply.</p>
//                     {DAAUploaded
//                       ?
//                       <div>
//                         <div tw="w-2/3 flex justify-between bg-gray-100 text-black my-4 py-1">
//                           <button tw="mx-2 underline" type="button" onClick={onDAAClick}>
//                             {daa.name}
//                           </button>
//                           <button tw="font-bold mx-2" type="button" onClick={onXClick}>
//                             X
//                           </button>
//                         </div>
//                         <div>
//                           <input tw="col-start-2 col-end-4 text-primary-500 border-primary-500 rounded bg-white text-center font-bold mx-6 px-3 py-2 my-5"
//                             type="button"
//                             value="Replace File"
//                             onClick={() => document.getElementById('daa_pdf_replace').click()} />
//                           <input tw="hidden"
//                             id="daa_pdf_replace"
//                             name="daa_pdf_replace"
//                             type='file'
//                             {...register("daa_pdf", { onChange: onUploadDaa, required: false })}
//                           />

//                           <button
//                             tw="col-start-2 col-end-4 text-primary-500 bg-white text-center font-bold mx-6 px-3 py-2 my-5">
//                             Download Agreement
//                           </button>
//                         </div>
//                       </div>
//                       :
//                       <div>
//                         <input tw="col-start-2 col-end-4 text-primary-500 border-primary-500 rounded bg-white text-center font-bold mx-6 px-3 py-2 my-5"
//                           type="button"
//                           value="Upload File"
//                           onClick={() => document.getElementById('daa_pdf').click()} />
//                         <input tw="hidden"
//                           id="daa_pdf"
//                           name="daa_pdf"
//                           type='file'
//                           {...register("daa_pdf", { onChange: onUploadDaa, required: true })}
//                         />
//                         <button
//                           tw="col-start-2 col-end-4 text-primary-500 bg-white text-center font-bold mx-6 px-3 my-5">
//                           Download agreement
//                         </button>
//                       </div>
//                     }
//                   </div>
//                 ]
//                 : ""
//               } */}
//             </form>
//         </Modal>
//     )
// }


