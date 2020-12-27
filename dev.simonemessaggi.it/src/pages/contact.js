import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../layout'
import config from '../../data/SiteConfig'

const ContactPage = () => (
  <Layout>
    <main>
      <Helmet title={`Contact | ${config.siteTitle}`} />
      <h1>Contattami</h1>
      <p>In genere rispondo con il mio profilo social, su <a href="https://twitter.com/simmessa">Twitter</a></p>
    </main>
  </Layout>
)
export default ContactPage
