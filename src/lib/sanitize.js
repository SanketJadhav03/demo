import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

export default function sanitize(dirty) {
  return domPurify.sanitize(dirty);
}