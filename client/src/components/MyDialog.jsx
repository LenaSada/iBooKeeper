import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const MyDialog = ({ children, isOpen, closeWin }) => {
  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeWin}>
            <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <div className='fixed inset-0 bg-black bg-opacity-25' />
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
                <div className='flex min-h-full justify-center p-4 text-center'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 scale-95'
                        enterTo='opacity-100 scale-100'
                        leave='ease-out duration-300'
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <Dialog.Panel className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform 
                        rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5 transition-bg-darkmode'>
                            <button
                                type='button'
                                className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
                                onClick={closeWin}
                            >X</button>
                            <div className='flex flex-col pt-10'>
                            {children}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
</>
  )
}

export default MyDialog