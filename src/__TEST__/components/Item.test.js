import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Item from '../../components/Item';

Enzyme.configure({ adapter: new Adapter() });

describe('<Item />', () => {
  const props = {
    date: 'date',
    size: 11,
    face: 'face',
    price: 123
  };
  const wrapper = shallow(<Item {...props} />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
