import './leaderboard.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Icon, Grid, Card, List, Image, Segment, Label, Progress, Statistic } from 'semantic-ui-react';
import { getTopStreaks, getWhichUsersAnsweredMostQuestions, selectLeaderboardState } from './leaderboardSlice';
import { selectLoadingState } from '../store/loadingSlice';
import CreatorBadge from '@components/CreatorBadge';

const TOP_X_AMT = 5; // Keep 5

// Utility function: Return a medal trophy for top 3 ranks
const getMedalIcon = (index) => {
  if (index === 0) return <Icon size='large' name='trophy' color='yellow' />;
  if (index === 1) return <Icon size='large' name='trophy' color='grey' />;
  if (index === 2) return <Icon size='large' name='trophy' color='brown' />;
  return null;
};

const LeaderboardCard = ({ title, icon, iconColor, data, dataKey }) => (
  <Card fluid className='leaderboard-card' key={title}>
    <Card.Content className='leaderboard-card-header'>
      <Card.Header>
        <Icon name={icon} color={iconColor} /> {title}
      </Card.Header>
    </Card.Content>
    <Card.Content className='leaderboard-card-content'>
      <List divided relaxed>
        {data &&
          data.map((item, index) => (
            <List.Item key={`${index} + ${item.username}`} className='leaderboard-card-item'>
              {/* Rank + Medal */}
              {/* <div className='player-rank'>
                {getMedalIcon(index)}
                <Label circular color={index === 0 ? 'yellow' : 'grey'}>
                  {index + 1}
                </Label>
              </div> */}

              {/* User Avatar */}
              <Image size='large' avatar src={item.icon || `https://api.dicebear.com/6.x/initials/svg?seed=${item.username}`} />

              {/* User Info */}
              <List.Content>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <List.Header as='h3'>{item.username}</List.Header>
                  {item?.is_creator == 1 && <CreatorBadge />}
                </div>
                <List.Description>
                  <Statistic value={item[dataKey]} />
                  {dataKey === 'current_streak' ? 'day streak' : 'questions answered'}
                </List.Description>

                {/* Progress bar to show relative achievement vs. top user */}
                {/* <Progress
                  percent={Math.round(Math.min((item[dataKey] / data[0][dataKey]) * 100, 100))}
                  size='small'
                  color={index === 0 ? 'yellow' : 'grey'}
                  className='player-progress'
                  progress
                /> */}
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
  const loading = useSelector(selectLoadingState).loadingComps?.Leaderboard;

  useEffect(() => {
    if (!streaks) {
      dispatch(getTopStreaks(TOP_X_AMT));
    }
    if (!questionsAnswered) {
      dispatch(getWhichUsersAnsweredMostQuestions());
    }
  }, [dispatch, streaks, questionsAnswered]);

  return (
    <Container style={{ marginTop: '-8rem' }} className='leaderboard-container'>
      <Header as='h1' textAlign='center' icon className='leaderboard-main-header'>
        <Icon name='trophy' color='yellow' className='cool-hover cool-click' />
        Leaderboard
        <Header.Subheader>Celebrate our top performers!</Header.Subheader>
      </Header>

      <Segment raised loading={loading} className='leaderboard-segment'>
        <Grid columns={2} stackable centered>
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
      </Segment>
    </Container>
  );
}
