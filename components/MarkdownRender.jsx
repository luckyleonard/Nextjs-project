import { memo, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css';

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
}); //translate html tag and url link

function base64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

export default memo(function MarkdownRenderer({ content, isBase64 }) {
  const markdownContent = isBase64 ? base64_to_utf8(content) : content;

  const html = useMemo(() => markdown.render(markdownContent), [
    markdownContent,
  ]);

  return (
    <div className='markdown-body'>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});
