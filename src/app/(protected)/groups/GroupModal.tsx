import { useState, useEffect } from "react";
import { Group, User } from "../../types/Group";
import "./groupModal.css";
import { groupAdmin, groupListOfUsers } from "./groups";

interface GroupModalProps {
  group: Group;
  onClose: () => void;
  isOpen: boolean;
  userToken: string;
}

const GroupModal = ({ group, onClose, isOpen, userToken }: GroupModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && group) {
      setIsLoading(true);
      
      // Charger les utilisateurs du groupe
      const fetchUsers = async () => {
        try {
          const [usersData, adminData] = await Promise.all([
            groupListOfUsers(group.id),
            groupAdmin(group.id)
          ]);
          
          setUsers(usersData);
          setAdmin(adminData);
        } catch (error) {
          console.error("Erreur lors du chargement des données du groupe:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    }
  }, [group, isOpen, userToken]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{group.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="group-details">
            <h3>Description</h3>
            <p>{group.description}</p>
          </div>

          <div className="group-admin">
            <h3>Administrateur</h3>
            {isLoading ? (
              <p>Chargement...</p>
            ) : admin ? (
              <p>{admin.pseudo}</p>
            ) : (
              <p>Aucun administrateur trouvé</p>
            )}
          </div>

          <div className="group-members">
            <h3>Membres ({users.length})</h3>
            {isLoading ? (
              <p>Chargement...</p>
            ) : users.length > 0 ? (
              <ul>
                {users.map(user => (
                  <li key={user.id}>{user.pseudo}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun membre dans ce groupe</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;