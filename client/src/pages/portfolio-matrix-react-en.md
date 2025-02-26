# Portfolio with Matrix-style effects built using React

In this article, I'll show you how to create a portfolio with effects inspired by the Matrix movie, using React and modern front-end libraries. The project includes animated menus, a "falling code" effect, and many other interactive elements.

## Technologies used

- **React** - main interface building library ([Documentation](https://react.dev))
- **Tailwind CSS** - utility-first CSS framework ([Documentation](https://tailwindcss.com))
- **Framer Motion** - animation library ([Documentation](https://www.framer.com/motion/))
- **EmailJS** - sending emails without a backend ([Documentation](https://www.emailjs.com/docs/))
- **Wouter** - lightweight React router ([Documentation](https://github.com/molefrog/wouter))

## Project structure

The project is divided into several main components:

```
src/
├── features/
│   ├── articles/
│   ├── home/
│   ├── projects/
│   └── skills/
├── shared/
│   └── components/
│       ├── common/
│       │   ├── MatrixRain.tsx
│       │   ├── TextReveal.tsx
│       │   └── LanguageContext.tsx
│       └── layout/
│           └── Sidebar.tsx
└── App.tsx
```

## Main Matrix effects

### 1. Falling code effect (MatrixRain)

The most characteristic effect is the Matrix "falling code", implemented in the **MatrixRain.tsx** component:

```tsx
interface MatrixEffectProps {
  color?: string;
  bgOpacity?: number;
  immediate?: boolean;
  matrixColors?: string[];
}

const MatrixEffect: React.FC<MatrixEffectProps> = ({
  color = "#22b455",
  bgOpacity = 0.05,
  immediate = false,
  matrixColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    // Effect implementation
    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = matrixColors[Math.floor(Math.random() * matrixColors.length)];
        ctx.fillText(text, i * 20, y * 20);
        
        if (y * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const intervalId = setInterval(draw, 50);
    return () => clearInterval(intervalId);
  }, [immediate, matrixColors]);

  return <canvas id="matrixCanvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};
```

### 2. Animated text (TextReveal)

We achieve the "hacking" text effect through the TextReveal component, which gradually reveals text, initially showing random characters:

```tsx
const TextReveal = ({ text, interval = 150, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const revealNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(prev => 
          prev + text.charAt(currentIndex)
        );
        currentIndex++;
        timeoutId = setTimeout(revealNextChar, interval);
      } else {
        onComplete?.();
      }
    };
    
    revealNextChar();
    return () => clearTimeout(timeoutId);
  }, [text, interval, onComplete]);

  return <span className="matrix-text">{displayText}</span>;
};
```

## Responsive menu

The menu is built using Framer Motion for smooth animations:

```tsx
const Sidebar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const threshold = 100;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY - lastScrollY > threshold) {
        setShowMobileMenu(false);
      } else if (lastScrollY - currentScrollY > threshold) {
        setShowMobileMenu(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: showMobileMenu ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sidebar-mobile-icons"
    >
      {/* Menu content */}
    </motion.div>
  );
};
```

## Contact form with EmailJS

The contact form implementation uses EmailJS for simple handling without a backend:

```tsx
const ContactModal = ({ onClose }: ContactModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    
    try {
      await emailjs.sendForm(
        "service_id",
        "template_id",
        formRef.current,
        "user_id"
      );
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message."
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-modal"
    >
      {/* Form content */}
    </motion.div>
  );
};
```

## Implementation tips

1. **Customizing the Matrix effect:**
   - Modify **bgOpacity** for different effect intensity
   - Adjust **interval** in **setInterval** for different character "falling" speeds
   - Change character sets in **letters** for different visual effects

2. **Animation optimization:**
   - Use **useCallback** for functions in effects
   - Use **requestAnimationFrame** instead of **setInterval** for smoother animations
   - Adjust the **threshold** value in the menu for better responsiveness

3. **Styling:**
   ```css
   :root {
     --matrix-black: #000000;
     --matrix-bg: #0C1714;
     --matrix-darker: #0A3622;
     --matrix-dark: #204829;
     --matrix-primary: #22b455;
     --matrix-light: #80ce87;
     --matrix-hover: #33FF33;
   }
   ```

4. **Responsiveness:**
   - Use Tailwind breakpoints (**md:**, **lg:**)
   - Adjust Matrix character size on different devices
   - Use Flexbox and Grid for better layouts

## Customizing the project

1. **Changing the color scheme:**
   ```tsx
   const getMatrixColors = () => {
     const rootStyles = getComputedStyle(document.documentElement);
     return [
       rootStyles.getPropertyValue("--matrix-black").trim(),
       rootStyles.getPropertyValue("--matrix-bg").trim(),
       rootStyles.getPropertyValue("--matrix-darker").trim(),
       rootStyles.getPropertyValue("--matrix-dark").trim(),
     ];
   };
   ```

2. **Animation modification:**
   - Adjust **transition** parameters in Framer Motion components
   - Change the typing speed in **TextReveal**
   - Modify hover effects on cards and buttons

3. **Extending functionality:**
   - Add more Matrix effects
   - Implement additional transition animations
   - Extend the theme system

## Summary

A Matrix-style portfolio is a great way to showcase your skills in a visually attractive way. The key to success is properly combining visual effects with good performance and responsiveness.

Remember to:
- Optimize effects for less powerful devices
- Maintain accessibility despite visual effects
- Strike the right balance between aesthetics and usability
- Test on different devices and browsers

## Links to useful resources

- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Tailwind CSS Customization](https://tailwindcss.com/docs/customizing-colors)
- [EmailJS Templates](https://www.emailjs.com/docs/tutorial/creating-email-template/)
- [React Performance Optimization](https://react.dev/learn/managing-state)