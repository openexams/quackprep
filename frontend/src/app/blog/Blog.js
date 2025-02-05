/**
 *
 * @param {String} text
 */
function upperCaseAllLettersAfterASpace(text) {
  let newText = '';
  for (let i = 0; i < text.length; i++) {
    if (i === 0) {
      newText += text[i].toUpperCase();
    } else if (text[i - 1] === ' ') {
      newText += text[i].toUpperCase();
    } else {
      newText += text[i];
    }
  }
  return newText;
}

export default class Blog {
  /**
   *
   * @param {String} title
   * @param {Date} pub_date
   * @param {String} desc
   * @param {Number} read_time
   * @param {String} by username of who made
   * @param {React.Component} html
   */
  constructor(title, pub_date, desc, read_time, by, html, icon, tags) {
    this.title = title;
    this.pub_date = pub_date;
    this.desc = desc;
    this.read_time = read_time;
    this.by = by;
    this.html = html;
    this.icon = icon;
    this.tags = tags;
  }
  getLink() {
    return this.title.toLowerCase().replaceAll(' ', '-');
  }
  getTitle() {
    return this.title;
  }
  getHtml() {
    return this.html;
  }
  getPubDate() {
    return this.pub_date;
  }
  getDesc() {
    return this.desc;
  }
  getReadTime() {
    return this.read_time;
  }
  getBy() {
    return this.by;
  }
  getIcon() {
    return this.icon;
  }
  getTags() {
    return this.tags;
  }
  /**
   *
   * @param {Blog[]} blogs
   * @param {String} link
   * @returns {Blog}
   */
  static getBlogFromLink(blogs, link) {
    const title = link.replaceAll('-', ' ');
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].getTitle().toLowerCase() === title.toLowerCase()) {
        return blogs[i];
      }
    }
    return null;
  }
}
