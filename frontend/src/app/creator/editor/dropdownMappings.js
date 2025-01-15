export function mapSchoolsToDropdown(schools) {
  return schools.map((school) => ({
    key: school.id,
    value: school.id,
    text: school.school_name,
  }));
}

export function mapClassCategoriesToDropdown(class_categories) {
  return class_categories.map((class_category) => ({
    key: class_category.id,
    value: class_category.id,
    text: class_category.name,
  }));
}

export function mapClassesToDropdown(classes) {
  return classes.map((cass) => ({ key: cass.id, value: cass.id, text: cass.name }));
}
export function mapGroupsToDropdown(groupList) {
  return groupList.map((g) => ({
    key: g.id,
    value: g.id,
    text: g.name,
  }));
}
