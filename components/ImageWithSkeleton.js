import React, { useState } from "react";
import Image from "next/image";
import { Box, Skeleton } from "@mui/material";

export default function ImageWithSkeleton(props) {
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	return (
		<Box sx={props.containersx} width="100%" height="100%" position="relative">
			{!isImageLoaded && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />}
			<Image
				{...props}
				onLoadingComplete={() => {
					setIsImageLoaded(true);
				}}
			/>
		</Box>
	);
}
