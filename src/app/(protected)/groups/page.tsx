"use client";

import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { Group } from "../../types/Group";
import "./groups.css";
import dynamic from "next/dynamic";
import { createNewGroup, loadMyGroups } from "./groups";

function Groups() {
  const user = useAuthenticatedUser();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [myGroups, setMyGroups] = useState<Group[]>([]);

  useEffect(() => {
    const allGroupsPromise = loadMyGroups(user.token);
    allGroupsPromise.then((groups) => {
      if (groups !== null) {
        console.log("Groups", groups);
        setMyGroups(groups);
      }
    });
  }, [myGroups, user.token]);

  const handleNewGroupCreation = () => {
    // Ici, vous pouvez ajouter la logique pour créer un nouveau groupe
    console.log("Groupe créé");
    console.log("Nom du groupe:", newGroupName);
    console.log("Description du groupe:", newGroupDescription);
    const newGroupIdPromise = createNewGroup(
      newGroupName,
      newGroupDescription,
      user.token
    );
    newGroupIdPromise.then((newGroupId) => {
      setMyGroups((prevGroups) => [
        ...(prevGroups || []),
        {
          id: newGroupId,
          name: newGroupName,
          description: newGroupDescription,
        },
      ]);
    });
    // Réinitialiser les champs après la création
    setNewGroupName("");
    setNewGroupDescription("");
  };

  return (
    <>
      <h1>Groups</h1>
      <div className="groups-container">
        <div className="my-groups-container">
          <h2> Mes groupes </h2>
          {myGroups === null ? (
            <p>Vous n&apos;avez pas de groupe</p>
          ) : (
            myGroups?.map((group, index) => (
              <li key={index}>
                {group.name} - {group.description}
              </li>
            ))
          )}
        </div>
        <div className="group-join-container">
          <h2>Rejoindre un groupe</h2>
          <label> UUID du groupe à rejoindre : </label>
          <input type="text" placeholder="UUID" />
          <button>Rejoindre</button>
        </div>
        <div className="create-group-container">
          <h2>Créer un groupe</h2>
          <label> Nom du groupe : </label>
          <br />
          <input
            type="text"
            placeholder="Nom"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <br />
          <label> Description du groupe : </label>
          <br />
          <textarea
            value={newGroupDescription}
            placeholder="Description"
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
          <br />
          <button onClick={handleNewGroupCreation}>Créer</button>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Groups), {
  ssr: false,
});
