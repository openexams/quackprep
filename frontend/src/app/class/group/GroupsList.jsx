import { useSelector } from 'react-redux';
import { Header, Segment, Card, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfIncludingItems, selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import GroupEditor from '@src/app/creator/forms/GroupEdit';
import { selectEditState } from '@src/app/auth/authSlice';
import GroupCard from './GroupCard';
import { useState } from 'react';

export default function GroupsList() {
  const editModeOn = useSelector(selectEditState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setStateFilter] = useState(searchParams.get('filter') || '');
  const { navbar } = useSelector(selectNavbarState);
  const { className, classId } = navbar;
  const loading = useSelector(selectLoadingState).loadingComps.GroupsList;
  const groups = selectArrayOfIncludingItems(
    useSelector(selectBINARYArrayOfStateById('app.group.groups', 'class_id', classId)),
    ['name'],
    [filter || ''],
  );
  console.log(filter);

  function setFilter(newStr) {
    searchParams.set('filter', newStr);
    setSearchParams(searchParams);
    setStateFilter(newStr);
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
          {editModeOn && <GroupEditor class_id={classId} />}
        </Card.Group>
      </Segment>
    </Container>
  );
}
