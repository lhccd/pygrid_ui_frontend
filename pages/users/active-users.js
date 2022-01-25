import { useState, useEffect, useMemo } from 'react';
import { get, set, useForm } from "react-hook-form"
import tw, {styled} from 'twin.macro';
import { Link } from 'next/link'
import Tag from '../../components/Tag'
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import {
    faCalendar,
    faEnvelope,
    faPlus,
    faUser,
    faUserPlus,
    faInfoCircle,
    faCheckCircle,
    faTimesCircle,
    faTrash,
    faExpandAlt
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { GlobalFilter } from '../../components/GlobalFilter';
import { Router } from 'next/router';
import { Tab } from "@headlessui/react"
import { Fragment } from 'react'

const Table = tw.table`
    min-w-full
    my-5
    table-auto
    text-base
    text-gray-900
`;

const TableHead = tw.thead`
    px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase 
`;

const TableRow = tw.tr`
    px-6 py-4 whitespace-nowrap border border-gray-200
`;

const TableHeader = tw.th`
    px-6 py-4 text-base font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border border-gray-200    
`;

const TableBody = tw.tbody`
`;

const TableData = tw.td`
    px-6 py-4 whitespace-nowrap border border-gray-200
`;

async function acceptUserByID(email){
    console.log("acceptUserByID Called", {email})
    try{
        const body = JSON.stringify(email)
        console.log("requesting put", body)
        const apiRes = await fetch('/api/accept_user_by_id',
            {
                method: "PUT",
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body: body
            });
        const data = await apiRes.json()
        console.log("ACCEPT USER BY ID outside returns", data)
    }
    catch(error) {
        console.log("error in updateUserByID", error)
    }
}

async function adjustBudget(email, budget){
    console.log("adjustBudget Called", {email})
    try{
        const body = JSON.stringify({"email": email, "budget":budget})
        console.log("requesting put", body)
        const apiRes = await fetch('/api/adjust_budget_by_id',
            {
                method: "PUT",
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body: body
            });
        const data = await apiRes.json()
        console.log("ADJUST BUDGET BY ID outside returns", data)
    }
    catch(error) {
        console.log("error in updateUserByID", error)
    }
}

function CreateUserModal({show, onClose}){
    const { register, handleSubmit, errors, reset } = useForm();

    async function onSubmitForm(values) {
        const data = {
            "email" : values.email,
            "full_name": values.full_name,
            "institution": values.institution,
            "password": values.password,
            "website": values.website
        }

        let config = {
          method: 'post',
          url: 'http://localhost/api/v1/users/open',
          data
        }
        try {
          console.log("config data: ", values)
          const response = await axios(config)
          console.log(response);
          onClose();
        } catch (err) {
          console.error(err);
        }
    }
    return(
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmitForm)} tw="grid grid-cols-12 text-sm text-center font-bold p-6 rounded-lg gap-4 ">
                <div tw="col-span-12 my-3 text-left text-gray-800">
                    <FontAwesomeIcon icon={faUserPlus} size="2x" tw="my-4"/>  
                    <p tw="text-2xl">
                        Create a User
                    </p>
                    <p tw="mt-3 text-sm font-normal">
                        PyGrid utilizes users and roles to appropriately permission data at a higher level. All users with the permission CAN CREATE USERS are allowd to create users in the domain. Create a user by filling out the fields below. 
                    </p>
                </div>
                <div tw="col-span-6 text-left ">
                    <label tw="block my-2" htmlFor="full_name">Full Name<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
                    <input
                    tw="block p-3 border border-gray-300 rounded-lg w-full
                                focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                    name="full_name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="on"
                    {...register("full_name", { required: true, message: 'You must enter a name' })}
                    />
                </div>
                <div tw="col-span-6 text-left">
                    <label tw="block my-2" htmlFor="email">Email<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
                    <input
                    tw="block p-3 border border-gray-300 rounded-lg w-full
                                focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                    name="email"
                    type="email"
                    placeholder="abc@university.edu"
                    autoComplete="on"
                    {...register("email",{required: true})}
                    />
                </div>
                <div tw="col-span-6 block text-left">
                    <label tw="block my-2" htmlFor="pw">Password<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
                    <input
                    tw="block p-3 border border-gray-300 rounded-lg w-full
                                focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                    name="password"
                    type="password"
                    placeholder="Text here"
                    autoComplete="on"
                    {...register("password", { required: true })}
                    />
                </div>
                <div tw="col-span-6 inline-block text-left">
                    <label tw="block my-2" htmlFor="confirmpw">Confirm Password<p tw="pl-1 inline relative bottom-1 text-primary-500">*</p></label>
                    <input
                    tw="block p-3 border border-gray-300 rounded-lg w-full
                                focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                    name="confirmpw"
                    type="password"
                    placeholder="Text here"
                    autoComplete="on"
                    {...register("confirmpw", { required: true })}
                    />
                </div>
                <div tw="col-span-12 block text-left">
                    <label tw="block my-2" htmlFor="website">Role<p tw="pl-1 inline relative bottom-1 text-primary-500">*</p></label>
                    <input
                        tw="block p-3 border border-gray-300 rounded-lg w-full
                                    focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                        name="website"
                        type="text"
                        placeholder="This can help a domain owner vett your application"
                        autoComplete="on"
                        {...register("website", { required: false })}
                    />
                </div>
                <div tw="col-span-5">
                    <label tw="col-span-full block my-2 text-left" htmlFor="website">Set Privacy Budget (PB)<p tw="pl-1 inline text-base italic font-normal text-primary-500 ">(optional)</p></label>
                    <input
                        tw="col-span-3 block p-3 border border-gray-300 rounded-lg w-full
                                    focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                        name="website"
                        type="text"
                        placeholder="This can help a domain owner vett your application"
                        autoComplete="on"
                    />
                </div>
                <div tw="col-span-7 text-justify font-normal font-mono my-2">
                    <p>Allocating Privacy Budget (PB) is an optional setting that allows you to maintain a set standard of privacy while offloading the work of manually approving every data request for a single user. You can think of privacy budget as credits you give to a user to perform computations from. These credits of Epsilon(ɛ) indicate the amount of visibility a user has into any one entity of your data. You can learn more about privacy budgets and how to allocate them at Course.OpenMined.org</p>
                </div>
                <div tw="col-span-full flex justify-between font-bold text-xl">
                    <button tw="bg-white rounded text-primary-500 text-center my-6 px-3 py-2 my-5 border-2 border-primary-500 " onClick={onClose}>Cancel</button>
                    <button tw="bg-primary-500 rounded text-white text-center my-6 px-3 py-2 my-5" type="submit"><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create</button>
                </div>
            </form>
        </Modal>
    )
}

function UserModal ({show, onClose, data}) {
    const [showAdjustBudgetModal, setShowAdjustBudgetModal] = useState(false)
    const [full_name, setFull_name] = useState("")
    const [budget, setBudget] = useState("")
    const [email, setEmail] = useState("");
    const [institution, setInstitution] = useState("");
    const [website, setWebsite] = useState("");
    const [added_by, setAdded_by] = useState("")
    const [daa_pdf, setDaa_pdf] = useState("")
    const [created_at, setCreated_at] = useState("")
    const router = useRouter();

    useEffect(() => {
        setFull_name(data.full_name);
        setBudget(data.budget);
        setEmail(data.email);
        setInstitution(data.institution);
        setWebsite(data.website);
        setAdded_by(data.added_by);
        setDaa_pdf(data.daa_pdf);
        setCreated_at(data.created_at);
    }, [data]);

    useEffect(() => {
    }, [showAdjustBudgetModal]);

    useEffect(() => {
    }, [budget]);

    function handleBudgetInUserModal(value) {
        setBudget(value)
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div tw="h-auto">
                <div tw="flex"><button tw="items-center font-bold space-x-2" onClick={()=>router.push(`/users/${email}`)}><FontAwesomeIcon size="sm" icon={faExpandAlt}/>   Expand Page</button></div>
                <div tw="flex items-center justify-between my-5">
                    <div tw="flex space-x-3 items-center">
                        <h2 tw="font-bold text-4xl text-gray-800">{full_name}</h2>
                        <Tag>Data Scientist</Tag>
                    </div>
                    <Button tw="float-right" tw="space-x-3 text-gray-400"><FontAwesomeIcon size="sm" icon={faTrash}/>  Delete User</Button>
                </div>
                <p tw="">Change Role</p>

                <h3 tw="font-bold mt-10 text-gray-600">Privacy Budget</h3>
                <div tw="flex bg-gray-50 items-center justify-between border border-gray-100 rounded p-4 space-x-3">
                    <div>
                        <p tw="text-error-400 font-bold">{budget} ɛ</p>
                        <p>Current Balance</p>
                    </div>
                    <div>
                        <p tw="text-gray-800 font-bold">{budget} ɛ</p>
                        <p>Allocated Budget</p>
                    </div>
                    <Button variant={"primary"} onClick={() => setShowAdjustBudgetModal(true)} isSmall isHollow>Adjust Budget</Button>
                    <AdjustBudgetModal show={showAdjustBudgetModal} onClose={() => setShowAdjustBudgetModal(false)}
                                        email={email} data={budget} handleBudgetInUserModal={handleBudgetInUserModal}/>
                </div>
                <h3 tw="font-bold mt-10 text-gray-600">Background</h3>
                <div tw="flex-col border border-gray-100 rounded p-4 space-y-3">
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Email:</p>
                        <p>{email}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Company/Institution:</p>
                        <p>{institution}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Website/profile:</p>
                        <p>{website}</p>
                    </div>
                </div>
                <h3 tw="font-bold mt-10 text-gray-600">System</h3>
                <div tw="flex-col border border-gray-100 rounded p-4 space-y-3">
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Date Added:</p>
                        <p>{added_by}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Data Access Agreement:</p>
                        <p>{daa_pdf}</p>
                    </div>
                    <div tw="flex space-x-3">
                        <p tw="font-bold text-gray-600">Uploaded On:</p>
                        <p>{created_at}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function AdjustBudgetModal({show, onClose, email, data, handleBudgetInUserModal}){
    console.log("adjustbudgetmodal data", data)

    const [balance, setBalance] = useState(0)
    const [budget, setBudget] = useState(0)

    useEffect(()=>{
        setBalance(data);
        setBudget(data);
    }, [data])

    useEffect(()=>{

    }, [balance])

    function incrementBudget(){
        setBudget(prevCount => prevCount + 1)
    }
    function decrementBudget(){
        setBudget(prevCount => prevCount - 1)
    }

    const onUpgrade = ()=> {
        console.log("budget", budget)
        setBalance(budget);
        console.log("balance", balance)
        adjustBudget(email, budget)
        handleBudgetInUserModal(budget);
        onClose();
        console.log("onUpgrade", email, balance, budget)
    }

    return(
        <Modal show={show} onClose={onClose}>
            <div tw="grid grid-cols-12 text-left p-6 rounded-lg gap-4">
                <div tw="col-span-full flex-col items-center">
                    <h2 tw="font-bold text-4xl my-6 text-gray-800">∑</h2>
                    <h2 tw="font-bold text-4xl my-6 text-gray-800">Upgrade Budget</h2>
                </div>
                <p tw="col-span-full text-justify my-6">Allocating Privacy Budget (PB) is an optional setting that allows you to maintain a set standard of privacy while offloading the work of manually approving every data request for a single user. You can think of privacy budget as credits you give to a user to perform computations from. These credits of  Epsilon(ɛ) indicate the amount of visibility a user has into any one entity of your data. The more budget the more visibility. By default all users start with 0ɛ and must have their data requests approved manually until upgraded. You can learn more about privacy budgets and how to allocate them at Course.OpenMined.org</p>

                <h3 tw="col-span-full font-bold mt-3 text-gray-600">Adjust Privacy Budget</h3>
                <div tw="col-span-full flex bg-gray-50 items-center justify-between border border-gray-100 rounded p-4 space-x-3 my-6">
                    <div>
                        <p tw="text-error-400 font-bold">{balance} ɛ</p>
                        <p>Current Balance</p>
                    </div>
                    <div>
                        <p tw="text-gray-800 font-bold">{budget} ɛ</p>
                        <p>Allocated Budget</p>
                    </div>
                    <div tw="flex border border-gray-200 rounded justify-between">
                        <Button tw='bg-gray-200 text-white' isSmall onClick={decrementBudget}>-</Button>
                        <p tw="px-8 py-2 text-center text-lg">{budget}</p>
                        <Button tw='bg-gray-200 text-white' isSmall onClick={incrementBudget}>+</Button>
                    </div>
                </div>
                <div tw="col-span-full flex justify-between">
                    <Button variant={"primary"} isHollow onClick={onClose}>Cancel</Button>
                    <Button variant={"primary"} onClick={onUpgrade}>Upgrade</Button>
                </div>
            </div>
        </Modal>
    )
}

/*
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

 */

export default function Active(){
    const [userlist, setUserlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userData, setUserData] = useState(
        {
            "email": "",
            "full_name": "",
            "id": 0,
            "institution": "",
            "website": "",
            "status": "",
            "role": null,
            "budget": 0,
            "created_at": "",
            "added_by": "",
            "daa_pdf": ""
        });

    useEffect(() => {
        fetchUserlist()
    }, [showUserModal])

    const fetchUserlist = async () => {
        try{
            setLoading(true);
            const apiRes = await fetch(
                '/api/accepted_userlist',
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                }
            );
            const data = await apiRes.json();
            console.log("userlist from backend", {data})
            setUserlist(data);
        }
        finally {
            setLoading(false);
        }
    }

    async function getUser(email) {
        const body =JSON.stringify({
            email,
        })
        try{
            const apiRes = await fetch(
                "api/get_user_by_id",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body
                }
            );

            if(apiRes.status == 200){
                const data = await apiRes.json();
                setUserData(data)
                console.log("userData: ", userData)
            }
            else{
                alert("Couldn't fetch the user!");
            }
        }
        catch (error){
            console.log(error);
        }
    }


    const usersData = useMemo(() => [...userlist], [userlist]);
    const usersColumns = useMemo(
        () => 
            userlist[0] 
                ? Object.keys(userlist[0])
                    .map((key) => {
                        return { Header: key, accessor: key };
                    })
            : [], 
        [userlist]
    );
    
    const tableHooks = (hooks) => {
        const router = useRouter()

        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "Edit", 
                Header: 'Edit',
                Cell: ({ row }) => (
                    <Button variant={'primary'} onClick={() => {
                        getUser(row.values.email);
                        setShowUserModal(true);
                    }}>Edit</Button>
                )
            },
            {
                id: "Delete", 
                Header: 'Delete',
                Cell: ({ row }) => (
                    <Button variant={'error'} onClick={() => alert('route to deleting: '+row.values.email)}>Delete</Button>
                )
            }
        ])
    }
    const tableInstance = useTable({ columns: usersColumns, data: usersData}, useGlobalFilter, tableHooks, useSortBy);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, preGlobalFilteredRows, setGlobalFilter,  state} = tableInstance;

    useEffect(() => {
        fetchUserlist();
    }, [])

    const isEven = (idx) => idx % 2 === 0;

    return(
        <div tw="flex-col justify-center">
            <div tw="flex justify-between">
                <div tw="inline-flex my-6 space-x-4">
                    <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} setGlobalFilter={setGlobalFilter} globalFilter={state.globalFilter}/>
                </div>
                <button tw="bg-gray-800 rounded text-primary-200 text-center my-6 px-3 py-2 font-bold" onClick={() => setShowCreateUserModal(true)}><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create User</button>
            </div>
            <CreateUserModal show={showCreateUserModal} onClose={()=>setShowCreateUserModal(false)}/>
            <UserModal show={showUserModal} onClose={()=>setShowUserModal(false)} data={userData} />
            <div tw="flex w-auto">
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => ( 
                                    <TableHeader {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        { column.render("Header")}
                                        { column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row, idx) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell,idx) => (
                                    <TableData {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </TableData>
                                ))}
                                </TableRow>)
                        })}

                    </TableBody>
                </Table> 
            </div>
        </div>
    )
}