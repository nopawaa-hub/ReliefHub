import type { QuestionSet } from '../../types';
import { mc, tf, makeSet } from '../builders';

export const gkMalaysia: QuestionSet = makeSet(
  'gk-malaysia',
  'Know Our Malaysia',
  'general-knowledge',
  [3, 4, 5, 6],
  'easy',
  [
    mc('gk-my-1', 'What is the capital city of Malaysia?', ['Kuala Lumpur', 'Johor Bahru', 'Penang', 'Kuching'], 'Kuala Lumpur'),
    mc('gk-my-2', 'How many stripes are on the Malaysian flag?', ['14', '12', '10', '13'], '14'),
    mc('gk-my-3', 'Which animal is the national symbol of Malaysia?', ['Tiger', 'Elephant', 'Eagle', 'Rhino'], 'Tiger'),
    mc('gk-my-4', 'What colours are the Malaysian flag?', ['Red, white, blue and yellow', 'Green and white', 'Red and green', 'Blue and red only'], 'Red, white, blue and yellow'),
    mc('gk-my-5', 'Malaysia celebrates Independence Day (Merdeka) in which month?', ['August', 'June', 'September', 'January'], 'August', 'Merdeka Day is 31 August.'),
    mc('gk-my-6', 'Which tower is famous in Kuala Lumpur?', ['Petronas Twin Towers', 'Eiffel Tower', 'Tokyo Tower', 'Burj Khalifa'], 'Petronas Twin Towers'),
    mc('gk-my-7', 'The hibiscus is the national ___ of Malaysia.', ['flower', 'bird', 'fruit', 'tree'], 'flower'),
    mc('gk-my-8', 'Which fruit is called the "King of Fruits" in Malaysia?', ['Durian', 'Banana', 'Apple', 'Grape'], 'Durian'),
    mc('gk-my-9', 'Bahasa Melayu is the national ___ of Malaysia.', ['language', 'dance', 'food', 'song'], 'language'),
    mc('gk-my-10', 'Which sea borders Malaysia on the east coast of the peninsula?', ['South China Sea', 'Red Sea', 'Black Sea', 'Baltic Sea'], 'South China Sea'),
  ],
);

export const gkCountries: QuestionSet = makeSet(
  'gk-countries',
  'Around the World',
  'general-knowledge',
  [4, 5, 6],
  'medium',
  [
    mc('gk-country-1', 'The Eiffel Tower is in which country?', ['France', 'Italy', 'Spain', 'Egypt'], 'France'),
    mc('gk-country-2', 'Which country is famous for pandas?', ['China', 'India', 'Brazil', 'Canada'], 'China'),
    mc('gk-country-3', 'Which is the largest ocean in the world?', ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 'Pacific Ocean'),
    mc('gk-country-4', 'The Great Wall is found in ___', ['China', 'Japan', 'Korea', 'Thailand'], 'China'),
    mc('gk-country-5', 'Which country is shaped like a boot?', ['Italy', 'Greece', 'Turkey', 'Portugal'], 'Italy'),
    mc('gk-country-6', 'Koalas and kangaroos come from ___', ['Australia', 'Africa', 'India', 'Malaysia'], 'Australia'),
    mc('gk-country-7', 'Which country is the biggest by land area?', ['Russia', 'China', 'USA', 'Canada'], 'Russia'),
    mc('gk-country-8', 'The pyramids are in ___', ['Egypt', 'Mexico', 'Peru', 'Iraq'], 'Egypt'),
    mc('gk-country-9', 'Which country has the most people?', ['India', 'USA', 'Indonesia', 'Brazil'], 'India'),
    mc('gk-country-10', 'Japan is famous for which mountain?', ['Mount Fuji', 'Mount Everest', 'Mount Kinabalu', 'Mount Alps'], 'Mount Fuji'),
  ],
);

export const gkEveryday: QuestionSet = makeSet(
  'gk-everyday',
  'Everyday Life',
  'general-knowledge',
  [1, 2, 3],
  'easy',
  [
    mc('gk-every-1', 'What do we use to write on paper?', ['Pencil', 'Spoon', 'Cup', 'Broom'], 'Pencil'),
    mc('gk-every-2', 'Where do we go to borrow books?', ['Library', 'Market', 'Clinic', 'Airport'], 'Library'),
    mc('gk-every-3', 'What do we use to tell the time?', ['Clock', 'Ruler', 'Plate', 'Bag'], 'Clock'),
    mc('gk-every-4', 'Who helps us when we are sick?', ['Doctor', 'Farmer', 'Pilot', 'Chef'], 'Doctor'),
    mc('gk-every-5', 'Where do we buy food and vegetables?', ['Market', 'School', 'Field', 'Office'], 'Market'),
    mc('gk-every-6', 'What do we wear on a rainy day?', ['Raincoat', 'Swimsuit', 'Cap', 'Slippers'], 'Raincoat'),
    mc('gk-every-7', 'How many days are in a week?', ['7', '5', '10', '12'], '7'),
    mc('gk-every-8', 'What sound does an alarm clock make in the morning?', ['Ring!', 'Moo!', 'Splash!', 'Boom!'], 'Ring!'),
    mc('gk-every-9', 'We use a ___ to sweep the floor.', ['broom', 'comb', 'brush for teeth', 'spoon'], 'broom'),
    mc('gk-every-10', 'Which is the first day of the school week in Malaysia?', ['Monday', 'Sunday', 'Friday', 'Saturday'], 'Monday'),
  ],
);

export const gkSafety: QuestionSet = makeSet(
  'gk-safety',
  'Safety Smart',
  'general-knowledge',
  [1, 2, 3, 4],
  'easy',
  [
    mc('gk-safe-1', 'What colour traffic light means STOP?', ['Red', 'Green', 'Yellow', 'Blue'], 'Red'),
    mc('gk-safe-2', 'What number do you call for an emergency in Malaysia?', ['999', '100', '911', '123'], '999'),
    mc('gk-safe-3', 'Before crossing the road, you should ___', ['look left and right', 'run quickly', 'close your eyes', 'play games'], 'look left and right'),
    mc('gk-safe-4', 'When a stranger offers you sweets, you should ___', ['say no and walk away', 'take them', 'follow them', 'keep quiet and take them'], 'say no and walk away'),
    mc('gk-safe-5', 'In a fire, you should ___', ['stay low and go out fast', 'hide under the bed', 'take your toys', 'use the lift'], 'stay low and go out fast'),
    mc('gk-safe-6', 'We wear a ___ in the car for safety.', ['seat belt', 'hat', 'shoes', 'watch'], 'seat belt'),
    mc('gk-safe-7', 'Sharp objects like knives should be handled by ___', ['adults', 'children', 'babies', 'nobody'], 'adults'),
    mc('gk-safe-8', 'When you get lost in a shop, you should ___', ['tell a shop worker', 'cry and hide', 'go out alone', 'walk home'], 'tell a shop worker'),
    mc('gk-safe-9', 'It is safe to swim ___', ['with an adult watching', 'alone after school', 'in a river alone', 'at night'], 'with an adult watching'),
    mc('gk-safe-10', 'Playing with matches is ___', ['dangerous', 'fun', 'safe', 'clever'], 'dangerous'),
  ],
);

export const gkRiddles: QuestionSet = makeSet(
  'gk-riddles',
  'Simple Riddles',
  'general-knowledge',
  [2, 3, 4, 5],
  'medium',
  [
    mc('gk-riddle-1', 'I have hands but cannot clap. What am I?', ['A clock', 'A cat', 'A tree', 'A fan'], 'A clock'),
    mc('gk-riddle-2', 'I shine at night and change shape. What am I?', ['The moon', 'A lamp', 'A star', 'The sun'], 'The moon'),
    mc('gk-riddle-3', 'I have many teeth but cannot bite. What am I?', ['A comb', 'A dog', 'A saw', 'A crocodile'], 'A comb'),
    mc('gk-riddle-4', 'I get wetter the more I dry. What am I?', ['A towel', 'A rock', 'A shoe', 'A cloud'], 'A towel'),
    mc('gk-riddle-5', 'I have a face and two hands but no arms. What am I?', ['A clock', 'A doll', 'A mirror', 'A statue'], 'A clock'),
    mc('gk-riddle-6', 'I fly without wings and cry without eyes. What am I?', ['A cloud', 'A kite', 'A plane', 'A bird'], 'A cloud', 'A cloud flies across the sky and rain is like its tears.'),
    mc('gk-riddle-7', 'The more you take of me, the more you leave behind. What am I?', ['Footsteps', 'Water', 'Money', 'Photographs'], 'Footsteps'),
    mc('gk-riddle-8', 'I am full of holes but still hold water. What am I?', ['A sponge', 'A cup', 'A bag', 'A net'], 'A sponge'),
    mc('gk-riddle-9', 'What has one eye but cannot see?', ['A needle', 'A cyclops', 'A potato', 'A lamp'], 'A needle'),
    mc('gk-riddle-10', 'What goes up but never comes down?', ['Your age', 'A ball', 'Rain', 'A lift'], 'Your age'),
  ],
);

export const gkTrueFalse: QuestionSet = makeSet(
  'gk-tf-mixed',
  'True or False: General Knowledge Mix',
  'general-knowledge',
  [3, 4, 5, 6],
  'easy',
  [
    tf('gk-tf-1', 'Malaysia has 13 states and 3 federal territories.', true),
    tf('gk-tf-2', 'The sun rises in the west.', false, 'The sun rises in the east.'),
    tf('gk-tf-3', 'There are 12 months in a year.', true),
    tf('gk-tf-4', 'A spider is an insect.', false, 'A spider is an arachnid ¡ª it has 8 legs, insects have 6.'),
    tf('gk-tf-5', 'Mount Kinabalu is in Sabah.', true),
    tf('gk-tf-6', 'The largest planet in our solar system is Mars.', false, 'Jupiter is the largest planet.'),
    tf('gk-tf-7', 'Honey is made by bees.', true),
    tf('gk-tf-8', 'An octopus has 6 arms.', false, 'An octopus has 8 arms.'),
    tf('gk-tf-9', 'Water boils at 100 degrees Celsius.', true),
    tf('gk-tf-10', 'The Great Wall of China was built in one year.', false, 'It was built over many centuries.'),
    tf('gk-tf-11', 'Penguins can fly.', false, 'Penguins swim instead of flying.'),
    tf('gk-tf-12', 'Lightning is hotter than the surface of the sun.', true),
  ],
);
