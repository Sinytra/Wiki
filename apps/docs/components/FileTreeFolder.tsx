/*
 * MIT License
 *
 * Copyright (c) 2020 Shu Ding
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
'use client';

import cn from 'clsx';
import {useState} from 'react';
import type {FC, ReactNode} from 'react';
import {FolderIcon, FolderOpenIcon} from 'nextra/icons';
import {Button} from 'nextra/components';
import type {FileProps} from '@/components/FileTreeFile';

type FolderProps = FileProps & {
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  comment?: string
  children: ReactNode
};

export const FileTreeFolder: FC<FolderProps> = ({name, open, children, defaultOpen = false, comment, active}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    setIsOpen(v => !v);
  };

  const isFolderOpen = open === undefined ? isOpen : open;

  const ComponentToUse = isFolderOpen ? FolderOpenIcon : FolderIcon;

  return (
    <li className="x:flex x:flex-col x:gap-1">
      <Button
        onClick={toggle}
        disabled={open}
        className={({hover}) =>
          cn(
            'x:flex x:items-center x:gap-1 x:break-all',
            'x:text-start group', // override browser default
            hover && 'x:opacity-60',
            active && 'x:text-primary-600'
          )
        }
      >
        {/* Text can shrink icon */}
        <ComponentToUse height="14" className="x:shrink-0"/>
        {name}
        {comment &&
          <span className="ml-1 text-neutral-500!">
            {'//'} {comment}
        </span>
        }
      </Button>
      {isFolderOpen && (
        <ul className="x:flex x:flex-col x:gap-2 x:ps-4">{children}</ul>
      )}
    </li>
  );
};