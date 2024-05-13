import React, { useState } from 'react';
import Slider from 'react-slider';
import '../App.css'; 




const doubleSlider = ({min,max,values,setValues}) => {
   
    return (
        <>
        <div className="slider-container">

            <Slider
            className="horizontal-slider react-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderTrack={(props, state) => (
                <div {...props} key={state.index} style={{
                    ...props.style,
                    backgroundColor: state.index === 1 ? '#2563EB' : '#ddd'
                }} />
            )}
            renderThumb={(props, state) => (
                <div {...props}>
                  <div className="thumb-value">{state.valueNow}</div>
                </div>
              )}
            onChange={setValues}
            value={values}
            withTracks={true}
            pearling={true}
            min={min}
            max={max}
            defaultValue={[min, max]}
        />
        </div>
        {/* <div className="slider-labels">
        <span className="slider-min-max">{min}</span>
        <span className="slider-min-max">{max}</span>
      </div> */}
        </>
    );
};

export default doubleSlider;
