import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	Form,
	FieldState,
	FieldType,
	FormResult,
	FormResultState,
} from "@source-cooperative/components";
import { Box, Heading, Divider } from "theme-ui";
import { ViewerLoader } from "../components/viewers/viewer";
import Layout from "../components/Layout";

export default function Home() {
	const router = useRouter();
	const [url, setUrl] = useState(null);
	const [selectedViewer, setSelectedViewer] = useState(null);

	const [urlState, setUrlState] = useState({
		state: FieldState.INVALID,
		message: null,
	});

	useEffect(() => {
		if (!router.isReady) {
			return;
		}

		if (router.query.url) {
			setUrl(router.query.url as string);
		} else {
			setUrl(null);
		}

		if (router.query.viewer) {
			setSelectedViewer(router.query.viewer as string);
		} else {
			setSelectedViewer(null);
		}
	}, [router.query]);

	var fields = [
		{
			id: "url",
			required: true,
			type: FieldType.TEXT,
			title: "File URL",
			defaultValue: url,
			state: urlState,
			validationDelay: 1,
			setState: (state: { state: FieldState; message?: string }) => {
				setUrlState({
					state: state.state,
					message: state.message,
				});
			},
			onValidation: (val: string) => {
				setUrlState({
					state: FieldState.VALID,
					message: null,
				});
			},
		},
	];

	function onSubmit(values: { [key: string]: string }): Promise<FormResult> {
		return new Promise((resolve, reject) => {
			resolve({
				state: FormResultState.SUCCESS,
				onSuccess: () => {
					router.query.url = values.url;
					router.query.viewer = null;
					router.push(router);
					setSelectedViewer(null);
					setUrl(values.url);
				},
			});
		});
	}

	return (
		<Layout>
			<Box sx={{ py: 2 }}>
				<Form
					onSubmit={onSubmit}
					gridColumns={["auto", "auto", "auto", "auto"]}
					fields={fields}
					submitText="Preview File"
				/>
			</Box>

			{url ? (
				<>
					<Divider />
					<ViewerLoader
						url={url}
						viewerId={selectedViewer}
						onViewerSelected={(viewerId: string) => {
							setSelectedViewer(viewerId);
							router.query.viewer = viewerId;
							router.push(router);
						}}
					/>
				</>
			) : (
				<></>
			)}
		</Layout>
	);
}
