import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux'; // Ensure this is imported from the correct place
import { setFooterHeight } from '../../redux';
import { Adsense } from '@ctrl/react-adsense';

const Footer = () => {
    const dispatch = useDispatch();
    const footerRef = useRef<HTMLDivElement>(null); // Explicitly defining the type

    useEffect(() => {
        if (footerRef.current) {
            dispatch(setFooterHeight(footerRef.current.clientHeight));
        }
    }, [dispatch]);

    return (
        <footer ref={footerRef}>
            <div className="container">
                <div className="flex justify-center items-center gap-4 border-t py-2">
                    <Link href={'/disclaimer'} legacyBehavior>
                        <a>Disclaimer</a>
                    </Link>
                    <Link href={'/privacy'} legacyBehavior>
                        <a>Privacy Policy</a>
                    </Link>
                </div>
                <div className="w-full flex justify-center text-center">
                    <Adsense
                        client="ca-pub-7331531005923711"
                        slot="8387500170"
						style={{ display: 'block' }}
						layout="in-article"
						format="fluid"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
