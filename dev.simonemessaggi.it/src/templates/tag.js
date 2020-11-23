import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layout'
import PostListing from '../components/PostListing'
import config from '../../data/SiteConfig'

const TagTemplate = ({ data, pageContext }) => (
  <Layout>
    <main>
      <Helmet
        title={`Posts tagged as "${pageContext.tag}" | ${config.siteTitle}`}
      />
      <PostListing postEdges={data.allMarkdownRemark.edges} />
    </main>
  </Layout>
)
export default TagTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: {
        frontmatter: {
          tags: { in: [$tag] }
          status: { ne: "draft" }
        }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date(formatString: "DD/MM/YYYY")
          }
          excerpt
          timeToRead
          frontmatter {
            title
            featuredImage{
              childImageSharp {
                fluid(maxWidth: 400, maxHeight: 200) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            tags
            date
            categories
          }
        }
      }
    }
  }
`
