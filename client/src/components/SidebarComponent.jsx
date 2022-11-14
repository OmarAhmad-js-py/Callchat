/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
import YoutubeComponent from '../components/YoutubeComponent.jsx';
import { faComments, faHome, faUser, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

function SidebarComponent(props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [ytOpen, SetYtOpen] = useState(false);
    const items = [
        { title: "Home", src: faHome },
        { title: "Chat", src: faComments, onClick: () => SetYtOpen(!ytOpen) },
        { title: "Profile", src: faUser },
    ]
    const MenuItems = items.map((item, i) =>
    (<li
        key={i}
        onClick={item.onClick}
        className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4 gap-y-4 
                ${item.gap ? "mt-10" : "mt-9"}`}
    >
        <FontAwesomeIcon icon={item.src} />
        <span className={`${!open && "hidden"} origin-left duration-200`}>
            {item.title}
        </span>
    </li>
    ))


    return (<>
        <div className="menu-overlay transition-all duration-500  " onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} >
            <div className={`${open ? "w-63 sm:w-8" : "w-20"} bg-primary-800 h-screen p-5 pt-8 `}>
                <div className="flex gap-x-1 items-center">
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
        <YoutubeComponent open={ytOpen} />
    </>)
}

export default SidebarComponent