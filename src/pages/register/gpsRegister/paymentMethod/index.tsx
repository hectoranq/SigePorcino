import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RadioCard from "../../../../components/card/radioCard";
import { fetchPlans } from "../../../../data/repository";
import FileUpload from "../../../../components/fileUpload/fileUpload";

const PaymentMethod = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Estado para el plan seleccionado

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/');
  };

  const handleCardSelect = (planId: string) => {
    setSelectedPlanId(planId); // Establece el id del plan seleccionado
  };

  return (
    <section className="container">
      <Typography variant="logintitle" gutterBottom style={{ marginBottom: '2px' }}>
        Registro
      </Typography>
      <Divider 
        style={{ 
          borderBottom: '6px solid #00A5CF', 
          width: '6%',
          marginBottom: '32px'
        }} 
      />
      <Typography variant="bodySRegular" style={{ fontSize: 20 }} gutterBottom>
        ¡Ya casi terminamos! Elige un plan y el método de pago de tu preferencia
      </Typography>
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Selecciona un plan
      </Typography>

      {loading ? (
        <Typography variant="bodySRegular" style={{ fontSize: 18 }}>
          <CircularProgress color="secondary" />
        </Typography>
      ) : (
        <section className="form-grid-3-cols">
          {plans.map((plan) => (
            <RadioCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlanId}
              onSelect={handleCardSelect}
            />
          ))}
        </section>
      )}

      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20, marginTop: '24px' }}>
        Método de pago
      </Typography>
      <Typography variant="bodySRegular" style={{ fontSize: 20, marginBottom: '25px' }} gutterBottom>
        Debes realizar una transferencia a la cuenta 
        <span style={{ fontWeight: 'bold' }}> 15133364884 </span> 
        del Banco Santander al Nombre 
        <span style={{ fontWeight: 'bold' }}> Juan José Torrez Galindo </span> 
        y cargar el comprobante.
      </Typography>
      <FileUpload/>
      <section className="form-grid-main">
        <section className="form-grid-2-cols">
          <Button variant="contained" color="primary" className="button-1" onClick={handleRegister}>
            Atrás
          </Button>
          <Button variant="contained" color="primary" className="button" onClick={handleLogin}>
            Finalizar
          </Button>
        </section>
      </section>
    </section>
  );
};

export default PaymentMethod;
