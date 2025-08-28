// Library Usage
// Author: RND Solomon Airlines
// 
// This library processes and styles HTML content,
// Below is an overview of the supported features and usage instructions.
// 
// Automatically Processed HTML Tags
// The following HTML tags are detected and styled automatically
//    <a>: Hyperlinks are rendered inline with a consistent style and an accompanying icon.
//    <ul> and <ol>: Unordered and ordered lists are styled without default markers.
//    <li>: List items are formatted with a custom bullet SVG icon.
//    <img>: Images are centered with shadows and vertical margins for a clean appearance.

// Custom Markdown Syntax
// The library supports custom markdown-like tags that must be explicitly included in the input HTML. 
// These tags are processed to render styled elements as described below:
//    
//    Notes ([note]): Used to highlight text in an info label style with a blue background.
//    Usage: [note]text[/note]
//    Output: Renders the enclosed text as an inline blue info label with rounded corners and compact padding.

//    Documents ([doc]): Used to present document links with an appropriate file type icon (e.g., PDF, Word, Excel, or generic) and a green info label style.
//    Usage:[doc text="Display Text"]url[/doc]: Specifies custom display text and a URL.
//          [doc]url[/doc]: Uses the URL as both the link and display text.
//          [doc]<a href="url">text</a>[/doc]: Uses the <a> tag’s href as the URL and its inner text as the display text.
//    Output: Renders the document link as an inline green info label with a file type-specific icon (based on the URL’s extension) and a clickable link.
//    


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

// SVG icons for different file types
const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#8d8cd9" className="inline mr-1" viewBox="0 0 256 256">
    <path d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"></path>
  </svg>
);

const WordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#8d8cd9" className="inline mr-1" viewBox="0 0 256 256"><path d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z"></path></svg>
);

const ExcelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#8d8cd9" className="inline mr-1" viewBox="0 0 256 256"><path d="M156,208a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v48h20A8,8,0,0,1,156,208ZM92.65,145.49a8,8,0,0,0-11.16,1.86L68,166.24,54.51,147.35a8,8,0,1,0-13,9.3L58.17,180,41.49,203.35a8,8,0,0,0,13,9.3L68,193.76l13.49,18.89a8,8,0,0,0,13-9.3L77.83,180l16.68-23.35A8,8,0,0,0,92.65,145.49Zm98.94,25.82c-4-1.16-8.14-2.35-10.45-3.84-1.25-.82-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.72,19.82-.56a8,8,0,0,0,4.07-15.48c-2.11-.55-21-5.22-32.83,2.76a20.58,20.58,0,0,0-8.95,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.33-2.15,3.93-4.6,3.06-15.16,1.55-19.54.35A8,8,0,0,0,173.93,214a60.63,60.63,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.81,20.81,0,0,0,9.18-15.23C218,179,201.48,174.17,191.59,171.31ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,1,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.68L160,51.31Z"></path></svg>
);

const GenericFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="inline mr-1" fill="#8d8cd9" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"></path></svg>
);

// Reusable utility function to parse and style HTML
export const beautifyHtml = (html: string): React.ReactNode => {
  // Preprocess [note]text[/note] to convert to <span class="note">text</span>
  const processedHtml = html.replace(/\[note\](.*?)\[\/note\]/g, '<span class="note">$1</span>')
                            .replace(
                              /\[doc(?:\s+text="([^"]*)")?\](.*?)\[\/doc\]/g,
                              (match, text, content) => {
                                // Check if content is an <a> tag
                                const anchorMatch = content.match(/<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/i);
                                if (anchorMatch) {
                                  const [, href, innerText] = anchorMatch;
                                  return `<span class="doc" data-url="${href}">${innerText}</span>`;
                                }
                                // Handle [doc text="..."]url[/doc] or [doc]url[/doc]
                                return `<span class="doc" data-url="${content.trim()}">${text || content}</span>`;
                              }
                            );

  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode, index: number) => {
      if (!(domNode instanceof Element)) {
        return undefined;
      }

      // Helper to check if parent is a <p> tag
      const isParentP = (node: DOMNode): boolean => {
        return node.parent instanceof Element && node.parent.name === 'p';
      };

      // Helper to check if children contain an <a> tag
      const hasAnchorChild = (children: DOMNode[]): boolean => {
        return children.some((child) => child instanceof Element && child.name === 'a');
      };

      // Helper to get file type icon
      const getFileIcon = (url: string) => {
        const extension = url.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'pdf':
            return <PdfIcon />;
          case 'doc':
          case 'docx':
            return <WordIcon />;
          case 'xls':
          case 'xlsx':
            return <ExcelIcon />;
          default:
            return <GenericFileIcon />;
        }
      }

      // Handle <ul> and <ol>
      if (domNode.name === 'ul' || domNode.name === 'ol') {
        const Wrapper = isParentP(domNode) ? 'span' : 'div';
        return (
          <Wrapper className={domNode.name === 'ul' ? 'list-none' : 'list-none'} key={`list-${index}`}>
            {domToReact(domNode.children as DOMNode[], options)}
          </Wrapper>
        ) as unknown as string | boolean | void | object | Element | null;
      }

      // Handle <li>
      if (domNode.name === 'li') {
        const ariaLabel = domNode.attribs['data-title']
          ? `Story: ${domNode.attribs['data-title']}`
          : undefined;
        return (
          <li
            className="flex items-start p-2 w-full"
            role={ariaLabel ? 'region' : undefined}
            aria-label={ariaLabel}
            key={`li-${index}`}
          >
            <span className="flex-1">
              <CustomBullet />
              {domToReact(domNode.children as DOMNode[], options)}
            </span>
          </li>
        ) as unknown as string | boolean | void | object | Element | null;
      }

      // Handle <a>
      if (domNode.name === 'a' && domNode.attribs.class != 'doc') {
        const handleClick = domNode.attribs['data-title']
          ? () => console.log(`Clicked story: ${domNode.attribs['data-title']}`)
          : undefined;
        return (
          <a
            href={domNode.attribs.href || '#'}
            target={domNode.attribs.target || '_self'}
            rel={domNode.attribs.rel || undefined}
            className="inline text-blue-500 hover:text-blue-200 transition-colors"
            onClick={handleClick}
            key={`a-${index}`}
          >
            {domToReact(domNode.children as DOMNode[], options)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#192a5d"
              className="inline ml-1 mr-1 align-middle"
              viewBox="0 0 256 256"
            >
              <path d="M209.94,113.94l-96,96a48,48,0,0,1-67.88-67.88l96-96a48,48,0,0,1,67.88,67.88Z" opacity="0.2"></path>
              <path d="M232,80a55.67,55.67,0,0,1-16.4,39.6l-30.07,30.06a8,8,0,0,1-11.31-11.32l30.07-30.06a40,40,0,1,0-56.57-56.56L117.66,81.77a8,8,0,0,1-11.32-11.32L136.4,40.4A56,56,0,0,1,232,80Zm-93.66,94.22-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z"></path>
            </svg>
          </a>
        ) as unknown as string | boolean | void | object | Element | null;
      }

      // Handle <img>
      if (domNode.name === 'img') {
        return (
          <div className="flex justify-center my-8" key={`img-${index}`}>
            <img
              src={domNode.attribs.src}
              alt={domNode.attribs.alt || 'Image'}
              width={domNode.attribs.width || 'auto'}
              height={domNode.attribs.height || 'auto'}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        ) as unknown as string | boolean | void | object | Element | null;
      }

      // Handle <span class="note">
      if (domNode.name === 'span' && domNode.attribs.class === 'note') {
        return (
          <span
            className="inline-block bg-refx text-blue-400 p-2 border-2 border-blue-50 my-4 rounded-md text-sm font-normal"
            key={`note-${index}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#343399" className="inline mr-1" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.86,15.86,0,0,0,168,219.31L219.31,168A15.86,15.86,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM48,48H208V152H160a8,8,0,0,0-8,8v48H48ZM196.69,168,168,196.69V168Z"></path></svg>
            <span className="font-bold">Note</span><br/>
            {domToReact(domNode.children as DOMNode[], options)}
          </span>
        ) as unknown as string | boolean | void | object | Element | null;
      }

       // Handle <span class="doc">
      if (domNode.name === 'span' && domNode.attribs.class === 'doc') {
        const url = domNode.attribs['data-url'] || '';
        const children = domNode.children as DOMNode[];
        const hasAnchor = hasAnchorChild(children);
        return (
          <span
            className="inline-block  text-blue-200 my-2 p-2 py-1 rounded-md text-sm font-medium border-2 border-blue-50 bg-refx "
            key={`doc-${index}`}
          >
            {getFileIcon(url)}
            {hasAnchor ? (
              domToReact(children, options)
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline">
                {domToReact(children, options)}
              </a>
            )}
          </span>
        ) as unknown as string | boolean | void | object | Element | null;
      }

      return undefined;
    },
  };

  // Use DOMPurify only in client-side context
  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(processedHtml, {
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
  }) : processedHtml; // Fallback to raw HTML on server to avoid SSR issues

  return parse(cleanHtml, options) ?? <div />;
};