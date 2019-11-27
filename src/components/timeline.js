import React, { useRef, useEffect } from 'react'
import { initTimeline } from '../utils';
function Timeline({ animation }) {
  const timeline = useRef(null);
  useEffect(() => {
    let tl = initTimeline(timeline.current, animation);
    animation.setTimeline(tl)
  }, [animation]);
  return (<div ref={timeline} style={{ width: '100%', height: 50 }}></div>)
}

export default Timeline;