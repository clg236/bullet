import React, { useState, useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'video.js/dist/video-js.css';
import styled from 'styled-components';
import './video.css'

const VideoWrapper = styled.div`
    display: flex;
    align-items: stretch;
`;

const testStream = 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8'

const videoJsOptions = {
    autoplay: true,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controls: true,
    smoothQualityChange: true,
    liveui: true,
    aspectRatio: '16:9',
    fluidui: true,
    controlBar: {
      children: [
        {
          name: 'playToggle'
        },
        {
          name: 'volumePanel',
          
        },
        {
            name: 'progressControl',
        },
        {
          name: 'fullscreenToggle'
        },
        {
          name: 'liveDisplay'
        }
      ]
    },
    sources: [
      {
        src: testStream,
        type: 'application/mpegUrl',
      },
    ],
    poster: 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
    plugins: {
  
    }
  };

  export default function VideoPlayer() {

    const videoRef = useRef();
    let player;

    useEffect(() => {
        // whatever we do when component mounts
        player = videojs(videoRef.current, videoJsOptions, function onPlayerReady() {
            console.log('player ready');      
        });
    
        let qualityLevels = player.qualityLevels();
    
        // Listen to change events for when the player selects a new quality level
        qualityLevels.on('change', function() {
            console.log('Quality Level changed!');
            console.log('New level:', qualityLevels[qualityLevels.selectedIndex]);
        });
    
        return() => {
        // whatever we do when component unmounts
        if(player) {
            player.dispose();
        }
        }
      }, []);
      
      return (
          <VideoWrapper>
             <video ref={ videoRef } className="custom vjs-fill video-js vjs-tech vjs-big-play-centered" playsInline></video>
          </VideoWrapper>
      )
  }