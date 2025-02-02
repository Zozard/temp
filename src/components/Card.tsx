import React, { ReactNode } from "react";
import "./Card.css";

interface Card {
    date: ReactNode;
    title: ReactNode;
    children: ReactNode;
  }

const Card: React.FC <Card> = (props) => {
  return ( 
  <div className="card card-content"> 
    <div className="card-title">{props.title}</div>
    <div className="card-bottom">{props.date}</div>
  </div>
)
}

export default Card;
