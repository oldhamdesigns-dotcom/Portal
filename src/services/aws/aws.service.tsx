import { signIn, getCurrentUser, signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsweb from '@aws/awsweb';

Amplify.configure(awsweb);

export const loginAWS = async (user: LoginUser) => {
  const emailPattern = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
  const mobilePattern = '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$';
  const { username } = user;
  let error = undefined;

  if (username.match(mobilePattern) || username.match(emailPattern)) {
    try {
      return await signIn(user);
    } catch (err) {
      error = err;
    }
  } else {
    error = 'Email pattern not matching';
  }
  return { error };
};

export const getUser = async () => {
  try {
    return await getCurrentUser();
  } catch (error) {
    return { error };
  }
};

export const logoutUser = () => {
  return signOut();
};
