import { useSelector } from 'react-redux';
import { Breadcrumb, Transition } from 'semantic-ui-react';
import { changeNavbarPage, getFixedUrlArr, selectNavbarState } from './navbar/navbarSlice';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectArrayOfStateById } from 'maddox-js-funcs';

export default function HistoryNav() {
  const { classId, groupId } = useSelector(selectNavbarState).navbar;
  const curGroupName = useSelector(selectArrayOfStateById('app.group.groups', 'id', groupId))?.[0]?.name;
  const curClassName = useSelector(selectArrayOfStateById('app.class.classes.classes', 'id', classId))?.[0]?.name;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const urlArr = getFixedUrlArr(location.pathname);
  const CLASS_NAME_LOCATION = 3;
  const GROUP_NAME_LOCATION = 5;
  const sections = useMemo(() => {
    return mapCurrentNavbarStateToSectionsOfBreadcrumb(urlArr);
  }, [urlArr]);
  // if (urlArr?.[1] === 'create') return null;

  function mapCurrentNavbarStateToSectionsOfBreadcrumb(urlArr) {
    if (!urlArr) return null;
    let sections = [];
    for (let i = 0; i < urlArr.length; i++) {
      if (urlArr[i] == '' || urlArr[i] == ' ') {
        // do nothing
      } else if (i !== 5) {
        let curItemUrl = urlArr.slice(0, i + 1).join('/');
        let content = null;
        if (i === CLASS_NAME_LOCATION) {
          content = curClassName;
        } else if (i === GROUP_NAME_LOCATION) {
          // never can be this lol
          content = curGroupName;
        }

        sections.push({
          key: urlArr[i],
          content: content || urlArr[i]?.[0].toUpperCase() + urlArr[i].slice(1),
          onClick: () => dispatch(changeNavbarPage(navigate, curItemUrl)),
          active: urlArr[urlArr.length - 1] == urlArr[i] ? true : false,
        });
      }
    }
    return sections;
  }

  const breadcrumbStyle = {
    position: 'fixed', // Changed to fixed instead of absolute
    top: '5rem',
    left: 0,
    right: 0,
    zIndex: 10,
    padding: '1.5rem 1rem',
    backgroundColor: 'transparent', // Removed background
    margin: 0,
  };

  const sectionStyle = {
    color: '#007bff',
    fontWeight: 500,
    padding: '0.5em 0.75em',
    borderRadius: '3px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f8f9fa',
      transform: 'translateY(-1px)',
    },
  };

  const activeSectionStyle = {
    ...sectionStyle,
    color: '#495057',
    fontWeight: 600,
    backgroundColor: '#e9ecef',
  };

  return (
    <>
      <Transition visible={sections?.length > 1} animation='fade down' duration={300}>
        <div style={breadcrumbStyle}>
          <Breadcrumb
            icon='right angle'
            sections={sections?.map((section) => ({
              ...section,
              style: section.active ? activeSectionStyle : sectionStyle,
            }))}
          />
        </div>
      </Transition>

      {sections?.length && sections.length !== 1 ? <div style={{ height: '3rem' }} /> : null}
    </>
  );
}
