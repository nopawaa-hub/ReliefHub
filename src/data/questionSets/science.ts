import type { QuestionSet } from '../../types';
import { mc, tf, makeSet } from '../builders';

export const scienceLivingThings: QuestionSet = makeSet(
  'sci-living-things',
  'Living or Not Living?',
  'science',
  [1, 2, 3],
  'easy',
  [
    mc('sci-lt-1', 'Which one is a living thing?', ['Tree', 'Rock', 'Chair', 'Pencil'], 'Tree'),
    mc('sci-lt-2', 'All living things need ___', ['water', 'sunscreen', 'toys', 'paint'], 'water'),
    mc('sci-lt-3', 'Which one is NOT a living thing?', ['Car', 'Cat', 'Grass', 'Bird'], 'Car'),
    mc('sci-lt-4', 'Living things grow. What does a seed grow into?', ['A plant', 'A stone', 'A cloud', 'A car'], 'A plant'),
    mc('sci-lt-5', 'What do all living things need to breathe?', ['Air', 'Soil', 'Paper', 'Metal'], 'Air'),
    mc('sci-lt-6', 'Which animal lays eggs?', ['Hen', 'Cow', 'Cat', 'Goat'], 'Hen'),
    mc('sci-lt-7', 'Plants make their own food using ___', ['sunlight', 'moonlight', 'rainbow', 'wind'], 'sunlight'),
    mc('sci-lt-8', 'Which one can move by itself?', ['Fish', 'Boat', 'Ball', 'Kite'], 'Fish'),
    mc('sci-lt-9', 'We know something is alive because it can ___', ['grow and change', 'stay the same forever', 'be heavy', 'be colourful'], 'grow and change'),
    mc('sci-lt-10', 'Which is a baby plant called?', ['Seedling', 'Kitten', 'Cub', 'Chick'], 'Seedling'),
  ],
);

export const scienceAnimals: QuestionSet = makeSet(
  'sci-animals',
  'Animal Scientists',
  'science',
  [2, 3, 4],
  'easy',
  [
    mc('sci-anim-1', 'Which animal group has feathers?', ['Birds', 'Fish', 'Mammals', 'Insects'], 'Birds'),
    mc('sci-anim-2', 'Which animal group lives only in water and has gills?', ['Fish', 'Frog', 'Snake', 'Duck'], 'Fish'),
    mc('sci-anim-3', 'A tiger is a ___', ['mammal', 'bird', 'fish', 'insect'], 'mammal'),
    mc('sci-anim-4', 'Which animal eats only plants?', ['Cow', 'Tiger', 'Eagle', 'Shark'], 'Cow'),
    mc('sci-anim-5', 'Which body part does a butterfly use to fly?', ['Wings', 'Legs', 'Fins', 'Tail'], 'Wings'),
    mc('sci-anim-6', 'Which animal has a shell for protection?', ['Tortoise', 'Rabbit', 'Chicken', 'Cat'], 'Tortoise'),
    mc('sci-anim-7', 'A frog starts life as a ___', ['tadpole', 'chick', 'puppy', 'caterpillar'], 'tadpole'),
    mc('sci-anim-8', 'Which animal hunts at night and can turn its head far around?', ['Owl', 'Hen', 'Cow', 'Goat'], 'Owl'),
    mc('sci-anim-9', 'Bees help flowers by carrying ___', ['pollen', 'water', 'leaves', 'seeds only'], 'pollen'),
    mc('sci-anim-10', 'Which animal is a mammal that lives in the sea?', ['Dolphin', 'Shark', 'Octopus', 'Jellyfish'], 'Dolphin'),
  ],
);

export const sciencePlants: QuestionSet = makeSet(
  'sci-plants',
  'Plant Explorers',
  'science',
  [2, 3, 4],
  'easy',
  [
    mc('sci-plant-1', 'Which part of the plant takes in water from the soil?', ['Roots', 'Leaves', 'Flowers', 'Fruits'], 'Roots'),
    mc('sci-plant-2', 'Which part makes food for the plant?', ['Leaves', 'Roots', 'Stem', 'Soil'], 'Leaves'),
    mc('sci-plant-3', 'What do plants take in from the air to make food?', ['Carbon dioxide', 'Oxygen only', 'Smoke', 'Nitrogen'], 'Carbon dioxide'),
    mc('sci-plant-4', 'Which part carries water up the plant?', ['Stem', 'Petals', 'Seeds', 'Roots'], 'Stem'),
    mc('sci-plant-5', 'Flowers make ___ so new plants can grow.', ['seeds', 'sugar only', 'shadows', 'rain'], 'seeds'),
    mc('sci-plant-6', 'Which plant part do we eat when we eat a carrot?', ['Root', 'Leaf', 'Flower', 'Seed'], 'Root'),
    mc('sci-plant-7', 'Which plant part do we eat when we eat rice?', ['Seed', 'Leaf', 'Stem', 'Flower'], 'Seed'),
    mc('sci-plant-8', 'Plants need sunlight, water and air to ___', ['grow', 'sleep', 'sing', 'run'], 'grow'),
    mc('sci-plant-9', 'Mango is a ___ of the mango tree.', ['fruit', 'leaf', 'root', 'stem'], 'fruit'),
    mc('sci-plant-10', 'Which part of the plant attracts bees and butterflies?', ['Flower', 'Root', 'Bark', 'Seed'], 'Flower'),
  ],
);

export const scienceHumanBody: QuestionSet = makeSet(
  'sci-human-body',
  'My Amazing Body',
  'science',
  [2, 3, 4, 5],
  'easy',
  [
    mc('sci-body-1', 'Which organ pumps blood around your body?', ['Heart', 'Lungs', 'Stomach', 'Brain'], 'Heart'),
    mc('sci-body-2', 'Which organ helps you breathe?', ['Lungs', 'Heart', 'Ear', 'Bone'], 'Lungs'),
    mc('sci-body-3', 'Which body part helps you think and remember?', ['Brain', 'Foot', 'Hand', 'Nose'], 'Brain'),
    mc('sci-body-4', 'How many senses do humans have?', ['Five', 'Three', 'Seven', 'Ten'], 'Five', 'Sight, hearing, smell, taste and touch.'),
    mc('sci-body-5', 'Which sense do your ears give you?', ['Hearing', 'Sight', 'Taste', 'Smell'], 'Hearing'),
    mc('sci-body-6', 'What protects your brain and head?', ['Skull', 'Ribs', 'Spine', 'Knee'], 'Skull'),
    mc('sci-body-7', 'Which body part grinds your food when you chew?', ['Teeth', 'Tongue', 'Lips', 'Cheek'], 'Teeth'),
    mc('sci-body-8', 'Which body part joins bones together so you can bend?', ['Joints', 'Nails', 'Hair', 'Veins'], 'Joints'),
    mc('sci-body-9', 'Which organ helps digest your food?', ['Stomach', 'Heart', 'Lungs', 'Eyes'], 'Stomach'),
    mc('sci-body-10', 'Which body part pumps blood around your body?', ['Heart', 'Lungs', 'Stomach', 'Brain'], 'Heart'),
  ],
);

export const scienceMatter: QuestionSet = makeSet(
  'sci-matter',
  'Solids, Liquids and Gases',
  'science',
  [4, 5, 6],
  'medium',
  [
    mc('sci-matter-1', 'Which one is a solid?', ['Stone', 'Water', 'Air', 'Juice'], 'Stone'),
    mc('sci-matter-2', 'Which one is a liquid?', ['Milk', 'Rock', 'Oxygen', 'Brick'], 'Milk'),
    mc('sci-matter-3', 'Which one is a gas?', ['Oxygen', 'Ice', 'Sand', 'Oil'], 'Oxygen'),
    mc('sci-matter-4', 'When water becomes ice, we call it ___', ['freezing', 'melting', 'boiling', 'evaporating'], 'freezing'),
    mc('sci-matter-5', 'When ice becomes water, we call it ___', ['melting', 'freezing', 'condensing', 'boiling'], 'melting'),
    mc('sci-matter-6', 'When water boils, it turns into ___', ['water vapour', 'ice', 'steam that is solid', 'snow'], 'water vapour'),
    mc('sci-matter-7', 'A solid has a shape that is ___', ['fixed', 'always changing', 'like water', 'invisible'], 'fixed'),
    mc('sci-matter-8', 'A liquid takes the shape of its ___', ['container', 'lid', 'colour', 'weight'], 'container'),
    mc('sci-matter-9', 'Water vapour cooling on a cold glass forms ___', ['droplets (condensation)', 'smoke', 'sand', 'ice cubes'], 'droplets (condensation)'),
    mc('sci-matter-10', 'Which is NOT one of the three states of matter?', ['Light', 'Solid', 'Liquid', 'Gas'], 'Light'),
  ],
);

export const scienceTrueFalse: QuestionSet = makeSet(
  'sci-tf-mixed',
  'True or False: Science Mix',
  'science',
  [3, 4, 5],
  'easy',
  [
    tf('sci-tf-1', 'Plants need sunlight to make food.', true),
    tf('sci-tf-2', 'Fish can live out of water for many days.', false, 'Fish breathe through gills and need water.'),
    tf('sci-tf-3', 'Humans breathe in oxygen and breathe out carbon dioxide.', true),
    tf('sci-tf-4', 'A rock is a living thing.', false),
    tf('sci-tf-5', 'The heart pumps blood around the body.', true),
    tf('sci-tf-6', 'All animals lay eggs.', false, 'Mammals like cats and cows give birth to live young.'),
    tf('sci-tf-7', 'Water can be a solid, a liquid or a gas.', true),
    tf('sci-tf-8', 'The moon gives off its own light like the sun.', false, 'The moon reflects sunlight.'),
    tf('sci-tf-9', 'Roots hold a plant in the soil.', true),
    tf('sci-tf-10', 'Sound cannot travel through water.', false, 'Sound travels through solids, liquids and gases.'),
    tf('sci-tf-11', 'A caterpillar changes into a butterfly.', true),
    tf('sci-tf-12', 'We see with our ears.', false, 'We see with our eyes.'),
  ],
);
