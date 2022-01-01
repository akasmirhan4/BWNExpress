import AwesomeSlider from "react-awesome-slider";
import styles from "styles/carousel.module.scss";
import mainStyles from "styles/main.module.scss";

export default function AwesomeCarousel(props) {
	return (
		<AwesomeSlider {...props} cssModule={props.cssModule ?? styles} className={mainStyles.dropShadow} >
			{props.children}
		</AwesomeSlider>
	);
}
