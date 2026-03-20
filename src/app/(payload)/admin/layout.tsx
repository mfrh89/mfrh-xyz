import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './importMap'
import configPromise from '@payload-config'
import React from 'react'

import '@payloadcms/next/css'

import { handleServerFunctions, ServerFunctionClient } from 'payload'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

const Layout = ({ children }: Args) =>
  RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction,
  })

export default Layout
