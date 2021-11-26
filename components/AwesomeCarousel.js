import AwesomeSlider from "react-awesome-slider";
import styles from "../styles/carousel.module.scss";

export default function AwesomeCarousel(props) {
	return (
		<AwesomeSlider {...props} cssModule={props.cssModule ?? styles} className={[props.className].join(" ")}>
			{props.children}
		</AwesomeSlider>
	);
}
