"use client";

import styles from './SuggestionChips.module.css';

export const DEFAULT_CHIPS = [
  "한글은 왜 만드셨나요?",
  "측우기로 비를 어떻게 쟀나요?",
  "앙부일구는 어떻게 시간을 알려주나요?"
];

export default function SuggestionChips({ suggestions = DEFAULT_CHIPS, onChipClick, disabled }) {
  return (
    <div className={styles.container}>
      {suggestions.map((chip) => (
        <button
          key={chip}
          className={styles.chip}
          onClick={() => onChipClick(chip)}
          disabled={disabled}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
