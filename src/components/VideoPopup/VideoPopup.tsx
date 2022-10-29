import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const VideoPopup = ({
    isOpen,
    onClose,
    videoId,
}: {
    isOpen: boolean;
    videoId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
        if (((e.charCode || e.keyCode) === 27) || e.key === 'Escape') {
            onClose(false);
        }
    };

    useEffect(() => {
        document.body.addEventListener("keydown", closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(

        <div
            onClick={() => {
                onClose(false);
            }}
            className="fixed inset-0 bg-slate-400/80 bg-opacity-75 transition-opacity z-20 overflow-y-auto flex justify-center items-center w-full h-full"
        >

            <div className="w-screen md:w-4/5 relative m-3 text-white">
                <div className="absolute -right-2 -top-2 z-10">
                    <button
                        className="rounded-full border border-neutral-600 w-8 h-8  bg-stone-900 "
                        onClick={() => {
                            onClose(false);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div onClick={e => e.stopPropagation()} className="aspect-video bg-gray-800 rounded-lg relative drop-shadow-md m-1 p-2">

                    <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

            </div>

        </div>,
        document.getElementById("portal-root")!
    );
};

export default VideoPopup;