import type { QuestionSet } from '../../types';
import { mc, tf, makeSet } from '../builders';

export const mathAddition: QuestionSet = makeSet(
  'math-addition',
  'Addition Adventure',
  'mathematics',
  [1, 2, 3],
  'easy',
  [
    mc('math-add-1', '3 + 4 = ?', ['7', '6', '8', '5'], '7'),
    mc('math-add-2', '5 + 5 = ?', ['10', '9', '11', '12'], '10'),
    mc('math-add-3', '6 + 7 = ?', ['13', '12', '14', '15'], '13'),
    mc('math-add-4', '8 + 9 = ?', ['17', '16', '18', '19'], '17'),
    mc('math-add-5', '12 + 8 = ?', ['20', '18', '22', '19'], '20'),
    mc('math-add-6', '15 + 6 = ?', ['21', '20', '22', '19'], '21'),
    mc('math-add-7', '25 + 15 = ?', ['40', '35', '45', '30'], '40'),
    mc('math-add-8', '34 + 27 = ?', ['61', '60', '62', '51'], '61'),
    mc('math-add-9', 'What is 10 more than 49?', ['59', '50', '60', '39'], '59'),
    mc('math-add-10', 'Aini has 12 stickers. Zul gives her 9 more. How many stickers now?', ['21', '20', '22', '19'], '21'),
  ],
);

export const mathSubtraction: QuestionSet = makeSet(
  'math-subtraction',
  'Subtraction Safari',
  'mathematics',
  [1, 2, 3],
  'easy',
  [
    mc('math-sub-1', '9 - 4 = ?', ['5', '4', '6', '3'], '5'),
    mc('math-sub-2', '10 - 7 = ?', ['3', '4', '2', '5'], '3'),
    mc('math-sub-3', '15 - 8 = ?', ['7', '6', '8', '9'], '7'),
    mc('math-sub-4', '20 - 5 = ?', ['15', '14', '16', '25'], '15'),
    mc('math-sub-5', '18 - 9 = ?', ['9', '8', '10', '7'], '9'),
    mc('math-sub-6', '23 - 14 = ?', ['9', '10', '8', '11'], '9'),
    mc('math-sub-7', '40 - 15 = ?', ['25', '26', '24', '35'], '25'),
    mc('math-sub-8', '52 - 17 = ?', ['35', '34', '36', '45'], '35'),
    mc('math-sub-9', 'There are 16 ducks. 7 fly away. How many are left?', ['9', '8', '10', '7'], '9'),
    mc('math-sub-10', 'What is 10 less than 63?', ['53', '54', '52', '43'], '53'),
  ],
);

export const mathMultiplication: QuestionSet = makeSet(
  'math-multiplication',
  'Times Table Challenge',
  'mathematics',
  [3, 4, 5],
  'medium',
  [
    mc('math-mul-1', '2 × 3 = ?', ['6', '5', '8', '9'], '6'),
    mc('math-mul-2', '4 × 4 = ?', ['16', '12', '20', '8'], '16'),
    mc('math-mul-3', '5 × 6 = ?', ['30', '35', '25', '36'], '30'),
    mc('math-mul-4', '7 × 8 = ?', ['56', '54', '48', '63'], '56'),
    mc('math-mul-5', '9 × 6 = ?', ['54', '56', '45', '63'], '54'),
    mc('math-mul-6', '3 × 9 = ?', ['27', '24', '30', '21'], '27'),
    mc('math-mul-7', '12 × 4 = ?', ['48', '44', '36', '52'], '48'),
    mc('math-mul-8', '11 × 7 = ?', ['77', '70', '84', '77'], '77'),
    mc('math-mul-9', 'One box holds 6 eggs. How many eggs in 8 boxes?', ['48', '42', '54', '36'], '48'),
    mc('math-mul-10', 'What is double 25?', ['50', '45', '55', '35'], '50'),
  ],
);

export const mathShapes: QuestionSet = makeSet(
  'math-shapes',
  'Shape Detectives',
  'mathematics',
  [1, 2, 3, 4],
  'easy',
  [
    mc('math-shape-1', 'How many sides does a triangle have?', ['3', '4', '5', '6'], '3'),
    mc('math-shape-2', 'A square has ___ equal sides.', ['4', '3', '2', '6'], '4'),
    mc('math-shape-3', 'Which shape is round with no corners?', ['Circle', 'Square', 'Triangle', 'Star'], 'Circle'),
    mc('math-shape-4', 'How many corners does a rectangle have?', ['4', '2', '6', '8'], '4'),
    mc('math-shape-5', 'A ball looks like which shape?', ['Sphere', 'Cube', 'Cylinder', 'Pyramid'], 'Sphere'),
    mc('math-shape-6', 'How many sides does a hexagon have?', ['6', '5', '7', '8'], '6'),
    mc('math-shape-7', 'Which shape has 5 sides?', ['Pentagon', 'Square', 'Triangle', 'Hexagon'], 'Pentagon'),
    mc('math-shape-8', 'A slice of pizza is often shaped like a ___', ['triangle', 'circle', 'square', 'oval'], 'triangle'),
    mc('math-shape-9', 'How many faces does a cube have?', ['6', '4', '8', '12'], '6'),
    mc('math-shape-10', 'Which shape is like a tin can?', ['Cylinder', 'Sphere', 'Cone', 'Square'], 'Cylinder'),
  ],
);

export const mathPatterns: QuestionSet = makeSet(
  'math-patterns',
  'Number Pattern Puzzle',
  'mathematics',
  [3, 4, 5, 6],
  'medium',
  [
    mc('math-pat-1', '2, 4, 6, 8, ___', ['10', '9', '12', '7'], '10'),
    mc('math-pat-2', '5, 10, 15, 20, ___', ['25', '30', '24', '21'], '25'),
    mc('math-pat-3', '1, 3, 5, 7, ___', ['9', '8', '10', '6'], '9'),
    mc('math-pat-4', '10, 20, 30, 40, ___', ['50', '45', '44', '60'], '50'),
    mc('math-pat-5', '1, 2, 4, 8, 16, ___', ['32', '24', '20', '18'], '32'),
    mc('math-pat-6', '100, 90, 80, 70, ___', ['60', '50', '69', '65'], '60'),
    mc('math-pat-7', '3, 6, 9, 12, ___', ['15', '14', '16', '13'], '15'),
    mc('math-pat-8', '1, 1, 2, 3, 5, 8, ___', ['13', '11', '12', '10'], '13', 'Add the two numbers before it: 5 + 8 = 13.'),
    mc('math-pat-9', '81, 72, 63, 54, ___', ['45', '46', '44', '36'], '45', 'Each number is 9 less than the one before.'),
    mc('math-pat-10', '2, 5, 11, 23, ___', ['47', '35', '46', '34'], '47', 'Each number is double plus one: 23 × 2 + 1 = 47.'),
  ],
);

export const mathTrueFalse: QuestionSet = makeSet(
  'math-tf-mixed',
  'True or False: Maths Mix',
  'mathematics',
  [2, 3, 4, 5],
  'easy',
  [
    tf('math-tf-1', '2 + 2 = 5', false, '2 + 2 = 4.'),
    tf('math-tf-2', 'A square has four equal sides.', true),
    tf('math-tf-3', '10 - 10 = 0', true),
    tf('math-tf-4', '3 × 3 = 6', false, '3 × 3 = 9.'),
    tf('math-tf-5', 'The number 7 is an odd number.', true),
    tf('math-tf-6', 'Half of 10 is 5.', true),
    tf('math-tf-7', 'The number 20 comes before 19.', false, '19 comes before 20.'),
    tf('math-tf-8', 'A circle has no corners.', true),
    tf('math-tf-9', '5 × 0 = 5', false, 'Any number multiplied by 0 is 0.'),
    tf('math-tf-10', 'Two 50-cent coins make one ringgit.', true),
    tf('math-tf-11', '9 is greater than 11.', false, '11 is greater than 9.'),
    tf('math-tf-12', '1 metre has 100 centimetres.', true),
  ],
);
