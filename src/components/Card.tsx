import React, { ReactNode } from "react";
import "./Card.css";

interface Card {
    date: ReactNode;
    title: ReactNode;
    owner: string;
    children?: React.ReactNode; // <- "?" le rend optionnel
  }

const Card: React.FC <Card> = (props) => {
  return ( 
  <div className="card card-content"> 
    <div className="card-title">{props.title}</div>
    <div className="card-bottom">{props.owner}</div>
    <div className="card-bottom">{props.date}</div>
  </div>
)
}

export default Card;
