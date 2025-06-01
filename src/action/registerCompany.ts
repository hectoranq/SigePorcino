'use server';


import PocketBase from 'pocketbase';

export async function registerCompany(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('company_name') as string;
  const cif = formData.get('cif') as string;
  const city = formData.get('city') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;
  const postalCode = formData.get('postal_code') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const acceptTerms = formData.get('accept_terms') === 'true';

  // TODO: server-side validation

  const pb = new PocketBase("http://38.242.147.212:8090");

  // Creamos el nuevo usuario
  const newUser = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password, // importante para PocketBase
    user_type: 'company', // indicamos que es empresa
    company_name: companyName,
    cif,
    city,
    province,
    address,
    postal_code: postalCode,
    phone_number: phoneNumber,
    accept_terms: acceptTerms,
    emailVisibility: true, // (opcional) si quieres que el email sea visible
  });

  console.log(newUser);
}
