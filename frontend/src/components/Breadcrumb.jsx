import { useSelector } from 'react-redux';
import { Breadcrumb, Segment } from 'semantic-ui-react';
import { changeNavbarPage, selectNavbarState } from './navbar/navbarSlice';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export default function HistoryNav() {
  const dispatch = useDispatch();
  const urlArr = useSelector(selectNavbarState).navbar.page?.split('/');
  /**
   *
   * @param {Array} urlArr
   * @returns
   */
  function mapCurrentNavbarStateToSectionsOfBreadcrumb(urlArr) {
    if (!urlArr) return null;
    let sections = [];
    for (let i = 0; i < urlArr.length; i++) {
      if (urlArr[i] == '' || urlArr[i] == ' ') {
        // do nothing
      } else if (i !== 5) {
        // gets rid of topic / exam name from breadcrumb
        let curItemUrl = urlArr.slice(0, i + 1).join('/');

        sections.push({
          key: urlArr[i],
          content: urlArr[i][0].toUpperCase() + urlArr[i].slice(1),
          onClick: () => dispatch(changeNavbarPage(curItemUrl)),
          active: urlArr[urlArr.length - 1] == urlArr[i] ? true : false,
        });
      }
    }
    return sections;
  }

  const sections = useMemo(() => {
    return mapCurrentNavbarStateToSectionsOfBreadcrumb(urlArr);
  }, [urlArr]);
  const breadcrumbStyle = {
    marginTop: '5rem', // todo fix pushes everything down
    marginBottom: '0',
  };

  const sectionStyle = {
    color: '#007bff',
    fontWeight: 500,
    padding: '0.5em 0.75em',
    borderRadius: '3px',
    transition: 'background-color 0.2s ease',
  };

  const activeSectionStyle = {
    ...sectionStyle,
    color: '#495057',
    fontWeight: 600,
    backgroundColor: '#e9ecef',
  };

  return (
    <>
      {sections?.length && sections.length !== 1 ? (
        <Segment basic style={breadcrumbStyle}>
          <Breadcrumb
            icon='right angle'
            sections={sections.map((section) => ({
              ...section,
              style: section.active ? activeSectionStyle : sectionStyle,
            }))}
          />
        </Segment>
      ) : null}
    </>
  );
}
