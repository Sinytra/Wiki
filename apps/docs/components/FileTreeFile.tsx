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
import cn from 'clsx';
import {FileIcon} from 'nextra/icons';
import type {FC, ReactNode} from 'react';
import {FileJson2Icon} from 'lucide-react';

export type FileProps = {
  name: ReactNode
  comment?: string
  active?: boolean
};

export const FileTreeFile: FC<FileProps> = ({ name, comment, active }) => {
  const Icon = typeof name == 'string' && name.endsWith('.json') ? FileJson2Icon : FileIcon;
  return (
    <li
      className={cn(
        'x:flex x:items-center x:gap-1 x:break-all',
        active && 'x:text-primary-600'
      )}
    >
      <Icon width="14" height="14" className="x:shrink-0" />
      {name}
      {comment &&
        <span className="ml-1 text-neutral-500!">
            {'//'} {comment}
        </span>
      }
    </li>
  );
};