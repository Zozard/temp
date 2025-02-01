"use client";

import Navbar from "@/components/Navbar";
import { saveFriendCode, loadFriendCode } from "./savefriendcode";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [friendCode, setFriendCode] = useState("");

  useEffect(() => {
    const friendCodePromise = loadFriendCode("g.zozine@gmail.com");
    friendCodePromise.then((x) => {
      if (x !== null) {
        setFriendCode(x);
      }
    });
  }, []);

  
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <h1>Profile</h1>
      {/* Contenu de la page profil */}
      <label>Mon code ami</label>
      <input
        type="text"
        name="friendcode"
        value={friendCode}
        onChange={(event) => setFriendCode(event.target.value)}
      />
      <button onClick={() => saveFriendCode("g.zozine@gmail.com", friendCode)}>Save</button>
    </div>
  );
}
