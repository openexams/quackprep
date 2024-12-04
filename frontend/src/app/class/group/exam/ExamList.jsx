import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Segment, Card, Button, Container, Icon } from 'semantic-ui-react';
import { selectArrayOfStateById, selectBINARYArrayOfStateById } from '../../../../../../libs/maddox-js-funcs/functions';
import { changeNavbarPage, selectNavbarState, updateCurrentGroupData } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { useNavigate } from 'react-router-dom';

export default function ExamList() {
  const navigate = useNavigate();
  const { navbar } = useSelector(selectNavbarState);
  const { className, classId } = navbar;
  const loadingObject = useSelector(selectLoadingState).loadingComps;
  const exams = useSelector(selectBINARYArrayOfStateById('app.exam.exams', 'class_id', classId));
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
                  <Card.Header>{`${exam.name}`}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    fluid
                    color='blue'
                    onClick={() => {
                      dispatch(updateCurrentGroupData(exam.id, exam.name));
                      dispatch(changeNavbarPage(navigate, `${exam.name}/question`));
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
