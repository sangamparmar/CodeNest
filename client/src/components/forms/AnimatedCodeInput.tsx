import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AnimatedCodeInputProps = {
  label: string;
  placeholder?: string;
  animation?: boolean;
  delay?: number;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
};

const AnimatedCodeInput: React.FC<AnimatedCodeInputProps> = ({
  label,
  placeholder = '',
  animation = true,
  delay = 0,
  type = 'text',
  name,
  value,
  onChange,
  icon
}) => {
  const [focused, setFocused] = useState(false);
  const [characters, setCharacters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const placeholderChars = placeholder.split('');
  
  useEffect(() => {
    if (!animation || focused) return;
    
    // If we have real value, don't show the animation
    if (value && value.length > 0) return;

    const interval = setInterval(() => {
      if (currentIndex < placeholderChars.length) {
        setCharacters(prev => [...prev, placeholderChars[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCharacters([]);
          setCurrentIndex(0);
        }, 1500); // Wait before restarting animation
      }
    }, 100); // Speed of typing
    
    return () => clearInterval(interval);
  }, [animation, focused, currentIndex, placeholderChars, value]);

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
        {icon}
      </div>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        className="w-full pl-12 pr-4 py-4 rounded-xl border focus:ring-2 focus:ring-offset-1 focus:border-violet-500 transition-all duration-200 outline-none text-white/90 bg-black/40 backdrop-blur-md border-white/10 shadow-inner placeholder:text-gray-500"
        aria-label={label}
      />
      
      {!focused && value === '' && (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.span 
              key="prompt-animation"
              className="inline-block text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay }}
            >
              {animation ? (
                <>
                  {characters.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    className="inline-block w-2 h-5 ml-0.5 bg-violet-500"
                    animate={{
                      opacity: [1, 0, 1],
                      transition: { repeat: Infinity, duration: 0.8 }
                    }}
                  />
                </>
              ) : placeholder}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AnimatedCodeInput;
