import books from './books.svg';
import female from './female_avatar.svg';
import jewelry from './jewelry.svg';
import male from './male_avatar.svg';
import netflix from './netflix.svg';
import notification from './notification.svg';
import cards from './playing_cards.svg';
import happyNews from './happy_news.svg';

export interface Material {
  id: number
  url: string
  name: string
}

const data: Material[] = [
  { id: 1, url: books, name: 'books' },
  { id: 2, url: female, name: 'female' },
  { id: 3, url: jewelry, name: 'jewelry' },
  { id: 4, url: male, name: 'male' },
  { id: 5, url: netflix, name: 'netflix' },
  { id: 6, url: notification, name: 'notification' },
  { id: 7, url: cards, name: 'cards' },
  { id: 8, url: happyNews, name: 'happy_news' }
]

const fetchAssets = () => Promise.resolve(data);

export default fetchAssets;