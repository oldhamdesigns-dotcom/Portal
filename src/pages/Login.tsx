import { memo, useCallback } from 'react';

import BgLogin from '@/assets/images/bg-login.jpeg';
import { Link, useNavigate } from 'react-router';
import CSCLogoImage from '@icons/CSCLogoImage';
import { Controller, useForm } from 'react-hook-form';
import Input from '@components/forms/Input';
import LockFillIcon from '@icons/LockFIllIcon';
import InfoIcon from '@icons/InfoIcon';
import { loginAWS } from '@aws/aws.service';

const Login = () => {
  const form = useForm<LoginUser>({ defaultValues: { username: '', password: '' } });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const navigate = useNavigate();

  const login = useCallback(
    async (values: LoginUser) => {
      loginAWS(values)
        .then((response) => {
          if ('isSignedIn' in response) {
            navigate('/main-dashboard');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [navigate]
  );

  return (
    <div className={'flex items-center'}>
      <div className={'basis-1/2'}>
        <img
          src={BgLogin}
          alt={'bg'}
          className={'h-screen object-cover'}
        />
      </div>
      <div className={'flex basis-1/2 flex-col items-center justify-center'}>
        <div>
          <Link
            to={'/'}
            className={'mt-4'}
          >
            <CSCLogoImage height={50} />
          </Link>
        </div>
        <h3 className={'mt-[50px] text-3xl font-bold text-black'}>{'Log In'}</h3>
        <p className={'text-placeholder'}>{'Log in to your One Tap Away account.'}</p>

        <div className={'mt-4 flex w-1/3 flex-col gap-4'}>
          <Controller
            name={'username'}
            control={control}
            render={({ field }) => (
              <Input
                label={'Email'}
                placeholder={'Enter email or phone number...'}
                {...field}
              />
            )}
          />
          <Controller
            name={'password'}
            control={control}
            render={({ field }) => (
              <Input
                label={'Password'}
                type={'password'}
                placeholder={'Enter Password'}
                {...field}
              />
            )}
          />
          <div className={'mt-2 flex items-center justify-center gap-2'}>
            <LockFillIcon />
            <p className={'text-placeholder-2'}>{'Forgot password?'}</p>
          </div>
          <button
            className={'mt-2 w-full rounded bg-black px-1 py-2 text-white'}
            type={'submit'}
            onClick={handleSubmit(login)}
            disabled={isSubmitting}
          >
            {!isSubmitting ? 'Log in' : 'Logging you in, please wait...'}
          </button>
          <div className={'mt-2 flex flex-col items-center justify-center gap-2'}>
            <Link
              className={'flex items-center text-link'}
              to={'/'}
            >
              {'Create account '}
              <InfoIcon />
            </Link>
            <p className={'text-sm text-placeholder-2'}>
              {'©One Tap Away '}
              {new Date().getFullYear()} {'• All Rights Reserved'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
