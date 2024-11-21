import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Segment, Card, Button, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfIncludingItem, selectBINARYArrayOfStateById, turnUnderscoreIntoSpace } from '@utils/functions';
import { changeNavbarPage, selectNavbarState, updateCurrentGroupData } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import Searchbar from '@components/Searchbar';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function TopicsShow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';
  const { navbar } = useSelector(selectNavbarState);
  const { className, classId, schoolName } = navbar;
  const loadingObject = useSelector(selectLoadingState).loadingComps;
  const topics = selectArrayOfIncludingItem(
    useSelector(selectBINARYArrayOfStateById('app.topic.topics', 'class_id', classId)),
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
      <Segment loading={loadingObject.TopicsShow} basic>
        <Header as='h2' color='blue' dividing>
          <Icon name='book' />
          <Header.Content>
            {className}: Study by Topics
            <Header.Subheader>Select a topic to start studying</Header.Subheader>
          </Header.Content>
        </Header>
        <Searchbar setValue={setFilter} value={filter} placeholder={'Search Topics'} />
        <Card.Group itemsPerRow={3} stackable>
          {topics &&
            topics.map((topic) => (
              <Card key={topic.id} raised>
                <Card.Content>
                  <Card.Header>{turnUnderscoreIntoSpace(topic.name)}</Card.Header>
                  <Card.Description>{topic.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    fluid
                    color='blue'
                    onClick={() => {
                      dispatch(updateCurrentGroupData(topic.id, topic.name));
                      dispatch(changeNavbarPage(navigate, `/class/${schoolName}/${className}/topic/${topic.name}/question`));
                    }}
                  >
                    <Icon name='fork' />
                    Study Topic
                  </Button>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Container>
  );
}
