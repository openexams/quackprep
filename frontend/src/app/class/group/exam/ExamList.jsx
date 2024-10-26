import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Segment, Card, Button, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfStateById, turnUnderscoreIntoSpace } from '@utils/functions';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';

export default function ExamList() {
  const { navbar } = useSelector(selectNavbarState);
  const { className, classId } = navbar;
  const loadingObject = useSelector(selectLoadingState).loadingComps;
  const exams = useSelector(selectArrayOfStateById('app.exam.exams', 'class_id', classId));
  const dispatch = useDispatch();

  return (
    <Container>
      <Segment loading={loadingObject.ExamList} basic>
        <Header as='h2' color='blue' dividing>
          <Icon name='book' />
          <Header.Content>
            {className}: Study by Exam
            <Header.Subheader>Select a exam to start studying</Header.Subheader>
          </Header.Content>
        </Header>

        <Card.Group itemsPerRow={3} stackable>
          {exams &&
            exams.map((exam, index) => (
              <Card key={index} raised>
                <Card.Content>
                  <Card.Header>{turnUnderscoreIntoSpace(`${exam.semester} ${exam.year} Exam ${exam.exam_num}`)}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    fluid
                    color='blue'
                    onClick={() => {
                      //dispatch(updateCurrentTopicData(topic.id, topic.name)); // TODO CHOSE EXAM UPDATE GROUP NAME AND ID
                      dispatch(changeNavbarPage(`${exam.semester}_${exam.year}_${exam.exam_num}/question`));
                    }}
                  >
                    <Icon name='fork' />
                    Study Exam
                  </Button>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Container>
  );
}
