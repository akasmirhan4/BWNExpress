/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { useRouter } from "next/router";

export default function CustomHead(props) {
	const { title, metaName, metaContent, links } = props;
	const { route } = useRouter();
	const routeTitle = title ?? routeToString(route);
	return (
		<Head>
			<title>{`BWNExpress | ${routeTitle}`}</title>
			<meta name={metaName ?? "description"} content={metaContent ?? "Generated by create next app"} />
			<meta name="viewport" content="width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
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
