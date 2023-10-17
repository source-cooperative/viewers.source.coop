export interface ViewerMetadata {
    maxSizeBytes?: number; // Set this if you want to limit the size of the file that can be viewed
    extensions?: string[]; // Set this if you want to limit the file extensions that can be viewed
    contentTypes?: string[]; // Set this if you want to limit the content types that can be viewed
    viewerLogo?: JSX.Element; // Set this if you want to display a logo for your viewer; Preferably a SVG
    viewer: () => JSX.Element; // The React component that will be rendered when the viewer is selected
}