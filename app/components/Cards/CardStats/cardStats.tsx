import React from 'react'

const cardStats = ({ statSubtitle,statTitle, statPercentColor , statArrow ,statPercent, statDescription }: 
    { statSubtitle: string , statTitle: string,  statPercentColor: string , statArrow: string , statPercent: string, statDescription: string }) => {
  return (
    <>
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6  xl:mb-0 shadow-lg">
    <div className="flex-auto p-4">
      <div className="flex flex-wrap">
        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
          <h5 className="text-blueGray-400 uppercase font-bold text-xs">
            {statSubtitle}
          </h5>
          <span className="font-semibold text-xl text-blueGray-700">
            {statTitle}
          </span>
        </div>
     
      </div>
      <p className="text-sm text-blueGray-400 mt-4">
        <span className={statPercentColor + " mr-2"}>
          <i
            className={
              statArrow === "up"
                ? "fas fa-arrow-up"
                : statArrow === "down"
                ? "fas fa-arrow-down"
                : ""
            }
          ></i>{" "}
          {statPercent}%
        </span>
        <span className="whitespace-nowrap">{statDescription}</span>
      </p>
    </div>
  </div>
</>
  )
}

export default cardStats