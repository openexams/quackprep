import { useSelector } from 'react-redux';
import { Header, Segment, Card, Container, Icon, Label } from 'semantic-ui-react';
import { selectArrayOfIncludingItems, selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import GroupEditor from '@src/app/creator/forms/GroupEdit';
import { selectCanAndIsEdit } from '@src/app/auth/authSlice';
import GroupCard from './GroupCard';
import { useEffect, useState } from 'react';
import { GROUP_TYPES } from './groupSlice';
import CreateGroupByPDF from './CreateGroupByPDF';

export default function GroupsList() {
  const { className, classId } = useSelector(selectNavbarState).navbar;

  const editModeOn = useSelector(selectCanAndIsEdit());

  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setStateFilter] = useState(searchParams.get('filter') || '');
  const types = GROUP_TYPES;
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const loading = useSelector(selectLoadingState).loadingComps.GroupsList;
  const groups = selectArrayOfIncludingItems(
    useSelector(selectBINARYArrayOfStateById('app.group.groups', 'class_id', classId)),
    ['name', 'type'],
    [filter || '', typeFilter],
  );

  function setFilter(newStr) {
    searchParams.set('filter', newStr);
    setSearchParams(searchParams);
    setStateFilter(newStr);
  }

  // handles if type selected has no groups
  useEffect(() => {
    if (groups?.length === 0 && typeFilter) {
      window.alert(`no ${typeFilter}s found`);
      handleTypeClick('');
    }
  }, [groups, typeFilter]);

  function handleTypeClick(type) {
    if (typeFilter === type) {
      // If clicking the active filter, clear it
      searchParams.delete('type');
      setSearchParams(searchParams);
      setTypeFilter('');
    } else {
      // Set new filter
      searchParams.set('type', type);
      setSearchParams(searchParams);
      setTypeFilter(type);
    }
  }

  return (
    <Container>
      <Segment loading={loading} basic>
        <Header as='h2' color='blue' dividing>
          <Icon name='book' />
          <Header.Content>
            {className}: Study by Groups
            <Header.Subheader>Select content to start studying</Header.Subheader>
          </Header.Content>
        </Header>

        <div style={{ marginBottom: '1rem' }}>
          <Searchbar setValue={setFilter} value={filter} placeholder={'Search groups'} />
          {types.map((type) => (
            <Label
              key={type}
              as='a'
              color={typeFilter === type ? 'blue' : 'grey'}
              onClick={() => handleTypeClick(type)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: typeFilter && typeFilter !== type ? 0.6 : 1,
              }}
            >
              {type}
              {typeFilter === type && <Icon name='close' style={{ marginLeft: '4px' }} />}
            </Label>
          ))}
        </div>

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
        {editModeOn && <CreateGroupByPDF classId={classId} /> /* ai group */}
      </Segment>
    </Container>
  );
}
