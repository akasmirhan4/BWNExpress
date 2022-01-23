import { LoadingButton } from "@mui/lab";
import { Box, Button, FormHelperText, Link, Tooltip, Typography } from "@mui/material";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "lib/firebase";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";

export default function CustomUploadButton(props) {
	const [loading, setLoading] = useState(false);

	const {
		tooltip = "",
		label = "",
		errors = [],
		accept = "image/jpeg,image/png,application/pdf,.doc,.docx,.txt",
		onChange = () => {},
		required,
		maxFile = 4,
		type = "unknown",
	} = props;

	return (
		<Fragment>
			<Tooltip title={tooltip} placement="top" arrow enterTouchDelay={100}>
				<LoadingButton
					loading={loading}
					variant={!errors.length ? "contained" : "outlined"}
					color={!errors.length ? "accent" : "error"}
					sx={{
						color: !errors.length ? "white.main" : "error.main",
					}}
					size="large"
					fullWidth
					component="label"
				>
					{label}
					{required ? " *" : ""}
					<input
						type="file"
						hidden
						multiple={maxFile > 1}
						accept={accept}
						onChange={async (e) => {
							setLoading(true);
							try {
								const { files } = e.currentTarget;
								if (required && !files.length) {
									toast.error("No file selected");
									return;
								}
								if (files.length > maxFile) {
									toast.error(`Please select max ${maxFile} files only`);
									return;
								}

								for (let i = 0; i < files.length; i++) {
									if (files[i].size > 5 * 1024 * 1024) {
										toast.error("File(s) exceed 5MB. Please compress before uploading the file(s).");
										return;
									}
									let acceptFileTypes = [];
									const acceptArray = accept.split(",");
									if (acceptArray.includes("image/jpeg")) acceptFileTypes.push("image/jpeg", "image/png");
									if (acceptArray.includes("application/pdf")) acceptFileTypes.push("application/pdf");
									if (acceptArray.includes(".doc"))
										acceptFileTypes.push("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain");
									if (!acceptFileTypes.includes(files[i].type)) {
										toast.error("Upload images, pdf files, or word files only");
										return;
									}
								}

								const orderID = window.sessionStorage.getItem("orderID");
								if (!orderID) throw "missing orderID";

								const getURL = (file) => {
									return new Promise(async (resolve) => {
										const storageRef = ref(storage, `users/${auth.currentUser.uid}/orders/${orderID}/${type}/${file.name}`);
										await uploadBytes(storageRef, file);
										const URL = await getDownloadURL(storageRef);
										resolve({ URL, ref: storageRef, name: file.name, type: file.type });
									});
								};

								let batchPromises = [];
								// Delete all files in folder
								const folderRef = ref(storage, `users/${auth.currentUser.uid}/orders/${orderID}/${type}`);
								const batchDelete = await listAll(folderRef).then((results) => results.items.map(deleteObject));
								await Promise.all(batchDelete);

								for (let i = 0; i < files.length; i++) {
									batchPromises.push(getURL(files[i]));
								}

								await toast.promise(Promise.all(batchPromises).then(onChange), { loading: "uploading...", success: "File(s) selected 😎" });
							} catch (e) {
								console.error(e);
								toast.error(JSON.stringify(e));
							}
							setLoading(false);
						}}
					/>
				</LoadingButton>
			</Tooltip>
			{props.value?.length > 0 && <Typography sx={{ mt: 1 }}>{`File${props.value?.length > 1 ? "s" : ""} selected:`}</Typography>}
			<Box>
				{props.value?.length > 0 &&
					props.value?.map((doc, index) => (
						<Link href={doc?.URL} key={index} target={"_blank"}>
							<Typography variant="body2">{doc?.name}</Typography>
						</Link>
					))}
			</Box>
			<FormHelperText error>{errors.join(" , ")}</FormHelperText>
		</Fragment>
	);
}
