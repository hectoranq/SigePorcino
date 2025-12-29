import PocketBase from 'pocketbase';

export async function registerPayment({ user_id, plan_id, file }: {
  user_id: string;
  plan_id: string;
  file: File;
}) {
  const pb = new PocketBase('https://api.appsphere.pro');

  try {
    // Validar que el archivo exista
    if (!file) {
      throw new Error('No se proporcionó un archivo de comprobante de pago');
    }

    // Validar tipo de archivo permitido
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG o PDF');
    }

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB');
    }

    // Crear FormData con los campos requeridos
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('plan_id', plan_id);
    
    // IMPORTANTE: El nombre del campo debe coincidir exactamente con el nombre 
    // del campo file definido en la colección 'payments' de PocketBase
    // Si el campo se llama 'payment_proof', 'proof_document', 'document', etc.
    // ajusta este nombre según tu configuración en PocketBase
    formData.append('comprobante', file);

    // Crear el registro en la colección payments
    const record = await pb.collection('payments').create(formData);

    console.log('Pago registrado exitosamente:', record.id);
    return {
      success: true,
      data: record,
      message: 'Comprobante de pago subido exitosamente'
    };

  } catch (error) {
    console.error('Error al registrar el pago:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw new Error(pbError.message || 'Error al procesar el pago en el servidor');
    }
    
    // Re-lanzar el error para que sea manejado por el componente
    throw error;
  }
}