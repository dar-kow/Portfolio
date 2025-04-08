**[Polska wersja](#portfolio-z-efektami-w-stylu-matrix-zbudowane-przy-użyciu-react)**
# Matrix-style Portfolio Built with React 


In this article, I'll show you how to create a portfolio with effects inspired by The Matrix movie, using React and modern front-end libraries. The project includes animated menus, the "falling code" effect, and many other interactive elements.

## Technologies Used

- **React** - the main library for building the interface ([Documentation](https://react.dev))
- **Tailwind CSS** - utility-first CSS framework ([Documentation](https://tailwindcss.com))
- **Framer Motion** - animation library ([Documentation](https://www.framer.com/motion/))
- **EmailJS** - sending emails without a backend ([Documentation](https://www.emailjs.com/docs/))
- **Wouter** - lightweight router for React ([Documentation](https://github.com/molefrog/wouter))

## Project Structure

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

## Main Matrix Effects

### 1. Falling Code Effect (MatrixRain)

The most characteristic effect is the Matrix "falling code," implemented in the **MatrixRain.tsx** component:

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

### 2. Animated Text (TextReveal)

We achieve the text "hacking" effect through the TextReveal component, which gradually reveals text, initially showing random characters:

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

## Responsive Menu

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

## Contact Form with EmailJS

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
        description: "An error occurred while sending the message."
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

## Implementation Tips

1. **Customizing the Matrix Effect:**
   - Modify **bgOpacity** for different effect intensity
   - Adjust the **interval** in **setInterval** for different character "falling" speeds
   - Change the character sets in **letters** for different visual effects

2. **Animation Optimization:**
   - Use **useCallback** for functions in effects
   - Utilize **requestAnimationFrame** instead of **setInterval** for smoother animations
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
   - Use Flexbox and Grid for better layout

## Customizing the Project

1. **Changing Colors:**
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

2. **Modifying Animations:**
   - Adjust **transition** parameters in Framer Motion components
   - Change typing speed in **TextReveal**
   - Modify hover effects on cards and buttons

3. **Extending Functionality:**
   - Add more Matrix effects
   - Implement additional transition animations
   - Expand the theme system

## Summary

A Matrix-style portfolio is a great way to showcase your skills in a visually appealing way. The key to success is appropriately combining visual effects with good performance and responsiveness.

Remember to:
- Optimize effects for less powerful devices
- Maintain accessibility despite visual effects
- Strike the right balance between aesthetics and usability
- Test on different devices and browsers

## Links to Useful Resources

- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Tailwind CSS Customization](https://tailwindcss.com/docs/customizing-colors)
- [EmailJS Templates](https://www.emailjs.com/docs/tutorial/creating-email-template/)
- [React Performance Optimization](https://react.dev/learn/managing-state)


---
<br><br><br>


# Portfolio z efektami w stylu Matrix zbudowane przy użyciu React

W tym artykule pokażę, jak stworzyć portfolio z efektami inspirowanymi filmem Matrix, wykorzystując React i nowoczesne biblioteki front-endowe. Projekt zawiera animowane menu, efekt "padającego kodu" oraz wiele innych interaktywnych elementów.

## Użyte technologie

- **React** - główna biblioteka do budowy interfejsu ([Dokumentacja](https://react.dev))
- **Tailwind CSS** - utility-first framework CSS ([Dokumentacja](https://tailwindcss.com))
- **Framer Motion** - biblioteka do animacji ([Dokumentacja](https://www.framer.com/motion/))
- **EmailJS** - wysyłanie maili bez backendu ([Dokumentacja](https://www.emailjs.com/docs/))
- **Wouter** - lekki router dla React ([Dokumentacja](https://github.com/molefrog/wouter))

## Struktura projektu

Projekt jest podzielony na kilka głównych komponentów:

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

## Główne efekty Matrix

### 1. Efekt padającego kodu (MatrixRain)

Najbardziej charakterystyczny efekt to "padający kod" Matrix, zaimplementowany w komponencie **MatrixRain.tsx**:

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

    // Implementacja efektu
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

### 2. Animowany tekst (TextReveal)

Efekt "hackowania" tekstu osiągamy poprzez komponent TextReveal, który stopniowo odsłania tekst, początkowo pokazując losowe znaki:

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

## Responsywne menu

Menu jest zbudowane z wykorzystaniem Framer Motion dla płynnych animacji:

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

## Formularz kontaktowy z EmailJS

Implementacja formularza kontaktowego wykorzystuje EmailJS dla prostej obsługi bez backendu:

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
        title: "Wiadomość wysłana",
        description: "Twoja wiadomość została wysłana pomyślnie."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd przy wysyłaniu wiadomości."
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

## Wskazówki implementacyjne

1. **Dostosowanie efektu Matrix:**
   - Modyfikuj **bgOpacity** dla różnej intensywności efektu
   - Dostosuj **interval** w **setInterval** dla różnej szybkości "padania" znaków
   - Zmień zestawy znaków w **letters** dla różnych efektów wizualnych

2. **Optymalizacja animacji:**
   - Używaj **useCallback** dla funkcji w efektach
   - Wykorzystuj **requestAnimationFrame** zamiast **setInterval** dla płynniejszych animacji
   - Dostosuj wartość **threshold** w menu dla lepszej responsywności

3. **Stylowanie:**
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

4. **Responsywność:**
   - Wykorzystuj breakpointy Tailwind (**md:**, **lg:**)
   - Dostosuj wielkość znaków Matrix na różnych urządzeniach
   - Używaj Flexbox i Grid dla lepszego układu

## Dostosowywanie projektu

1. **Zmiana kolorystyki:**
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

2. **Modyfikacja animacji:**
   - Dostosuj parametry **transition** w komponentach Framer Motion
   - Zmień szybkość pisania w **TextReveal**
   - Modyfikuj efekty hover na kartach i przyciskach

3. **Rozszerzanie funkcjonalności:**
   - Dodaj więcej efektów Matrix
   - Zaimplementuj dodatkowe animacje przejść
   - Rozszerz system motywów

## Podsumowanie

Portfolio w stylu Matrix to świetny sposób na pokazanie swoich umiejętności w atrakcyjny wizualnie sposób. Kluczem do sukcesu jest odpowiednie połączenie efektów wizualnych z dobrą wydajnością i responsywnością.

Pamiętaj o:
- Optymalizacji efektów dla słabszych urządzeń
- Zachowaniu dostępności mimo efektów wizualnych
- Odpowiednim balansie między estetyką a użytecznością
- Testowaniu na różnych urządzeniach i przeglądarkach

## Zaawansowane funkcje projektu

### Automatyczne daty aktualizacji repozytoriów

Portfolio zawiera funkcję automatycznego pobierania i wyświetlania dat ostatnich commitów dla projektów hostowanych na GitHubie:

- Integracja z GitHub API
- Cache odpowiedzi dla zoptymalizowania wydajności
- Responsywne wyświetlanie dat z indykatorem ładowania
- Formatowanie dat zgodne z wybranym językiem
- Obsługa 20+ języków w szablonach dat

## Linki do przydatnych zasobów

- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Tailwind CSS Customization](https://tailwindcss.com/docs/customizing-colors)
- [EmailJS Templates](https://www.emailjs.com/docs/tutorial/creating-email-template/)
- [React Performance Optimization](https://react.dev/learn/managing-state)
