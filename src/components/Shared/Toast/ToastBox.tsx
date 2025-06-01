'use client'

import '@/components/Shared/Toast/ToastStyles.css'
import { useEffect } from 'react'
import { ToastContainer, ToastContainerProps } from 'react-toastify'

// Module-level flag – its value is shared by every instance
let alreadyMounted = false

export default function ToastBox(config?: ToastContainerProps) {
  useEffect(() => {
    if (alreadyMounted) {
      throw new Error('ToastBox has already been mounted. Only one instance is allowed.')
    }
    alreadyMounted = true

    return () => {
      alreadyMounted = false
    }
  }, [])

  return <ToastContainer toastClassName='md:ml-12' autoClose={5000} closeOnClick limit={5} pauseOnHover={false} pauseOnFocusLoss theme='colored' position='bottom-center' {...config} />
}
