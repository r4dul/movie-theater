import React from 'react';
import {animated, useSpring} from 'react-spring';

const ScrollTracker = props => {
    const style = useSpring({
        width: `${props.position}%`
    })

    return (
        <div className="scroll-tracker">
            <animated.div className="scroll-tracker__gauge" style={style}/>
        </div>
    )
}

export default ScrollTracker;