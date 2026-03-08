import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import {
  type EmergencyContact,
  listEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../../action/DesastresEmergenciasPocket";

interface EmergencyContactsTableProps {
  planId: string;
  token: string;
  contacts: EmergencyContact[];
  setContacts: (contacts: EmergencyContact[]) => void;
}

const EmergencyContactsTable: React.FC<EmergencyContactsTableProps> = ({
  planId,
  token,
  contacts,
  setContacts,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    disaster_plan_id: planId,
    nombre: "",
    cargo: "",
    telefono: "",
    email: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load contacts when planId changes
  useEffect(() => {
    if (planId && token) {
      loadContacts();
    }
  }, [planId, token]);

  const loadContacts = async () => {
    if (!planId || !token) return;
    
    const response = await listEmergencyContacts(token, planId);
    if (response.success && response.data) {
      setContacts(response.data);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewContact({
      disaster_plan_id: planId,
      nombre: "",
      cargo: "",
      telefono: "",
      email: "",
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewContact({
      disaster_plan_id: planId,
      nombre: "",
      cargo: "",
      telefono: "",
      email: "",
    });
  };

  const handleSaveNew = async () => {
    if (!newContact.nombre || !newContact.telefono) {
      alert("Nombre y teléfono son obligatorios");
      return;
    }

    if (planId && token) {
      // Save to backend
      const response = await createEmergencyContact(token, {
        ...newContact,
        disaster_plan_id: planId,
      });
      
      if (response.success && response.data) {
        setContacts([...contacts, response.data]);
        handleCancelNew();
      } else {
        alert("Error al crear contacto: " + (response.message || "Error desconocido"));
      }
    } else {
      // Save locally (for new plans not yet created)
      const tempContact = { ...newContact, id: `temp_${Date.now()}` };
      setContacts([...contacts, tempContact]);
      handleCancelNew();
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleSaveEdit = async (index: number) => {
    const contact = contacts[index];
    
    if (!contact.nombre || !contact.telefono) {
      alert("Nombre y teléfono son obligatorios");
      return;
    }

    if (contact.id && !contact.id.startsWith("temp_") && token) {
      // Update in backend
      const response = await updateEmergencyContact(token, contact.id, contact);
      
      if (response.success) {
        setEditingIndex(null);
        loadContacts();
      } else {
        alert("Error al actualizar contacto: " + (response.message || "Error desconocido"));
      }
    } else {
      // Update locally
      setEditingIndex(null);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("¿Eliminar este contacto?")) return;
    
    const contact = contacts[index];
    
    if (contact.id && !contact.id.startsWith("temp_") && token) {
      // Delete from backend
      const response = await deleteEmergencyContact(token, contact.id);
      
      if (response.success) {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
      } else {
        alert("Error al eliminar contacto: " + (response.message || "Error desconocido"));
      }
    } else {
      // Delete locally
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);
    }
  };

  const handleFieldChange = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };

  const handleNewContactChange = (field: keyof EmergencyContact, value: string) => {
    setNewContact({ ...newContact, [field]: value });
  };

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Cargo</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 && !isAddingNew && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay contactos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            
            {contacts.map((contact, index) => (
              <TableRow key={contact.id || index}>
                {editingIndex === index ? (
                  <>
                    <TableCell>
                      <TextField
                        size="small"
                        value={contact.nombre}
                        onChange={(e) => handleFieldChange(index, "nombre", e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={contact.cargo}
                        onChange={(e) => handleFieldChange(index, "cargo", e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={contact.telefono}
                        onChange={(e) => handleFieldChange(index, "telefono", e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={contact.email || ""}
                        onChange={(e) => handleFieldChange(index, "email", e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleSaveEdit(index)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleCancelEdit}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{contact.nombre}</TableCell>
                    <TableCell>{contact.cargo}</TableCell>
                    <TableCell>{contact.telefono}</TableCell>
                    <TableCell>{contact.email || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            
            {isAddingNew && (
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Nombre *"
                    value={newContact.nombre}
                    onChange={(e) => handleNewContactChange("nombre", e.target.value)}
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Cargo *"
                    value={newContact.cargo}
                    onChange={(e) => handleNewContactChange("cargo", e.target.value)}
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Teléfono *"
                    value={newContact.telefono}
                    onChange={(e) => handleNewContactChange("telefono", e.target.value)}
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Email"
                    value={newContact.email || ""}
                    onChange={(e) => handleNewContactChange("email", e.target.value)}
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={handleSaveNew}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleCancelNew}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {!isAddingNew && (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ mt: 2 }}
          variant="outlined"
          size="small"
        >
          Agregar Contacto
        </Button>
      )}
    </Box>
  );
};

export default EmergencyContactsTable;
