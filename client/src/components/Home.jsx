import React, { useState } from 'react'
import { signIn } from '../utils';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    let navigate = useNavigate();

    const signInHelper = async () => {
        const res=await signIn(email, password);
        if(res.error) {
            setError(res.error);
        } else{
            navigate('/in/');
            await new Promise(resolve => setTimeout(resolve, 100));
            window.location.href = '/in/';
        }
    }

    return (
        <main className="overflow-hidden">
            <div className='text-primary-blue flex-1 pt-12'>
                <div className='flex flex-col'>
                    <div className='sign-in__bar' id='signin'>
                        <div className='flex justify-center'>
                            <h1 className='text-3xl'>Sign in to Schedule</h1>
                        </div>
                        <div className='m-5'>
                            <p>Email</p>
                            <div className='bar__item mt-3'>
                                <input
                                    type='text'
                                    name='model'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email'
                                    className='bar__input'
                                />
                            </div>
                        </div>
                        <div className='m-5'>
                            <div className='flex flex-row justify-between'>
                                <p>Password</p>
                            </div>
                            <div className='bar__item mt-3'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='model'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                    className='bar__input'
                                />
                                {password && (
                                    <div className='password-toggle' onClick={() => setShowPassword(!showPassword)}>
                                        <img
                                            src={showPassword ? 'toggle-hide.png' : 'toggle-show.png'}
                                            alt='view toggle'
                                            width={25} height={25}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ color: 'red' }}>{error}</div>
                        <div className='m-5 flex justify-center'>
                        </div>
                    </div>
                    <div className='sign-in__bar'>
                        <div className='flex flex-row justify-center'>
                            <button
                                type='button'
                                className='rounded-full sign-in__btn min-h-[30px] min-w-[130px]'
                                onClick={() => {signInHelper()}}
                            >Sign in</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home