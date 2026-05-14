import { useEffect, useMemo, useState } from 'react';
import { site } from '../config';

interface Props {
  className?: string;
  slogans?: string[];
}

// 定义更丰富的渐变色方案，具有更强的层次感和对比度
const gradients = [
  // 深浅过渡，增强层次感
  'bg-gradient-to-r from-purple-800 via-purple-600 to-purple-400 dark:from-purple-900 dark:via-purple-700 dark:to-purple-500',
  'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-blue-900 dark:via-blue-700 dark:to-blue-500',
  'bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400 dark:from-emerald-900 dark:via-emerald-700 dark:to-emerald-500',

  // 多色渐变，增强视觉冲击力
  'bg-gradient-to-r from-purple-700 via-primary-500 to-blue-600 dark:from-purple-800 dark:via-primary-600 dark:to-blue-700',
  'bg-gradient-to-r from-red-700 via-orange-500 to-yellow-400 dark:from-red-800 dark:via-orange-600 dark:to-yellow-500',
  'bg-gradient-to-r from-teal-700 via-cyan-500 to-sky-600 dark:from-teal-800 dark:via-cyan-600 dark:to-sky-700',

  // 对比强烈的渐变，提升视觉层次
  'bg-gradient-to-r from-indigo-800 via-violet-600 to-purple-400 dark:from-indigo-900 dark:via-violet-700 dark:to-purple-500',
  'bg-gradient-to-r from-rose-800 via-pink-600 to-fuchsia-400 dark:from-rose-900 dark:via-pink-700 dark:to-fuchsia-500',
  'bg-gradient-to-r from-amber-700 via-orange-500 to-red-600 dark:from-amber-800 dark:via-orange-600 dark:to-red-700',

  // 柔和过渡，细腻层次
  'bg-gradient-to-r from-sky-700 to-blue-500 dark:from-sky-800 dark:to-blue-600',
  'bg-gradient-to-r from-emerald-700 to-teal-500 dark:from-emerald-800 dark:to-teal-600',
  'bg-gradient-to-r from-violet-700 to-indigo-500 dark:from-violet-800 dark:to-indigo-600',

  // 三段式渐变，丰富层次变化
  'bg-gradient-to-r from-pink-700 via-rose-500 to-red-600 dark:from-pink-800 dark:via-rose-600 dark:to-red-700',
  'bg-gradient-to-r from-cyan-700 via-sky-500 to-blue-600 dark:from-cyan-800 dark:via-sky-600 dark:to-blue-700',
  'bg-gradient-to-r from-lime-700 via-green-500 to-emerald-600 dark:from-lime-800 dark:via-green-600 dark:to-emerald-700',
];

export default function TypewriterSlogan({
  className = '',
  slogans,
}: Props) {
  const [text, setText] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [shineCycle, setShineCycle] = useState(0);
  const activeSlogans = useMemo(
    () => {
      const source = slogans ?? (
        Array.isArray(site.typewriter) ? site.typewriter : [site.typewriter]
      );

      return source.map(slogan => slogan.trim()).filter(Boolean);
    },
    [slogans],
  );

  useEffect(() => {
    if (activeSlogans.length === 0) {
      setText('');
      return;
    }

    let sloganIndex = 0;
    let charIndex = 0;
    let phase: 'typing' | 'pausing' | 'deleting' = 'typing';
    let timer: number | undefined;

    const schedule = (delay: number) => {
      timer = window.setTimeout(tick, delay);
    };

    const tick = () => {
      const currentSlogan = activeSlogans[sloganIndex];

      if (phase === 'typing') {
        if (charIndex < currentSlogan.length) {
          charIndex += 1;
          setText(currentSlogan.slice(0, charIndex));
          schedule(75);
          return;
        }

        phase = 'pausing';
        schedule(3000);
        return;
      }

      if (phase === 'pausing') {
        phase = 'deleting';
        setColorIndex(() => Math.floor(Math.random() * gradients.length));
        schedule(50);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        setText(currentSlogan.slice(0, charIndex));
        schedule(50);
        return;
      }

      sloganIndex = (sloganIndex + 1) % activeSlogans.length;
      phase = 'typing';
      setShineCycle(cycle => cycle + 1);
      schedule(250);
    };

    setText('');
    setShineCycle(cycle => cycle + 1);
    schedule(250);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [activeSlogans]);

  return (
    <>
      <style>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes slogan-shine {
          0% {
            background-position: 180% 50%;
            opacity: 0;
          }
          12%, 88% {
            opacity: 0.6;
          }
          100% {
            background-position: -180% 50%;
            opacity: 0;
          }
        }

        .typewriter-slogan__shine {
          position: absolute;
          inset: 0;
          color: transparent;
          pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 0%,
            transparent 42%,
            rgba(255, 255, 255, 0.08) 46%,
            rgba(255, 255, 255, 0.46) 50%,
            rgba(253, 224, 71, 0.2) 52%,
            rgba(255, 255, 255, 0.08) 56%,
            transparent 60%,
            transparent 100%
          );
          background-size: 300% 100%;
          background-position: 180% 50%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: slogan-shine 3.2s linear infinite;
        }
      `}</style>
      <h1
        data-text={text}
        className={`relative inline-block max-w-full overflow-hidden text-ellipsis text-nowrap text-3xl md:text-5xl xl:text-6xl h-20 break-all font-bold mb-3 text-transparent bg-clip-text ${gradients[colorIndex]} transition-all duration-1000 ease-in-out ${className}`}
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-animation 2s ease infinite',
        }}
      >
        {text}
        <span
          key={shineCycle}
          className="typewriter-slogan__shine"
          aria-hidden="true"
        >
          {text}
        </span>
      </h1>
    </>
  );
}
