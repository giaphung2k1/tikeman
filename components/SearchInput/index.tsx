import axios from 'axios';
import React, { useRef, useState } from 'react';
import {Adsense} from '@ctrl/react-adsense';
import {
	RootState,
	setPagination,
	setVideoLoading,
	setVidoes,
	useDispatch,
	useSelector,
} from '../../redux';
import { Feed } from '../index';
import { toast } from 'react-toastify';

const SearchInput = () => {
	const [error, setError] = useState<null | string>(null);
	const [videos, setvideos] = useState<any>(null);
	const inputRef = useRef<any>();
	const btnRef = useRef<any>();
	const siteState = useSelector((state: RootState) => state.site);

	// get user post
	const dispatch = useDispatch();
	const getUserPost = (value: string) => {
		var options = null;


		if ((value.includes('tiktok.com') && value.includes('/video/')) || value.match(/(vt\.tiktok\.com\/[A-Za-z0-9]+)+/g)) {
			// get video by url
			options = {
				method: 'GET',
				url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
				params: { url: value, hd: '0', count: '1000' },
				headers: {
					'X-RapidAPI-Key':
						'533115be6amsh2515f73f171c6f1p160d9djsn833294e42f10',
					'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com',
				},
			};
		} else if (!value.includes('tiktok.com') && !value.includes('@')) {
			setError('please enter a correct username with @!');
			dispatch(setVideoLoading(false));
		} else {
			// get user videos by username
			options = {
				method: 'GET',
				url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts',
				params: {
					unique_id: value,
					count: '1000',
				},
				headers: {
					'X-RapidAPI-Key':
						'533115be6amsh2515f73f171c6f1p160d9djsn833294e42f10',
					'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com',
				},
			};
		}

		if (options) {
			axios
				.request(options)
				.then(function (response) {
					if (response.data.msg === 'success') {
						var videoArray = null;
						var feedTitle = null;
						if (response.data.data.videos) {
							videoArray = response.data.data.videos;
							feedTitle = 'User Vidoes';
						} else {
							videoArray = [response.data.data];
							feedTitle = 'Videso';
						}

						if (videoArray) {
							dispatch(
								setVidoes({
									title: feedTitle,
									videos: videoArray,
								})
							);
							setvideos(videos);
							dispatch(setVideoLoading(false));
						}
					} else {
						// setError('username or video url is wrong.');
						toast.error("username or video url is wrong.")
						dispatch(setVideoLoading(false));
					}
					console.log(response.data);
				})
				.catch(function (error) {
					console.error(error);
					toast.error("There is an error")
					dispatch(setVideoLoading(false));
				});
		}
	};

	// clear error
	const onClickInput = () => {
		setError(null);
		dispatch(setPagination({ currentPage: 0 }));
	};

	// onclick search button
	const onSearch = () => {
		if (inputRef.current.value) {
			dispatch(setVideoLoading(true));
			const searchValue: any = inputRef.current.value;
			getUserPost(searchValue);
		} else {
			setError('search field is required.');
		}
	};

	return (
		<>
			<div className="pt-32 pb-4">
				<div className="container">
					<h2 className="text-lg font-bold text-center">
						Enter Tiktok Username/URL
					</h2>
					<p className="text-center mb-4">
						Download Tiktok video without watermark wih username Use @ Before name
					</p>
					<div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center justify-center">
						<input
							ref={inputRef}
							onClick={onClickInput}
							className="max-w-sm w-full py-2 px-4 outline-0 rounded-md text-gray-700"
							placeholder="Type username or past url"
						/>
						<button
							onClick={onSearch}
							className="inline-block rounded bg-yellow-300 px-6 py-2 uppercase text-gray-700 shadow-md transition duration-150 ease-in-out hover:bg-yellow-400 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-600 active:shadow-lg cursor-pointer disabled:opacity-75 disabled:cursor-progress"
							disabled={siteState.videoLoading}
						>
							{siteState.videoLoading ? 'loading...' : 'SEARCH'}
						</button>
					</div>
					<p
						className={`text-red-500 mt-2 transition duration-150 ease-in-out ${
							!error ? 'opacity-0' : 'opacity-1'
						}`}
					>
						error: {error}
					</p>
					<div className="w-full  flex justify-center text-center">
						<a href="https://snap.storyclone.com/" type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 gap-2 hover:cursor-pointer">
						<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5404 18.6947C20.0401 18.3741 20.6836 18.4316 21.6521 17.8965C22.269 17.5559 21.9175 17.3459 21.7185 17.2464C18.2115 15.5503 17.652 12.9278 17.6277 12.731C17.5967 12.4944 17.5636 12.3087 17.8223 12.0699C18.0722 11.8377 19.1844 11.15 19.4918 10.9355C20.0003 10.5795 20.2259 10.2235 20.06 9.7857C19.9451 9.48498 19.662 9.36999 19.3635 9.36999C19.2706 9.36999 19.1756 9.38105 19.0849 9.40095C18.5255 9.52257 17.9815 9.80339 17.6675 9.87857C17.6255 9.88963 17.5857 9.89405 17.5525 9.89405C17.3867 9.89405 17.3248 9.81887 17.338 9.61765C17.3778 9.00514 17.4619 7.81108 17.3646 6.69442C17.2319 5.15762 16.7366 4.39696 16.1484 3.72475C15.8654 3.40191 14.5453 2 12.0024 2C9.46609 2 8.13936 3.40191 7.85632 3.72475C7.26814 4.39917 6.77283 5.15983 6.64015 6.69442C6.54286 7.81108 6.63131 9.00514 6.66669 9.61765C6.67774 9.81003 6.62025 9.89405 6.4522 9.89405C6.41903 9.89405 6.38144 9.88963 6.33721 9.87857C6.02322 9.80339 5.47926 9.52257 4.91982 9.40095C4.82916 9.38105 4.73408 9.36999 4.64121 9.36999C4.3427 9.36999 4.05966 9.48277 3.94468 9.7857C3.77883 10.2235 4.00217 10.5795 4.51296 10.9355C4.82032 11.15 5.93256 11.8377 6.18243 12.0699C6.44114 12.3109 6.40797 12.4967 6.37702 12.731C6.35048 12.9278 5.79325 15.5503 2.28626 17.2464C2.08062 17.3459 1.73125 17.5559 2.34818 17.8965C3.31669 18.4294 3.96015 18.3719 4.45989 18.6947C4.88444 18.9689 4.63458 19.5593 4.94194 19.7716C5.32005 20.0347 6.44335 19.7539 7.8917 20.2315C9.10345 20.6317 9.84421 21.7617 12.0001 21.7617C14.1517 21.7617 14.9145 20.6273 16.1086 20.2315C17.5569 19.7539 18.678 20.0347 19.0584 19.7716C19.3657 19.5593 19.1158 18.9689 19.5404 18.6947Z" stroke="#000000" stroke-linejoin="round"/>
</svg> Try Snapchat<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
					<a href="https://insta.storyclone.com/" type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 gap-2 hover:cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg> Try Instagram<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
					</div>
					<div className="w-full  flex justify-center text-center">
					<Adsense
						client="ca-pub-7331531005923711"
						slot="8387500170"
						style={{ display: 'block', maxWidth: 500 }}
						layout="in-article"
						format="fluid"
					/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchInput;
