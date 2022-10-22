import { Dispatch, SetStateAction, useState } from "react"

export function useModal(defaultState: boolean): [boolean, Dispatch<SetStateAction<boolean>>, () => void] {
    const [isOpen, setIsOpen] = useState(defaultState);

    function toggleModal() {
        setIsOpen(prev => !prev);
    }

    return [
        isOpen,
        setIsOpen,
        toggleModal,
    ]
}