/* eslint-disable camelcase */
import { tuple } from '~/utilities/dataTypes';

const _ListTypes = tuple('index', 'cate', 'search');
const _LabelTypes = tuple('sticky', 'primary', 'secondary', 'green', 'gray');

export interface Post {
  type: 'text' | 'image' | 'audio';
  img?: string;
  title?: string;
  slug: string;
  excerpt?: string;
  categories?: string[];
  date?: string;
  content?: string;
  audioUrl?: string;
}

export type ListTypes = (typeof _ListTypes)[number];
export type LabelTypes = (typeof _LabelTypes)[number];
