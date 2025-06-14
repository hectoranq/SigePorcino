'use server';


import PocketBase from 'pocketbase';
export async function registerCompany(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('company_name') as string;
  const cif = formData.get('cif') as string;
  const city = formData.get('city') as string;
  const province = formData.get('province') as string;
  const locality = formData.get('locality') as string;
  const address = formData.get('address') as string;
  const postalCode = formData.get('postal_code') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const acceptTerms = formData.get('accept_terms') === 'true';

  const pb = new PocketBase("https://api.appsphere.pro");

  try {
    const newUser = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      type_user: 'company',
      company_name: companyName,
      cif,
      province,
      locality,
      address,
      postal_code: postalCode,
      phone_number: phoneNumber,
      accept_terms: acceptTerms,
      emailVisibility: true,
    });

    return {
      success: true,
      data: newUser,
    };
  } catch (error: any) {
    // Extraemos los mensajes de error si vienen del response
    const errorDetails = error?.response?.data || null;
    let message = error?.message || 'Error al registrar la empresa';

    // Si hay detalles de error, busca el primer mensaje específico
    if (errorDetails && typeof errorDetails === 'object') {
      // Busca el primer campo con mensaje de error
      for (const key in errorDetails) {
        if (errorDetails[key]?.message) {
          message = errorDetails[key].message;
          break;
        }
      }
    }

    return {
      success: false,
      message,
      errors: errorDetails, // puedes usar esto para mostrar mensajes campo por campo
    };
  }
}