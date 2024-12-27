import './streak.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Segment, Header, Icon, Statistic, Progress, Button } from 'semantic-ui-react';
import { getStreak, selectStreakData, claimStreak } from './streakSlice';
import { Streak } from 'maddox-js-funcs';

const MilestoneLabel = ({ days, color }) => (
  <Segment color={color} size='tiny' className='milestone-label'>
    <Icon name='trophy' /> {days} Days
  </Segment>
);

export default function StreakPage() {
  const { streak } = useSelector(selectStreakData);
  const dispatch = useDispatch();
  const streakClass = new Streak(streak.lastClaim);

  useEffect(() => {
    if (!streak.currentStreak && streak.hasStreak !== null) {
      dispatch(getStreak());
    }
  }, [streak.hasStreak]);

  const handleCheckIn = () => {
    dispatch(claimStreak());
  };

  const milestones = [
    { days: 1, color: 'red' },
    { days: 5, color: 'green' },
    { days: 10, color: 'teal' },
    { days: 30, color: 'blue' },
    { days: 60, color: 'purple' },
    { days: 90, color: 'brown' },
    { days: 180, color: 'grey' },
    { days: 365, color: 'black' },
    { days: 1095, color: 'yellow' },
  ];

  /**
   * Determines difference from the current goal you already hit to the next goal and returns a % based off of that
   * @returns {Int} Percent 0-100
   */
  function calculateRelativeGoal() {
    for (let i = 1; i < milestones.length; i++) {
      if (streak.currentStreak >= milestones[i - 1].days && streak.currentStreak < milestones[i].days) {
        const percent = (100 * (streak.currentStreak - milestones[i - 1].days)) / (milestones[i].days - milestones[i - 1].days);
        return percent;
      }
    }
    return 0;
  }

  // let relative_dist = goal - last_goal
  // let percent = curstreak/relative_dist

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment raised>
              <Header as='h2'>
                <Icon name='fire' color='orange' />
                <Header.Content>Daily Streak</Header.Content>
              </Header>
              <Statistic size='huge' color='orange'>
                <Statistic.Value>{streak.currentStreak}</Statistic.Value>
                <Statistic.Label>Days</Statistic.Label>
              </Statistic>
              <Progress percent={calculateRelativeGoal(streak.currentStreak)} indicating size='small' className='mt-4'>
                Progress To Next Badge {/**does not check if u alr have the badge */}
              </Progress>
              <Button
                primary
                fluid
                size='large'
                className='mt-4'
                onClick={() => handleCheckIn()}
                disabled={!streakClass.canClaimStreak()}
              >
                {streakClass.canClaimStreak() ? 'Check In for Today' : 'Already Claimed Today'}
              </Button>
              <Header as='h4'>Last Claim:</Header>
              <Segment basic>{streak?.lastClaim ? new Date(streak.lastClaim).toLocaleString() : 'Not claimed yet'}</Segment>
            </Segment>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment raised>
              <Header as='h2'>
                <Icon name='trophy' color='yellow' />
                <Header.Content>Longest Streak</Header.Content>
              </Header>
              <Statistic size='huge' color='yellow'>
                <Statistic.Value>{streak.longestStreak}</Statistic.Value>
                <Statistic.Label>Days</Statistic.Label>
              </Statistic>
            </Segment>
            <Segment raised>
              <Header as='h3'>Milestones</Header>
              <div className='milestone-container'>
                {milestones.map(
                  ({ days, color }) => streak.longestStreak >= days && <MilestoneLabel key={days} days={days} color={color} />,
                )}
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
