import './class.css';
import { Container, Grid, Header, Segment, Divider, Icon, Menu, Message, Transition } from 'semantic-ui-react';
import { useState } from 'react';
import ClassCard, { getIconByCategory } from './ClassCard';
import { useSelector } from 'react-redux';
import { selectClassCategories } from './class_categories/classCategorySlice';
import { selectLoadingState } from '../store/loadingSlice';
import ClassEditor from '../creator/forms/ClassEditor';
import { selectArrayOfIncludingItems, selectArrayOfIncludingItemsByNumber, selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectEditState } from '../auth/authSlice'; // cuz anyone can make classes
import ClassCardCTA from './class_cta/ClassCardCTA';
import ClassSearch from './ClassSearch';
import { selectUser } from '../auth/authSlice';
export default function ClassList() {
  const user_id = useSelector(selectUser).user?.id;
  const [classFilter, setClassFilter] = useState('');
  let { schoolId: curSchoolId } = useSelector(selectNavbarState).navbar;

  const loading = useSelector(selectLoadingState).loadingComps?.ClassList;
  const classCategories = useSelector(selectClassCategories).class_categories;
  const [curCategory, setCurCategory] = useState('');
  const [visible, setVisible] = useState(true);
  const edit = useSelector(selectEditState);

  let classes = useSelector(selectBINARYArrayOfStateById('app.class.classes.classes', 'school_id', curSchoolId));
  classes = selectArrayOfIncludingItems(classes, ['name'], [classFilter]);
  let filteredClasses = curCategory
    ? selectArrayOfIncludingItemsByNumber(classes, ['category'], [parseInt(curCategory)])
    : classes;
  // only show classes with no content to user who owns the class
  filteredClasses = filteredClasses
    ? filteredClasses.filter((c) => c.pdf_id !== null || c.group_id !== null || c.created_by === user_id)
    : null;

  const handleCategoryChange = (category) => {
    setVisible(false);
    setTimeout(() => {
      setCurCategory(category);
      setVisible(true);
    }, 300);
  };

  return (
    <Container>
      <Segment loading={loading}>
        <ClassSearch setClassFilter={setClassFilter} classFilter={classFilter} />

        <Header.Subheader>
          {curCategory
            ? `Showing ${filteredClasses?.length} classes in ${classCategories.find((c) => c.id === curCategory)?.name}`
            : `Showing all ${classes?.length} available classes`}
        </Header.Subheader>

        <Container style={{ backgroundColor: '#f9fafb' }}>
          {/* The category menu remains as is */}

          <Menu pointing fluid widths={classCategories?.length + 1} stackable>
            <Menu.Item name='All Classes' active={curCategory === ''} onClick={() => handleCategoryChange('')} icon='list' />
            {classCategories?.map((category, index) => (
              <Menu.Item
                key={index}
                name={category.name}
                active={curCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
                icon={getIconByCategory(category.id)}
              />
            ))}
          </Menu>

          {/* Wrap Transition.Group with a scrollable container */}
          <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '1rem' }}>
            <Transition.Group as={Grid} duration={300} animation='fade' stackable columns={3}>
              {!edit && (
                <Grid.Column key={'cta_card'}>
                  <ClassCardCTA />
                </Grid.Column>
              )}
              {visible && filteredClasses?.length > 0
                ? filteredClasses.map((c, index) => (
                    <Grid.Column key={index}>
                      <ClassCard
                        group_id={c.group_id}
                        pdf_id={c.pdf_id}
                        id={c.id}
                        name={c.name}
                        category={c.category}
                        desc={c.description}
                        school_id={c.school_id}
                        created_by={c.created_by}
                        created_username={c.created_username}
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
          </div>
        </Container>

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
