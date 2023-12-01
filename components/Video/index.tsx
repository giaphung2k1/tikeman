import axios from 'axios';
import Image from 'next/image';
import 'node_modules/video-react/dist/video-react.css';
import React, { useRef, useState } from 'react';
import { AiOutlineDownload, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdDownloadDone, MdOutlineContentCopy } from 'react-icons/md';
import { RxClipboardCopy } from 'react-icons/rx';
import { Player } from 'video-react';
import { Adsense } from '@ctrl/react-adsense';

const Video = ({
    videoData,
}: {
    videoData: {
        video_id: number;
        title: string;
        play: string;
        cover: string;
        wmplay: string;
        origin_cover: string;
        author: { id: number; unique_id: string; avatar: string; nickname: string };
    };
}) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [downloadProcess, setDownloadProcess] = useState<any>(0);
    const progressRef = useRef<any>();

    const onDownloadProgress = (e: any) => {
        var loaded = Math.floor((e.loaded / e.total) * 100);
        setDownloadProcess(loaded);

        if (loaded === 100) {
            setLoading(false);
            setDownloadProcess(0);
        }
    };

    const onDownload = () => {
        setLoading(true);

        axios
            .get(videoData.play, {
                responseType: 'blob',
                onDownloadProgress: (e) => {
                    onDownloadProgress(e);
                },
            })
            .then((response) => {
                let tempUrl = URL.createObjectURL(response.data);
                let aTag = document.createElement('a');
                aTag.href = tempUrl;
                aTag.download = 'video';
                document.body.appendChild(aTag);
                aTag.click();
                aTag.remove();
            });
        setDownloaded(true);
    };

    return (
        <>
            <div className="w-full bg-gray-700 rounded-md overflow-hidden">
                <div className="px-2 py-2 mb-2 flex gap-3 items-start">
                    <Image
                        width={50}
                        height={50}
                        src={videoData.author.avatar}
                        alt="Avatar"
                        className="rounded-full shadow-lg"
                    />
                    <div className="w-full overflow-hidden pt-1">
                        <h3 className="text-sm leading-none font-bold">
                            {videoData.author.unique_id}
                        </h3>
                        <p className="text-lg">{videoData.title.slice(0, 60)}...</p>
                    </div>
                </div>
                <Player
                    playsInline
                    poster={videoData.origin_cover}
                    src={videoData.play}
                />
                <div className="flex gap-2 px-2 py-3">
                    {/* Download and Copy URL buttons */}
                    <a
                        className={`${
                            downloaded ? 'bg-yellow-600 shadow-lg' : 'bg-yellow-300'
                        } text-gray-700 px-3 py-2 rounded flex items-center gap-2 shadow-md transition duration-150 ease-in-out hover:bg-yellow-400 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-600 active:shadow-lg cursor-pointer disabled:opacity-75 disabled:cursor-progress`}
                        href={`/api/hello?filename=${videoData.play}&name=${videoData.video_id}`} download
                    >
                        {isLoading && (
                            <>
                                <span className="animate-spin">
                                    <AiOutlineLoading3Quarters />
                                </span>
                                <span>Downloading...</span>
                            </>
                        )}
                        {!isLoading && (
                            <>
                                {downloaded ? <MdDownloadDone /> : <AiOutlineDownload />}
                                <span>{downloaded ? 'Downloaded' : 'Download'}</span>
                            </>
                        )}
                    </a>

                    <button
                        className={`${
                            copied ? 'bg-yellow-600 shadow-lg' : 'bg-yellow-300'
                        } text-gray-700 px-3 py-2 rounded flex items-center gap-2 shadow-md transition duration-150 ease-in-out hover:bg-yellow-400 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-600 active:shadow-lg`}
                        onClick={() => {
                            navigator.clipboard.writeText(videoData.play);
                            setCopied(true);
                        }}
                    >
                        {copied ? <RxClipboardCopy /> : <MdOutlineContentCopy />}
                        <span>{copied ? 'Copied' : 'Copy URL'}</span>
                    </button>
                </div>
            </div>

            {/* Adsense Ad under each video */}
            <div className="my-4">
                <Adsense
                    client="ca-pub-7331531005923711"
                    slot="8387500170"
                    style={{ display: "inline-block", width: 500, height: 300 }}
                    format=""
                />
            </div>
        </>
    );
};

export default Video;
