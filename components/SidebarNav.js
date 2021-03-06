import tw from 'twin.macro'
import {faUsers, faCheck, faLemon, faHandsHelping, faChevronDown, faUserCircle, faThLarge} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {logout} from '../lib/auth'
import DomainConnectionStatus from '../components/DomainConnectionStatus'
import useSWR from 'swr'
import Avatar from './Avatar'
import axios from "axios";
import {useEffect, useState} from "react";

const SidebarNav = (props) => {
    const [domainName, setDomainName] = useState("");
    const [id, setId] = useState("");

    useEffect (() => {
        getMetaData();
    }, [])

    async function getMetaData(){
        try{
            const apiRes = await axios({
                method: 'GET',
                url: `api/utils/domain-metadata`,
                headers: {
                    "Accept": "application/json"
                },
            });

            if(apiRes.status === 200){
                const data = await apiRes.data;
                setDomainName(data.name);
                setId(data.id);
            }
            else{
                alert("Couldn't fetch the metadata!")
            }

        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div tw="sticky flex flex-col justify-between h-screen top-0 bg-gradient-to-r from-black to-gray-900 min-w-max max-w-xs text-gray-200 w-96">
            <header tw="py-10 border-b border-gray-600">
                <Avatar name={domainName} domainid={id}/>
            </header>
            <div>
                <nav tw="text-lg mb-auto">
                    <div tw="cursor-pointer">
                        {/* <Link href="/dashboard">
                            <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
                                <div tw="p-2">
                                    <FontAwesomeIcon size="sm" icon={faThLarge} />
                                </div>
                                <a>Dashboard</a>
                            </div>
                        </Link> */}
                        <Link href="/users">
                            <div
                                css={[tw`flex items-center space-x-3 px-3 py-4 hover:bg-gray-500`,
                                    (props.current=="users") && tw`bg-gray-800`]}>
                                <div tw="p-2">
                                    <FontAwesomeIcon size="sm" icon={faUsers} />
                                </div>
                                <a>Users</a>
                            </div>
                        </Link>
                        <Link href="/permissions">
                            <div
                                css={[tw`flex items-center space-x-3 px-3 py-4 hover:bg-gray-500`,
                                    (props.current=="permissions") && tw`bg-gray-800`]}>
                                <div tw="p-2">
                                    <FontAwesomeIcon size="sm" icon={faCheck} />
                                </div>
                                <a>Permissions</a>
                            </div>
                        </Link>
                        <div
                            css={[tw``,
                                (props.current=="data requests" || props.current=="upgrade requests") && tw`pb-2 bg-gray-800`]}>
                            <Link href="/data-requests">
                                <div
                                    css={[tw`flex items-center space-x-3 px-3 py-4 hover:bg-gray-500`]}>
                                    <div tw="p-2 font-bold">
                                        ∑
                                    </div>
                                    <a>Requests</a>
                                </div>
                            </Link>
                            <Link href="/data-requests" css={[tw`invisible`,
                                (props.current=="data requests" || props.current=="upgrade requests") && tw`visible`]}>
                                <div
                                    css={[tw`h-0 flex items-center text-sm hover:bg-gray-500 invisible`,
                                        (props.current=="data requests") && tw`bg-gray-700`,
                                        (props.current=="data requests" || props.current=="upgrade requests") && tw`h-full space-x-3 px-3 py-2 pl-14 visible`]}>
                                    <a>Data Requests</a>
                                </div>
                            </Link>
                            <Link href="/upgrade-requests" css={[tw`invisible`,
                                (props.current=="data requests" || props.current=="upgrade requests") && tw`visible`]}>
                                <div
                                    css={[tw`h-0 flex items-center text-sm hover:bg-gray-500 invisible`,
                                        (props.current=="upgrade requests") && tw`bg-gray-700`,
                                        (props.current=="data requests" || props.current=="upgrade requests") && tw`h-full space-x-3 px-3 py-2 pl-14 visible`]}>
                                    <a>Upgrade Requests</a>
                                </div>
                            </Link>
                        </div>
                        <Link href="/networks">
                            <div
                                css={[tw`flex items-center space-x-3 px-3 py-4 hover:bg-gray-500`,
                                    (props.current=="networks") && tw`bg-gray-800`]}>
                                <div tw="p-2">
                                    <FontAwesomeIcon size="sm" icon={faHandsHelping} />
                                </div>
                                <a>Networks</a>
                            </div>
                        </Link>
                    </div>
                </nav>
            </div>
            <footer tw="py-10 text-lg border-t border-gray-600">
                <div tw="px-3">
                    <DomainConnectionStatus/>
                </div>
                <CurrentUser/>
            </footer>
        </div>
    )
}
// const SidebarNav = () => {
//     return (
//         <aside tw="flex flex-col justify-between h-screen sticky top-0 bg-gradient-to-r from-black to-gray-800 text-gray-200 py-6 min-w-min max-w-xs">
//             {/* <DomainInfo tw="p-6" />
//             <div tw="">hgallo</div> */}
//             <Avatar tw="flex" name={"Canada Domain"} domainid={"ID: 5724741532"}/>
//             <div tw="my-10"></div>
            // <nav tw="text-lg mb-auto">
            //     <ul tw="">
            //         {/* <Link href="/dashboard">
            //             <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
            //                 <div tw="p-2">
            //                     <FontAwesomeIcon size="sm" icon={faThLarge} />
            //                 </div>
            //                 <a>Dashboard</a>
            //             </div>
            //         </Link> */}
            //         <Link href="/users">
            //             <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
            //                 <div tw="p-2">
            //                     <FontAwesomeIcon size="sm" icon={faUsers} />
            //                 </div>
            //                 <a>Users</a>
            //             </div>
            //         </Link>
            //         <Link href="/permissions">
            //             <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
            //                 <div tw="p-2">
            //                     <FontAwesomeIcon size="sm" icon={faCheck} />
            //                 </div>
            //                 <a>Permissions</a>
            //             </div>
            //         </Link>
            //         <Link href="/requests">
            //             <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
            //                 <div tw="p-2">
            //                     <FontAwesomeIcon size="sm" icon={faLemon} />
            //                 </div>
            //                 <a>DataRequests</a>
            //             </div>
            //         </Link>
            //         <Link href="/networks">
            //             <div tw="flex items-center space-x-3 px-3 py-4 hover:bg-gray-500">
            //                 <div tw="p-2">
            //                     <FontAwesomeIcon size="sm" icon={faHandsHelping} />
            //                 </div>
            //                 <a>Networks</a>
            //             </div>
            //         </Link>
            //     </ul>
            // </nav>
            // <footer tw="text-lg">
            //     <div tw="px-3">
            //         <DomainConnectionStatus/>
            //     </div>
            //     <CurrentUser/>
            // </footer>
//         </aside>
//     )
// }

function CurrentUser() {
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error } = useSWR('/api/user-profile', fetcher)
    if (error) return <div>failed to load user</div>
    if (!data) return <div>loading...</div>
  
    return (
        <Link href="/account-settings">
            <div tw="flex items-center space-x-3 px-6 py-5 hover:bg-gray-500">
                <div>
                    <FontAwesomeIcon icon={faUserCircle} size="sm" />
                </div>
                <p>{data.full_name}</p>
            </div>
        </Link>
    )
}

function DomainInfo(){
    return (
        <header>
            <div tw="flex items-center space-x-2 my-6 mx-4">
                <img src="/avatar.jpg" tw="w-20 h-20 rounded-full" alt="Canada Domain"/>
                <div id="content" tw="relative w-auto truncate">
                    <p tw="relative text-xl font-bold truncate">Canada Domain</p>
                    <p tw="relative text-lg truncate">ID: 5724724357124372437</p>
                    <button tw="text-left" onClick={logout}>
                        <p size="sm" tw="lowercase bg-transparent hover:text-white underline">
                            {('logout')}
                        </p>
                    </button>
                </div>
                <div tw="static top-0">
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>
            </div>
        </header>   
    )
}
export {SidebarNav}

