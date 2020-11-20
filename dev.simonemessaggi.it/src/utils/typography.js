import Typography from "typography"
import TypographyTheme from 'typography-theme-ocean-beach'
// import TypographyTheme from 'typography-theme-stow-lake'

// @SM override stuff here...
// fairyGatesTheme.headerFontFamily = ["Lora", "sans-serif"]

TypographyTheme.baseFontSize = '20px'

// Like some theme styles I hate...
TypographyTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  a: {
    textShadow: "none",
    backgroundImage: "none"
  }
})

const typography = new Typography(TypographyTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

// Export helper functions
export const { scale, rhythm, options } = typography
export default typography
