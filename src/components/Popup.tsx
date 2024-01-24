"use client";

import React, { MutableRefObject, useRef } from "react";

export default function Popup( {children, popupRef} : {children: React.ReactNode, popupRef: MutableRefObject<HTMLDivElement | null>} ){
    const closePopup = () => {
        if(popupRef.current) popupRef.current!.classList.remove("visible");
    }
    
    return ( 
        <div className="popup" ref={popupRef}>
            <div className="popup-content">
                <button className="popup-close" aria-label="Close popup" onClick={closePopup} tabIndex={0}></button>
                {children}
            </div>
            <div className="popup-background" onClick={closePopup}></div>
        </div>
    )
}