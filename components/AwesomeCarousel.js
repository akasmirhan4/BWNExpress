import withAutoplay from "react-awesome-slider/dist/autoplay";
import AwesomeSlider from "react-awesome-slider";
import styles from "styles/carousel.module.scss";
import mainStyles from "styles/main.module.scss";

const AutoplaySlider = withAutoplay(AwesomeSlider);

export default function AwesomeCarousel(props) {
	return (
		<AutoplaySlider {...props} play cancelOnInteraction={false} interval={6000} cssModule={props.cssModule ?? styles} className={mainStyles.dropShadow}>
			{props.children}
		</AutoplaySlider>
	);
}
