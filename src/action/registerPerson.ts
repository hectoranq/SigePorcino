'use server';


import PocketBase from 'pocketbase';
export async function registerPerson(formData: FormData) {
  const dni = formData.get('dni') as string;
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const locality = formData.get('locality') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;
  const postal_code = formData.get('postal_code') as string;
  const phone_code = formData.get('phone_code') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const accept_terms = formData.get('accept_terms') === 'true';

  const pb = new PocketBase("https://api.appsphere.pro");

  // Creamos el nuevo usuario persona física
  const newUser = await pb.collection('users').create({
    password,
    passwordConfirm,
    email,
    emailVisibility: true,
    verified: true,
    type_user: "person",
    dni,
    first_name: name,
    last_name: surname,   
    province,
    locality,
    address,
    postal_code,
    phone_number: phone_code,
    accept_terms,
  });

  console.log(newUser);
}