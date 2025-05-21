import { useState, useEffect } from "react";
import { Group, User } from "../../types/Group";
import "./groupModal.css";
import { groupAdmin, groupListOfUsers, isAdmin, removeFromGroup, removeGroup } from "./groups";

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
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  useEffect(() => {
    if (isOpen && group) {
      setIsLoading(true);
      
      // Charger les utilisateurs du groupe
      const fetchUsers = async () => {
        try {
          const [usersData, adminData, adminStatus]: [User[], User | null, boolean] = await Promise.all([
            groupListOfUsers(group.id),
            groupAdmin(group.id),
            isAdmin(userToken, group.id)
          ]);
          
          setUsers(usersData);
          setAdmin(adminData);
          setIsCurrentUserAdmin(adminStatus);
          console.log("isAdmin", adminStatus);
          console.log("Liste des utilisateurs du groupe:", usersData);
        } catch (error) {
          console.error("Erreur lors du chargement des données du groupe:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    }
  }, [group, isOpen, userToken]);

    const handleRemoveUser = async (userId: string) => {
    if (!isCurrentUserAdmin) return;
    
    try {
      const success = await removeFromGroup(userId, group.id, userToken);
      if (success) {
        // Mise à jour locale de la liste des utilisateurs
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  const handleRemoveGroup = async (groupId: number) => {
    if (!isCurrentUserAdmin) return;

    try {
      const success = await removeGroup(group.id, userToken);
      if (success) {
        console.log("Groupe supprimé:", groupId);
        onClose(); // Fermer la modale après la suppression
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error);
    }
  };


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
                  <li key={user.id}>
                    {user.pseudo}
                    {isCurrentUserAdmin && user.id !== admin?.id && (
                      <span 
                        className="remove-user" 
                        onClick={() => handleRemoveUser(user.id)}
                        title="Supprimer cet utilisateur du groupe"
                      >
                        ×
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun membre dans ce groupe</p>
            )}
          </div>
          <div className="group-remove">
            {isCurrentUserAdmin && (
              <button className="remove-group-button" onClick={() => handleRemoveGroup(group.id)}>
                Supprimer le groupe
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;