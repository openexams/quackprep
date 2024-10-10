import './leaderboard.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Icon, Grid, Card, List, Image } from 'semantic-ui-react';
import { getTopStreaks, getWhichUsersAnsweredMostQuestions, selectLeaderboardState } from './leaderboardSlice';

const TOP_X_AMT = 5;

const LeaderboardCard = ({ title, icon, iconColor, data, dataKey }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        <Icon name={icon} color={iconColor} /> {title}
      </Card.Header>
    </Card.Content>
    <Card.Content>
      <List size='large' divided relaxed>
        {data &&
          data.map((item, index) => (
            <List.Item key={item.user_id}>
              <List.Content floated='right'>
                <strong>{item[dataKey]}</strong>
              </List.Content>
              <Image avatar src={item.icon || `https://api.dicebear.com/6.x/initials/svg?seed=${item.username}`} />
              <List.Content>
                <List.Header>{item.username}</List.Header>
                <List.Description>Rank: {index + 1}</List.Description>
              </List.Content>
            </List.Item>
          ))}
      </List>
    </Card.Content>
  </Card>
);

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { streaks, questionsAnswered } = useSelector(selectLeaderboardState).leaderboard;

  useEffect(() => {
    if (!streaks) dispatch(getTopStreaks(TOP_X_AMT));
    if (!questionsAnswered) dispatch(getWhichUsersAnsweredMostQuestions());
  }, [dispatch, streaks, questionsAnswered]);

  return (
    <Container>
      <Header as='h1' textAlign='center' icon>
        <Icon name='trophy' color='yellow' className='cool-hover cool-click' />
        Leaderboard
        <Header.Subheader>Top performers in streaks and questions answered</Header.Subheader>
      </Header>

      <Grid columns={2} stackable centered style={{ marginTop: '2rem' }}>
        <Grid.Column>
          <LeaderboardCard title='Highest Streak Holders' icon='fire' iconColor='red' data={streaks} dataKey='current_streak' />
        </Grid.Column>
        <Grid.Column>
          <LeaderboardCard
            title='Most Questions Answered'
            icon='question'
            iconColor='blue'
            data={questionsAnswered}
            dataKey='questions_answered'
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
