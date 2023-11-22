export interface ViewerMetadata {
	title: string;
	description?: string;
	compatibilityCheck: (props: FileProps) => boolean; // Return true if the viewer can handle the file
	viewer: (props: FileProps) => JSX.Element; // The React component that will be rendered when the viewer is selected
}

export interface FileProps {
	url: string;
	filename: string;
	contentType?: string;
	size?: number;
}
