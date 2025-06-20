'use server';


import PocketBase from 'pocketbase';

type PBErrorResponse = {
  response?: {
    data?: Record<string, { code?: string; message?: string }>;
  };
  message?: string;
};

export async function registerCompany(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('company_name') as string;
  const cif = formData.get('cif') as string;
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
  } catch (error: unknown) {
    // Extraemos los mensajes de error si vienen del response
    const err = error as PBErrorResponse;
    const errorDetails = err?.response?.data || null;
    let message = err?.message || 'Error al registrar la empresa';

    // Si hay detalles de error, busca el primer mensaje específico
    if (errorDetails && typeof errorDetails === 'object') {
      for (const key in errorDetails) {
        if (errorDetails[key]?.message) {
          message = errorDetails[key].message as string;
          break;
        }
      }
    }

    return {
      success: false,
      message,
      errors: errorDetails,
    };
  }
}