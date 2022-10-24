/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
function SidebarComponent(props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [ERun, setERun] = useState(true);
    const itemes = props.items
    const MenuItems = itemes.map((Menu, index) => (
        <li
            key={index}
            onClick={() => interact(Menu, index)}
            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4 gap-y-4 
                ${Menu.gap ? "mt-10" : "mt-9"}`}
        >
            <FontAwesomeIcon icon={Menu.src} />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
            </span>
        </li>
    ))

    function interact(menu, type) {
        console.log(menu, type)
    }



    return (<>
        <div className="menu-overlay" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <div className={`${open ? "w-63" : "w-20 "} bg-primary-800 h-screen p-5  pt-8  duration-700`}>

                <div className="flex gap-x-1 items-center ">
                    <img src="../src/assets/logo.png" className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
                    <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
                        Designer
                    </h1>
                </div>
                <ul className="pt-6">
                    {MenuItems}
                </ul>
            </div>

        </div>
    </>
    )


}

export default SidebarComponent