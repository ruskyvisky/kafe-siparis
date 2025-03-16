"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCoffee,
  faUtensils,
  faChair,
  faChartLine,
  faMoneyBill,
  faUsers,
  faCalendarCheck,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path:string) => pathname.includes(path);

  return (
    <nav className="md:fixed md:top-0 md:bottom-0 shadow-xl bg-white md:w-64 z-10 py-4 px-6 flex flex-col">
      {/* Toggler */}
      <button
        className="md:hidden text-black opacity-50 px-3 py-1 text-xl"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>

      <div className={`${isCollapsed ? "block" : "hidden"} md:block md:flex md:flex-col`}>
      <ul className="mt-4">
        <li>
          <Link legacyBehavior href="/">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname === "/" ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faHouse} className={`mr-2 text-sm ${pathname === "/" ? "opacity-75" : "text-blueGray-300"}`} /> 
              Dashboard
            </a>
          </Link>
        </li>
      </ul>

      {/* Kafe İşlemleri */}
      <h6 className="mt-6 text-gray-500 text-xs uppercase font-bold">Kafe İşlemleri</h6>
      <ul>
        <li>
          <Link legacyBehavior href="/category">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/category") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faList} className={`mr-2 text-sm ${pathname.indexOf("/category") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Kategori İşlemleri
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/menu">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/menu") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faUtensils} className={`mr-2 text-sm ${pathname.indexOf("/menu") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Menü İşlemleri
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/tables">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/tables") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faChair} className={`mr-2 text-sm ${pathname.indexOf("/tables") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Masa İşlemleri
            </a>
          </Link>
        </li>
      </ul>

 {/* Muhasebe İşlemleri */}
 <h6 className="mt-6 text-gray-500 text-xs uppercase font-bold">Muhasebe İşlemleri</h6>
      <ul>
        <li>
          <Link legacyBehavior href="/statistics">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/statistics") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faChartLine} className={`mr-2 text-sm ${pathname.indexOf("/statistics") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Aylık İstatistikler
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/revenue">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/revenue") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faMoneyBill} className={`mr-2 text-sm ${pathname.indexOf("/revenue") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Aylık Gelir-Gider Durumu
            </a>
          </Link>
        </li>
      </ul>

        {/* Personel İşlemleri */}
        <h6 className="mt-6 text-gray-500 text-xs uppercase font-bold">Personel İşlemleri</h6>
        <ul>
        <li>
          <Link legacyBehavior href="/staff-list">
            <a className={`text-xs uppercase py-3 font-bold block ${pathname.indexOf("/staff-list") !== -1 ? "text-lightBlue-500 hover:text-lightBlue-600" : "text-blueGray-700 hover:text-blueGray-500"}`}>
              <FontAwesomeIcon icon={faUsers} className={`mr-2 text-sm ${pathname.indexOf("/staff-list") !== -1 ? "opacity-75" : "text-blueGray-300"}`} /> 
              Personel Listesi
            </a>
          </Link>
        </li>
          <li>
          <Link legacyBehavior href="/staff-plan">
        <a
                 className={
                  "text-xs uppercase py-3 font-bold block " +
                  (pathname.indexOf("/staff-plan") !== -1
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-700 hover:text-blueGray-500")
                }
        
        >
          <FontAwesomeIcon
            icon={faCalendarCheck}
            className={
              "mr-2 text-sm " +
              (pathname === "/staff-plan" ? "opacity-75" : "text-blueGray-300")
            }
          />
          Haftalık Plan Hazırla
        </a>
      </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;