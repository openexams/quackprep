import { useDispatch, useSelector } from 'react-redux';
import { Header, Segment, Card, Button, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfIncludingItem, selectBINARYArrayOfStateById, turnUnderscoreIntoSpace } from 'maddox-js-funcs';
import { changeNavbarPage, selectNavbarState, updateCurrentGroupData } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function GroupsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';
  const { navbar } = useSelector(selectNavbarState);
  const { className, classId, schoolName } = navbar;
  const loading = useSelector(selectLoadingState).loadingComps.GroupsList;
  const groups = selectArrayOfIncludingItem(
    useSelector(selectBINARYArrayOfStateById('app.group.groups', 'class_id', classId)),
    'name',
    filter || '',
  );
  const dispatch = useDispatch();

  function setFilter(newStr) {
    searchParams.set('filter', newStr);
    setSearchParams(searchParams);
  }
  return (
    <Container>
      <Segment loading={loading} basic>
        <Header as='h2' color='blue' dividing>
          <Icon name='book' />
          <Header.Content>
            {className}: Study by Groups
            <Header.Subheader>Select a topic to start studying</Header.Subheader>
          </Header.Content>
        </Header>
        <Searchbar setValue={setFilter} value={filter} placeholder={'Search groups'} />
        <Card.Group itemsPerRow={3} stackable>
          {groups &&
            groups.map((group) => (
              <Card key={group.id} raised>
                <Card.Content>
                  <Card.Header>{turnUnderscoreIntoSpace(group.name)}</Card.Header>
                  <Card.Description>{group.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    fluid
                    color='blue'
                    onClick={() => {
                      dispatch(updateCurrentGroupData(group.id, group.name));
                      dispatch(changeNavbarPage(navigate, `/class/${schoolName}/${classId}/group/${group.id}/question`)); // /group may cause issues
                    }}
                  >
                    <Icon name='fork' />
                    Study Group
                  </Button>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Container>
  );
}
