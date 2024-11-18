import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { selectClassCategories } from './classCategorySlice';

export default function CategoryList() {
  const categories = useSelector(selectClassCategories).class_categories;
  return (
    <Segment>
      <ul>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <li key={category.id}>
              {'id:' + category.id + ' '}
              {category.name}
            </li>
          ))}
      </ul>
    </Segment>
  );
}
