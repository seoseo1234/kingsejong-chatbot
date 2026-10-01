import Image from 'next/image';
import Link from 'next/link';
import styles from './home.module.css';

const TOPICS = [
  { title: '한글', caption: '훈민정음은 어떻게 만들었을까?', img: '/images/hunmin.png' },
  { title: '측우기', caption: '비가 온 양을 어떻게 쟀을까?', img: '/images/cheugugi.png' },
  { title: '앙부일구', caption: '그림자로 시간을 알 수 있을까?', img: '/images/angbu.png' },
];

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.card} aria-labelledby="home-title">
        <div className={styles.intro}>
          <div className={styles.portrait}>
            <Image
              src="/images/sejong-realistic-poster.webp"
              alt="세종대왕 초상"
              fill
              sizes="(max-width: 768px) 132px, 180px"
              loading="eager"
              className={styles.portraitImage}
            />
            <span className={styles.reconstructionLabel}>AI 재현</span>
          </div>

          <p className={styles.eyebrow}>세종대왕과 함께하는</p>
          <h1 id="home-title" className={styles.title}>한글 역사 교실</h1>
          <p className={styles.lead}>
            세종대왕님께 궁금한 것을 물어보고,<br />
            세종대왕님의 목소리로 대답을 들어 보아요!
          </p>

          <Link href="/chat" className={styles.startBtn}>
            세종대왕과 대화하기
            <span aria-hidden="true" className={styles.startArrow}>→</span>
          </Link>
        </div>

        <div className={styles.topics}>
          <h2 className={styles.topicsTitle}>이런 이야기를 나눌 수 있어요</h2>
          <ul className={styles.topicList}>
            {TOPICS.map((topic) => (
              <li key={topic.title} className={styles.topic}>
                <div className={styles.topicImage}>
                  <Image src={topic.img} alt="" fill sizes="(max-width: 768px) 30vw, 150px" />
                </div>
                <strong>{topic.title}</strong>
                <span>{topic.caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
