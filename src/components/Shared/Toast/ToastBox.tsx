'use client'
import '@/components/Shared/Toast/ToastStyles.css'
import { ToastContainer, ToastContainerProps } from 'react-toastify'

export default function ToastBox(config?: ToastContainerProps) {
  return <ToastContainer toastClassName='md:ml-12' autoClose={5000} closeOnClick limit={5} pauseOnHover={false} pauseOnFocusLoss={true} theme={'colored'} position={'bottom-center'} {...config} />
}
