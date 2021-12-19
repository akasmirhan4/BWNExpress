import { Collapse, Fade, Grow, Slide, Zoom } from "@mui/material";
import React, { useState } from "react";
import VizSensor from "react-visibility-sensor";

export default function VizSensorComponent(props) {
	let [active, setActive] = useState(false);
	const transition = props.transition ?? "fade";

	switch (transition) {
		case "fade":
			return (
				<VizSensor
					onChange={(isVisible) => {
						setActive(isVisible);
					}}
				>
					<Fade in={active} timeout={props.timeout ?? 1000}>
						{props.children}
					</Fade>
				</VizSensor>
			);
		case "grow":
			return (
				<VizSensor
					onChange={(isVisible) => {
						setActive(isVisible);
					}}
				>
					<Grow in={active} timeout={props.timeout ?? 1000}>
						{props.children}
					</Grow>
				</VizSensor>
			);
		case "slide":
			return (
				<VizSensor
					onChange={(isVisible) => {
						setActive(isVisible);
					}}
				>
					<Slide container={props.containerRef?.current ?? null} direction={props.direction ?? "up"} in={active} timeout={props.timeout ?? 1000}>
						{props.children}
					</Slide>
				</VizSensor>
			);
		case "zoom":
			return (
				<VizSensor
					onChange={(isVisible) => {
						setActive(isVisible);
					}}
				>
					<Zoom in={active} timeout={props.timeout ?? 1000}>
						{props.children}
					</Zoom>
				</VizSensor>
			);
		default:
			return null;
	}
}
