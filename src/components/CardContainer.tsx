// CardContainer.jsx
import React, { ReactNode } from "react";
import "./CardContainer.css";

interface CardContainerProps {
    title: string;
    children: ReactNode;
  }

const CardContainer: React.FC<CardContainerProps> = ({ title, children }) => {
  return (
    <div className="card-container" >
        <div className ="card-container-title">
            <h2>{title}</h2>
        </div>  
        {children}
    </div>
  );
};

export default CardContainer;