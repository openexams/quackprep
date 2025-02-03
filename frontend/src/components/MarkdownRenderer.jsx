import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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

  const processedRender = render
    .replace(/\\\[/g, '$$') // Replace \[ with $$ TMP FIX
    .replace(/\\\]/g, '$$'); // Replace \] with $$ TMP FIX

  if (
    !processedRender?.includes('$') &&
    !processedRender?.includes('/') &&
    !processedRender?.includes('#') &&
    !processedRender?.includes('\\') &&
    !processedRender?.includes('$$')
  ) {
    return <span>{render}</span>;
  } else {
    return (
      <ReactMarkdown components={customComponents} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {processedRender}
      </ReactMarkdown>
    );
  }
}
