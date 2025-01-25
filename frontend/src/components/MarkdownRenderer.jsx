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
    ? components
    : {
        ...components,
        a: ({ node, ...props }) => <span>{props.children}</span>, // Disable link rendering
      };

  if (!render?.includes('$') && !render?.includes('/') && !render?.includes('#') && !render?.includes('\\')) {
    return <span>{render}</span>;
  } else {
    return (
      <ReactMarkdown components={linkComponents} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {render}
      </ReactMarkdown>
    );
  }
}
