import React, { useCallback, useEffect, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import "./AgeMultiRange.css";

const MultiRangeSlider = ({ minVal, maxVal, setMinVal, setMaxVal }) => {
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);
  const min = 0;
  const max = 20;

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  return (
    <div className="relative flex mt-[.5rem] pt-[1.5rem] pb-[1rem] items-center justify-center rounded-md border-[1px] border-[#bbc6cc]">
        <div className="absolute top-[-12%] left-[4%] px-[.25rem] bg-white text-[.65rem] text-[#7e97a9]">Age Range (Years)</div>
        <div className="flex flex-col">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                ref={minValRef}
                onChange={(event) => {
                const value = Math.min(+event.target.value, maxVal - 1);
                setMinVal(value);
                event.target.value = value.toString();
                }}
                className={classnames("thumb thumb--zindex-3", {
                "thumb--zindex-5": minVal > max - 100
                })}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                ref={maxValRef}
                onChange={(event) => {
                const value = Math.max(+event.target.value, minVal + 1);
                setMaxVal(value);
                event.target.value = value.toString();
                }}
                className="thumb thumb--zindex-4"
            />
            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
            </div>
            <div className="relative p-[1rem]">
                <div style={{ position: 'absolute', left: `${minVal*4.5}%` }}>{minVal}</div>
                <div style={{ position: 'absolute', left: `${maxVal*4.5+2}%` }}>{maxVal}</div>
            </div>
        </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
};

export default MultiRangeSlider;
