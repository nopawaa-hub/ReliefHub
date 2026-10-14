import type { PicturePack } from '../types';

// Hidden Picture packs use large emoji glyphs so the game works fully offline
// with no image assets required. Each pack matches a question-set theme.

export const picturePackAnimals: PicturePack = {
  id: 'pack-animals',
  title: 'Animal Safari',
  subject: 'english',
  years: [1, 2, 3],
  pictures: [
    { id: 'a1', emoji: '🐘', label: 'Elephant', hint: 'Big, grey, has a trunk' },
    { id: 'a2', emoji: '🦒', label: 'Giraffe', hint: 'Very tall with a long neck' },
    { id: 'a3', emoji: '🐧', label: 'Penguin', hint: 'A bird that swims, not flies' },
    { id: 'a4', emoji: '🦁', label: 'Lion', hint: 'King of the jungle' },
    { id: 'a5', emoji: '🐬', label: 'Dolphin', hint: 'A clever sea mammal' },
    { id: 'a6', emoji: '🦋', label: 'Butterfly', hint: 'Colourful wings, was a caterpillar' },
    { id: 'a7', emoji: '🐢', label: 'Tortoise', hint: 'Slow with a shell house' },
    { id: 'a8', emoji: '🐝', label: 'Bee', hint: 'Makes honey in a hive' },
  ],
};

export const picturePackFood: PicturePack = {
  id: 'pack-food',
  title: 'Food Fun',
  subject: 'english',
  years: [1, 2, 3],
  pictures: [
    { id: 'f1', emoji: '🍌', label: 'Banana', hint: 'A yellow curved fruit' },
    { id: 'f2', emoji: '🍉', label: 'Watermelon', hint: 'Big green fruit, red inside' },
    { id: 'f3', emoji: '🌽', label: 'Corn', hint: 'Yellow kernels on a cob' },
    { id: 'f4', emoji: '🍕', label: 'Pizza', hint: 'Round with cheese and toppings' },
    { id: 'f5', emoji: '🥕', label: 'Carrot', hint: 'Orange vegetable rabbits love' },
    { id: 'f6', emoji: '🍔', label: 'Burger', hint: 'Bun, patty and salad together' },
    { id: 'f7', emoji: '🍦', label: 'Ice Cream', hint: 'Cold and sweet in a cone' },
    { id: 'f8', emoji: '🍛', label: 'Nasi Lemak', hint: 'Malaysia\u2019s famous coconut rice' },
  ],
};

export const picturePackPlaces: PicturePack = {
  id: 'pack-places',
  title: 'Places & Things',
  subject: 'general-knowledge',
  years: [3, 4, 5],
  pictures: [
    { id: 'p1', emoji: '🏫', label: 'School', hint: 'Where you learn every day' },
    { id: 'p2', emoji: '🚂', label: 'Train', hint: 'Runs on rails' },
    { id: 'p3', emoji: '✈️', label: 'Aeroplane', hint: 'Flies in the sky' },
    { id: 'p4', emoji: '🚦', label: 'Traffic Light', hint: 'Red, yellow and green' },
    { id: 'p5', emoji: '🏥', label: 'Hospital', hint: 'Where doctors work' },
    { id: 'p6', emoji: '📚', label: 'Library', hint: 'Full of books to borrow' },
    { id: 'p7', emoji: '⚽', label: 'Football', hint: 'Kick it into the goal' },
    { id: 'p8', emoji: '⛈️', label: 'Thunderstorm', hint: 'Dark clouds, rain and lightning' },
  ],
};

export const picturePackScience: PicturePack = {
  id: 'pack-science',
  title: 'Science Spotting',
  subject: 'science',
  years: [3, 4, 5],
  pictures: [
    { id: 's1', emoji: '🌱', label: 'Seedling', hint: 'A baby plant' },
    { id: 's2', emoji: '🌈', label: 'Rainbow', hint: 'Appears after rain with sunshine' },
    { id: 's3', emoji: '🔬', label: 'Microscope', hint: 'Makes tiny things look big' },
    { id: 's4', emoji: '🧲', label: 'Magnet', hint: 'Attracts iron' },
    { id: 's5', emoji: '🦷', label: 'Tooth', hint: 'You brush them every day' },
    { id: 's6', emoji: '🫀', label: 'Heart', hint: 'Pumps blood around your body' },
    { id: 's7', emoji: '🌡️', label: 'Thermometer', hint: 'Measures temperature' },
    { id: 's8', emoji: '💧', label: 'Water Drop', hint: 'Liquid we drink' },
  ],
};

export const allPacks: PicturePack[] = [
  picturePackAnimals,
  picturePackFood,
  picturePackPlaces,
  picturePackScience,
];
