/**
 * Global type declarations for the project
 */

// CSS Module declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Allow importing CSS files as side-effects
declare module '*.css?*' {
  const content: { [className: string]: string }
  export default content
}

// SVG imports
declare module '*.svg' {
  // oxlint-disable-next-line typescript/no-require-imports
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// Image imports
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.webp'
declare module '*.ico'
declare module '*.bmp'
