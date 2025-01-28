import { Link } from '@source-cooperative/components'
import { Heading, Paragraph } from 'theme-ui'
import Layout from '../../components/Layout'

export default function About() {
  return (
    <>
      <Layout>
        <Heading as="h2">What are Source Cooperative Viewers?</Heading>
        <Paragraph>
					Source Cooperative viewers are a collection of open source React
					components which allow you to easily embed interactive viewers for
					data served through HTTP into your web application. These components
					are what is used to power the{' '}
          <Link href="https://beta.source.coop">Source Cooperative</Link> data
					previewer.
        </Paragraph>

        <Heading as="h2">How can I improve or create a viewer?</Heading>
        <Paragraph>
					This project is open source and we welcome contributions. Check out
					the{' '}
          <Link href="https://github.com/source-cooperative/viewers/blob/main/CONTRIBUTING.md">
						contribution
          </Link>{' '}
					guide for more information about how to get started.
        </Paragraph>
      </Layout>
    </>
  )
}
