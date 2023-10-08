/*
 * This page is auto-generated. Do not edit it by hand.
 */
import { Uma } from '@freesewing/uma'
// Dependencies
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
import { workbenchInlineDocs } from 'shared/mdx/docs.mjs'
// Hooks
import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useBackend } from 'shared/hooks/use-backend.mjs'
// Context
import { LoadingStatusContext } from 'shared/context/loading-status-context.mjs'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { Workbench, ns as wbNs } from 'shared/components/workbench/new.mjs'
import { WorkbenchLayout } from 'site/components/layouts/workbench.mjs'
import { Loading } from 'shared/components/spinner.mjs'

// Translation namespaces used on this page
const ns = nsMerge('uma', wbNs, pageNs)

const EditDesignComponent = ({ id, design, Design, settings, docs }) => (
  <Workbench preload={{ settings }} saveAs={{ pattern: id }} {...{ design, Design, docs }} />
)

const EditUmaPage = ({ page, docs, design, id }) => {
  const { setLoadingStatus } = useContext(LoadingStatusContext)
  const backend = useBackend()
  const { t } = useTranslation(ns)

  const [pattern, setPattern] = useState(false)

  useEffect(() => {
    const getPattern = async () => {
      setLoadingStatus([true, t('backendLoadingStarted')])
      let result
      try {
        result = await backend.getPattern(id)
        if (result.success) {
          setPattern(result.data.pattern)
          setLoadingStatus([true, 'backendLoadingCompleted', true, true])
        } else setLoadingStatus([true, 'backendError', true, false])
      } catch (err) {
        console.log(err)
        setLoadingStatus([true, 'backendError', true, false])
      }
    }
    if (id) getPattern()
  }, [id])

  return (
    <PageWrapper {...page} title="Uma" layout={pattern ? WorkbenchLayout : false} header={null}>
      {pattern ? (
        <EditDesignComponent
          id={pattern.id}
          settings={pattern.settings}
          design="uma"
          Design={Uma}
          docs={docs}
        />
      ) : (
        <div>
          <h1>{t('account:oneMomentPLease')}</h1>
          <Loading />
        </div>
      )}
    </PageWrapper>
  )
}

export default EditUmaPage

export async function getStaticProps({ locale, params }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      id: params.id,
      docs: await workbenchInlineDocs({
        Design: Uma,
        design: 'uma',
        locale,
      }),
      page: {
        locale,
        path: ['account', 'patterns', 'uma', params.id, 'edit'],
        title: 'Uma',
      },
    },
  }
}

/*
 * getStaticPaths() is used to specify for which routes (think URLs)
 * this page should be used to generate the result.
 */
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
