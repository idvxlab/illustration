import books from '../assets/books.svg';
import female from '../assets/female_avatar.svg';
import jewelry from '../assets/jewelry.svg';
import male from '../assets/male_avatar.svg';
import netflix from '../assets/netflix.svg';
import notification from '../assets/notification.svg';
import cards from '../assets/playing_cards.svg';
import happyNews from '../assets/happy_news.svg';

const data = [
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