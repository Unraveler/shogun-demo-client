import React, {
  ReactNode,
  useEffect,
  useState
} from 'react';

import {
  faClock
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';

import {
  Divider
} from 'antd';

import moment from 'moment';

import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';

import type {
  MarkObj
} from 'rc-slider/es/Marks';

import {
  useTranslation
} from 'react-i18next';

import TimeSlider, {
  TimeSliderProps
} from '@terrestris/react-geo/dist/Slider/TimeSlider/TimeSlider';

import './index.less';

interface WmsTimeSliderProps extends Omit<TimeSliderProps, 'min' | 'max' | 'marks' | 'useRange' |
  'onChange' | 'defaultValue' | 'value' | 'formatString'> {
  layer: OlLayerTile<OlSourceTileWMS> | OlLayerImage<OlSourceImageWMS>;
}

export const WmsTimeSlider: React.FC<WmsTimeSliderProps> = ({
  layer,
  ...passThroughProps
}) => {
  const [value, setValue] = useState<string | [string, string]>(layer.getSource()?.getParams().TIME);
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();
  const [marks, setMarks] = useState<Record<string | number, string> | undefined>();

  const {
    t
  } = useTranslation();

  useEffect(() => {
    const timeValues = layer.get('dimension')?.values?.split(',');

    if (!timeValues || timeValues.length === 0) {
      return;
    }

    setMin(timeValues[0]);
    setMax(timeValues[timeValues.length - 1]);
    setValue(timeValues[timeValues.length - 1]);

    const m: Record<string | number, string> = {};
    timeValues.forEach((val: string, idx: number) => {
      m[val] = moment(val).format('YYYY-MM-DD');
    });

    setMarks(m);

    if (timeValues.default === 'current') {
      let nearest: [number, string] = [NaN, ''];
      Object.values(m).forEach(d => {
        let diff = moment().diff(moment(d));

        if (diff < nearest[0]) {
          nearest = [diff, d];
        }
      });

      setValue(nearest[1]);
    }
  }, [layer]);

  const onChange = (val: string | [string, string]) => {
    setValue(val);

    layer.getSource()?.updateParams({
      TIME: val
    });
  };

  return (
    <div
      className="wms-time-slider"
    >
      <Divider>
        <FontAwesomeIcon
          icon={faClock}
        />
        {t('WmsTimeSlider.title')}
      </Divider>
      {
        marks ?
          <TimeSlider
            min={min}
            max={max}
            marks={marks}
            value={value}
            onChange={onChange}
            step={null}
            {...passThroughProps}
          /> :
          <span>
            {t('WmsTimeSlider.warning')}
          </span>
      }
    </div>
  );
};

export default WmsTimeSlider;
