export interface GroomConfig {
  name: string;
  fullName: string;
  order: string;
  parents: string;
  instagram: string;
  instagramHandle?: string;
  photo: string;
}

export interface BrideConfig {
  name: string;
  fullName: string;
  order: string;
  parents: string;
  instagram: string;
  instagramHandle?: string;
  photo: string;
}

export interface EventConfig {
  title: string;
  dateIso: string;
  dateDisplay: string;
  dateShort: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  icsProdId: string;
  icsSummary: string;
  icsDescription: string;
  icsStart: string;
  icsEnd: string;
}

export interface BankAccountConfig {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  testId: string;
}

export interface PhysicalGiftConfig {
  recipient: string;
  phone: string;
  address: string;
}

import type { StoryMoment, GalleryPhoto } from "../types/invitation";

export interface WeddingConfig {
  groom: GroomConfig;
  bride: BrideConfig;
  coupleName: string;
  coupleFullName: string;
  event: EventConfig;
  bankAccounts: BankAccountConfig[];
  musicUrl: string;
  qrisImage: string;
  physicalGift?: PhysicalGiftConfig;
  storyMoments: StoryMoment[];
  galleryPhotos: GalleryPhoto[];
  siteUrl?: string;
}

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : ({} as Record<string, string | undefined>);

const groomName = env.VITE_GROOM_NAME || "Miftah";
const groomFullName = env.VITE_GROOM_FULL_NAME || "Miftah Pratama";
const brideName = env.VITE_BRIDE_NAME || "Riris";
const brideFullName = env.VITE_BRIDE_FULL_NAME || "Nafidatur Riskia";

export const WEDDING_CONFIG: WeddingConfig = {
  siteUrl: env.VITE_SITE_URL || "",
  coupleName: `${groomName} & ${brideName}`,
  coupleFullName: `${groomFullName} & ${brideFullName}`,
  musicUrl:
    env.VITE_MUSIC_URL ||
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2c8d4f4b8f.mp3",
  qrisImage: env.VITE_QRIS_IMAGE || "",
  groom: {
    name: groomName,
    fullName: groomFullName,
    order: env.VITE_GROOM_ORDER || "Putra pertama dari",
    parents: env.VITE_GROOM_PARENTS || "Bapak H. Suryadi & Ibu Hj. Kartika",
    instagram: env.VITE_GROOM_INSTAGRAM || "https://instagram.com",
    instagramHandle: env.VITE_GROOM_IG_HANDLE || "@miftahpratama",
    photo:
      env.VITE_GROOM_PHOTO ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  },
  bride: {
    name: brideName,
    fullName: brideFullName,
    order: env.VITE_BRIDE_ORDER || "Putri kedua dari",
    parents: env.VITE_BRIDE_PARENTS || "Bapak Juki & Ibu Hotimah",
    instagram: env.VITE_BRIDE_INSTAGRAM || "https://instagram.com",
    instagramHandle: env.VITE_BRIDE_IG_HANDLE || "@riris",
    photo:
      env.VITE_BRIDE_PHOTO ||
      "https://images.unsplash.com/photo-1492175742197-ed20dc5a6bed?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  },
  event: {
    title: env.VITE_EVENT_TITLE || "Resepsi",
    dateIso: env.VITE_EVENT_DATE_ISO || "2026-09-27T08:00:00+07:00",
    dateDisplay: env.VITE_EVENT_DATE_DISPLAY || "Minggu, 27 September 2026",
    dateShort: env.VITE_EVENT_DATE_SHORT || "27 . 09 . 2026",
    time: env.VITE_EVENT_TIME || "08.00 WIB — Selesai",
    venue: env.VITE_EVENT_VENUE || "Ballroom The Grand Estate",
    address: env.VITE_EVENT_ADDRESS || "Jl. Merdeka No. 88, Jakarta Selatan",
    mapsUrl: env.VITE_EVENT_MAPS_URL || "https://maps.google.com/?q=The+Grand+Estate+Jakarta",
    icsProdId: env.VITE_ICS_PRODID || "-//Miftah & Riris Wedding//ID",
    icsSummary: env.VITE_ICS_SUMMARY || "Pernikahan Miftah & Riris",
    icsDescription:
      env.VITE_ICS_DESCRIPTION || "Resepsi Pernikahan Miftahus Surur, S.Kom & Nafidatur Riskia",
    icsStart: env.VITE_ICS_START || "20260927T010000Z",
    icsEnd: env.VITE_ICS_END || "20260927T070000Z",
  },
  bankAccounts: [
    {
      bank: env.VITE_GROOM_BANK_NAME || "Dana",
      accountNumber: env.VITE_GROOM_BANK_NO || "1234567890",
      accountHolder: env.VITE_GROOM_BANK_HOLDER
        ? env.VITE_GROOM_BANK_HOLDER.startsWith("a.n.")
          ? env.VITE_GROOM_BANK_HOLDER
          : `a.n. ${env.VITE_GROOM_BANK_HOLDER}`
        : "a.n. Miftahus Surur",
      testId: "copy-bca-button",
    },
    {
      bank: env.VITE_BRIDE_BANK_NAME || "Bank BRI",
      accountNumber: env.VITE_BRIDE_BANK_NO || "0987654321",
      accountHolder: env.VITE_BRIDE_BANK_HOLDER
        ? env.VITE_BRIDE_BANK_HOLDER.startsWith("a.n.")
          ? env.VITE_BRIDE_BANK_HOLDER
          : `a.n. ${env.VITE_BRIDE_BANK_HOLDER}`
        : "a.n. Nafidatur Riskia",
      testId: "copy-mandiri-button",
    },
  ],
  physicalGift: {
    recipient: env.VITE_GIFT_RECIPIENT || "Miftah / Riris",
    phone: env.VITE_GIFT_PHONE || "",
    address:
      env.VITE_GIFT_ADDRESS ||
      "Jl. Merdeka No. 88, Jakarta Selatan",
  },
  storyMoments: [
    {
      chapter: "I",
      year: "2023",
      when: "Maret 2023",
      title: "Awal Pertemuan",
      desc: "Takdir mempertemukan kami dalam sebuah pertemuan keluarga yang bertujuan untuk mengikat janji dan menjalin silaturahmi yang baik ke depan. Percakapan yang tak disangka itu ternyata menjadi awal dari sebuah perjalanan yang indah.",
      image:
        "https://5kha3rsp76.ucarecd.net/c1a45253-7900-4e97-8e3f-f9d91d479375/-/crop/960x745/0,535/-/preview/3000x3000/",
      alt: "Awal Pertemuan",
    },
    {
      chapter: "II",
      year: "2024",
      when: "Desember 2024",
      title: "Semakin Dekat",
      desc: "Hari demi hari kami lalui bersama. Belajar saling memahami, berbagi suka dan duka, hingga menemukan kenyamanan dalam setiap langkah.",
      image:
        "https://5kha3rsp76.ucarecd.net/fe974ea4-8e4e-406a-b417-e1ad3c567a3c/-/crop/960x967/0,313/-/preview/3000x3000/",
      alt: "Semakin Dekat",
    },
    {
      chapter: "III",
      year: "2025",
      when: "Februari 2025",
      title: "Sebuah Janji",
      desc: "Dengan restu kedua orang tua dan keluarga, sebuah komitmen diikrarkan untuk melangkah bersama ke gerbang pernikahan yang suci.",
      image:
        "https://5kha3rsp76.ucarecd.net/9b718bee-41df-4258-99b4-dfd8fd6bcd31/2025.jpeg",
      alt: "Sebuah Janji",
    },
    {
      chapter: "IV",
      year: "2026",
      when: "September 2026",
      title: "Menuju Halal",
      desc: "Kini kami siap menyatukan dua hati dalam ikatan pernikahan yang agung, memohon doa restu dari segenap keluarga dan sahabat terkasih.",
      image:
        "https://5kha3rsp76.ucarecd.net/e10a57e3-1d23-43ff-a978-eb18e154858c/akhirnya.jpeg",
      alt: "Menuju Halal",
    },
  ],
  galleryPhotos: [
    {
      id: 0,
      featured: true,
      tall: true,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/ab1e93c6-64fc-46c6-8d29-e67bfb9a479b/4.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/ab1e93c6-64fc-46c6-8d29-e67bfb9a479b/-/scale_crop/300x300/",
      alt: "Momen Bahagia Miftah & Riris",
    },
    {
      id: 1,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/2c7f0a5c-940f-4d15-b8ee-5a38379c25b1/2.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/2c7f0a5c-940f-4d15-b8ee-5a38379c25b1/-/scale_crop/300x300/",
      alt: "Senyum Bersama",
    },
    {
      id: 2,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/2df477e0-5aff-43b3-b63a-71aa6cd4190b/3.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/2df477e0-5aff-43b3-b63a-71aa6cd4190b/-/scale_crop/300x300/",
      alt: "Langkah Beriringan",
    },
    {
      id: 3,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/9720b430-a4c5-495f-b73d-e5a1d42b1c06/1.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/9720b430-a4c5-495f-b73d-e5a1d42b1c06/-/scale_crop/300x300/",
      alt: "Tatapan Penuh Makna",
    },
    {
      id: 4,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/af98e2ec-dd67-4d9a-95ed-b3e490ee0537/5.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/af98e2ec-dd67-4d9a-95ed-b3e490ee0537/-/scale_crop/300x300/",
      alt: "Kehangatan Cinta",
    },
    {
      id: 5,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/f007cb0c-86cc-4a28-bdcc-d6fa81de26d1/6.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/f007cb0c-86cc-4a28-bdcc-d6fa81de26d1/-/scale_crop/300x300/",
      alt: "Hari yang Dinanti",
    },
    {
      id: 6,
      tall: false,
      fullSrc:
        "https://5kha3rsp76.ucarecd.net/e10a57e3-1d23-43ff-a978-eb18e154858c/akhirnya.jpeg",
      thumbSrc:
        "https://5kha3rsp76.ucarecd.net/e10a57e3-1d23-43ff-a978-eb18e154858c/-/scale_crop/300x300/",
      alt: "Kebersamaan",
    },
  ],
};
