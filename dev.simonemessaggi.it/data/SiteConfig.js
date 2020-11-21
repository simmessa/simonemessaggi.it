const config = {
  siteTitle: 'SimoneMessaggi.it', // Site title.
  siteTitleShort: 'Simone Messaggi', // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: 'Simone Messaggi', // Alternative site title for SEO.
  siteLogo: '/logos/logo-1024.png', // Logo used for SEO and manifest.
  siteUrl: 'https://dev.simonemessaggi.it', // Domain of your website without pathPrefix.
  pathPrefix: '', // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription:
    'A DevOps Journey.', // Website description used for RSS feeds/meta description tag.
  siteRss: '/rss.xml', // Path to the RSS file.
  siteFBAppID: '1825356251115265', // FB Application ID for using app insights
  googleAnalyticsID: 'UA-1068523-29', // GA tracking ID.
  dateFromFormat: 'YYYY-MM-DD', // Date format used in the frontmatter.
  dateFormat: 'DD/MM/YYYY', // Date format for display.
  userName: 'Simone Messaggi', // Username to display in the author segment.
  userEmail: 'simmessa@gmail.com', // Email used for RSS feed's author segment
  userTwitter: 'simmessa', // Optionally renders "Follow Me" in the Bio segment.
  userGitHub: 'simmessa', // Optionally renders "Follow Me" in the Bio segment.
  userLocation: 'Milano, Italy', // User location to display in the author segment.
  userAvatar: 'https://pbs.twimg.com/profile_images/1248154244856705024/VcjtdBXR_400x400.jpg', // User avatar to display in the author segment.
  userDescription:
    "", // User description to display in the author segment.
  copyright: 'Copyleft 2020. La conoscenza e\' libera.', // Copyright string for the footer of the website and RSS feed.
  themeColor: '#c62828', // Used for setting manifest and progress theme colors.
  backgroundColor: 'red' // Used for setting manifest background color.
}

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  // @SM buggy so I removed this!
  // config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/')
  config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
// if (config.siteRss && config.siteRss[0] !== "/")
//   config.siteRss = `/${config.siteRss}`;

module.exports = config
