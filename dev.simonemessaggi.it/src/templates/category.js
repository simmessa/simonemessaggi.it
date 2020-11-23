import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layout'
import PostListing from '../components/PostListing'
import config from '../../data/SiteConfig'

const CategoryTemplate = ({ data, pageContext }) => (
  <Layout>
    <main>
      <Helmet title={` "${pageContext.category}" - ${config.siteTitle}`} />
      <h1>
Category:
{' '}
{pageContext.category}
</h1>
      <PostListing postEdges={data.allMarkdownRemark.edges} />
    </main>
  </Layout>
)

export default CategoryTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: {
        frontmatter: {
          categories: { in: [$category] }
          status: {ne: "draft"}
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
