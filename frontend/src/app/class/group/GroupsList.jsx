import { useDispatch, useSelector } from 'react-redux';
import { Header, Segment, Card, Button, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfIncludingItem, selectBINARYArrayOfStateById, turnUnderscoreIntoSpace } from 'maddox-js-funcs';
import { changeNavbarPage, selectNavbarState, updateCurrentGroupData } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GroupEditor from '@src/app/creator/editor/GroupEdit';
import { selectEditState, selectUser } from '@src/app/auth/authSlice';
import GroupCard from './GroupCard';

export default function GroupsList() {
  const user_id = useSelector(selectUser).user?.id;
  const editModeOn = useSelector(selectEditState);
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
            groups.map((group) => {
              return (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  description={group.desc}
                  class_id={group.class_id}
                  created_by={group.created_by}
                  type={group.type}
                />
              );
            })}
        </Card.Group>
      </Segment>
    </Container>
  );
}
