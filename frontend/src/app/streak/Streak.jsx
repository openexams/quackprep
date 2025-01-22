import './streak.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Segment, Header, Icon, Statistic, Progress, Button, Step } from 'semantic-ui-react';
import { getStreak, selectStreakData, claimStreak } from './streakSlice';
import { Streak } from 'maddox-js-funcs';
import Confetti from 'react-confetti'; // <-- Make sure to install react-confetti or remove if not used

export default function StreakPage() {
  const { streak } = useSelector(selectStreakData);
  const dispatch = useDispatch();
  const streakClass = new Streak(streak.lastClaim);

  // State to handle confetti celebration
  const [justClaimed, setJustClaimed] = useState(false);

  // Optional: If you want the confetti sized to the window
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!streak.currentStreak && streak.hasStreak !== null) {
      dispatch(getStreak());
    }
  }, [streak.hasStreak, streak.currentStreak, dispatch]);

  const handleCheckIn = () => {
    dispatch(claimStreak()).then(() => {
      setJustClaimed(true);
      // Turn off confetti after 4 seconds
      setTimeout(() => setJustClaimed(false), 4000);
    });
  };

  const milestones = [
    { days: 1, color: 'red', label: 'Newcomer' },
    { days: 5, color: 'green', label: 'Rising Star' },
    { days: 10, color: 'teal', label: 'Streaking!' },
    { days: 30, color: 'blue', label: 'Committed' },
    { days: 60, color: 'purple', label: 'Disciplined' },
    { days: 90, color: 'brown', label: 'Veteran' },
    { days: 180, color: 'grey', label: 'Master' },
    { days: 365, color: 'black', label: 'Legend' },
    { days: 1095, color: 'yellow', label: 'Grandmaster' },
  ];

  /**
   * Determines difference from the current goal you already hit to the next goal
   * and returns a percentage (0-100) for the progress bar
   */
  function calculateRelativeGoal() {
    for (let i = 1; i < milestones.length; i++) {
      if (streak.currentStreak >= milestones[i - 1].days && streak.currentStreak < milestones[i].days) {
        const percent = (100 * (streak.currentStreak - milestones[i - 1].days)) / (milestones[i].days - milestones[i - 1].days);
        return Math.floor(percent);
      }
    }
    // If we exceed the largest milestone, just return 100
    if (streak.currentStreak >= milestones[milestones.length - 1].days) {
      return 100;
    }
    return 0;
  }

  /**
   * Finds the next milestone not yet achieved. Returns -1 if none remain.
   */
  function nextMilestoneIndex() {
    return milestones.findIndex((m) => streak.currentStreak < m.days);
  }

  return (
    <Container className='streak-page-container'>
      <Segment raised basic>
        {/* Confetti effect (only show when user has just claimed) */}
        {justClaimed && <Confetti width={windowSize.width} height={windowSize.height} />}

        <Grid stackable>
          <Grid.Row>
            {/* LEFT COLUMN - Daily Streak */}
            <Grid.Column width={8}>
              <Segment raised className='gamified-segment'>
                <Header as='h2' className='trophy-header'>
                  <Icon name='fire' color='orange' size='large' />
                  <Header.Content>Daily Streak</Header.Content>
                </Header>
                <Statistic size='huge' color='orange'>
                  <Statistic.Value>{streak.currentStreak || 0}</Statistic.Value>
                  <Statistic.Label>Days</Statistic.Label>
                </Statistic>

                <Progress percent={calculateRelativeGoal()} indicating size='large' className='mt-4'>
                  Progress to Next Milestone
                </Progress>

                <Button
                  primary
                  fluid
                  size='large'
                  className='mt-4'
                  onClick={handleCheckIn}
                  disabled={!streakClass.canClaimStreak()}
                >
                  {streakClass.canClaimStreak() ? 'Check In for Today' : 'Already Claimed Today'}
                </Button>

                <Header as='h4' className='mt-4'>
                  Last Claim:
                </Header>
                <Segment basic>{streak?.lastClaim ? new Date(streak.lastClaim).toLocaleString() : 'Not claimed yet'}</Segment>
              </Segment>
            </Grid.Column>

            {/* RIGHT COLUMN - Longest Streak & Milestones */}
            <Grid.Column width={8}>
              {/* Longest Streak */}
              <Segment raised className='gamified-segment'>
                <Header as='h2' className='trophy-header'>
                  <Icon name='trophy' color='yellow' size='large' />
                  <Header.Content>Longest Streak</Header.Content>
                </Header>
                <Statistic size='huge' color='yellow'>
                  <Statistic.Value>{streak.longestStreak || 0}</Statistic.Value>
                  <Statistic.Label>Days</Statistic.Label>
                </Statistic>
              </Segment>

              {/* Milestones Display */}
              <Segment raised className='gamified-segment'>
                <Header as='h3'>Milestones Achieved</Header>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Step.Group size='mini' ordered className='milestones-step-group'>
                    {milestones.map((milestone, index) => {
                      const achieved = streak.longestStreak >= milestone.days;
                      const isNext = index === nextMilestoneIndex();
                      return (
                        <Step
                          key={milestone.days}
                          completed={achieved}
                          disabled={!achieved && !isNext}
                          active={isNext}
                          className={isNext ? 'milestone-active' : ''}
                          color={achieved ? milestone.color : undefined}
                        >
                          {!achieved && <Icon name={'trophy'} />}
                          <Step.Content>
                            <Step.Title>{milestone.label}</Step.Title>
                            <Step.Description>{milestone.days} Days</Step.Description>
                          </Step.Content>
                        </Step>
                      );
                    })}
                  </Step.Group>
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
}
