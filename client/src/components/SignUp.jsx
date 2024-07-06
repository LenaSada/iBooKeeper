import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { signUp } from '../utils';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLasttname] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    let navigate = useNavigate();

    const signUpHelper = async () => {
        if (password != confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        const res=await signUp(email, firstname + " " + lastname, password);
        if(res.error) {
            setError(res.error);
        } else{
            navigate('/');
        }
    }

    return (
        <main className="overflow-hidden">
            <div className='text-primary-blue flex-1 pt-12'>
                <div className='flex flex-col'>
                    <div className='sign-in__bar' id='signin'>
                        <div className='flex justify-center'>
                            <h1 className='text-3xl'>Create account in IBooKeeper</h1>
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
                            <div className='bar__item mt-3'>
                                <div className='flex'>
                                    <div className='flex-col mr-2'>
                                        <p>First Name</p>
                                        <input
                                            type='text'
                                            name='model'
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                            placeholder='firstname'
                                            className='bar__input'
                                        />
                                    </div>
                                    <div className='flex-col'>
                                        <p>Last Name</p>
                                        <input
                                            type='text'
                                            name='model'
                                            value={lastname}
                                            onChange={(e) => setLasttname(e.target.value)}
                                            placeholder='lastname'
                                            className='bar__input'
                                        />
                                    </div>
                                </div>
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

                        <div className='m-5'>
                            <div className='flex flex-row justify-between'>
                                <p>Confirm Password</p>
                            </div>
                            <div className='bar__item mt-3'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='model'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm Password'
                                    className='bar__input'
                                />
                                {confirmPassword && (
                                    <div className='password-toggle' 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <img
                                            src={showConfirmPassword ? 'toggle-hide.png' : 'toggle-show.png'}
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
                                onClick={() => { signUpHelper() }}
                            >Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SignUp