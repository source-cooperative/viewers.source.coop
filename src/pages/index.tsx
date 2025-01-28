import {
  FieldState,
  FieldType,
  Form,
  FormFieldState,
  FormResult,
  FormResultState,
  ViewerId,
  ViewerLoader,
  viewerIds,
} from '@source-cooperative/components'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Box, Divider } from 'theme-ui'
import Layout from '../components/Layout'

function parseViewerId(value: string): ViewerId | undefined {
  return viewerIds.some(id => value === id) ? value as ViewerId : undefined
}

export default function Home() {
  const router = useRouter()
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [selectedViewer, setSelectedViewer] = useState<ViewerId | undefined>(undefined)

  const [urlState, setUrlState] = useState<FormFieldState>({ state: FieldState.INVALID })

  // TODO(SL): remove useEffect
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (router.query.url) {
      // the query string should contain only one 'url' parameter. Only the first one is used.
      const url = Array.isArray(router.query.url) ? router.query.url[0] : router.query.url
      setUrl(url)
    } else {
      setUrl(undefined)
    }

    if (router.query.viewer) {
      // the query string should contain only one 'viewer' parameter. Only the first one is used.
      const viewer = parseViewerId(Array.isArray(router.query.viewer) ? router.query.viewer[0] : router.query.viewer)
      setSelectedViewer(viewer)
    } else {
      setSelectedViewer(undefined)
    }
  }, [router.isReady, router.query])

  const fields = [
    {
      id: 'url',
      required: true,
      type: FieldType.TEXT,
      title: 'File URL',
      defaultValue: url,
      state: urlState,
      validationDelay: 1,
      setState: setUrlState,
      onValidation: () => { setUrlState({ state: FieldState.VALID }) },
    },
  ]

  function onSubmit(values: Record<string, string>): Promise<FormResult> {
    return Promise.resolve({
      state: FormResultState.SUCCESS,
      onSuccess: () => {
        router.query.url = values.url
        router.query.viewer = undefined
        router.push(router).catch((e: unknown) => { console.error(e) })
        setSelectedViewer(undefined)
        setUrl(values.url)
      },
    })
  }

  const onViewerSelected = useCallback((viewerId: ViewerId | undefined) => {
    setSelectedViewer(viewerId)
    router.query.viewer = viewerId
    router.push(router).catch((e: unknown) => { console.error(e) })
  }, [router])

  return (
    <Layout>
      <Box sx={{ py: 2 }}>
        <Form
          onSubmit={onSubmit}
          gridColumns={['auto', 'auto', 'auto', 'auto']}
          fields={fields}
          submitText="Preview File"
        />
      </Box>
      {url && <>
        <Divider />
        <ViewerLoader
          url={url}
          viewerId={selectedViewer}
          onViewerSelected={onViewerSelected}
        />
      </>}
    </Layout>
  )
}
