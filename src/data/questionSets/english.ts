import type { QuestionSet } from '../../types';
import { mc, tf, makeSet } from '../builders';

// English question sets for Years 1-6, aligned to common primary ESL topics.

export const englishAnimals: QuestionSet = makeSet(
  'en-animals',
  'Animals Around Us',
  'english',
  [1, 2, 3],
  'easy',
  [
    mc('en-animals-1', 'Which animal says "moo"?', ['Cow', 'Cat', 'Dog', 'Sheep'], 'Cow'),
    mc('en-animals-2', 'Which animal lives in water?', ['Fish', 'Lion', 'Hen', 'Rabbit'], 'Fish'),
    mc('en-animals-3', 'How many legs does a bird have?', ['Two', 'Four', 'Six', 'Eight'], 'Two'),
    mc('en-animals-4', 'Which animal is very big and grey?', ['Elephant', 'Mouse', 'Frog', 'Ant'], 'Elephant'),
    mc('en-animals-5', 'Which animal can fly?', ['Butterfly', 'Cow', 'Goat', 'Snake'], 'Butterfly'),
    mc('en-animals-6', 'A young dog is called a ___', ['puppy', 'kitten', 'chick', 'calf'], 'puppy'),
    mc('en-animals-7', 'Which animal gives us milk?', ['Cow', 'Hen', 'Fish', 'Duck'], 'Cow'),
    mc('en-animals-8', 'Which animal hops and has a pouch?', ['Kangaroo', 'Tiger', 'Horse', 'Pig'], 'Kangaroo'),
    mc('en-animals-9', 'The animal that says "meow" is a ___', ['cat', 'cow', 'crow', 'crab'], 'cat'),
    mc('en-animals-10', 'Which animal works in a hive and makes honey?', ['Bee', 'Bat', 'Bear', 'Bull'], 'Bee'),
  ],
);

export const englishColours: QuestionSet = makeSet(
  'en-colours',
  'Colours All Around',
  'english',
  [1, 2],
  'easy',
  [
    mc('en-colours-1', 'What colour is a banana?', ['Yellow', 'Blue', 'Purple', 'Black'], 'Yellow'),
    mc('en-colours-2', 'What colour is the sky on a clear day?', ['Blue', 'Green', 'Red', 'Brown'], 'Blue'),
    mc('en-colours-3', 'Mix red and yellow. What do you get?', ['Orange', 'Pink', 'Grey', 'Gold'], 'Orange'),
    mc('en-colours-4', 'What colour are the leaves of most plants?', ['Green', 'Orange', 'White', 'Blue'], 'Green'),
    mc('en-colours-5', 'What colour is a ripe strawberry?', ['Red', 'Green', 'Yellow', 'Blue'], 'Red'),
    mc('en-colours-6', 'What colour is a zebra?', ['Black and white', 'Brown and yellow', 'Grey and pink', 'Green and blue'], 'Black and white'),
    mc('en-colours-7', 'What colour do you get when you mix blue and yellow?', ['Green', 'Purple', 'Orange', 'Silver'], 'Green'),
    mc('en-colours-8', 'What colour is the sun in most drawings?', ['Yellow', 'Black', 'Green', 'Pink'], 'Yellow'),
  ],
);

export const englishWeather: QuestionSet = makeSet(
  'en-weather',
  'Weather Watch',
  'english',
  [2, 3, 4],
  'easy',
  [
    mc('en-weather-1', 'What falls from clouds when it rains?', ['Water', 'Sand', 'Leaves', 'Smoke'], 'Water'),
    mc('en-weather-2', 'What do you use when it rains?', ['Umbrella', 'Fan', 'Ruler', 'Plate'], 'Umbrella'),
    mc('en-weather-3', 'What shines in the sky during the day?', ['The sun', 'The moon', 'A star', 'A rainbow'], 'The sun'),
    mc('en-weather-4', 'A very strong wind storm is called a ___', ['hurricane', 'snowfall', 'rainbow', 'shadow'], 'hurricane'),
    mc('en-weather-5', 'What do clouds look like before rain?', ['Dark and grey', 'Bright pink', 'Made of paper', 'Full of stars'], 'Dark and grey'),
    mc('en-weather-6', 'In Malaysia, the weather is usually ___', ['hot and wet', 'cold and snowy', 'dry and freezing', 'windy and icy'], 'hot and wet'),
    mc('en-weather-7', 'What appears in the sky after rain and sunshine?', ['A rainbow', 'A hurricane', 'A comet', 'A volcano'], 'A rainbow'),
    mc('en-weather-8', 'We feel ___ when the sun is very strong.', ['hot', 'sleepy', 'hungry', 'quiet'], 'hot'),
  ],
);

export const englishFood: QuestionSet = makeSet(
  'en-food',
  'Food We Eat',
  'english',
  [1, 2, 3],
  'easy',
  [
    mc('en-food-1', 'Which one is a fruit?', ['Apple', 'Bread', 'Rice', 'Egg'], 'Apple'),
    mc('en-food-2', 'Which food comes from a hen?', ['Egg', 'Milk', 'Honey', 'Cheese'], 'Egg'),
    mc('en-food-3', 'Which drink is made from cows?', ['Milk', 'Juice', 'Water', 'Soup'], 'Milk'),
    mc('en-food-4', 'Which food do we eat at breakfast with kaya or butter?', ['Bread', 'Pizza', 'Candy', 'Chips'], 'Bread'),
    mc('en-food-5', 'Which vegetable is orange and long?', ['Carrot', 'Potato', 'Cabbage', 'Pea'], 'Carrot'),
    mc('en-food-6', 'Which one is a healthy snack?', ['Banana', 'Candy', 'Chips', 'Soda'], 'Banana'),
    mc('en-food-7', 'Which food is Malaysia\u2019s famous noodle dish?', ['Laksa', 'Spaghetti', 'Ramen', 'Udon'], 'Laksa'),
    mc('en-food-8', 'We should drink lots of ___ every day.', ['water', 'soda', 'syrup', 'coffee'], 'water'),
  ],
);

export const englishClothes: QuestionSet = makeSet(
  'en-clothes',
  'Clothes We Wear',
  'english',
  [1, 2, 3],
  'easy',
  [
    mc('en-clothes-1', 'What do we wear on our feet?', ['Shoes', 'Shirt', 'Hat', 'Belt'], 'Shoes'),
    mc('en-clothes-2', 'What do we wear on our heads when it is sunny?', ['A cap', 'A sock', 'A scarf', 'A glove'], 'A cap'),
    mc('en-clothes-3', 'What do you wear on your hands when it is cold?', ['Gloves', 'Shoes', 'Shorts', 'Tie'], 'Gloves'),
    mc('en-clothes-4', 'What do pupils wear to school in Malaysia?', ['School uniform', 'Pyjamas', 'Swimsuit', 'Football boots'], 'School uniform'),
    mc('en-clothes-5', 'Which clothing is worn on the legs?', ['Trousers', 'Cap', 'Mittens', 'Cardigan'], 'Trousers'),
    mc('en-clothes-6', 'What covers your body like a shirt with buttons in front?', ['A shirt', 'A skirt', 'A shoe', 'A ring'], 'A shirt'),
    mc('en-clothes-7', 'What do girls often wear instead of trousers?', ['A skirt', 'A helmet', 'A shawl for hands', 'A sock'], 'A skirt'),
    mc('en-clothes-8', 'What do you wear to see better on a sunny day?', ['Sunglasses', 'Earmuffs', 'Slippers', 'Necklace'], 'Sunglasses'),
  ],
);

export const englishPrepositions: QuestionSet = makeSet(
  'en-prepositions',
  'Where Is It? (Prepositions)',
  'english',
  [3, 4, 5],
  'medium',
  [
    mc('en-prep-1', 'The cat is ___ the table. (on top)', ['under', 'on', 'behind', 'between'], 'on'),
    mc('en-prep-2', 'The ball is ___ the box. (inside)', ['in', 'on', 'above', 'near'], 'in'),
    mc('en-prep-3', 'The bird is flying ___ the tree. (higher than)', ['above', 'under', 'in', 'beside'], 'above'),
    mc('en-prep-4', 'The shoes are ___ the bed. (below)', ['under', 'on', 'in', 'at'], 'under'),
    mc('en-prep-5', 'The shop is ___ the school and the bank.', ['between', 'on', 'above', 'in'], 'between'),
    mc('en-prep-6', 'Sit ___ me, please. (next to)', ['beside', 'above', 'under', 'behind'], 'beside'),
    mc('en-prep-7', 'The teacher stands ___ the whiteboard.', ['in front of', 'under', 'inside', 'between'], 'in front of'),
    mc('en-prep-8', 'Hang the picture ___ the wall.', ['on', 'in', 'under', 'between'], 'on'),
    mc('en-prep-9', 'The dog is hiding ___ the door. (at the back of)', ['behind', 'on', 'above', 'beside'], 'behind'),
    mc('en-prep-10', 'The pencil fell ___ the floor.', ['to', 'in', 'above', 'between'], 'to'),
  ],
);

export const englishVocabulary: QuestionSet = makeSet(
  'en-vocabulary',
  'Word Power (Vocabulary)',
  'english',
  [3, 4, 5, 6],
  'medium',
  [
    mc('en-vocab-1', '"Enormous" means very ___', ['big', 'small', 'fast', 'loud'], 'big'),
    mc('en-vocab-2', 'The opposite of "happy" is ___', ['sad', 'glad', 'merry', 'kind'], 'sad'),
    mc('en-vocab-3', 'A place with many books to borrow is a ___', ['library', 'kitchen', 'clinic', 'stable'], 'library'),
    mc('en-vocab-4', 'A person who teaches is a ___', ['teacher', 'doctor', 'farmer', 'pilot'], 'teacher'),
    mc('en-vocab-5', '"Delicious" describes food that tastes ___', ['very good', 'burnt', 'cold', 'salty'], 'very good'),
    mc('en-vocab-6', 'The opposite of "ancient" is ___', ['modern', 'old', 'rusty', 'quiet'], 'modern'),
    mc('en-vocab-7', 'A baby frog is called a ___', ['tadpole', 'cub', 'kitten', 'nestling'], 'tadpole'),
    mc('en-vocab-8', '"Careful" means full of ___', ['care', 'carries', 'carts', 'carpets'], 'care'),
    mc('en-vocab-9', 'The opposite of "borrow" is ___', ['lend', 'keep', 'lose', 'take'], 'lend'),
    mc('en-vocab-10', 'A large group of fish swimming together is called a ___', ['school', 'herd', 'flock', 'pack'], 'school'),
  ],
);

export const englishGrammar: QuestionSet = makeSet(
  'en-grammar',
  'Grammar Gym',
  'english',
  [4, 5, 6],
  'medium',
  [
    mc('en-grammar-1', 'She ___ to school every day.', ['goes', 'go', 'going', 'gone'], 'goes'),
    mc('en-grammar-2', 'I ___ a new pencil case yesterday.', ['bought', 'buy', 'buying', 'buys'], 'bought'),
    mc('en-grammar-3', 'Choose the correct plural: one box, two ___', ['boxes', 'boxs', 'boxies', 'box'], 'boxes'),
    mc('en-grammar-4', 'The boys ___ playing football now.', ['are', 'is', 'am', 'be'], 'are'),
    mc('en-grammar-5', 'My friend and ___ went to the canteen.', ['I', 'me', 'mine', 'my'], 'I'),
    mc('en-grammar-6', 'This book is ___. (it belongs to me)', ['mine', 'my', 'me', 'I'], 'mine'),
    mc('en-grammar-7', 'Ali is taller ___ Abu.', ['than', 'then', 'that', 'them'], 'than'),
    mc('en-grammar-8', 'Which sentence is correct?', ['He runs fast.', 'He run fast.', 'He running fast.', 'He to run fast.'], 'He runs fast.'),
    mc('en-grammar-9', 'There ___ some milk in the cup.', ['is', 'are', 'were', 'have'], 'is'),
    mc('en-grammar-10', 'Past tense of "eat" is ___', ['ate', 'eated', 'eating', 'eats'], 'ate'),
  ],
);

export const englishTrueFalse: QuestionSet = makeSet(
  'en-tf-mixed',
  'True or False: English Mix',
  'english',
  [2, 3, 4, 5],
  'easy',
  [
    tf('en-tf-1', 'A cat is bigger than an elephant.', false, 'An elephant is much bigger than a cat.'),
    tf('en-tf-2', 'We use an umbrella when it rains.', true),
    tf('en-tf-3', 'The word "book" begins with the letter B.', true),
    tf('en-tf-4', 'Monday comes after Friday.', false, 'Monday comes before Friday. The day after Friday is Saturday.'),
    tf('en-tf-5', 'A triangle has three sides.', true),
    tf('en-tf-6', '"Apple" is a kind of animal.', false, 'An apple is a fruit.'),
    tf('en-tf-7', 'We wear shoes on our hands.', false, 'We wear shoes on our feet.'),
    tf('en-tf-8', 'The plural of "child" is "children".', true),
    tf('en-tf-9', 'Red and yellow make green.', false, 'Red and yellow make orange. Blue and yellow make green.'),
    tf('en-tf-10', 'A doctor works in a hospital.', true),
    tf('en-tf-11', 'The word "quiet" is the opposite of "noisy".', true),
    tf('en-tf-12', 'We eat breakfast in the evening.', false, 'We eat breakfast in the morning.'),
  ],
);
