import './class.css';
import { Container, Grid, Header, Segment, Divider, Icon, Menu, Message, Transition } from 'semantic-ui-react';
import { useState } from 'react';
import ClassCard from './ClassCard';
import { useSelector } from 'react-redux';
import { selectClassCategories } from './class_categories/classCategorySlice';
import { selectLoadingState } from '../store/loadingSlice';
import ClassEditor from '../creator/editor/ClassEditor';
import { selectEditState } from '../auth/authSlice';
import { selectArrayOfIncludingItemsByNumber } from 'maddox-js-funcs';

export default function ClassList({ classes }) {
  const loading = useSelector(selectLoadingState).loadingComps?.ClassList;
  const classCategories = useSelector(selectClassCategories).class_categories;
  const edit = useSelector(selectEditState);
  const [curCategory, setCurCategory] = useState('');
  const [visible, setVisible] = useState(true);

  let filteredClasses = curCategory
    ? selectArrayOfIncludingItemsByNumber(classes, ['category'], [parseInt(curCategory)])
    : classes;

  const handleCategoryChange = (category) => {
    setVisible(false);
    setTimeout(() => {
      setCurCategory(category);
      setVisible(true);
    }, 300);
  };

  return (
    <Container>
      <Segment padded basic>
        <Header.Subheader>
          {curCategory
            ? `Showing ${filteredClasses.length} classes in ${classCategories.find((c) => c.id === curCategory)?.name}`
            : `Showing all ${classes.length} available classes`}
        </Header.Subheader>

        <Segment loading={loading} raised>
          <Menu pointing secondary fluid widths={classCategories.length + 1}>
            <Menu.Item name='All Classes' active={curCategory === ''} onClick={() => handleCategoryChange('')} icon='list' />
            {classCategories.map((category, index) => (
              <Menu.Item
                key={index}
                name={category.name}
                active={curCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
                icon={category.icon || 'book'} // Assuming you might want to add icons for categories
              />
            ))}
          </Menu>

          <Transition.Group as={Grid} duration={300} animation='fade' stackable columns={4} padded>
            {visible && filteredClasses.length > 0
              ? filteredClasses.map((c, index) => (
                  <Grid.Column key={index}>
                    <ClassCard
                      id={c.id}
                      name={c.name}
                      category={c.category}
                      desc={c.description}
                      school_id={c.school_id}
                      user_id={c.created_by}
                    />
                  </Grid.Column>
                ))
              : visible && (
                  <Grid.Column width={16}>
                    <Message
                      icon='search'
                      header='No Classes Found'
                      content='There are no classes available in this category yet.'
                      info
                    />
                  </Grid.Column>
                )}
          </Transition.Group>
        </Segment>

        {edit && (
          <>
            <Divider horizontal>
              <Header as='h4'>
                <Icon name='plus' />
                Add New Class
              </Header>
            </Divider>
            <Segment raised>
              <ClassEditor />
            </Segment>
          </>
        )}
      </Segment>
    </Container>
  );
}
