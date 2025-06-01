'use client'
import '@/components/Shared/Toast/ToastStyles.css'
import { ToastContainer, toast } from 'react-toastify'

export default function ToastBox(config?: ContainerProps) {
  return <ToastContainer toastClassName='md:ml-12' autoClose={3000} closeOnClick pauseOnHover pauseOnFocusLoss={false} theme={'colored'} position={'bottom-center'} {...config} />
}

export type ContainerProps = {
  className?: string
  autoClose?: number
  hideProgressBar?: boolean
  pauseOnHover?: boolean
  theme?: 'colored' | 'dark' | 'light'
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
  pauseOnFocusLoss?: boolean
}

export type ToastProps = {
  type?: 'info' | 'success' | 'warning' | 'error'
  autoClose?: number
  isClosable?: boolean
  hideProgressBar?: boolean

  pauseOnHover?: boolean
  theme?: 'colored' | 'dark' | 'light'
}

export function createToast(message: string, options?: ToastProps) {
  return toast(message, options)
}
