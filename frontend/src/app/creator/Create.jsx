import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassesByUserId, selectClassState } from '../class/classSlice';
import { getTopicsByUserId, selectTopicState } from '../class/group/topic/topicSlice';
import { getExamsByUserId, selectExamsState } from '../class/group/exam/examSlice';
import {
  deleteQuestionById,
  getQuestionsByUserId,
  selectQuestionState,
  upsertQuestionWithGroupIds,
} from '../class/question/questionSlice';
import { getChoicesByUserId, selectChoicesState } from '../class/question/choices/choicesSlice';
import { useEffect } from 'react';
import { selectUser } from '../auth/authSlice';
import { selectLoadingState } from '../store/loadingSlice';
import { Accordion, Segment, Container, Icon, Grid, Header, Divider } from 'semantic-ui-react';
import { upsertClass, deleteClassById } from '../class/classSlice';
import ItemEdit from '@components/ItemEdit';
import { upsertTopic, deleteTopicById } from '../class/group/topic/topicSlice';
import { deleteExamById, upsertExam } from '../class/group/exam/examSlice';
import { upsertChoice, deleteChoiceById } from '../class/question/choices/choicesSlice';
import { selectArrayOfIncludingItemsByNumber } from 'maddox-js-funcs';
import CreateFilter from './CreateFilter';
import SchoolsList from '../class/school/SchoolsList';
import { getSchools } from '../class/school/schoolSlice';
import { getClassCategories } from '../class/class_categories/classCategorySlice';
import CategoryList from '../class/class_categories/CategoryList';
import { hide401Msg, show401Msg } from '@components/401/401Slice';
import { deletePdfById, getPdfsByUserId, selectPdfsState, upsertPdf } from '../class/group/pdf/pdfSlice';

export default function Create() {
  const [filter, setFilter] = useState({
    school_id: '',
    class_type: '',
    class_id: '',
    group_id: '',
    question_id: '',
    choice_id: '',
    pdf_id: '',
  });
  const dispatch = useDispatch();

  /**
   * Get the classes, topics, exams, questions, and choices that match the filter
   */
  const classes = selectArrayOfIncludingItemsByNumber(
    useSelector(selectClassState).classes,
    ['school_id', 'category', 'id'],
    [filter.school_id, filter.class_type, filter.class_id],
  );
  const pdfs = selectArrayOfIncludingItemsByNumber(
    useSelector(selectPdfsState).pdfs,
    ['school_id', 'class_category', 'class_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.pdf_id],
  );
  const topics = selectArrayOfIncludingItemsByNumber(
    useSelector(selectTopicState).topics,
    ['school_id', 'class_category', 'class_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id],
  );
  const exams = selectArrayOfIncludingItemsByNumber(
    useSelector(selectExamsState).exams,
    ['school_id', 'class_category', 'class_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id],
  );
  const questions = selectArrayOfIncludingItemsByNumber(
    useSelector(selectQuestionState).questions,
    ['school_id', 'class_category', 'class_id', 'group_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id, filter.question_id],
  );

  const choices = selectArrayOfIncludingItemsByNumber(
    useSelector(selectChoicesState).choices,
    ['school_id', 'class_category', 'class_id', 'group_id', 'question_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id, filter.question_id, filter.choice_id],
  );

  // ******************************* //

  const user = useSelector(selectUser).user;
  const loading = useSelector(selectLoadingState).loadingComps?.Create;

  // map questions so that questions with different group ids are merged into one

  const [activeIndex, setActiveIndex] = useState(null);
  // data.active is what it active before the click
  function handleAccordClick(event, data) {
    if (data.active === false) {
      setActiveIndex(data.index);
    } else {
      setActiveIndex(-1);
    }
  }

  function loadAccords(arr) {
    return arr.map((val, index) => {
      return (
        <Accordion key={index}>
          <Accordion.Title active={activeIndex === index} index={index} onClick={handleAccordClick}>
            <Icon name='dropdown' />
            {val.name}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            <Grid key={index} columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
              {val.component}
            </Grid>
          </Accordion.Content>
        </Accordion>
      );
    });
  }

  // maps the classes into a array of itemedit components
  function mapClassesToItems() {
    // DO THIS SHIT TO MUCH IS THERE A WAY TO ABSTRACT?
    let ret = [];
    if (classes) {
      ret = classes?.map((cl) => {
        return (
          <ItemEdit
            key={'cc' + cl.id}
            id={cl.id}
            name={cl.name}
            desc={cl.description}
            formFields={[
              { name: 'name', value: cl.name, required: true },
              { name: 'description', value: cl.description, required: true },
              { name: 'category', value: cl.category, required: true },
              { name: 'school_id', value: cl.school_id, required: true },
            ]}
            onSubmit={({ name, description, category, school_id }) => {
              dispatch(upsertClass(cl.id, school_id, name, description, category));
            }}
            onDelete={() => {
              dispatch(deleteClassById(cl.id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='cplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'category', value: '', required: true },
          { name: 'school_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, category, school_id }) => {
          dispatch(upsertClass(null, school_id, name, description, category));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }
  function mapPdfsToItems() {
    let ret = [];
    if (pdfs) {
      ret = pdfs?.map((pdf) => {
        return (
          <ItemEdit
            key={'pdf' + pdf.id}
            id={pdf.id}
            name={pdf.name}
            desc={pdf.link}
            formFields={[
              { name: 'name', value: pdf.name, required: true },
              { name: 'link', value: pdf.link, required: true },
              { name: 'class_id', value: pdf.class_id, required: true },
            ]}
            onSubmit={({ link, class_id, name }) => {
              dispatch(upsertPdf(name, class_id, link, pdf.id));
            }}
            onDelete={() => {
              dispatch(deletePdfById(pdf.id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='pdfplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'link', value: '', required: true },
          { name: 'class_id', value: '', required: true },
        ]}
        onSubmit={({ link, class_id, name }) => {
          dispatch(upsertPdf(name, class_id, link, null));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapTopicsToItems() {
    let ret = [];
    if (topics) {
      ret = topics?.map((topic) => {
        return (
          <ItemEdit
            key={'t' + topic.id}
            id={topic.id}
            name={topic.name}
            desc={topic.desc}
            formFields={[
              { name: 'name', value: topic.name, required: true },
              { name: 'description', value: topic.desc, required: true },
              { name: 'class_id', value: topic.class_id, required: true },
            ]}
            onSubmit={({ name, description, class_id }) => {
              dispatch(upsertTopic(topic.id, name, class_id, description));
            }}
            onDelete={() => {
              dispatch(deleteTopicById(topic.id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='tplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'class_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, class_id }) => {
          dispatch(upsertTopic(null, name, class_id, description));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapExamsToItems() {
    let ret = [];
    if (exams) {
      ret = exams?.map((exam) => {
        return (
          <ItemEdit
            key={'e' + exam.id}
            id={exam.id}
            name={exam.name}
            desc={exam.desc}
            formFields={[
              { name: 'name', value: exam.name, required: true },
              { name: 'description', value: exam.desc, required: true },
              { name: 'class_id', value: exam.class_id, required: true },
            ]}
            onSubmit={({ name, description, class_id }) => {
              dispatch(upsertExam(exam.id, name, class_id, description));
            }}
            onDelete={() => {
              dispatch(deleteExamById(exam.id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='eplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'class_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, class_id }) => {
          dispatch(upsertExam(null, name, class_id, description));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapQuestionsToItems() {
    let ret = [];
    if (questions) {
      ret = questions?.map((curQuestion, index) => {
        return (
          <ItemEdit
            key={'q' + curQuestion.id + index}
            id={curQuestion.id}
            name={curQuestion.question}
            desc={null}
            formFields={[
              { name: 'question', value: curQuestion.question, required: true },
              { name: 'group_id', value: String(curQuestion.group_id), required: true },
            ]}
            onSubmit={({ question, group_id }) => {
              if (group_id.includes(',')) group_id = group_id.split(',');
              else {
                let tmp = [];
                tmp.push(group_id);
                group_id = tmp;
              }
              dispatch(upsertQuestionWithGroupIds(curQuestion.id, question, group_id));
            }}
            onDelete={() => {
              dispatch(deleteQuestionById(curQuestion.id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='qplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'question', value: '', required: true },
          { name: 'group_id', value: '', required: true },
        ]}
        onSubmit={({ question, group_id }) => {
          if (group_id.includes(',')) group_id = group_id.split(','); // SPECIAL LOGIC TODO TELL USER OR FIX WETARD
          else {
            let tmp = [];
            tmp.push(group_id);
            group_id = tmp;
          }
          dispatch(upsertQuestionWithGroupIds(null, question, group_id));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  // need to do one of those above for choice now :(
  function mapChoicesToItems() {
    let ret = [];
    if (choices) {
      ret = choices?.map((choice, index) => {
        return (
          <ItemEdit
            key={'choice' + choice.id}
            id={choice.id}
            name={choice.answer}
            desc={choice.is_correct ? 'Correct' : 'Incorrect'}
            formFields={[
              { name: 'text', value: choice.answer, required: true },
              { name: 'is_correct', value: choice.is_correct, required: true },
              { name: 'question_id', value: choice.question_id, required: true },
              { name: 'type', value: choice.type, required: true },
            ]}
            onSubmit={({ text, is_correct, question_id, type }) => {
              dispatch(upsertChoice(text, question_id, is_correct, type, choice.id));
            }}
            onDelete={(id) => {
              dispatch(deleteChoiceById(id));
            }}
          />
        );
      });
    }
    ret.push(
      <ItemEdit
        key='chplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'text', value: '', required: true },
          { name: 'is_correct', value: '', required: true },
          { name: 'question_id', value: '', required: true },
          { name: 'type', value: '', required: true },
        ]}
        onSubmit={({ text, is_correct, question_id, type }) => {
          dispatch(upsertChoice(text, question_id, is_correct, type, null));
        }}
        onDelete={(id) => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  // kinda like navbar.jsx
  useEffect(() => {
    if (user?.is_creator) {
      dispatch(hide401Msg());

      dispatch(getSchools());
      dispatch(getClassCategories());
      dispatch(getClassesByUserId());
      dispatch(getPdfsByUserId());
      dispatch(getTopicsByUserId());
      dispatch(getExamsByUserId());
      dispatch(getQuestionsByUserId());
      dispatch(getChoicesByUserId());
    } else {
      dispatch(show401Msg());
    }
  }, [user?.is_creator]);
  return (
    <Container style={{ padding: '2em 0' }}>
      <Header as='h1' textAlign='center' color='blue'>
        Course Management
        <Header.Subheader>Manage your classes, topics, and exams (refresh to update*)</Header.Subheader>
      </Header>
      <Divider hidden />

      {user?.is_creator ? (
        <Segment raised padded='very' loading={loading} style={{ backgroundColor: '#f8f9fa' }}>
          <Segment basic>
            <Header as={'h2'}>Key</Header>
            Schools:
            <SchoolsList onCreator={true} />
            Class Categories:
            <CategoryList />
          </Segment>
          <CreateFilter filter={filter} setFilter={setFilter} />
          {loadAccords([
            { name: 'Classes', component: mapClassesToItems() },
            { name: 'PDFs', component: mapPdfsToItems() },
            { name: 'Topics', component: mapTopicsToItems() },
            { name: 'Exams', component: mapExamsToItems() },
            { name: 'Questions', component: mapQuestionsToItems() },
            { name: 'Choices', component: mapChoicesToItems() },
          ])}
        </Segment>
      ) : (
        <Segment>You must be a creator! How did you get here? {';)'}</Segment>
      )}
    </Container>
  );
}
