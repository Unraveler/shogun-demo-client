import React from 'react';

import {
  render
} from '@testing-library/react';

import {
  MapFishPrintV3Manager
} from '@terrestris/mapfish-print-manager';

import LayoutSelect from './index';

describe('<LayoutSelect />', () => {

  let printManager: MapFishPrintV3Manager;

  beforeEach(() => {
    // @ts-ignore
    printManager = new MapFishPrintV3Manager({});
  });

  it('is defined', () => {
    expect(LayoutSelect).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(<LayoutSelect printManager={printManager} />);
    expect(container).toBeVisible();
  });

});
