import PocketBase from 'pocketbase';

/**
 * Request Password Reset - Enviar correo para restablecer contraseña
 * POST /api/collections/users/request-password-reset
 * @param email - Correo electrónico del usuario registrado
 * @returns Confirmación del envío del correo
 */
export async function requestPasswordReset(email: string) {
  try {
    // Validar que el email no esté vacío
    if (!email || email.trim() === '') {
      throw new Error('El correo electrónico es requerido');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del correo electrónico no es válido');
    }

    const pb = new PocketBase('https://api.appsphere.pro');

    // Enviar solicitud de reseteo de contraseña
    await pb.collection('users').requestPasswordReset(email);

    console.log(`✅ Solicitud de reseteo de contraseña enviada a: ${email}`);
    return {
      success: true,
      message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña',
    };
  } catch (error: any) {
    console.error('❌ Error al solicitar reseteo de contraseña:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al solicitar reseteo de contraseña',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al solicitar reseteo de contraseña',
      error,
    };
  }
}

/**
 * Confirm Password Reset - Confirmar el reseteo de contraseña con el token recibido
 * POST /api/collections/users/confirm-password-reset
 * @param token - Token recibido por correo electrónico
 * @param password - Nueva contraseña
 * @param passwordConfirm - Confirmación de la nueva contraseña
 * @returns Confirmación del cambio de contraseña
 */
export async function confirmPasswordReset(
  token: string,
  password: string,
  passwordConfirm: string
) {
  try {
    // Validar campos requeridos
    if (!token || !password || !passwordConfirm) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      throw new Error('Las contraseñas no coinciden');
    }

    // Validar longitud mínima de contraseña
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const pb = new PocketBase('https://api.appsphere.pro');

    // Confirmar el reseteo de contraseña
    await pb.collection('users').confirmPasswordReset(
      token,
      password,
      passwordConfirm
    );

    console.log('✅ Contraseña restablecida exitosamente');
    return {
      success: true,
      message: 'Tu contraseña ha sido restablecida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al restablecer contraseña:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al restablecer contraseña',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al restablecer contraseña',
      error,
    };
  }
}

export default {
  requestPasswordReset,
  confirmPasswordReset,
};
