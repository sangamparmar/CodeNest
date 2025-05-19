import React from "react";
import { motion } from "framer-motion";

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Animated code blocks */}
      <CodeBlock
        top="15%"
        left="15%"
        delay={0}
        language="javascript"
      />
      <CodeBlock
        top="25%"
        right="10%"
        delay={0.5}
        language="python"
      />
      <CodeBlock
        bottom="15%"
        left="20%"
        delay={1}
        language="typescript"
      />
      
      {/* Floating shapes */}
      <FloatingShape 
        top="30%"
        left="50%"
        size={60}
        color="from-violet-500/20 to-blue-500/10"
        duration={15}
      />
      <FloatingShape 
        top="60%"
        left="20%"
        size={80}
        color="from-blue-500/20 to-cyan-500/10"
        duration={18}
      />
      <FloatingShape 
        top="20%"
        left="70%"
        size={70}
        color="from-cyan-500/20 to-indigo-500/10"
        duration={20}
      />
      
      {/* Small particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <SmallParticle key={i} />
      ))}
    </div>
  );
};

// Floating code blocks
const CodeBlock = ({ 
  top, 
  left, 
  right, 
  bottom,
  delay, 
  language 
}: { 
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: number;
  language: string;
}) => {
  const codeSnippets = {
    javascript: "const connect = () => {\n  socket.emit('join');\n  console.log('Connected');\n};",
    python: "def process_data(items):\n  return [x for x in items\n    if x.is_valid()]",
    typescript: "interface User {\n  id: string;\n  name: string;\n  role: UserRole;\n}",
  };
  
  return (
    <motion.div
      className="absolute backdrop-blur-lg bg-black/30 border border-white/10 p-2 rounded-lg shadow-lg text-xs font-mono max-w-[230px] transform -translate-x-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
      style={{
        top,
        left,
        right,
        bottom,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ 
        opacity: [0.3, 0.5, 0.3],
        y: [0, -15, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <div className="flex items-center mb-1 space-x-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <div className="text-xs text-gray-400 ml-2">{language}</div>
      </div>
      <pre className="text-[9px] text-gray-300 overflow-hidden">
        <code>{codeSnippets[language as keyof typeof codeSnippets]}</code>
      </pre>
    </motion.div>
  );
};

// Floating shapes component
const FloatingShape = ({ 
  top, 
  left, 
  size,
  color,
  duration
}: { 
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
}) => {
  return (
    <motion.div
      className={`absolute blur-3xl rounded-full bg-gradient-to-r ${color}`}
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: ['-5vw', '5vw', '-5vw'],
        y: ['-5vh', '5vh', '-5vh'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    />
  );
};

// Small animated particles
const SmallParticle = () => {
  const top = `${Math.random() * 100}%`;
  const left = `${Math.random() * 100}%`;
  const size = Math.random() * 4 + 1;
  
  // Random color from bright colors
  const colors = ["bg-violet-400", "bg-blue-400", "bg-cyan-400", "bg-purple-400", "bg-pink-400"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-70`}
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: Math.random() * 5,
      }}
    />
  );
};

export default FloatingElements;
