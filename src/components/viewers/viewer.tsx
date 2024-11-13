// Import your viewer and add it to the viewers object below with a unique ID

import { viewerMetadata as markdown } from "./markdown";
import { viewerMetadata as text } from "./text";
import { viewerMetadata as map } from "./map";
import { viewerMetadata as table } from "./table";

export const viewers = {
	markdown: markdown,
	text: text,
	map: map,
	table: table,
};

import { useState, useEffect } from "react";
import { Box, Heading, Text, Grid } from "theme-ui";
import { Button } from "@source-cooperative/components";

interface ViewerLoaderProps {
	url: string;
	viewerId?: string;
	onViewerSelected?: (viewerId: string) => void;
}

interface FileProps {
	url: string;
	filename: string;
	contentType?: string;
	size?: number;
}

export function ViewerLoader(props: ViewerLoaderProps) {
	const { url, viewerId, onViewerSelected } = props;
	const [fileProps, setFileProps] = useState<FileProps>(null);
	const [compatibleViewers, setCompatibleViewers] = useState(null);

	useEffect(() => {
		if (!url) {
			return;
		}
		const fprops = {
			url: url,
			filename: (url as string).split("/").pop(),
		};

		setFileProps(fprops);

		var compatibleViewers = [];

		for (const [viewerId, viewerMetadata] of Object.entries(viewers)) {
			if (viewerMetadata.compatibilityCheck(fprops)) {
				compatibleViewers.push({
					id: viewerId,
					metadata: viewerMetadata,
				});
			}
		}

		setCompatibleViewers(compatibleViewers);
	}, [url]);

	if (!compatibleViewers) {
		return (
			<Box
				sx={{
					py: 2,
					justifyContent: "center",
					display: "flex",
				}}
			>
				<Text
					sx={{
						fontFamily: "mono",
						fontSize: 3,
					}}
				>
					Loading...
				</Text>
			</Box>
		);
	}

	if (viewerId && viewers[viewerId]) {
		const viewerMetadata = viewers[viewerId];

		return (
			<Box sx={{ py: 2 }}>
				{
					<viewerMetadata.viewer
						url={fileProps.url}
						filename={fileProps.filename}
					/>
				}
				<Box sx={{ py: 2 }}>
					<Button
						onClick={(e) => {
							onViewerSelected(null);
						}}
					>
						Change View
					</Button>
				</Box>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 2 }}>
			<Heading as="h2">Select a Viewer</Heading>
			<Grid sx={{ gridTemplateColumns: "1fr" }}>
				{compatibleViewers.length == 0 ? (
					<Text>No compatible viewers found.</Text>
				) : (
					compatibleViewers.map((viewer, i) => {
						const { id, metadata } = viewer;

						return (
							<Button
								key={`viewer-${i}`}
								onClick={(e) => {
									if (onViewerSelected) {
										onViewerSelected(id);
									}
								}}
							>
								{metadata.title}
							</Button>
						);
					})
				)}
			</Grid>
		</Box>
	);
}
