import type { QuestionSet } from '../../types';
import { mc, tf, makeSet } from '../builders';

// Bahasa Melayu question sets ¡ª language 'bm' where content is fully in BM.

export const bmKataNama: QuestionSet = makeSet(
  'bm-kata-nama',
  'Kata Nama: Haiwan & Benda',
  'bahasa-melayu',
  [1, 2, 3],
  'easy',
  [
    mc('bm-kn-1', 'Haiwan yang bersuara "meong" ialah¡­', ['kucing', 'lembu', 'anjing', 'kambing'], 'kucing'),
    mc('bm-kn-2', 'Anak ayam dipanggil¡­', ['piyik', 'anak lembu', 'anak kambing', 'anak itik'], 'piyik'),
    mc('bm-kn-3', '"Pokok" ialah kata nama bagi¡­', ['tumbuhan', 'haiwan', 'benda buatan manusia', 'tempat'], 'tumbuhan'),
    mc('bm-kn-4', 'Yang manakah kata nama am bagi tempat?', ['Sekolah', 'Meja', 'Kucing', 'Baju'], 'Sekolah'),
    mc('bm-kn-5', '"Kereta" ialah¡­', ['kata nama am', 'kata kerja', 'kata adjektif', 'kata sendi'], 'kata nama am'),
    mc('bm-kn-6', 'Haiwan yang suka makan keju dalam cerita ialah¡­', ['tikus', 'kucing', 'arnab', 'burung'], 'tikus'),
    mc('bm-kn-7', 'Yang berikut ialah nama buah-buahan, KECUALI¡­', ['lobak', 'mangga', 'rambutan', 'durian'], 'lobak', 'Lobak ialah sayur-sayuran.'),
    mc('bm-kn-8', 'Ikan hidup di¡­', ['air', 'darat', 'pokok', 'langit'], 'air'),
    mc('bm-kn-9', 'Alat untuk menulis ialah¡­', ['pensel', 'pinggan', 'baju', 'kasut'], 'pensel'),
    mc('bm-kn-10', 'Rumah bagi burung ialah¡­', ['sarang', 'kandang', 'kolam', 'gudang'], 'sarang'),
  ],
  'bm',
);

export const bmWarnaBilangan: QuestionSet = makeSet(
  'bm-warna-bilangan',
  'Warna & Bilangan',
  'bahasa-melayu',
  [1, 2],
  'easy',
  [
    mc('bm-wb-1', 'Warna bagi pisang ialah¡­', ['kuning', 'merah', 'biru', 'hitam'], 'kuning'),
    mc('bm-wb-2', '"Sepuluh" bermaksud nombor¡­', ['10', '5', '7', '100'], '10'),
    mc('bm-wb-3', 'Warna daun pokok ialah¡­', ['hijau', 'putih', 'ungu', 'coklat'], 'hijau'),
    mc('bm-wb-4', '"Dua" ditulis dengan angka¡­', ['2', '4', '6', '9'], '2'),
    mc('bm-wb-5', 'Bendera Malaysia ada warna merah, putih, biru dan¡­', ['kuning', 'hijau', 'hitam', 'jingga'], 'kuning'),
    mc('bm-wb-6', 'Warna langit waktu siang ialah¡­', ['biru', 'merah', 'kelabu', 'putih'], 'biru'),
    mc('bm-wb-7', '"Lima" ialah nombor¡­', ['5', '3', '8', '15'], '5'),
    mc('bm-wb-8', 'Warna bagi susu ialah¡­', ['putih', 'hitam', 'merah', 'biru'], 'putih'),
    mc('bm-wb-9', 'Berapakah bilangan jari pada satu tangan?', ['Lima', 'Empat', 'Enam', 'Sepuluh'], 'Lima'),
    mc('bm-wb-10', 'Warna bagi semangka di luar ialah¡­', ['hijau', 'kuning', 'biru', 'putih'], 'hijau'),
  ],
  'bm',
);

export const bmSifatKata: QuestionSet = makeSet(
  'bm-sifat',
  'Kata Adjektif (Sifat)',
  'bahasa-melayu',
  [3, 4, 5],
  'medium',
  [
    mc('bm-sifat-1', 'Gajah itu sangat¡­', ['besar', 'kecil', 'ringan', 'pendek'], 'besar'),
    mc('bm-sifat-2', 'Lawan bagi "panjang" ialah¡­', ['pendek', 'lebar', 'tinggi', 'berat'], 'pendek'),
    mc('bm-sifat-3', 'Ais terasa¡­', ['sejuk', 'panas', 'hangat', 'lembap'], 'sejuk'),
    mc('bm-sifat-4', 'Lawan bagi "laju" ialah¡­', ['perlahan', 'cepat', 'sangat cepat', 'tinggi'], 'perlahan'),
    mc('bm-sifat-5', 'Kuih itu terasa¡­', ['sedap', 'banyak', 'tinggi', 'keras'], 'sedap'),
    mc('bm-sifat-6', 'Lawan bagi "bersih" ialah¡­', ['kotor', 'cantik', 'wangi', 'licin'], 'kotor'),
    mc('bm-sifat-7', 'Rambut adik saya¡­', ['lembut', 'keras', 'tinggi', 'sejuk'], 'lembut'),
    mc('bm-sifat-8', 'Gunung Kinabalu sangat¡­', ['tinggi', 'rendah', 'kecil', 'sempit'], 'tinggi'),
    mc('bm-sifat-9', 'Lawan bagi "susah" ialah¡­', ['senang', 'laju', 'keras', 'berat'], 'senang'),
    mc('bm-sifat-10', 'Kertas itu¡­', ['nipis', 'tebal', 'tinggi', 'panas'], 'nipis'),
  ],
  'bm',
);

export const bmTrueFalse: QuestionSet = makeSet(
  'bm-tf-mixed',
  'Benar atau Salah: Campuran BM',
  'bahasa-melayu',
  [2, 3, 4, 5],
  'easy',
  [
    tf('bm-tf-1', '"Saya pergi ke sekolah setiap pagi." ialah ayat yang betul.', true),
    tf('bm-tf-2', '"Bola itu berwarna merah." bermaksud bola itu biru.', false, 'Merah bukan biru.'),
    tf('bm-tf-3', '"Kucing" ialah kata nama haiwan.', true),
    tf('bm-tf-4', '"Makan" ialah kata nama.', false, '"Makan" ialah kata kerja.'),
    tf('bm-tf-5', 'Hari Ahad datang selepas hari Sabtu.', true),
    tf('bm-tf-6', '"Besok" bermaksud hari yang telah berlalu.', false, '"Besok" bermaksud hari yang akan datang.'),
    tf('bm-tf-7', '"Terima kasih" dikatakan apabila kita berterima kasih.', true),
    tf('bm-tf-8', '"Selamat pagi" digunakan pada waktu petang.', false, '"Selamat petang" digunakan pada waktu petang.'),
    tf('bm-tf-9', 'Air ialah cecair.', true),
    tf('bm-tf-10', 'Beruang ialah haiwan yang sangat kecil.', false, 'Beruang ialah haiwan yang besar.'),
    tf('bm-tf-11', '"Cepat" dan "laju" mempunyai maksud yang hampir sama.', true),
    tf('bm-tf-12', '"Rendah" berlawanan dengan "tinggi".', true),
  ],
  'bm',
);
