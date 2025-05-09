import { useSelector } from 'react-redux';
import { Header, Segment, Card, Container, Icon, Label, Divider } from 'semantic-ui-react';
import { selectArrayOfIncludingItems, selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import GroupEditor from '@app/creator/forms/GroupEdit';
import { selectCanAndIsEdit } from '@app/auth/authSlice';
import GroupCard from './GroupCard';
import { useEffect, useState } from 'react';
import { GROUP_TYPES } from './groupSlice';
import CreateGroupByPDF from './CreateGroupByPDF';
import NoItemsFound from '@components/NoItemsFound';
import ClassVote from '../vote/ClassVote';

export default function GroupsList() {
  const { className, classId } = useSelector(selectNavbarState).navbar;

  const editModeOn = useSelector(selectCanAndIsEdit());

  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setStateFilter] = useState(searchParams.get('filter') || '');
  const types = GROUP_TYPES;
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const loading = useSelector(selectLoadingState).loadingComps.GroupsList;
  /** @type {import('../../../../../types').Group[]} */
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
  // on component mount and they chose a selection which has no groups, show all groups.
  useEffect(() => {
    if (!loading && groups?.length === 0) {
      handleTypeClick('');
    }
  }, [loading]); // dont want to run this on every groups change but idk why this works ngl

  return (
    <Container>
      <Segment loading={loading} basic>
        <Header as='h2' color='blue' dividing>
          <Icon name='book' />
          <Header.Content>
            {className}: Study by {typeFilter || 'Groups'} <Header.Subheader>Select content to start studying</Header.Subheader>
          </Header.Content>
        </Header>
        <ClassVote class_id={classId} />

        <div style={{ marginBottom: '1rem' }}>
          <Searchbar setValue={setFilter} value={filter} placeholder={'Search groups'} />
          <Label
            key={'All'}
            as='a'
            color={typeFilter === '' ? 'blue' : 'grey'}
            onClick={() => handleTypeClick('')}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: typeFilter && typeFilter !== '' ? 0.6 : 1,
            }}
          >
            {'All'}
            {typeFilter === '' && <Icon name='close' style={{ marginLeft: '4px' }} />}
          </Label>
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
        {groups?.length === 0 && <NoItemsFound message={'sort by all groups to see more!'} />}

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
                  school_id={group.school_id}
                />
              );
            })}
          {editModeOn && <GroupEditor class_id={classId} />}
        </Card.Group>
        <Divider style={{ marginTop: '5rem' }} />
        {editModeOn && <CreateGroupByPDF classId={classId} /> /* ai group */}
      </Segment>
    </Container>
  );
}
