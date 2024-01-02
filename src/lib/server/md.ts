import { JSDOM } from 'jsdom';
import sanitizeHtml from 'sanitize-html';
import showdown from 'showdown';

const converter = new showdown.Converter({
	
});

export function mdToHtml(markdown: string) {
	const html = converter.makeHtml(markdown);

	console.log(html);

	return sanitizeHtml(html, {
		allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		allowedAttributes: {
			a: ['href'],
		},
	});
}

export function htmlToMd(html: string) {
	const dom = new JSDOM(html);

	return converter.makeMarkdown(html, dom.window.document);
}
