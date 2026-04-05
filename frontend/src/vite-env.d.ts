/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'react-input-mask' {
  import { ComponentType, InputHTMLAttributes } from 'react';
  
  interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string;
    alwaysShowMask?: boolean;
  }
  
  const InputMask: ComponentType<InputMaskProps>;
  export default InputMask;
}