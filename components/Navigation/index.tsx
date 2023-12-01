import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { setNavHeight, useDispatch } from '../../redux';

const Navigation = () => {
	// set navigation height
	const dispatch = useDispatch();
	const navRef = useRef(null as null | HTMLDivElement);
	useEffect(() => {
		if (navRef.current) {
			dispatch(setNavHeight(navRef.current?.clientHeight));
		}
	}, []);

	return (
		<header className="py-4" ref={navRef}>
			<div className="container">
				<Link
					className="w-max mx-auto flex items-center justify-center gap-2"
					href={'/'}
				>
					<img className="block w-10" src="./img/logo.webp" />
					<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7331531005923711"
							crossOrigin="anonymous"></script>
					<p>TikTok Downloader With Username</p>
				</Link>
			</div>
		</header>
	);
};

export default Navigation;
