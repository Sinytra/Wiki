'use client'

import {createContext, useState} from "react";
import {DropdownMenu, DropdownMenuContent} from "@/components/ui/dropdown-menu";

export interface DropdownMenuContextState {
  setModalOpen: (open: boolean) => void;
}

export const DropdownMenuContext = createContext<DropdownMenuContextState | null>(null);

export default function ContextDropdownMenu({children, content}: { children: any; content: any }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleOnOpen(open: boolean) {
    setModalOpen(false);
    setOpen(open);
  }

  function handleModalStateChange(open: boolean) {
    if (!open) {
      setOpen(false);
    } else {
      setModalOpen(open);
    }
  }

  return (
    <DropdownMenuContext.Provider value={{setModalOpen: handleModalStateChange}}>
      <DropdownMenu open={open} onOpenChange={handleOnOpen}>
        {children}

        <DropdownMenuContent
          align="end"
          hidden={modalOpen}
          onCloseAutoFocus={event => {
            event.preventDefault();
            document.body.style.pointerEvents = '';
          }}
        >
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuContext.Provider>
  )
}