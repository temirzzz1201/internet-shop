'use client'
import { Provider } from "react-redux"
import store from "../store"
import { ReactNode } from "react"
import { ChakraProvider } from '@chakra-ui/react'

export default function Providers({ children }: { children: ReactNode }) {
  return (

    <Provider store={store}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </Provider>
  )
}
