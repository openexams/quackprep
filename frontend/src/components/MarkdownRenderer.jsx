import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import 'katex/dist/katex.min.css';

/**
 *
 * @param {Object} props
 * @param {String} props.render
 * @param {String} props.components
 * @param {Boolean} props.allowLinks - Whether links are allowed to render
 * @returns
 */
export default function MarkdownRenderer({ render, components = {}, allowLinks = false }) {
  // Check if links are allowed
  const linkComponents = allowLinks
    ? {}
    : {
        a: ({ node, ...props }) => <span>{props.children}</span>, // Disable link rendering
      };

  const customComponents = {
    ...components,
    ...linkComponents, //props of later object overwrite props of earlier object
    img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '20em', height: 'auto' }} alt={props.alt} />, // Add max size for images
  };

  const processedRender = JSON.parse(JSON.stringify(render))

    // .replace(/(?<!\\)\\n/g, '  \n') // Replace \n with two spaces and a newline
    .replace(/\\\[/g, '$$') // Replace \[ with $$ TMP FIX
    .replace(/\\\]/g, '$$')
    .replaceAll('$', '$$');

  if (
    false && // render in markdown always
    !processedRender?.includes('```') &&
    !processedRender?.includes('$') &&
    !processedRender?.includes('/') &&
    !processedRender?.includes('#') &&
    !processedRender?.includes('\\') &&
    !processedRender?.includes('$$')
  ) {
    return <span>{render}</span>;
  } else {
    return (
      <ReactMarkdown components={customComponents} remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
        {processedRender}
      </ReactMarkdown>
    );
  }
}
