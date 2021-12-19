import Head from "next/head";
import { useRouter } from "next/router";

export default function CustomHead(props) {
	const { title, iconPath, metaName, metaContent, links } = props;
	const { route } = useRouter();
	const routeTitle = title ?? routeToString(route);
	return (
		<Head>
			<title>{`BWNExpress | ${routeTitle}`}</title>
			<meta name={metaName ?? "description"} content={metaContent ?? "Generated by create next app"} />
			<link rel="icon" href={iconPath ?? "/favicon.ico"} />
			{!!links && links.map((link, index) => <link key={index} rel="stylesheet" href={link} />)}
		</Head>
	);
}

function routeToString(route) {
	route = route.split("/")[route.split("/").length - 1];
	route = route.replace(/\-/g, " ");
	var splitStr = route.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(" ");
}
