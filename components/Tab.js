import { useState } from 'react';
import tw, {styled} from 'twin.macro';
import { Table } from './Table';
import { Table2 } from './Table2';
import Modal from '../components/Modal';
import {faPlus, faUserPlus, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ListBox from './ListBox';

// const styles = {
//     container: ({ hasBg }) => [
//       tw`flex w-full`, // Add base styles first
//       hasBg && tw`bg-black`, // Then add conditional styles
//     ],
//     button: ({ toggleState }) => [
//         tw`p-4 text-center w-1/2 bg-white border`,
//         (toggleState === 1) && tw`bg-primary-300`,
//         (toggleState === 2) && tw`bg-primary-500`,
//         (toggleState === 3) && tw`bg-primary-800`
//     ]
// }
const Button = styled.button(({ state }) => [
    tw`p-4 bg-gray-50 text-center w-1/2 bg-white border-primary-500 border-t-2 border-r-2 border-l-2`,
    (state === 1) && tw`bg-gray-50`,
    (state === 2) && tw`bg-gray-100`,
    (state === 3) && tw`bg-gray-50`
])

const Content = styled.div(({ state }) => [
    tw`bg-gray-300 p-5 w-full h-full hidden`,
    (state === 1) && tw`bg-gray-300 block`,
    (state === 2) && tw`bg-gray-500 block`,
    (state === 3) && tw`bg-gray-800 block`

])
function Pending(){
    return (
        <>
            <div tw="col-span-11 mt-10 mb-10 col-span-11 mt-10 mb-10 flex items-center space-x-3 px-3 py-2 bg-primary-100 border-t-4 border-primary-500">
                <FontAwesomeIcon icon={faInfoCircle} size="2x" tw=""/>
                <p tw="text-gray-800 cursor-pointer">Pending users are users who have applied to your domain but who are not yet authorized to perform data requests. You can review their uploaded Data Access Agreements(DAA) below and choose to accept or deny their account applications.</p>
            </div>
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
        </>
    )
}
function Active(){
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div tw="col-span-11 mt-10 mb-10 flex items-center space-x-3 px-3 py-2 bg-primary-100 border-t-4 border-primary-500">
                <FontAwesomeIcon icon={faInfoCircle} size="2x" tw=""/>
                <p tw="text-gray-800 cursor-pointer">Active users are users who you have manually created or users who have had their account applications approved</p>
            </div>
            <div tw="col-span-full">
                <div tw="flex justify-between">
                    <div tw="my-6 space-x-4">
                        <input
                            tw="p-3 border border-gray-300 rounded-lg focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                            name="search"
                            type="text"
                            placeholder="Search"
                        />
                        {/* <input
                            tw="p-3 border border-gray-300 rounded-lg focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                            name="search"
                            type="text"
                            placeholder="Role"
                        /> */}
                        <ListBox/>
                    </div>
                    <button tw="bg-gray-800 rounded text-primary-200 text-center my-6 px-3 py-2 font-bold" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create User</button>
                </div>
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                        <form onSubmit={""} tw="grid grid-cols-12 text-sm text-center font-bold p-6 rounded-lg gap-4 ">
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
                                <label tw="block my-2" htmlFor="fullname">Full Name<p tw="pl-1 inline relative bottom-1 text-primary-500 ">*</p></label>
                                <input
                                tw="block p-3 border border-gray-300 rounded-lg w-full
                                            focus:shadow-active hover:shadow-active active:ring-primary-500 active:text-gray-800"
                                name="full_name"
                                type="text"
                                placeholder="Jane Doe"
                                autoComplete="on"
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
                                />
                            </div>
                            <div tw="col-span-5">
                                <label tw="col-span-full block my-2 text-left" htmlFor="website">Set Privacy Budget (PB)<p tw="pl-1 inline text-xs italic font-normal text-primary-500 ">(optional)</p></label>
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
                                <button tw="bg-white rounded text-primary-500 text-center my-6 px-3 py-2 my-5 border-2 border-primary-500 " type="submit" onClick={() => setShowModal(false)}>Cancel</button>
                                <button tw="bg-primary-500 rounded text-white text-center my-6 px-3 py-2 my-5" type="submit"><FontAwesomeIcon icon={faPlus} tw="mr-3"/>Create</button>
                            </div>
                        </form>
                    </Modal>
                    <Table2></Table2>
            </div>
        </>
    )
}

function ActiveUsers(){

}

export function Tab(){

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        console.log(index);
        console.log(toggleState)
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
                    Active Users (3)
                </h3>
                </button>
                <button
                    css={[tw`p-4 bg-white text-center w-1/2 bg-white border-b-2 border-primary-500 `,
                    (toggleState === 2) && tw`border-primary-500 border-b-0 border-t-2 border-r-2 border-l-2 rounded-t-md`]}
                    onClick={() => toggleTab(2)}
                >
                <h3 css={[tw`text-center font-bold text-gray-600`, (toggleState === 2) && tw`text-primary-500`]}>
                    Pending Users (3)
                </h3>
                </button>
                <button
                    css={[tw`p-4 bg-white text-center w-1/2 bg-white border-b-2 border-primary-500 `,
                    (toggleState === 3) && tw`border-primary-500 border-b-0 border-t-2 border-r-2 border-l-2 rounded-t-md`]}
                    onClick={() => toggleTab(3)}
                >
                <h3 css={[tw`text-center font-bold text-gray-600`, (toggleState === 3) && tw`text-primary-500`]}>
                    Denied Users (0)
                </h3>
                </button>
            </div>


            <div tw="">
                <div 
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 1) && tw`bg-white block`,]}
                >   
                    <Active></Active>
                    <h2>Content 1</h2>
                    <hr />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
                        praesentium incidunt quia aspernatur quasi quidem facilis quo nihil
                        vel voluptatum?
                    </p>
                    {/* <Table2/> */}
                </div>

                <div
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 2) && tw`bg-white block`,]}
                >
                    <Pending/>
                    <h2>Content 2</h2>
                    <hr />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                        voluptatum qui adipisci.
                    </p>
                    {/* <Table/> */}
                </div>

                <div
                    css={[tw`bg-white p-5 w-full h-full hidden`,
                    (toggleState === 3) && tw`bg-white block`,]}
                >
                    <h2>Content 3</h2>
                    <hr />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sed
                        nostrum rerum laudantium totam unde adipisci incidunt modi alias!
                        Accusamus in quia odit aspernatur provident et ad vel distinctio
                        recusandae totam quidem repudiandae omnis veritatis nostrum
                        laboriosam architecto optio rem, dignissimos voluptatum beatae
                        aperiam voluptatem atque. Beatae rerum dolores sunt.
                    </p>
                    {/* <Table2/> */}
                </div>

            </div>
        </div>
    )
}