/*
 * MIT License
 *
 * Copyright (c) 2019-present, Yuxi (Evan) You
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
'use client'

import {CSSTransition} from "react-transition-group";
import {useEffect, useRef} from "react";

// https://github.com/vuejs/vitepress/blob/2e54970f7195c67b63908964575f589ce24b6d29/src/client/theme-default/components/VPNavScreen.vue
export default function MobileNavScreen({ isVisible, children }: { isVisible: boolean; children: any }) {
  const nodeRef = useRef(null);

  function lockScroll() {
    document.querySelectorAll('html, body').forEach(e => e.classList.add('navScrollLock'));
  }

  function unlockScroll() {
    document.querySelectorAll('html, body').forEach(e => e.classList.remove('navScrollLock'));
  }

  useEffect(() => {
    if (!isVisible) {
      document.querySelectorAll('html, body').forEach(e => e.classList.remove('navScrollLock'));
    }
  }, [isVisible]);

  return (
    <div>
      <CSSTransition nodeRef={nodeRef} in={isVisible} timeout={200} classNames="fade" unmountOnExit onEnter={lockScroll} onExited={unlockScroll}>
        <div ref={nodeRef} className="fixed bg-primary py-0 px-8 overflow-y-auto top-nav-height right-0 bottom-0 left-0 w-full">
          <div className="mx-auto my-0 max-w-72 pt-8 pb-24 innerFadeContainer">
            {children}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}