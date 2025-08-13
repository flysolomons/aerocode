import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser';
import DOMPurify from 'dompurify';
import * as React from 'react';

// Custom SVG component for list item bullet
const CustomBullet = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="#101f5c"
    viewBox="0 0 256 256"
    aria-hidden="true"
    className="inline-block mr-2"
  >
    <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z"></path>
  </svg>
);

// Reusable utility function to parse and style HTML
export const beautifyHtml = (html: string): React.ReactNode => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode, index: number): string | boolean | void | object | Element | null => {
      if (!(domNode instanceof Element)) {
        return undefined;
      }

      // Remove bullet points for <ul> and <ol>
      if (domNode.name === 'ul' || domNode.name === 'ol') {
        return (
          <div className={domNode.name === 'ul' ? 'list-none' : 'list-none'} key={`list-${index}`}>
            {domToReact(domNode.children as DOMNode[], options)}
          </div>
        );
      }

      // Style <li> elements with custom SVG bullet
      if (domNode.name === 'li') {
        const ariaLabel = domNode.attribs['data-title']
          ? `Story: ${domNode.attribs['data-title']}`
          : undefined;
        return (
          <li
            className=" flex items-start p-2 w-full"
            role={ariaLabel ? 'region' : undefined}
            aria-label={ariaLabel}
            key={`li-${index}`}
          >
            
            <div className="flex-1"><CustomBullet /> {domToReact(domNode.children as DOMNode[], options)}</div>
          </li>
        );
      }

      // Style <a> elements with ChevronRight
      if (domNode.name === 'a') {
        const handleClick = domNode.attribs['data-title']
          ? () => console.log(`Clicked story: ${domNode.attribs['data-title']}`)
          : undefined;
        return (
          <a
            href={domNode.attribs.href || '#'}
            target={domNode.attribs.target || '_self'}
            rel={domNode.attribs.rel || undefined}
            className="flex items-start text-blue-500 hover:text-blue-600 transition-colors"
            onClick={handleClick}
            key={`a-${index}`}
          >
            <div className="flex-1 text-blue-300 hover:underline ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#192a5d" className="inline ml-2 mr-1 text-blue-500" viewBox="0 0 256 256"><path d="M209.94,113.94l-96,96a48,48,0,0,1-67.88-67.88l96-96a48,48,0,0,1,67.88,67.88Z" opacity="0.2"></path><path d="M232,80a55.67,55.67,0,0,1-16.4,39.6l-30.07,30.06a8,8,0,0,1-11.31-11.32l30.07-30.06a40,40,0,1,0-56.57-56.56L117.66,81.77a8,8,0,0,1-11.32-11.32L136.4,40.4A56,56,0,0,1,232,80Zm-93.66,94.22-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z"></path></svg>
                {domToReact(domNode.children as DOMNode[], options)}
            </div>
            
           
          </a>
        );
      }

      return undefined;
    },
  };

  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'ul',
      'ol',
      'li',
      'a',
      'div',
      'p',
      'span',
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',
      'em',
      'b',
      'i',
      'br',
      'section',
      'article',
    ],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'data-title',
      'class',
      'src',
      'alt',
      'width',
      'height',
      'style',
      'id',
      'aria-label',
      'role',
    ],
  });

  return parse(cleanHtml, options) ?? <div />;
};