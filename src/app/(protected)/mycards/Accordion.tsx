"use client";

import "./Accordion.css"

import { ReactNode, useState } from "react";

type AccordionProps = {
  header: ReactNode;
  initialState: "open" | "closed";
  children: ReactNode;
};



export function Accordion(props: AccordionProps) {
  
    const [isOpen, setIsOpen] = useState(props.initialState === "open");

    function toggleDisplayContent(){
        setIsOpen(!isOpen);
    }
    
    return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleDisplayContent}>{props.header}</div>
      <div className={`accordion-content ${isOpen ? 'open' : 'hidden'}`}>{props.children}</div>     
    </div>
  );
}
