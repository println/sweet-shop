import capitalize from "@shared/mixins/capitalize";
import { NAMES } from './names.config';

const toPath = (label: string) => (label ? `/${label}` : '');
const toTitle = (label: string) => capitalize(label.replace('-', ' '));
const makeTitle = (label: string) => ({
  id: label,
  title: toTitle(label),
});
const makePath = (label: string, ...parents: string[]) => ({
  ...makeTitle(label),
  path: toPath(label),
  fullPath: parents.map((p) => toPath(p)).join('') + toPath(label),
});

export const ROUTES = {
  home: makePath(NAMES.BASIC_PAGES.home),
  products: makePath(NAMES.BASIC_PAGES.products),
  checkout: makePath(NAMES.BASIC_PAGES.checkout),
  profile: makePath(NAMES.BASIC_PAGES.profile),
  cart: makePath(NAMES.BASIC_PAGES.cart),
  about: makePath(NAMES.BASIC_PAGES.about),
  contact: makePath(NAMES.BASIC_PAGES.contact),
  error: makePath(NAMES.ERROR_PAGES.error),
};
