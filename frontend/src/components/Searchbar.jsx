import { Input, Icon, Transition } from 'semantic-ui-react';
import { useState } from 'react';

export default function Searchbar({ value, setValue, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Input
        fluid
        size='large'
        icon
        value={value}
        onChange={(e, data) => setValue(data.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={isFocused ? 'focused-search' : ''}
      >
        <input />
        <Transition visible={!value} animation='scale' duration={200}>
          <Icon name='search' color='grey' />
        </Transition>
        <Transition visible={value} animation='scale' duration={200}>
          <Icon name='close' color='grey' link onClick={() => setValue('')} style={{ cursor: 'pointer' }} />
        </Transition>
      </Input>

      <style>{`
        .ui.input {
          transition: all 0.3s ease;
        }

        .ui.input input {
          border-radius: 25px !important;
          padding-left: 20px !important;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .ui.icon.input > i.icon {
          opacity: 0.5;
          transition: all 0.2s ease;
        }

        .ui.icon.input > i.icon:hover {
          opacity: 1;
        }

        .focused-search input {
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-1px);
        }

        .ui.input input:focus {
          border-color: #2185d0 !important;
        }
      `}</style>
    </div>
  );
}
