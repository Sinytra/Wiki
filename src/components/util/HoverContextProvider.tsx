'use client'

import {Children, cloneElement, createContext, isValidElement, ReactNode, useState} from "react";

export interface HoverContextData {
  hover: boolean;
  setHover: (hover: boolean) => void;
}

export const HoverContext = createContext<HoverContextData|null>(null);

export default function HoverContextProvider({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);

  const enhanceChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    return cloneElement(child, {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      // @ts-ignore
      ...child.props
    });
  });

  return (
    <HoverContext.Provider value={{hover, setHover}}>
      <>
        {enhanceChildren}
      </>
    </HoverContext.Provider>
  )
}