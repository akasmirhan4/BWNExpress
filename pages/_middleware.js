import { NextResponse, NextRequest } from "next/server";

export async function middleware(req, ev) {
	// const { currentUser } = auth;
	const { pathname } = req.nextUrl;

	// console.log({ currentUser });

	// if (currentUser) {
	// 	if (pathname == "/") return NextResponse.redirect("/dashboard");
	// } else {
	if (pathname == "/") return NextResponse.redirect("/home");
	// 	if (pathname == "/dashboard") return NextResponse.redirect("/home");
	// }

	return NextResponse.next();
}
