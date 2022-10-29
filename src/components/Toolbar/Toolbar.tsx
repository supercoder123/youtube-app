import React from 'react'
import cx from 'classnames';
import { getAuth, signOut } from "firebase/auth";

interface ToolbarProps {
    onSave: () => void;
    toggleEditMode: () => void;
    isEditing: boolean,
    editInProgress: boolean;
}

const Toolbar = ({ onSave, toggleEditMode, isEditing, editInProgress }: ToolbarProps) => {
    return (
        <div className={
            cx('container sticky top-1 rounded-full p-2 bg-neutral-800 z-20 m-2 px-2 mx-auto', { 'bg-blue-900': isEditing })
        }>
            <div className="flex justify-between">
                <div className='flex'>
                    <button
                        className='mr-3 flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full hover:border-transparent disabled:bg-blue-100 disabled:text-blue-900 disabled:cursor-not-allowed disabled:opacity-70 bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2'
                        onClick={() => {
                            toggleEditMode();
                        }}
                    >
                        Edit
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pl-2 w-6 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>

                    </button>
                    <button
                        className={
                            cx(
                                'flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full hover:border-transparent disabled:bg-green-100 disabled:text-green-900 disabled:cursor-not-allowed disabled:opacity-70 bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2',
                                { 'animate-pulse': editInProgress }
                            )
                        }
                        onClick={() => {
                            onSave();
                        }}
                    >
                        Save
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pl-2 w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <button
                        className='flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full hover:border-transparent disabled:bg-red-100 disabled:text-red-900 disabled:cursor-not-allowed disabled:opacity-70 bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2'
                        onClick={() => {
                            const auth = getAuth();
                            signOut(auth).then(() => {
                                // Sign-out successful.
                            }).catch((error) => {
                                // An error happened.
                            });
                        }}
                    >
                        Logout
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pl-2 w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toolbar;