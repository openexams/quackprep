import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Segment, Form, Button, Divider, Icon } from 'semantic-ui-react';
import { selectLoadingState } from '@src/app/store/loadingSlice';

export default function Settings() {
  const loadingObject = useSelector(selectLoadingState).loadingComps;

  const handleChange = (e, { name, value }) => {
    // setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // dispatch(updateUserSettings(localSettings));
  };

  return (
    <Container style={{ marginTop: '7rem' }}>
      NOT READY FOR PROD
      <Segment loading={loadingObject.SettingsPage} padded>
        <Header as='h2' color='blue' dividing>
          <Icon name='settings' />
          <Header.Content>
            User Settings
            <Header.Subheader>Manage your account settings</Header.Subheader>
          </Header.Content>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Form.Input label='Display Name' name='displayName' value={null} onChange={handleChange} />
          <Form.Select
            label='Theme'
            name='theme'
            options={[
              { key: 'light', text: 'Light', value: 'light' },
              { key: 'dark', text: 'Dark', value: 'dark' },
            ]}
            value={null}
            onChange={handleChange}
          />
          <Form.Checkbox
            label='Receive email notifications'
            name='emailNotifications'
            checked={null}
            onChange={(e, data) => handleChange(e, { name: 'emailNotifications', value: data.checked })}
          />

          <Divider />

          <Button type='submit' primary>
            Save Settings
          </Button>
        </Form>
      </Segment>
    </Container>
  );
}
