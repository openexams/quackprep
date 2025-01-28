import { Input, Dropdown, Grid, Icon } from 'semantic-ui-react';

export default function ClassSearch({ classFilter, setClassFilter }) {
  return (
    <Grid stackable>
      <Grid.Column width={16}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em', maxWidth: '800px', margin: '0 auto' }}>
          {/* Search Input */}
          <Input
            size='big'
            icon
            fluid
            placeholder='Search for classes...'
            value={classFilter}
            onChange={(e, { value }) => setClassFilter(value)}
            style={{ flex: 1 }}
          >
            <input />
            <Icon name='search' />
          </Input>
        </div>
      </Grid.Column>
    </Grid>
  );
}
