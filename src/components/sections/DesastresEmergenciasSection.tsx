import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type DisasterEmergencyPlan,
  type EmergencyContact,
  listDisasterPlans,
  getDisasterPlanById,
  createDisasterPlan,
  updateDisasterPlan,
  deleteDisasterPlan,
  uploadDisasterDocument,
} from "../../action/DesastresEmergenciasPocket";
import { buttonStyles } from "./buttonStyles";
import EmergencyContactsTable from "./EmergencyContactsTable";

const DesastresEmergenciasSection = () => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [plans, setPlans] = useState<DisasterEmergencyPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DisasterEmergencyPlan | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>("section1");
  
  // Form state
  const [formData, setFormData] = useState<DisasterEmergencyPlan>({
    user_id: record.id,
    farm_id: currentFarm?.id || "",
    riesgo_incendio: false,
    riesgo_inundacion: false,
    riesgo_terremoto: false,
    riesgo_fallo_electrico: false,
    riesgo_fallo_agua: false,
    riesgo_enfermedad: false,
    riesgo_otros: false,
    nivel_riesgo: "",
    protocolo_evacuacion: "",
    plan_comunicacion: "",
    documentos_plan: "",
    farm_name: currentFarm?.farm_name || "",
    rega_code: currentFarm?.REGA || "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  // Load plans on mount
  useEffect(() => {
    if (token && record.id && currentFarm?.id) {
      loadPlans();
    }
  }, [token, record.id, currentFarm?.id]);

  const loadPlans = async () => {
    if (!token || !record.id || !currentFarm?.id) return;
    
    setLoading(true);
    const response = await listDisasterPlans(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      setPlans(response.data);
    } else {
      alert("Error al cargar planes: " + (response.message || "Error desconocido"));
    }
  };

  const handleOpenDialog = (plan?: DisasterEmergencyPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ ...plan });
    } else {
      setEditingPlan(null);
      setFormData({
        user_id: record.id,
        farm_id: currentFarm?.id || "",
        riesgo_incendio: false,
        riesgo_inundacion: false,
        riesgo_terremoto: false,
        riesgo_fallo_electrico: false,
        riesgo_fallo_agua: false,
        riesgo_enfermedad: false,
        riesgo_otros: false,
        nivel_riesgo: "",
        protocolo_evacuacion: "",
        plan_comunicacion: "",
        documentos_plan: "",
        farm_name: currentFarm?.farm_name || "",
        rega_code: currentFarm?.REGA || "",
      });
      setContacts([]);
    }
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
    setSelectedFile(null);
  };

  const handleCheckboxChange = (field: keyof DisasterEmergencyPlan) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, nivel_riesgo: event.target.value });
  };

  const handleTextChange = (field: keyof DisasterEmergencyPlan) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert("Solo se permiten archivos PDF, DOC o DOCX");
        return;
      }
      
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert("El archivo no debe superar 10MB");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!token || !currentFarm?.id) {
      alert("Error: No hay una granja seleccionada");
      return;
    }

    // Validate required fields
    if (!formData.nivel_riesgo) {
      alert("Por favor, selecciona el nivel de riesgo");
      return;
    }

    setLoading(true);
    
    try {
      let savedPlan: DisasterEmergencyPlan | undefined;
      
      if (editingPlan && editingPlan.id) {
        // Update existing plan
        const response = await updateDisasterPlan(token, editingPlan.id, formData);
        if (!response.success) {
          throw new Error(response.message || "Error al actualizar el plan");
        }
        savedPlan = response.data;
      } else {
        // Create new plan
        const response = await createDisasterPlan(token, formData);
        if (!response.success) {
          throw new Error(response.message || "Error al crear el plan");
        }
        savedPlan = response.data;
      }

      // Upload file if selected
      if (selectedFile && savedPlan?.id) {
        const uploadResponse = await uploadDisasterDocument(token, savedPlan.id, selectedFile);
        if (!uploadResponse.success) {
          console.error("Error al subir documento:", uploadResponse.message);
          alert("Plan guardado pero hubo un error al subir el documento");
        }
      }

      alert(editingPlan ? "Plan actualizado exitosamente" : "Plan creado exitosamente");
      handleCloseDialog();
      loadPlans();
    } catch (error: any) {
      alert(error.message || "Error al guardar el plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!token) return;
    
    if (!confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      return;
    }

    setLoading(true);
    const response = await deleteDisasterPlan(token, planId);
    setLoading(false);
    
    if (response.success) {
      alert("Plan eliminado exitosamente");
      loadPlans();
    } else {
      alert("Error al eliminar el plan: " + (response.message || "Error desconocido"));
    }
  };

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.300" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
            Planes de Desastres y Emergencias
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={buttonStyles.primary}
          >
            Nuevo Plan
          </Button>
        </Box>

        {!currentFarm?.id && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Por favor, selecciona una granja para gestionar los planes de emergencia
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Fecha de Creación</strong></TableCell>
                <TableCell><strong>Nivel de Riesgo</strong></TableCell>
                <TableCell><strong>Granja</strong></TableCell>
                <TableCell><strong>REGA</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No hay planes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      {plan.created ? new Date(plan.created).toLocaleDateString("es-ES") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            plan.nivel_riesgo === "alto"
                              ? "error.light"
                              : plan.nivel_riesgo === "medio"
                              ? "warning.light"
                              : "success.light",
                          color: "white",
                          textTransform: "capitalize",
                        }}
                      >
                        {plan.nivel_riesgo || "No especificado"}
                      </Box>
                    </TableCell>
                    <TableCell>{plan.farm_name || "N/A"}</TableCell>
                    <TableCell>{plan.rega_code || "N/A"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDialog(plan)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => plan.id && handleDelete(plan.id)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog for Create/Edit */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: editingPlan ? "warning.main" : "primary.main",
            color: "white",
            fontWeight: 600,
          }}
        >
          {editingPlan ? "Editar Plan de Emergencia" : "Nuevo Plan de Emergencia"}
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {/* Section 1: Risk Evaluation */}
          <Accordion
            expanded={expandedAccordion === "section1"}
            onChange={handleAccordionChange("section1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "grey.100" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                1. Evaluación de Riesgos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selecciona los riesgos potenciales identificados:
                </Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_incendio || false}
                      onChange={handleCheckboxChange("riesgo_incendio")}
                    />
                  }
                  label="Incendio"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_inundacion || false}
                      onChange={handleCheckboxChange("riesgo_inundacion")}
                    />
                  }
                  label="Inundación"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_terremoto || false}
                      onChange={handleCheckboxChange("riesgo_terremoto")}
                    />
                  }
                  label="Terremoto"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_fallo_electrico || false}
                      onChange={handleCheckboxChange("riesgo_fallo_electrico")}
                    />
                  }
                  label="Fallo eléctrico"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_fallo_agua || false}
                      onChange={handleCheckboxChange("riesgo_fallo_agua")}
                    />
                  }
                  label="Fallo en suministro de agua"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_enfermedad || false}
                      onChange={handleCheckboxChange("riesgo_enfermedad")}
                    />
                  }
                  label="Brote de enfermedad"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.riesgo_otros || false}
                      onChange={handleCheckboxChange("riesgo_otros")}
                    />
                  }
                  label="Otros"
                />

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600 }}>
                    Nivel de Riesgo General *
                  </FormLabel>
                  <RadioGroup
                    value={formData.nivel_riesgo || ""}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value="bajo" control={<Radio />} label="Bajo" />
                    <FormControlLabel value="medio" control={<Radio />} label="Medio" />
                    <FormControlLabel value="alto" control={<Radio />} label="Alto" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Section 2: Action Protocol */}
          <Accordion
            expanded={expandedAccordion === "section2"}
            onChange={handleAccordionChange("section2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "grey.100" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                2. Protocolo de Actuación
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Protocolo de Evacuación"
                  multiline
                  rows={4}
                  value={formData.protocolo_evacuacion || ""}
                  onChange={handleTextChange("protocolo_evacuacion")}
                  placeholder="Describe los pasos a seguir en caso de evacuación..."
                  variant="filled"
                  fullWidth
                />

                <TextField
                  label="Plan de Comunicación"
                  multiline
                  rows={4}
                  value={formData.plan_comunicacion || ""}
                  onChange={handleTextChange("plan_comunicacion")}
                  placeholder="Describe cómo se comunicarán las emergencias..."
                  variant="filled"
                  fullWidth
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Contactos de Emergencia
                  </Typography>
                  <EmergencyContactsTable
                    planId={editingPlan?.id || ""}
                    token={token}
                    contacts={contacts}
                    setContacts={setContacts}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Section 3: Documentation */}
          <Accordion
            expanded={expandedAccordion === "section3"}
            onChange={handleAccordionChange("section3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "grey.100" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                3. Documentación
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Adjunta el plan de emergencia en formato PDF, DOC o DOCX (máximo 10MB)
                </Typography>
                
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Seleccionar Archivo
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
                
                {selectedFile && (
                  <Typography variant="body2" color="success.main">
                    ✓ Archivo seleccionado: {selectedFile.name}
                  </Typography>
                )}
                
                {formData.documentos_plan && !selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    Documento actual: {formData.documentos_plan}
                  </Typography>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Section 4: Farm Data (Readonly) */}
          <Accordion
            expanded={expandedAccordion === "section4"}
            onChange={handleAccordionChange("section4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "grey.100" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                4. Datos de la Granja
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Nombre de la Granja"
                  value={formData.farm_name || ""}
                  variant="filled"
                  fullWidth
                  disabled
                />
                
                <TextField
                  label="Código REGA"
                  value={formData.rega_code || ""}
                  variant="filled"
                  fullWidth
                  disabled
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={buttonStyles.cancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={editingPlan ? buttonStyles.edit : buttonStyles.save}
          >
            {loading ? "Guardando..." : editingPlan ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DesastresEmergenciasSection;
