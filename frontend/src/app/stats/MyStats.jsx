import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Grid, Segment, Icon, Card, Statistic, Accordion, Label } from 'semantic-ui-react';
import { getMyStats, selectMYStatsState } from './statsSlice';
import { selectUser } from '../auth/authSlice';
import LoginRequired from '../auth/LoginRequired';
import { selectLoadingState } from '../store/loadingSlice';

export default function MyStats() {
  const user_id = useSelector(selectUser)?.user?.id;
  const [aOpen, setAOpen] = useState(false);
  const dispatch = useDispatch();
  const myStats = useSelector(selectMYStatsState);
  const correct_answer_count = myStats?.correct_answer_count;
  const total_questions_answered = myStats?.total_questions_answered;
  const time_spent = myStats?.time_spent;
  const loading = useSelector(selectLoadingState).loadingComps?.MyStats;
  useEffect(() => {
    if (user_id) {
      dispatch(getMyStats());
      setAOpen(true);
    } else {
      setAOpen(false);
    }
  }, [user_id]);

  const handleAccordionClick = () => setAOpen(!aOpen);

  return (
    <Container fluid>
      <Accordion fluid styled>
        <Accordion.Title active={aOpen} onClick={handleAccordionClick}>
          <Icon name='chart line' />
          My Learning Stats
          <Icon name={aOpen ? 'angle up' : 'angle down'} />
        </Accordion.Title>

        <Accordion.Content active={aOpen}>
          <Segment basic loading={loading}>
            {user_id ? (
              <Grid columns={3} divided stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Statistic color='blue'>
                      <Statistic.Value>{total_questions_answered}</Statistic.Value>
                      <Statistic.Label>Total Questions Answered</Statistic.Label>
                    </Statistic>
                  </Grid.Column>

                  <Grid.Column>
                    <Statistic color='green'>
                      <Statistic.Value>{correct_answer_count}</Statistic.Value>
                      <Statistic.Label>Current Correct Answers</Statistic.Label>
                    </Statistic>
                  </Grid.Column>

                  <Grid.Column>
                    <Statistic color='purple'>
                      <Statistic.Value>{time_spent || 0} min</Statistic.Value>
                      <Statistic.Label>Time Spent</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (
              <LoginRequired title={'myStats'} />
            )}
          </Segment>
        </Accordion.Content>
      </Accordion>
    </Container>
  );
}
